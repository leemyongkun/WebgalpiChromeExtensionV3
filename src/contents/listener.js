import { ACTION } from "./action.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      ACTION.init(msg.data);
      sendResponse(true);
      return true;
  }
});
