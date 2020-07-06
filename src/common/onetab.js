import CONTENT_LISTENER from "./content-listener";

let md5 = require("md5");

let ONETAB = {
  closeAllTab() {
    let tabList = [];
    let current =
      "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";

    return new Promise(res => {
      chrome.windows.getAll({ populate: true }, windows => {
        windows.forEach(async window => {
          const promise = window.tabs.map(tab => {
            if (tab.url !== current) {
              tabList.push(tab);
              chrome.tabs.remove(tab.id);
            }
          });

          await Promise.all(promise);
          res(tabList);
        });
      });
    });
  },
  insertTabInfo(tabList) {
    let groupId = new Date().getTime();
    tabList.map(tab => {
      tab.GROUP_ID = groupId;
      tab.URL_KEY = md5(tab.url.split("#")[0]);

      return CONTENT_LISTENER.sendMessage({
        type: "insert.tabinfo",
        data: tab
      });
    });
  }
};
export default ONETAB;
