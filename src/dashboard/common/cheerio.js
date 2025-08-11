import CONTENTS from "../../contents/contents";
import Utils from "../utils/Utils";

import axios from "axios";
// const cheerio = require("cheerio"); // Disabled due to ES6 module parsing issues
import md5 from "md5";
const instance = axios.create();
instance.defaults.timeout = 5000;
//instance.defaults.headers.get['Content-Type'] = 'text/html; charset-UTF-8';

let CRAWLER = {
  getOriginalSiteContents: url => {
    return new Promise(async (res, rej) => {
      // Chrome extensions cannot directly fetch external URLs due to CORS
      // This feature needs to be implemented through content scripts or background service worker
      const errorObj = {
        message: "Direct URL fetching not supported in Chrome extension",
        url: url
      };
      rej(errorObj);
    });
  },
  getImportSiteContents: url => {
    return new Promise(async (res, rej) => {
      // Chrome extensions cannot directly fetch external URLs due to CORS
      // This feature needs to be implemented through content scripts or background service worker
      const errorObj = {
        message: "Direct URL fetching not supported in Chrome extension",
        url: url
      };
      rej(errorObj);
    });
  }
};
export default CRAWLER;
