import API from "../api/api.js";
import dbcon from "../database/dbcon";

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

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "init.data":
      console.log("msg.data", msg.data);
      dbcon.initData(msg.data);
      break;
    case "get.backup.data":
      API.getBackupData().then(backupdata => {
        sendResponse(backupdata);
      });
      return true;
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
      API.deleteItem(msg.data);
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

    case "get.site": //미사용
      let getSiteParameter = new Object();
      getSiteParameter.URL_KEY = msg.data;

      API.getSite(getSiteParameter).then(res => {
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
      API.updateOptionColor(msg.data).then(res => {
        sendResponse(res);
      });
      //emit all Tab
      API.getOptions().then(option => {
        console.log("options", option);
        emitOptionsAllTabs("emit.action", option);
      });

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
      //삭제 시, 하위 Directory 는 미아로 변경
      //Contents들은 No category로 변경.

      break;
    case "update.category.item": //dashboard
      let categoryParam = msg.data;

      let categoryId = [categoryParam[2]];
      let categoryParent = categoryParam[1];
      let checkRoot = categoryParam[3];

      if (categoryParam[3]) {
        //checkRoot가 true 일경우
        API.deleteCategoryRelationParent(categoryId);
      }

      //if(this.categoryParent === 0 && this.checkRoot){
      if (categoryParent === 0 && checkRoot) {
      } else {
        //카테고리 변경 시, parent에 포함된 category를 미아로 변경
        let lostTargetCateggory = categoryId;
        API.updateLostCategoryItem(lostTargetCateggory);
      }

      API.updateCategoryItem(categoryParam).then(res => {
        sendResponse(res);
      });

      return true;
      break;
    case "update.convert.viewmode":
      console.log("msg.data ", msg.data);
      API.updateConvertViewmode(msg.data).then(res => {
        sendResponse(res);
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
