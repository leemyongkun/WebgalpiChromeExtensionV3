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
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(msg => {
    switch (msg.action) {
      case "popup.highlights":
        let param = new Object();
        param.URL_KEY = msg.data;
        API.getAllItems(param).then(res => {
          port.postMessage(res);
        });
        break;
    }
  });
});
