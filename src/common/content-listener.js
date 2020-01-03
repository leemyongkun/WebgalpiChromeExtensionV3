let $ = require("jquery");
let CONTENT_LISTENER = {
  checkLastError: message => {
    let lastError = chrome.runtime.lastError;
    if (lastError) {
      console.log(message, lastError);
      return;
    }
  },
  sendMessage: parameter => {
    var reserveDefer = $.Deferred();
    try {
      console.log("parameter ", parameter);
      chrome.runtime.sendMessage(parameter, function(response) {
        console.log("response", response);
        CONTENT_LISTENER.checkLastError("action.js:272" + parameter.type);

        reserveDefer.resolve(response);
      });
    } catch (e) {
      alert("ERROR:Message.ChromeException[LANG]");
    }
    console.log("reserveDefer ", reserveDefer);
    return reserveDefer;
  }
};

export default CONTENT_LISTENER;
