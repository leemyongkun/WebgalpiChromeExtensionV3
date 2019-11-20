import { CONTENT_ACTION, ACTION } from "./action.js";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      ACTION.init(msg.data);
      sendResponse(true);
      return true;
      break;
    case "content.test":
      let content = await CONTENT_ACTION.firstVisitSite(new Object());
      console.log("content >> ", content);
      sendResponse(content);
      return true;
      break;
  }
});
