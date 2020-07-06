let COMMON_ACTION = {
  getSiteInfo: tabId => {
    return new Promise(res => {
      let interval = setInterval(() => {
        chrome.tabs.sendMessage(
          tabId,
          { action: "get.site.info" },
          siteInfo => {
            if (siteInfo === undefined) {
              clearInterval(interval);
              alert(
                "WEBGALPI가 로딩되지 않았습니다.\nPOPUP을 닫고 새로고침 후 다시 시도하십시오."
              );
              return false;
            }

            if (siteInfo.OG_IMAGE === null || siteInfo.OG_IMAGE === "") {
              siteInfo.OG_IMAGE = "";
            }
            if (siteInfo.OG_TITLE === null || siteInfo.OG_TITLE === "") {
              siteInfo.OG_TITLE = siteInfo.UPDATE_TITLE;
            }
            if (
              siteInfo.OG_DESCRIPTION === null ||
              siteInfo.OG_DESCRIPTION === ""
            ) {
              siteInfo.OG_DESCRIPTION = "NO DESCRIPTION";
            }

            siteInfo.DEFAULT_CATEGORY_IDX = null;

            console.log("###", siteInfo);
            if (siteInfo.URL !== "") {
              chrome.storage.local.get(["loginInfo"], result => {
                siteInfo.EMAIL = result.loginInfo.EMAIL;
                clearInterval(interval);
                res(siteInfo);
              });
            }
          }
        );
      }, 300);
    });
  }
};

export default COMMON_ACTION;
