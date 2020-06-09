import API from "../api/api.js";
import dbcon from "../database/dbcon";
import Utils from "../dashboard/utils/Utils";

let emitOptionsAllTabs = (actionCommand, data) => {
  chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
    chrome.windows.getAll({ populate: true }, function(windows) {
      windows.forEach(function(window) {
        window.tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(
            tab.id,
            { action: actionCommand, data: data },
            function(response) {
              checkLastError("emit.action");
            }
          );
        });
      });
    });
  });
};

function checkLastError(message) {
  let lastError = chrome.runtime.lastError;
  if (lastError) {
    console.log(message, lastError);
    return;
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  switch (msg.type) {
    case "init.data.option":
      API.initDataOption(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    case "get.category.max.id":
      API.getCategoryMaxId().then(result => {
        sendResponse(result);
      });
      return true;
      break;
    case "init.data.category":
      API.initDataCategory(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
    case "close.site":
      let target = msg.data;
      //현재 열려있는 구글 TAB 제거
      chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
        chrome.windows.getAll({ populate: true }, function(windows) {
          windows.forEach(function(window) {
            window.tabs.forEach(function(tab) {
              if (tab.url === target) {
                chrome.tabs.remove(tab.id);
              }
            });
          });
        });
      });
      return true;
      break;
    case "reload.all.tab":
      //설치 , 업데이트 시 모든 탭을 리로딩 한다.
      chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
        chrome.windows.getAll({ populate: true }, function(windows) {
          windows.forEach(function(window) {
            window.tabs.forEach(function(tab) {
              chrome.tabs.reload(tab.id);
            });
          });
        });
      });
      break;
    case "reloading.same.site":
      //todo : 같은 사이트를 리로딩 한다.
      chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        chrome.tabs.query({}, tabs => {
          tabs.map(item => {
            //하이라이팅 / 사이트 저장시
            if (msg.data === null) {
              if (
                currentTab[0].id !== item.id &&
                currentTab[0].url === item.url
              ) {
                chrome.tabs.reload(item.id);
              }
            } else {
              //dashboard에서 사이트 삭제 시
              if (msg.data.URL === item.url) {
                chrome.tabs.reload(item.id);
              }
            }
          });
        });
      });
      break;

    case "reloading.dashboard":
      console.log("########## ");
      chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        chrome.tabs.query({}, tabs => {
          tabs.map(item => {
            //하이라이팅 / 사이트 저장시
            if (
              item.url ===
              "chrome-extension://" +
                chrome.runtime.id +
                "/dashboard/index.html"
            ) {
              chrome.tabs.reload(item.id);
            }
          });
        });
      });
      break;

    case "insert.member":
      let data = msg.data;
      let memberParameter = [
        data.email,
        "", //name
        data.password, //password
        data.picture, //image
        "Y",
        new Date().getTime()
      ];
      API.postMember(memberParameter).then(() => {
        sendResponse(true);
      });
      break;
    case "get.backup.data":
      API.getBackupData(msg.data).then(backupdata => {
        sendResponse(backupdata);
      });
      return true;
      break;

    case "update.member.use":
      API.updateMemberUse(msg.data).then(members => {
        sendResponse(members);
      });
      return true;
      break;
    case "get.all.members":
      API.getAllMembers().then(members => {
        sendResponse(members);
      });
      return true;
      break;
    case "create.highlight":
      if (msg.data.SITE_CHECK === "N") {
        API.postSite(msg.data);
      }
      API.postItem(msg.data);
      break;

    case "update.highlight":
      API.updateItem(msg.data);
      break;

    case "delete.highlight":
      API.deleteItem(msg.data).then(res => {
        sendResponse(true);
      });
      return true;
      break;

    case "delete.all.highlight":
      API.deleteItems(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "delete.site.in.category":
      API.deleteSiteInCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "delete.site":
      API.deleteSite(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "post.site":
      if (msg.data.USE_CURRENT_SITE === "N") {
        API.postSite(msg.data).then(site => {
          sendResponse(site);
        });
      }
      break;

    case "full.before.capture":
      chrome.tabs.captureVisibleTab(
        sender.tab.windowId,
        { format: "png", quality: 100 },
        function(dataUrl) {
          sendResponse(dataUrl);
        }
      );
      return true;
      break;
    case "get.highlights":
      let param = new Object();
      if (msg.data === undefined) {
        return false;
      }
      param.URL_KEY = msg.data.KEY;
      param.EMAIL = msg.data.EMAIL;
      API.getAllItems(param).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    /*case "get.site": //미사용
                                                      let getSiteParameter = new Object();
                                                      getSiteParameter.URL_KEY = msg.data;

                                                      API.getSite(getSiteParameter).then(res => {
                                                        sendResponse(res); //조건
                                                      });
                                                      return true;
                                                      break;*/

    case "get.sites.count":
      API.getSites(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;

    case "get.sites":
      API.getSites(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    case "get.category": //dashboard
      API.getCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "get.system.category": //dashboard
      API.getSystemCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "get.system.all.category.count": //dashboard
      API.getAllCategoryCount(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "get.system.no.category.count": //dashboard
      API.getNoCategoryCount(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "get.lost.category": //dashboard
      API.getLostCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "get.slack":
      API.getSlack(null).then(res => {
        sendResponse(res);
      });
      break;

    case "update.slack":
      API.updateSlack(msg.data).then(res => {
        sendResponse(res);
      });
      break;

    case "delete.slack":
      API.deleteSlack(msg.data).then(res => {
        sendResponse(res);
      });
      break;
    case "post.slack":
      API.postSlack(msg.data).then(res => {
        sendResponse(res);
      });
      break;

    case "update.option.color":
      API.updateOptionColor(msg.data);
      //emit all Tab
      let parameter = new Object();
      parameter.EMAIL = msg.data[1]; //email
      API.getOptions(parameter).then(option => {
        emitOptionsAllTabs("emit.action", option);
        sendResponse(true);
      });
      return true;
      break;
    case "update.option.theme":
      API.updateOptionTheme(msg.data).then(res => {
        sendResponse(res);
      });
      break;
    case "post.category.relation": //dashboard
      API.deleteCategoryRelation(msg.data).then(() => {
        API.postCategoryRelation(msg.data).then(res => {
          sendResponse(res);
        });
      });
      return true;
      break;
    case "insert.category.item": //dashboard
      API.insertCategoryItem(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "delete.category.item": //dashboard
      let deleteCategoryParam = msg.data;

      if (deleteCategoryParam.CHECK_ROOT) {
        //삭제 시, 하위 Directory 는 미아로 변경
        let lostTargetCateggory = [deleteCategoryParam.CATEGORY_ID];
        API.updateLostCategoryItem(lostTargetCateggory);
      } else {
        //category와 연관되어있는 contents relation을 삭제한다.
        API.deleteCategoryRelationParent(deleteCategoryParam.CATEGORY_ID);
      }
      //삭제한다.
      API.deleteCategory(deleteCategoryParam.CATEGORY_ID).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    case "update.category.item": //dashboard
      let categoryParam = msg.data;

      if (categoryParam.CATEGORY_TYPE !== "SYSTEM") {
        if (categoryParam.CHECK_ROOT) {
          //checkRoot가 true 일경우
          API.deleteCategoryRelationParent(categoryParam.CATEGORY_ID);
        }

        if (categoryParam.CATEGORY_PARENT === 0 && categoryParam.CHECK_ROOT) {
        } else {
          //카테고리 변경 시, parent에 포함된 category를 미아로 변경
          let lostTargetCateggory = [categoryParam.CATEGORY_ID];
          API.updateLostCategoryItem(lostTargetCateggory);
        }
      }

      API.updateCategoryItem(categoryParam).then(res => {
        sendResponse(res);
      });

      return true;
      break;
    case "update.convert.viewmode":
      API.updateConvertViewmode(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "restore.site":
      API.restoreSite(msg.data).then(site => {
        sendResponse(site);
      });
      return true;
      break;
    case "restore.category":
      API.restoreCategory(msg.data).then(category => {
        sendResponse(category);
      });
      return true;
      break;
    case "restore.category.relation":
      API.restoreCategoryRelation(msg.data).then(relation => {
        sendResponse(relation);
      });
      return true;
      break;
    case "restore.highlight":
      API.restoreHighlight(msg.data).then(highlight => {
        sendResponse(highlight);
      });
      return true;
      break;
    case "restore.log":
      API.restoreLog(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
    case "update.favorite":
      API.updateFavorite(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
    case "delete.favorite":
      API.deleteFavorite(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
  }
});

/*chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(async msg => {
    switch (msg.action) {
      case "popup.save.site":
        API.postSite(msg.data);
        break;
    }
  });
});*/
