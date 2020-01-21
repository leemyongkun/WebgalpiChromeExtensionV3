import store from "../store";

global.browser = require("webextension-polyfill");
let md5 = require("md5");
import dbcon from "../database/dbcon.js";
import Api from "../api/api.js";

let $ = require("jquery");

//popup일경우에는 실행하지 않는다.
let isPopup = false;
let BackgroundModule = {
  isPopup: () => {
    chrome.windows.getCurrent(function(win) {
      if (win.type == "popup") isPopup = true;
    });
  },
  initApplication: (tabId, currentUrl) => {
    return new Promise(function(res) {
      if (isPopup) {
        isPopup = false;
        return false;
      }

      let urlPath = currentUrl;
      let ext = urlPath.substr(urlPath.length - 4, urlPath.length);
      currentUrl = md5(currentUrl.split("#")[0]);

      let param = {
        URL_KEY: currentUrl,
        URL: urlPath,
        EXT: ext
      };

      //현재 urlKey를 저장한다.
      chrome.storage.sync.set({ [tabId]: currentUrl }, null);

      Api.getInitInfo(param).then(res => {
        //todo : excludesUrl 등록 기능 추가 할것.
        res.tabid = tabId;

        //옵션을 저장해둔다.
        chrome.storage.sync.set({ options: res.options });

        chrome.tabs.sendMessage(
          tabId,
          { action: "application.init", data: res, site: param },
          response => {
            checkLastError("application.init");
          }
        );
      });

      res(true);
    });
  }
};
let BackgrounEvent = {
  onInstalled: () => {
    chrome.runtime.onInstalled.addListener(details => {
      if (!!window.openDatabase) {
        console.log("현재 브라우저는 Web SQL Database를 지원합니다");
        //dbcon.dropTable();
        dbcon.createTable();
        //dbcon.initData();
      } else {
        alert("현재 브라우저는 Web SQL Database를 지원하지 않습니다");
      }
    });
  },
  onUpdated: () => {
    chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
      if (
        info.status == "loading" &&
        tab.status == "loading" &&
        tab.url != undefined
      ) {
        //todo : badge 변경 및 로딩중 처리 내역이 있으면 추가.
      }

      if (info.status == "complete") {
        //팝업인지 확인.
        BackgroundModule.isPopup();

        console.log("tab.url ", tab.url);

        //현재 사이트에 하이라이트 초기화
        BackgroundModule.initApplication(tabId, tab.url);
      }
    });
  }
};

function checkLastError(message) {
  let lastError = chrome.runtime.lastError;
  if (lastError) {
    console.log(message, lastError);
    return;
  }
}

//설치 및 리로딩시
BackgrounEvent.onInstalled();

//Tab이 열릴때
BackgrounEvent.onUpdated();

let PROTECTION_SITE = {
  DEFAULT: {},
  SNS: ["www.facebook"]
};

// $('#authorize-button').on('click', handleAuthClick);
