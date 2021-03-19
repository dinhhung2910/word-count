const puppeteer = require('puppeteer');
const Crawler = require('./crawler');
const path = require('path');
const fs = require('fs');

async function* CountWordWebsite(home) {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const result = [];

    page.setViewport({
      width: 1280,
      height: 720
    })

    const crawler = new Crawler();  
    crawler.setHomePage(home);
    crawler._visitQueue.push(home);
    crawler._pathSet.push(home);

    while (crawler._visitQueue.length) {
      let link = crawler._visitQueue.shift();
      let words = null;
      let countWord = 0;

      try {
        await page.goto(link);
        words = await page.evaluate(() => {
          try {
            let d = document.createElement('div');
            d.innerHTML =  document.body.innerHTML;
        
            let noSee = d.querySelectorAll('script,noscript,style');
            noSee.forEach(elm => {
              elm.parentElement.removeChild(elm);
            });
            return d.textContent
          }
          catch (err) {
            console.error(err);
            return 0;
          }
        });
        
        countWord = words.trim().split(/[\s,]+/).length;
        const articles = await crawler.getVisitableLink(page);
        crawler._visitQueue = crawler._visitQueue.concat(articles);

        console.log(global.__basedir);
        console.log( link.replace(/[^a-zA-Z ]/g, ""))
        const filePath = path.resolve(global.__basedir, 'utils', 'sites', link.replace(/[^a-zA-Z ]/g, ""));
       
        fs.writeFileSync(filePath, words);

        yield {link, countWord};

        await page.waitFor(200);
      } catch (err) {
        console.error(err);
      }
      

    }
 
    await browser.close();
    return null;

  } catch (error) {
    console.error('Catch : ' + error);
    return [];
  }
  
}

module.exports = CountWordWebsite;