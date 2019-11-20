import { CONTENT_ACTION, ACTION } from "./action.js";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      ACTION.init(msg.data);
      sendResponse(true);
      return true;
      break;
    case "content.test":
      sendResponse(await CONTENT_ACTION.firstVisitSite(new Object()));
      break;
  }
});
