import { CONTENT_ACTION, ACTION } from "./action.js";
import { URL } from "./global/config";
import API from "../api/api";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      ACTION.init(msg.data);
      sendResponse(true);
      return true;
      break;
    case "get.site.info":
      let content = await CONTENT_ACTION.firstVisitSite(new Object());
      console.log("content ", content);
      sendResponse(content);
      return true;
      break;
  }
});
