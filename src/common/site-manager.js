let SITE_MANAGER = {
  DETECTE_SITES: [
    "chrome://newtab/",
    "chrome-extension://",
    "chrome://extensions/",
    "chrome://apps/"
  ],
  CONVERT_SITES: [
    "*://*.blog.me/*", //0
    "*://post.naver.com/*", //1
    "*://blog.naver.com/*", //2
    "*://blog.daum.net/*" //3
  ]
};

export default SITE_MANAGER;
