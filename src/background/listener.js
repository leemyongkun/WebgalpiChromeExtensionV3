import API from "../api/api.js";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
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
    case "get.sites":
      API.getSites(null).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    case "get.menus":
      API.getMenus(null).then(res => {
        sendResponse(res);
      });
      return true;
      break;

    case "update.option.color":
      API.updateOptionColor(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(msg => {
    console.log("background/listener / msg.action ", msg.action);
    switch (msg.action) {
      case "popup.save.site":
        API.postSite(msg.data);
        break;
    }
  });
});
