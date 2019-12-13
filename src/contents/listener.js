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
    case "content.test":
      let content = await CONTENT_ACTION.firstVisitSite(new Object());
      sendResponse(content);
      return true;
      break;
    case "getHighlights":
      //Background 로 보낸다.
      /*let highlights = await CONTENT_ACTION.getHighlights();
            console.log("getHighlights  " , JSON.stringify(highlights));*/
      sendResponse(await CONTENT_ACTION.getHighlights());
      break;
  }
});
