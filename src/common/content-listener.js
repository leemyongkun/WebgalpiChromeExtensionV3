let $ = require("jquery");
import LANG from "./language";
let CONTENT_LISTENER = {
  checkLastError: message => {
    let lastError = chrome.runtime.lastError;
    if (lastError) {
      console.log(message, lastError);
      return;
    }
  },
  sendMessage: parameter => {
    return new Promise(res => {
      try {
        chrome.runtime.sendMessage(parameter, function(response) {
          CONTENT_LISTENER.checkLastError("checkLastError : " + parameter.type);
          res(response);
        });
      } catch (e) {
        alert(LANG.ALERT_MESSAGE("A0025"));
        location.reload();
      }
    });

    /*
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

    */
  }
};

export default CONTENT_LISTENER;
