function contextAction(info, tab) {
  if (info.menuItemId == "webGalpi") {
    let extensionDashboard =
      "chrome-extension://" + chrome.runtime.id + "/dashboard/dashboard.html";
    if (tab.url === extensionDashboard) {
      location.reload();
      return false;
    }
    let open = window.open(extensionDashboard, "_blank");
    open.focus();
  }

  if (info.menuItemId == "saveSite") {
    if (tab.url.indexOf("chrome-extension://") !== -1) {
      alert("Dashboard에서는 저장할 수 없습니다.");
      return false;
    }
    //todo
    alert("준비중");
  }
}

chrome.contextMenus.onClicked.addListener(contextAction);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "webGalpi",
    title: "WEB-GALPI",
    checked: false,
    contexts: ["all"]
  });

  /*  chrome.contextMenus.create({
    id: "dashboard",
    title: "DASHBOARD",
    parentId: "webGalpi",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "saveSite",
    title: "SAVE SITE",
    parentId: "webGalpi",
    contexts: ["all"]
  });*/
});
