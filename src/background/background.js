import store from "../store";

global.browser = require("webextension-polyfill");
let md5 = require("md5");
import dbcon from "../database/dbcon.js";
import Api from "../api/api.js";

const CLIENT_ID =
  "193252333713-j91q3e6p75o5g836o8s7kb5ka2ovik3c.apps.googleusercontent.com";
const API_KEY = "Kt09L4H4hglL78qJcqot1r1j";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
let $ = require("jquery");
import gapi from "gapi-client";

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
        console.log("res ", res);
        res.tabid = tabId;
        chrome.tabs.sendMessage(
          tabId,
          { action: "init", data: res, site: param },
          response => {
            console.log("response ", response);
            checkLastError("init");
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
        dbcon.initData();
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

        //gapi.load("auth:client", handleClientLoad);
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

function handleClientLoad() {
  gapi.client.setApiKey(API_KEY);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  var options = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: true
  };
  gapi.auth.authorize(options, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById("authorize-button");

  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = "hidden";
    makeApiCall();
  } else {
    authorizeButton.style.visibility = "";
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  var options = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false
  };
  gapi.auth.authorize(options, handleAuthResult);
  return false;
}

function makeApiCall() {
  gapi.client.load("drive", "v2", makeRequest);
}

function makeRequest() {
  var request = gapi.client.drive.files.list({ maxResults: 5 });
  request.execute(function(resp) {
    for (i = 0; i < resp.items.length; i++) {
      var titulo = resp.items[i].title;
      var fechaUpd = resp.items[i].modifiedDate;
      var userUpd = resp.items[i].lastModifyingUserName;
      var userEmbed = resp.items[i].embedLink;
      var userAltLink = resp.items[i].alternateLink;

      var fileInfo = document.createElement("li");
      fileInfo.appendChild(
        document.createTextNode(
          "TITLE: " +
            titulo +
            " - LAST MODIF: " +
            fechaUpd +
            " - BY: " +
            userUpd
        )
      );
      document.getElementById("content").appendChild(fileInfo);
    }
  });
}

let GOOGLE_DRIVE = {
  load: () => {
    gapi.load("auth:client", handleClientLoad);
    /* $.getScript('https://apis.google.com/js/api.js', function() {
                 gapi.load('auth:client', handleClientLoad);
             });*/
  }
};
//export default GOOGLE_DRIVE;
// $('#authorize-button').on('click', handleAuthClick);
