import API from "../api/api.js";
import { GLOBAL_CONFIG, URL } from "../contents/global/config.js";

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

    case "select.highlights":
      sendResponse(API.getAllItems(msg.data));
      return true;
      break;
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log("background message recieved" + JSON.stringify(msg));
    let param = new Object();
    param.URL_KEY = "10976b60347df5f9ab327e8f6a30be14";
    API.getAllItems(param).then(res => {
      console.log("allItems ", res);
      port.postMessage(res);
    });
  });
});
