import CONTENT_LISTENER from "./content-listener";
import Common from "./common";
import Utils from "../dashboard/utils/Utils";

import md5 from "md5";

let ONETAB = {
  closeAllTab() {
    let tabList = [];
    let current = Common.getDashboardUrl();

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
  async insertTabInfo(tabList) {
    let groupId = new Date().getTime();
    let result = await Utils.getLocalStorage("loginInfo");
    tabList.map(tab => {
      tab.GROUP_ID = groupId;
      tab.URL_KEY = md5(tab.url.split("#")[0]);
      tab.EMAIL = result.loginInfo.EMAIL;

      return CONTENT_LISTENER.sendMessage({
        type: "insert.tabinfo",
        data: tab
      });
    });
  }
};
export default ONETAB;
