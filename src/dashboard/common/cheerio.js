import CONTENTS from "../../contents/contents";
import Utils from "../utils/Utils";

const axios = require("axios");
const cheerio = require("cheerio");
const md5 = require("md5");
const instance = axios.create();
instance.defaults.timeout = 5000;
//instance.defaults.headers.get['Content-Type'] = 'text/html; charset-UTF-8';

let CRAWLER = {
  getOriginalSiteContents: url => {
    return new Promise(async (res, rej) => {
      instance
        .get(url)
        .then(source => {
          let obj = new Object();
          const data = cheerio.load(source.data);
          let ogTitle = data('meta[property="og:title"]').attr("content");
          let ogDescription = data('meta[property="og:description"]').attr(
            "content"
          );
          let ogImage = data('meta[property="og:image"]').attr("content");

          obj.ogTitle = ogTitle;
          obj.ogDescription = ogDescription;
          obj.ogImage = ogImage;
          obj.body = source.data;
          obj.fullText = data.text().replace(/\n/g, " ");
          obj.title = data("title").text();

          res(obj);
        })
        .catch(error => {
          let errorObj = new Object();
          errorObj.message = error.message;
          errorObj.url = url;
          rej(errorObj);
        });
    });
  },
  getImportSiteContents: url => {
    return new Promise(async (res, rej) => {
      instance
        .get(url)
        .then(async source => {
          const $ = cheerio.load(source.data);
          let result = await Utils.getLocalStorage("loginInfo");

          let object = new Object();
          let urlInfo = CONTENTS.getUriInfo(url);

          if (location.href.indexOf("www.youtube.com/watch") === -1) {
            object.EMBEDURL = "";
          } else {
            object.EMBEDURL =
              "https://" + urlInfo.host + "/embed/" + urlInfo.parameter.v;
          }

          object.EMAIL = result.loginInfo.EMAIL;
          object.DEFAULT_CATEGORY_IDX = 0;
          object.FULL_TEXT = $.text().replace(/\n/g, " ");
          object.OG_DESCRIPTION = $('meta[property="og:description"]').attr(
            "content"
          );
          object.OG_IMAGE = $('meta[property="og:image"]').attr("content");
          object.OG_TITLE = $('meta[property="og:title"]').attr("content");
          object.URL = url;
          object.USE_CURRENT_SITE = "N";
          object.TITLE = $("title").text();
          object.UPDATE_TITLE = $("title").text();
          object.TAG = "";

          object.URL_KEY = md5(url.split("#")[0]);
          object.HOST = urlInfo.host; //  getUriInfo: url => {

          object.READERMODE_CONTENTS = await CONTENTS.getReadmodeContents(
            source.data,
            url
          );

          res(object);
        })
        .catch(error => {
          let errorObj = new Object();
          errorObj.message = error.message;
          errorObj.url = url;
          rej(errorObj);
        });
    });
  }
};
export default CRAWLER;
