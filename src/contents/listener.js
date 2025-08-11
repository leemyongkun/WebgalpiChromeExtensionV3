import CONTENTS from "./contents";
import EVENT from "./event";
import APPLICATION from "./application.js";
import { GLOBAL_CONFIG, URL, USER_INFO } from "./global/config";

let $ = require("jquery");

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("📥 Content Scripts received message:", msg.action, msg);

  switch (msg.action) {
    case "unwrap.highlight":
      //본문의 highlight를 삭제한다.
      $("[" + GLOBAL_CONFIG.HL_ID_NAME + "=" + msg.data.IDX + "]").each(
        (idx, item) => {
          $(item)
            .contents()
            .unwrap();
        }
      );

      GLOBAL_CONFIG.HIGHLIGHT_LIST.map((highlight, index) => {
        if (msg.data.IDX === highlight.IDX) {
          GLOBAL_CONFIG.HIGHLIGHT_LIST.splice(index, 1);
        }
      });

      break;
    case "update.global.config.useCurrentSite":
      GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
      break;
    case "application.init":
      console.log("🚀 Content Scripts processing application.init message");
      /*
                                                  같은 사이트에서 여러번의 호출(ajax)이 발생할 경우, 페이지 로딩이 생긴다.
                                                  새로 로딩된 사이트가 URL.SITE(전에 저장된 사이트)와 같으면 SPA로 판단하여 더이상 진행하지 않는다.
                                                  youtube , https://www.webprofessional.jp/custom-pdf-rendering/ 등을 처리한다.
                                                   */
      //if (URL.SITE.split("#")[0] === msg.site.URL.split("#")[0]) return false;
      if (URL.KEY === msg.site.URL_KEY) {
        console.log("❌ Same URL_KEY, skipping initialization:", URL.KEY);
        sendResponse({ success: false, reason: "Same URL_KEY" });
        return false;
      }

      console.log("✅ Initializing Content Scripts for new URL:", msg.site.URL);
      URL.SITE = msg.site.URL;
      URL.KEY = msg.site.URL_KEY;
      URL.TYPE = msg.site.EXT;

      USER_INFO.EMAIL = msg.site.EMAIL;

      console.log("📞 Calling APPLICATION.init with data:", msg.data);
      APPLICATION.init(msg.data);
      setInterval(() => {
        APPLICATION.init(msg.data);
      }, 2000);

      console.log("✅ Content Scripts application.init completed");
      sendResponse({
        success: true,
        message: "Content Scripts initialized successfully"
      });

      break;
    case "get.site.info":
      //let content = await CONTENTS.firstVisitSite(new Object());
      CONTENTS.firstVisitSite(new Object()).then(content => {
        content.USE_CURRENT_SITE = GLOBAL_CONFIG.USE_CURRENT_SITE;
        content.SITE_OPEN = GLOBAL_CONFIG.SITE_OPEN;
        content.TITLE = document.title;
        content.UPDATE_TITLE = document.title;
        content.URL = URL.SITE;
        content.URL_KEY = URL.KEY;
        sendResponse(content);
      });
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

    case "emit.action":
      document.getElementsByTagName("webgalpi-group")[0].remove();
      APPLICATION.createContentsForm(msg.data[0].COLOR);

      return true;
      break;
  }
});
