const axios = require("axios");
const cheerio = require("cheerio");
const instance = axios.create();
instance.defaults.timeout = 5000;

let CRAWLER = {
  getSiteInfo: async html => {
    return await instance.get(html).catch(error => {
      let reason = new Object();
      reason.message = error.message;

      errorSites.push(reason);
      console.log(error.request);
      console.log(error.message);
    });
  },
  getHtml: url => {
    return new Promise(async res => {
      console.log("URL : ", url);
      CRAWLER.getSiteInfo(url)
        .then(source => {
          const $ = cheerio.load(source.data);
          let ogTitle = $('meta[property="og:title"]').attr("content");
          let ogDescription = $('meta[property="og:description"]').attr(
            "content"
          );
          let ogImage = $('meta[property="og:image"]').attr("content");

          console.log("ogTitle ", ogTitle);
          console.log("ogDescription ", ogDescription);
          console.log("ogImage ", ogImage);

          console.log("$body", $("body"));
          //todo : 저장로직을 넣는다.

          res(source.data);
        })
        .catch(error => {});
    });
  }
};
export default CRAWLER;
