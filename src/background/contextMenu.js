import COMMON_ACTION from "../common/commonAction";
import API from "../api/api";
import Common from "../common/common";
import LANG from "../common/language";
function contextAction(info, tab) {
  if (info.menuItemId === "dashboard") {
    let extensionDashboard = Common.getDashboardUrl();
    if (tab.url === extensionDashboard) {
      return false;
    }
    chrome.tabs.create({ url: extensionDashboard });
  }

  if (info.menuItemId === "tabgroup") {
    chrome.tabs.create({ url: Common.getDashboardUrl() + "?tabgroup" });
  }

  if (info.menuItemId === "saveSite") {
    COMMON_ACTION.getSiteInfo(tab.id).then(siteInfo => {
      if (siteInfo.USE_CURRENT_SITE === "N") {
        API.postSite(siteInfo).then(site => {
          LANG.ALERT_MESSAGE("A0014");
        });
      } else {
        alert(LANG.ALERT_MESSAGE("A0020"));
      }
    });
  }
}

chrome.contextMenus.onClicked.addListener(contextAction);

//ROOT
chrome.contextMenus.create({
  id: "webGalpi",
  title: "WEBGALPI",
  checked: false,
  contexts: ["all"]
});

//CHILD
chrome.contextMenus.create({
  id: "dashboard",
  title: "대쉬보드 이동하기",
  parentId: "webGalpi",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "tabgroup",
  title: "열려있는 Tab 모으기",
  parentId: "webGalpi",
  contexts: ["all"]
});

/*chrome.contextMenus.create({
    id: "saveSite",
    title: "이 사이트 저장하기",
    parentId: "webGalpi",
    contexts: ["all"]
});*/

/*
let extensionDashboard =
            "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";
        if (tab.url === extensionDashboard) {
            location.reload();
            return false;
        }
        chrome.tabs.query({}, tabs => {
            let sameUrl = tabs.filter(item => {
                return item.url === extensionDashboard
            });

            if (sameUrl.length === 0) {
                let open = window.open(extensionDashboard, "_blank");
                open.focus();
            }else{
                //해당 탭으로 이동 (2개이상일경우, 0번째로 이동)
                chrome.tabs.reload(sameUrl[0].id, null);
                chrome.tabs.update(sameUrl[0].id, { 'active': true });
            }

        });
 */
