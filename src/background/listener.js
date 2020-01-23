import API from "../api/api.js";

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
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
      console.log("get.highlights > msg.data ", msg.data.KEY);
      param.URL_KEY = msg.data.KEY;
      API.getAllItems(param).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "get.sites": //dashboard
      API.getSites(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    case "get.menus": //dashboard
      API.getMenus(null).then(res => {
        sendResponse(res);
      });
      return true;
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
    case "update.category.item": //dashboard
      console.log("update.category.item ", msg.data);
      let categoryId = [msg.data[2]];
      if (msg.data[3]) {
        console.log("msg.dat ", categoryId, msg.data);
        API.deleteCategoryRelationParent(categoryId);
      }

      API.updateCategoryItem(msg.data).then(res => {
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
