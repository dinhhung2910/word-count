/**
 *
 */
class Crawler {
  constructor(options) {
    this._options = options || {
      headless: true,
    };
  }

  async setHomePage(home) {
    this._pathSet = new Array();
    this._visitQueue = new Array();
    this._home = home;
    this._hostname = home.replace('http://', '').replace('https://', '');
  }

  /**
   * Get pathname from url string
   * Remove hash, hostname, check if url is from same site
   * @param {String} url
   */
  getPathFromUrl(hostname, url) {
    // remove hash
    url = url.split('#')[0];
    // remove http
    if (url.includes('http://') || url.includes('https://')) {
      if (!url.includes(hostname)) {
        return null;
      } else {
        url = url.replace('http://', '').replace('https://', '');
      }
    }
    // check if mail link
    if (url.indexOf('mailto:') == 0) {
      return null;
    }
    // check javascript link
    if (url.indexOf('javascript:') == 0) {
      return null;
    }
    // check if resource links
    let extension = url.split('.');
    extension = extension ? extension[extension.length - 1] : '';
    const excludeExtension = ['jpg', 'png', 'zip', 'rar', 'pdf'];
    if (excludeExtension.includes(extension)) {
      return null;
    }

    url = url.split('?')[0];

    // check pathname
    if (url[0] == '/') {
      return url;
    } else {
      url = url.replace(hostname, '');
      return url;
    }
  }

  async getVisitableLink(page) {
    try {
      try {
        await page.exposeFunction('getPathFromUrl', this.getPathFromUrl);
      } catch (err) {}

      const result = await page.evaluate(async (hostname, pathArray) => {
        const ar_links = [];
        const links = document.querySelectorAll('a[href]');

        const pathSet = new Set(pathArray);

        for (let i = 0; i < links.length; i++) {
          const item = links[i];
          const href = item.getAttribute('href').trim();

          let nextURL = await getPathFromUrl(hostname, href);
          if (nextURL && nextURL[0] != '/') {
            nextURL = '/' + nextURL;
          }

          if (nextURL && nextURL.length && !pathSet.has(nextURL)) {
            ar_links.push(window.location.origin + nextURL);
            pathSet.add(nextURL);
          }
        }

        return {
          nextLinks: ar_links,
          pathSet: Array.from(pathSet),
        };
      }, this._hostname, this._pathSet);

      const nextLinks = result.nextLinks;
      this._pathSet = result.pathSet;

      return nextLinks;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = Crawler;
