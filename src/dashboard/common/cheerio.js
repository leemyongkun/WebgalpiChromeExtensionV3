const axios = require("axios");
const cheerio = require("cheerio");
const instance = axios.create();
instance.defaults.timeout = 5000;

let CRAWLER = {
  getHtml: url => {
    return new Promise(async (res, rej) => {
      instance
        .get(url)
        .then(source => {
          let obj = new Object();
          const $ = cheerio.load(source.data);
          let ogTitle = $('meta[property="og:title"]').attr("content");
          let ogDescription = $('meta[property="og:description"]').attr(
            "content"
          );
          let ogImage = $('meta[property="og:image"]').attr("content");

          obj.ogTitle = ogTitle;
          obj.ogDescription = ogDescription;
          obj.ogImage = ogImage;
          obj.body = source.data;
          obj.fullText = $.text().replace(/\n/g, " ");
          res(obj);
        })
        .catch(error => {
          /*console.log(error.request);
                    console.log(error.message);*/
          rej(error);
        });
    });
  }
};
export default CRAWLER;
