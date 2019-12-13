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
      let result = await API.getAllItems(msg.data);
      sendResponse(result);
      return true;
      break;
  }
});
