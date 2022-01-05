const puppeteer = require('puppeteer');
const Crawler = require('./crawler');
const path = require('path');
const fs = require('fs');
const Request = require('../models/Request');
const Link = require('../models/Link');
const md5 = require('md5');
const config = require('config');
const {v4} = require('uuid');

const timeout = config.get('requestTimeout');
const executablePath = config.get('browserPath');

/**
 * Crawl this homepage to get all available links
 * @param {Object} options
 * @param {ObjectId} requestId
 * @return {Iterable} list of links
 */
async function* CountWordWebsite(options, requestId) {
  try {
    const home = options.home;
    const include = options.include || [];
    const exclude = options.exclude || [];

    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
    });
    const page = await browser.newPage();

    page.setViewport({
      width: 1280,
      height: 720,
    });

    const crawler = new Crawler();
    crawler.setHomePage(home);
    crawler._visitQueue.push(home);
    crawler._pathSet.push(home);

    while (crawler._visitQueue.length) {
      let skip = false;
      const link = crawler._visitQueue.shift();
      const request = await Request.findById(requestId);

      // skip if request is aborted
      // or older than 30 minutes
      if (!request || request.isAborted) {
        skip = true;
      }
      if (request && new Date() - request.submittedDate >= timeout) {
        skip = true;
        await Request.findByIdAndUpdate(requestId, {isTimeout: true});
      }

      // check include and exclude
      {
        if (!skip) {
          for (const excludePattern of exclude) {
            if (link.includes(excludePattern)) skip = true;
          }
          if (include && include.length) {
            for (const includePattern of include) {
              if (!link.includes(includePattern)) skip = true;
            }
          }
        }
      }

      let words = null;
      let countWord = 0;
      let id = v4();

      if (!skip) {
        try {
          await page.goto(link);
          words = await page.evaluate(() => {
            try {
              const d = document.createElement('div');
              d.innerHTML = document.head.innerHTML;
              d.innerHTML += document.body.innerHTML;

              const noSee = d.querySelectorAll('style,code,script');
              noSee.forEach((elm) => {
                elm.parentElement.removeChild(elm);
              });

              // trim text
              let textContent = d.textContent;
              let accesibileText = d.querySelectorAll('[title]');
              accesibileText.forEach((elm) => {
                textContent = textContent + '\n' + elm.getAttribute('title');
              });

              accesibileText = d.querySelectorAll('[alt]');
              accesibileText.forEach((elm) => {
                textContent = textContent + '\n' + elm.getAttribute('alt');
              });

              accesibileText = d.querySelectorAll('[value]');
              accesibileText.forEach((elm) => {
                textContent = textContent + '\n' + elm.getAttribute('value');
              });

              textContent = textContent.trim();
              // trim text
              textContent = textContent.split('\n').
                map((en) => {
                  while (en.includes('\t')) {
                    en = en.replace('\t', ' ');
                  }
                  while (en.includes('  ')) {
                    en = en.replace('  ', ' ');
                  }
                  if (en == ' ') en = '';
                  return en;
                }).
                filter((en) => en.length).
                join('\n');
              // end trim text

              return textContent;
            } catch (err) {
              console.error(err);
              return JSON.stringify(err);
            }
          });

          const hashedWord = md5(words);
          const shrinkedLink = link.replace(/[^a-zA-Z0-9 ]/g, '');
          const existedLink = await Link.findOne({
            requestId: requestId,
            hashedContent: hashedWord,
          });
          if (existedLink) continue;

          countWord = words.trim().split(/[\s,]+/).length;
          const articles = await crawler.getVisitableLink(page);
          crawler._visitQueue = crawler._visitQueue.concat(articles);

          const filePath = path.resolve(
            global.__basedir,
            'utils',
            'sites',
            shrinkedLink,
          );

          // Save result
          fs.writeFileSync(filePath, words);

          const SaveLink = new Link();
          SaveLink.requestId = requestId;
          SaveLink.url = link;
          SaveLink.shrinkedUrl = shrinkedLink;
          SaveLink.wordCount = countWord;
          SaveLink.hashedContent = hashedWord;
          id = SaveLink._id;

          await SaveLink.save();
          await page.waitForTimeout(100);
        } catch (err) {
          console.error(err);
        }
      }


      yield {
        _id: id,
        link,
        countWord,
        remain: crawler._visitQueue.length,
      };
    }

    await browser.close();
    return null;
  } catch (error) {
    console.error('Catch : ' + error);
    return [];
  }
}

module.exports = CountWordWebsite;
