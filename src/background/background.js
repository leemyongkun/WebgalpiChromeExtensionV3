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
    console.log("initApplication");
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
      chrome.storage.local.set({ [tabId]: currentUrl }, null);
      console.log("initApplication 2");
      Api.getInitInfo(param).then(res => {
        console.log("####### ", res);

        //로그인 정보 저장해둔다.
        chrome.storage.local.set({ loginInfo: res.loginInfo });

        if (res.loginInfo.EMAIL === "") {
          return false;
        }
        //todo : excludesUrl 등록 기능 추가 할것.
        res.tabid = tabId;

        console.log("####");
        //옵션을 저장해둔다.
        chrome.storage.local.set({ options: res.options });

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
        /*dbcon.dropTable();
        dbcon.createTable();
        dbcon.initData();*/
      } else {
        alert("현재 브라우저는 Web SQL Database를 지원하지 않습니다");
      }
    });

    chrome.runtime.onSuspend.addListener(suspend => {
      alert("suspend");
    });
  },
  getBookmarks: () => {
    let bookmark = new Array();
    chrome.bookmarks.getTree(function(itemTree) {
      $(itemTree)
        .each(function(idx, item) {
          processNode(item);
        })
        .promise()
        .then(() => {
          console.log("bookmark ", bookmark);
        });
    });

    function processNode(node) {
      // recursively process child nodes
      if (node.children) {
        node.children.forEach(function(child) {
          processNode(child);
        });
      }
      bookmark.push(node);
    }
  },
  onUpdated: () => {
    chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
      console.log("info.status ", info.status);
      if (info.status === "complete") {
        //팝업인지 확인.
        BackgroundModule.isPopup();

        //대쉬보드의 TABID를 저장해둔다. (재진입시 STATUS를 변경하여 리로딩 하기 위함)
        if (
          tab.url ===
          "chrome-extension://" +
            chrome.runtime.id +
            "/dashboard/dashboard.html"
        ) {
          chrome.storage.local.set({
            activeDashboardTabId: tab.id
          });
        }

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
chrome.notifications.onClicked.addListener(function(notifId) {
  alert(notifId);
  if (notifId == "notification_1") {
    //handle notification 1 being clicked
  }
  if (notifId == "notification_2") {
    //handle notification 2 being clicked
  }
  //etc.
});

//설치 및 리로딩시
BackgrounEvent.onInstalled();

//Tab이 열릴때
BackgrounEvent.onUpdated();

//Bookmark
BackgrounEvent.getBookmarks();

//DashBoard에 재진입 했을때 데이타를 다시 가져온다.
chrome.tabs.onActivated.addListener((activeInfo, act) => {
  chrome.storage.local.get(["activeDashboardTabId"], result => {
    if (result.activeDashboardTabId === activeInfo.tabId) {
      chrome.storage.local.set({ activeDashboardStatus: true });
    }
  });
});
