import CONTENTS from "./contents";
import EVENT from "./event";
import APPLICATION from "./application.js";
import { GLOBAL_CONFIG, URL } from "./global/config";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      URL.SITE = msg.site.URL;
      URL.KEY = msg.site.URL_KEY;
      URL.TYPE = msg.site.EXT;

      APPLICATION.init(msg.data);
      sendResponse(true);
      return true;
      break;
    case "get.site.info":
      console.log(URL.SITE);
      let content = await CONTENTS.firstVisitSite(new Object());
      content.USE_CURRENT_SITE = GLOBAL_CONFIG.USE_CURRENT_SITE;
      content.TITLE = document.title;
      content.UPDATE_TITLE = document.title;
      content.URL = URL.SITE;
      content.URL_KEY = URL.KEY;
      sendResponse(content);
      return true;
      break;

    case "get.url.info":
      sendResponse(URL);
      return true;
      break;
    case "capture":
      EVENT.captureEvent();
      return true;
      break;

    case "position":
      EVENT.positionEvent(msg.data);
      return true;
      break;
  }
});
