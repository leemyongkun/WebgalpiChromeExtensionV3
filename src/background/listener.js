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
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(msg => {
    console.log("background/listener / msg.action ", msg.action);
    switch (msg.action) {
      case "popup.highlights":
        let param = new Object();

        console.log("msg.data ", msg.data.KEY);

        param.URL_KEY = msg.data.KEY;
        console.log("param ", param);
        API.getAllItems(param).then(res => {
          port.postMessage(res);
        });
        break;
      case "popup.save.site":
        API.postSite(msg.data);
        break;
      case "all.sites":
        console.log("all.sites ");
        let p = new Object();
        p.ts = "kkuni all sites";
        port.postMessage(p);
        break;
    }
  });
});
