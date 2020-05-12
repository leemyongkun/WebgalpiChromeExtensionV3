let ACCOUNT = {
  removeGoogleTokenCache: token => {
    return new Promise(res => {
      chrome.identity.removeCachedAuthToken({ token: token }, () => {
        window
          .fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token)
          .then(() => {
            res(true);
          });
      });
    });
  },
  googleLogin: () => {
    return new Promise((res, rej) => {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        chrome.storage.local.set({
          googleToken: token
        });
        // chrome.identity.removeCachedAuthToken({ token: token }, () => {});
        if (token === undefined) return false;
        //https://www.google.com/search?q=chrome.identity.getAuthToken+cache&rlz=1C5CHFA_enKR819KR819&oq=chrome.identity.getAuthToken+cache&aqs=chrome..69i57.1571j0j7&sourceid=chrome&ie=UTF-8
        //https://developer.chrome.com/apps/tut_oauth
        //https://console.developers.google.com/apis/api/drive.googleapis.com/metrics?project=chrome-webgalpi
        //https://developers.google.com/drive/api/v3/reference/files/create
        //https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/identity -- 샘플

        //GOOGLE 로그인
        let init = {
          method: "GET",
          async: true,
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
          contentType: "json"
        };
        fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
            token,
          init
        )
          .then(response => response.json())
          .then(function(data) {
            //현재 열려있는 구글 TAB 제거
            chrome.tabs.query(
              { active: true, currentWindow: true },
              currentTab => {
                chrome.tabs.query({}, tabs => {
                  tabs.map(item => {
                    if (item.url.indexOf("www.google.com") !== -1) {
                      chrome.tabs.remove(item.id);
                    }
                  });
                });
              }
            );

            res(data);
            /*chrome.identity.removeCachedAuthToken({ token: token }, () => {});*/
          })
          .catch(err => {
            rej(err);
          });

        return false;
      });
    });
  }
};
export default ACCOUNT;
