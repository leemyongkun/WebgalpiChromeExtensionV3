const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

let CRAWLER = {
  getSiteInfo: async html => {
    /*  await axios.get(html).catch(error => {
            console.log(error.response)
            console.log(error.request)
            console.log(error.message)
        })*/
    try {
      return await axios.get(html);
    } catch (error) {
      console.log(">>> error ", error.request);
    }
  },
  getHtml: html => {
    return new Promise(async res => {
      CRAWLER.getSiteInfo(html)
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

          res(source.data);
        })
        .catch(error => {});
    });
  }
};
export default CRAWLER;
