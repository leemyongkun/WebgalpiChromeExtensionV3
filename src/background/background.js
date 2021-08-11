global.browser = require("webextension-polyfill");

import dbcon from "../database/dbcon.js";
import Api from "../api/api.js";
import LANG from "../common/language";
import SITE_MANAGER from "../common/site-manager";
import Common from "../common/common";

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
    if (isPopup) {
      isPopup = false;
      return false;
    }

    /** 차단된 사이트는 열지 않도록 한다. */
    if (BackgrounEvent.checkExcludeSite(tabId, currentUrl)) return false;

    /** 현재 urlKey를 저장한다. */
    chrome.storage.local.set({ [tabId]: currentUrl }, null);

    //todo : N번 호출 됨.

    /** EMAIL로 조건을 걸지 않고, 사용중(IS_USE=Y)의 데이타만 가져온다 */
    Api.getMemberInfo().then(memberInfo => {
      if (memberInfo.EMAIL === "") {
        return false;
      }
      /**  로그인 정보 저장해둔다.*/
      chrome.storage.local.set({ loginInfo: memberInfo });

      let urlPath = currentUrl;
      let ext = urlPath.substr(urlPath.length - 4, urlPath.length);
      currentUrl = Common.generatorUrlKey(currentUrl, memberInfo.EMAIL);

      let initParameter = {
        URL_KEY: currentUrl,
        URL: urlPath,
        EXT: ext
      };

      initParameter.EMAIL = memberInfo.EMAIL;

      Api.getInitInfo(initParameter).then(res => {
        if (res.isRegist) {
          let highlightSize =
            res.allItems.HIGHLIGHT_LIST == null
              ? 0
              : res.allItems.HIGHLIGHT_LIST.length;
          BackgrounEvent.setBadge(tabId, a.toString(), "green");
        }

        //todo : excludesUrl 등록 기능 추가 할것.
        res.tabid = tabId;

        //옵션을 저장해둔다.
        chrome.storage.local.set({ options: res.options });

        chrome.tabs.sendMessage(tabId, {
          action: "application.init",
          data: res,
          site: initParameter
        });
      });
    });
  }
};

let BackgrounEvent = {
  setBadge: (tabId, _text, _color) => {
    chrome.browserAction.setBadgeText({
      text: _text,
      tabId: tabId
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: _color,
      tabId: tabId
    });
  },
  checkExcludeSite: (tabId, currentUrl) => {
    let isDetected = false;
    for (var i = 0; i < SITE_MANAGER.DETECTE_SITES.length; i++) {
      if (currentUrl.indexOf(SITE_MANAGER.DETECTE_SITES[i]) !== -1) {
        isDetected = true;
        chrome.browserAction.setPopup({
          tabId: tabId,
          popup: "popup/detectPopup.html"
        });
        BackgrounEvent.setBadge(tabId, "X", "red");
        return false;
      }
    }

    return isDetected;
  },
  onInstalled: () => {
    chrome.runtime.onInstalled.addListener(details => {
      if (details.reason === "install") {
        if (!!window.openDatabase) {
          //LANG.getMessage("A0022");

          chrome.storage.local.remove(["loginInfo"]);
          dbcon.dropTable();
          dbcon.createTable();
        } else {
          alert(LANG.ALERT_MESSAGE("A0023"));
        }
      } else {
        var opt = {
          type: "basic",
          title: "WEBGALPI",
          message:
            "VER " + Common.getVersion() + LANG.DESCRIPTION_MESSAGE("D0083"),
          iconUrl: "../icons/pen.png"
        };

        //테이블 추가
        dbcon.addTable();
        dbcon.removeTable();
        //업데이트 Alert 출력

        chrome.notifications.create("", opt);
        chrome.notifications.onClicked.addListener(function() {
          chrome.tabs.create({ url: Common.getDashboardUrl() + "?update" });
        });
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
      //todo : console.log("complte에서 loading으로 변경함.. 나중에 수정해야할 수도.. ",info.status);
      if (info.status === "complete") {
        //loading
        /** 팝업인지 확인.*/
        BackgroundModule.isPopup();

        /** 대쉬보드의 TABID를 저장해둔다. (재진입시 STATUS를 변경하여 리로딩 하기 위함) */
        if (tab.url === Common.getDashboardUrl()) {
          chrome.storage.local.set({
            activeDashboardTabId: tab.id
          });
        }
        /** 현재 사이트에 하이라이트 초기화 */
        BackgroundModule.initApplication(tabId, tab.url);
      }
    });
  },
  autoBackupScheduler: () => {
    setInterval(() => {
      //alert(new Date().getTime());
    }, 10000);
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

/** 설치 및 리로딩시 */
BackgrounEvent.onInstalled();

/** Tab이 열릴때 */
BackgrounEvent.onUpdated();

//BackgrounEvent.autoBackupScheduler();

//Bookmark
//BackgrounEvent.getBookmarks();

/** DashBoard에 재진입 했을때 데이타를 다시 가져온다. */
chrome.tabs.onActivated.addListener((activeInfo, act) => {
  chrome.storage.local.get(["activeDashboardTabId"], result => {
    if (result.activeDashboardTabId === activeInfo.tabId) {
      chrome.storage.local.set({ activeDashboardStatus: true });
    }
  });
});

/** Window에 Focus Event 발생 시*/
/*chrome.windows.onFocusChanged.addListener(function(window) {
    if (window != chrome.windows.WINDOW_ID_NONE) {
        console.log("onFocus");
        SYNC.SERVER();
    }
});*/
/** 새탭이 열릴때 서버에서 싱크 */
/*chrome.tabs.onCreated.addListener(callback => {
    console.log("onCreate");
    SYNC.SERVER();
});*/

export default BackgroundModule;
