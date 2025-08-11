import $ from "jquery";
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
        console.error("CONTENT_LISTENER sendMessage error:", e);
        alert(LANG.ALERT_MESSAGE("A0025"));
        // Only reload if we're not in a popup
        if (window.location.pathname.includes("popup.html")) {
          window.close();
        } else {
          location.reload();
        }
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
