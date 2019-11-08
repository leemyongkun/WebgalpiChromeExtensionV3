import Action from "./action.js";
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.action) {
    case "init":
      Action.init(msg.data);
      sendResponse(true);
      return true;
  }
});
