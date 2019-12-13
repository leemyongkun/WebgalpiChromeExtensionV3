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
      sendResponse("2");
      //Background 로 보낸다.
      /* CONTENT_ACTION.getHighlights().then(function (res) {
                 console.log("res ####  ", res);
                 sendResponse("2");
             });*/
      return true;
      break;
  }
});
