import API from "../api/api.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
  }
});
