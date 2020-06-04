import store from "../store";

global.browser = require("webextension-polyfill");
let md5 = require("md5");
import dbcon from "../database/dbcon.js";
import Api from "../api/api.js";
import LANG from "../common/language";
import SITE_MANAGER from "../common/site-manager";

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

      //차단된 사이트는 열지 않도록 한다.
      let isDetected = false;
      for (var i = 0; i < SITE_MANAGER.DETECTE_SITES.length; i++) {
        if (currentUrl.indexOf(SITE_MANAGER.DETECTE_SITES[i]) !== -1) {
          isDetected = true;
          chrome.browserAction.setPopup({
            tabId: tabId,
            popup: "popup/detectPopup.html"
          });

          chrome.browserAction.setBadgeText({
            text: "X",
            tabId: tabId
          });
          chrome.browserAction.setBadgeBackgroundColor({
            color: "red",
            tabId: tabId
          });

          return false;
        }
      }
      if (isDetected) {
        return false;
      }

      let urlPath = currentUrl;
      let ext = urlPath.substr(urlPath.length - 4, urlPath.length);
      currentUrl = md5(currentUrl.split("#")[0]);

      let initParameter = {
        URL_KEY: currentUrl,
        URL: urlPath,
        EXT: ext
      };

      //현재 urlKey를 저장한다.
      chrome.storage.local.set({ [tabId]: currentUrl }, null);

      //EMAIL로 조건을 걸지 않고, 사용중(IS_USE=Y)의 데이타만 가져온다
      Api.getMemberInfo().then(memberInfo => {
        if (memberInfo.EMAIL === "") {
          return false;
        }
        //로그인 정보 저장해둔다.
        chrome.storage.local.set({ loginInfo: memberInfo });

        initParameter.EMAIL = memberInfo.EMAIL;

        Api.getInitInfo(initParameter).then(res => {
          //todo : excludesUrl 등록 기능 추가 할것.
          res.tabid = tabId;

          //옵션을 저장해둔다.
          chrome.storage.local.set({ options: res.options });

          chrome.tabs.sendMessage(
            tabId,
            { action: "application.init", data: res, site: initParameter },
            response => {
              checkLastError("application.init");
            }
          );
        });
      });

      res(true);
    });
  }
};
let BackgrounEvent = {
  onInstalled: () => {
    chrome.runtime.onInstalled.addListener(details => {
      if (details.reason === "install") {
        if (!!window.openDatabase) {
          LANG.getMessage("M0001");
          chrome.storage.local.remove(["loginInfo"]);
          dbcon.dropTable();
          dbcon.createTable();
        } else {
          alert(LANG.getMessage("M0002"));
        }
      } else {
        //UPDATE
        /*chrome.identity.getAuthToken({ interactive: true }, token => {
                                          console.log("token " , token);
                                          ACCOUNT.removeGoogleTokenCache(token);
                                        })*/
        //todo : update 일때 Action (Version 별로 관리하는것이 좋을듯)

        console.log(chrome.runtime.getManifest().version);
        let message =
          "[" +
          chrome.runtime.getManifest().version +
          `] 업데이트 되었습니다.\n\n1. MORE 버튼의 Count가 변경되지 않는 현상 수정.\n2. Slack 공유 기능 삭제`;
        //alert(message);
      }
    });

    chrome.runtime.onSuspend.addListener(suspend => {});
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
      if (info.status === "complete") {
        //loading
        //팝업인지 확인.
        BackgroundModule.isPopup();

        //대쉬보드의 TABID를 저장해둔다. (재진입시 STATUS를 변경하여 리로딩 하기 위함)
        if (
          tab.url ===
          "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html"
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
    console.log("ERROR", message, lastError);
    return;
  }
}

function setBadgeColor(color) {
  chrome.browserAction.setIcon({
    path: {
      "19": "images/icon/" + color + "/19.png",
      "38": "images/icon/" + color + "/38.png"
    }
  });
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
//BackgrounEvent.getBookmarks();

//DashBoard에 재진입 했을때 데이타를 다시 가져온다.
chrome.tabs.onActivated.addListener((activeInfo, act) => {
  chrome.storage.local.get(["activeDashboardTabId"], result => {
    if (result.activeDashboardTabId === activeInfo.tabId) {
      chrome.storage.local.set({ activeDashboardStatus: true });
    }
  });
});

function doStuff(request) {
  chrome.extension.onRequest.removeListener(doStuff);
  console.log(request);
}

chrome.extension.onRequest.addListener(doStuff);
