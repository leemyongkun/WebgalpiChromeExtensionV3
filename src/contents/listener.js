import CONTENTS from "./contents";
import EVENT from "./event";
import APPLICATION from "./application.js";
import { GLOBAL_CONFIG, URL } from "./global/config";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "update.global.config.useCurrentSite":
      GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
      break;
    case "application.init":
      console.log("INIT ###");

      /*
            같은 사이트에서 여러번의 호출(ajax)이 발생할 경우, 페이지 로딩이 생긴다.
            새로 로딩된 사이트가 URL.SITE(전에 저장된 사이트)와 같으면 SPA로 판단하여 더이상 진행하지 않는다.
            youtube , https://www.webprofessional.jp/custom-pdf-rendering/ 등을 처리한다.
             */
      if (URL.SITE === msg.site.URL) return false;

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
      console.log("content >>> ", content);
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
