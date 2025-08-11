import CONTENT_LISTENER from "./content-listener";

let ACCOUNT = {
  removeGoogleTokenCache: token => {
    return new Promise(res => {
      if (!chrome.identity) {
        console.warn("Chrome identity API not available - OAuth not configured");
        res(false);
        return;
      }
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
      if (!chrome.identity) {
        console.warn("Chrome identity API not available - OAuth not configured");
        rej({ error: "Identity API not available" });
        return;
      }
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        console.log("Chrome Identity Token:", token);
        if (chrome.runtime.lastError) {
          console.error("Chrome Identity Error:", chrome.runtime.lastError);
          rej({ error: chrome.runtime.lastError.message });
          return;
        }
        chrome.storage.local.set({
          googleToken: token
        });
        // chrome.identity.removeCachedAuthToken({ token: token }, () => {});
        if (token === undefined) {
          console.error("Token is undefined");
          rej({ error: "Token is undefined" });
          return;
        }
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
          "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" +
            token,
          init
        )
          .then(response => response.json())
          .then(function(data) {
            console.log("Google API Response:", data);
            
            // OAuth2 userinfo API 응답 처리
            if (data.email) {
              console.log("Processed user info:", data);
              
              //현재 열려있는 구글 TAB 제거
              CONTENT_LISTENER.sendMessage({
                type: "close.site",
                data: "https://www.google.com/"
              });
              res(data);
            } else {
              console.error("Invalid API response:", data);
              rej({ error: "Invalid API response" });
            }
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
