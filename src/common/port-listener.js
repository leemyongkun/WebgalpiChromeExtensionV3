let port = chrome.extension.connect({
  name: "POPUP COMMUNICATION"
});

let POPUP_LISTENER = {
  postMessage: (actionName, data) => {
    port.postMessage({
      action: actionName,
      data: data
    });
    return port;
  }
};

export { POPUP_LISTENER };
