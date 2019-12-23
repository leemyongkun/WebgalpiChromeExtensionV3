import CONTENTS from "./contents";
import EVENT from "./event";
import APPLICATION from "./application.js";

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      APPLICATION.init(msg.data);
      sendResponse(true);
      return true;
      break;
    case "get.site.info":
      let content = await CONTENTS.firstVisitSite(new Object());
      console.log("content ", content);
      sendResponse(content);
      return true;
      break;

    case "capture":
      EVENT.captureEvent();
      return true;
      break;
  }
});
