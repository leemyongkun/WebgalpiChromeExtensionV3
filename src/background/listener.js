import API from "../api/api.js";

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "get.backup.data":
      API.getBackupData();
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
        console.log("post.site param ", msg.data);
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
        alert("제공되지 않는 페이지입니다.");
        return false;
      }
      param.URL_KEY = msg.data.KEY;
      API.getAllItems(param).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "get.site": //dashboard
      console.log("getSITE : msg.data ", msg.data);

      let getSiteParameter = new Object();
      getSiteParameter.URL_KEY = msg.data;

      API.getSite(getSiteParameter).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;

    case "get.sites": //dashboard
      API.getSites(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    case "get.category": //dashboard
      API.getCategory(null).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    case "get.lost.category": //dashboard
      API.getLostCategory(null).then(res => {
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
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(async msg => {
    console.log("background/listener / msg.action ", msg.action);
    switch (msg.action) {
      case "popup.save.site":
        API.postSite(msg.data);
        break;
    }
  });
});
