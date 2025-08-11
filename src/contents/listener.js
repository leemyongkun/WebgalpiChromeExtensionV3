import CONTENTS from "./contents";
import EVENT from "./event";
import APPLICATION from "./application.js";
import { GLOBAL_CONFIG, URL, USER_INFO } from "./global/config";

import $ from "jquery";

// Content Scripts가 로드되었음을 확인
console.log("🚀 Content Scripts listener.js loaded successfully!");
console.log("🚀 Current URL:", window.location.href);

// Content Scripts 로드 완료 플래그 설정
window.contentScriptsLoaded = true;

// Message listener 등록 확인
console.log("📋 Registering chrome.runtime.onMessage listener...");

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("📥 Content Scripts received message:", msg.action, msg);

  switch (msg.action) {
    // 하이라이트 삭제 - DOM에서 하이라이트 태그를 제거하고 메모리에서도 삭제
    case "unwrap.highlight":
      //본문의 highlight를 삭제한다.
      $("[" + GLOBAL_CONFIG.HL_ID_NAME + "=" + msg.data.IDX + "]").each(
        (idx, item) => {
          $(item)
            .contents()
            .unwrap();
        }
      );

      // Safely update HIGHLIGHT_LIST if it exists
      if (
        GLOBAL_CONFIG.HIGHLIGHT_LIST &&
        Array.isArray(GLOBAL_CONFIG.HIGHLIGHT_LIST)
      ) {
        GLOBAL_CONFIG.HIGHLIGHT_LIST.map((highlight, index) => {
          if (msg.data.IDX === highlight.IDX) {
            GLOBAL_CONFIG.HIGHLIGHT_LIST.splice(index, 1);
          }
        });
      }

      break;
    // 현재 사이트 사용 설정 업데이트
    case "update.global.config.useCurrentSite":
      GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
      break;
    // 애플리케이션 초기화 - 새 사이트 로딩 시 하이라이트와 설정을 초기화
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
      APPLICATION.init(msg.data)
        .then(() => {
          // Retry APPLICATION.init up to 3 times if it fails
          let retryCount = 0;
          const maxRetries = 3;

          const retryInterval = setInterval(() => {
            if (retryCount >= maxRetries) {
              console.log(
                "⏹️ Max retries reached, stopping APPLICATION.init retry attempts"
              );
              clearInterval(retryInterval);
              return;
            }

            retryCount++;
            console.log(
              `🔄 Retry APPLICATION.init attempt ${retryCount}/${maxRetries}`
            );

            APPLICATION.init(msg.data).catch(error => {
              console.error(
                `❌ APPLICATION.init retry ${retryCount} failed:`,
                error
              );
              if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
              }
            });
          }, 2000);

          console.log("✅ Content Scripts application.init completed");
          sendResponse({
            success: true,
            message: "Content Scripts initialized successfully"
          });
        })
        .catch(error => {
          console.error("❌ Error during APPLICATION.init:", error);
          sendResponse({
            success: false,
            error: error.message,
            message: "Failed to initialize Content Scripts"
          });
        });

      return true; // Indicates that the response will be sent asynchronously
      break;
    // 현재 사이트 정보 가져오기 - 제목, URL, 사이트 설정 등 반환
    case "get.site.info":
      //let content = await CONTENTS.firstVisitSite(new Object());
      CONTENTS.firstVisitSite(new Object())
        .then(content => {
          content.USE_CURRENT_SITE = GLOBAL_CONFIG.USE_CURRENT_SITE;
          content.SITE_OPEN = GLOBAL_CONFIG.SITE_OPEN;
          content.TITLE = document.title;
          content.UPDATE_TITLE = document.title;
          content.URL = URL.SITE;
          content.URL_KEY = URL.KEY;
          sendResponse(content);
        })
        .catch(error => {
          console.error("Error in get.site.info:", error);
          // Send a basic response even if firstVisitSite fails
          sendResponse({
            USE_CURRENT_SITE: GLOBAL_CONFIG.USE_CURRENT_SITE,
            SITE_OPEN: GLOBAL_CONFIG.SITE_OPEN,
            TITLE: document.title,
            UPDATE_TITLE: document.title,
            URL: URL.SITE || window.location.href,
            URL_KEY: URL.KEY || ""
          });
        });
      return true;
      break;
    // URL 정보 가져오기 - 현재 페이지의 URL 관련 정보 반환
    case "get.url.info":
      sendResponse(URL);
      return true;
      break;
    // 화면 캡처 이벤트 실행
    case "capture":
      EVENT.captureEvent();
      return true;
      break;

    // 하이라이트 위치로 스크롤 이동
    case "position":
      EVENT.positionEvent(msg.data);
      return true;
      break;

    // 액션 실행 - 기존 그룹 제거 후 새 컨텐츠 폼 생성
    case "emit.action":
      document.getElementsByTagName("webgalpi-group")[0].remove();
      APPLICATION.createContentsForm(msg.data[0].COLOR);

      return true;
      break;
  }
});
