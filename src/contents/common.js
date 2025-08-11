import SITE_MANAGER from "../common/site-manager";

let COMMON = {
  convert: function(convertIndex) {
    let replaceUrl = location.href
      .replace("http://", "http://m.")
      .replace("https://", "https://m.");
    switch (convertIndex) {
      case 0:
        let str = window.location.origin;
        let blogId = str.split("//")[1].split(".")[0];
        let logId = window.location.pathname.replace("/", "");
        let url =
          "https://m.blog.naver.com/PostView.nhn?blogId=" +
          blogId +
          "&logNo=" +
          logId +
          "&redirect=Dlog&widgetTypeCall=true&directAccess=false";
        location.href = url;
        break;

      // 1 : "*://post.naver.com/*"
      // 2 : "*://blog.naver.com/*"
      // 3 : "*://blog.daum.net/*"
      default:
        location.href = replaceUrl;
        break;
    }
  },
  urlMatch: function(conditionUrl, destUrl) {
    return destUrl.match(conditionUrl.replace(/\*/g, "[^ ]*"));
  },
  checkConvertUrl: function(url) {
    return new Promise(res => {
      let convertSites = SITE_MANAGER.CONVERT_SITES;
      for (var i = 0; i < convertSites.length; i++) {
        if (COMMON.urlMatch(convertSites[i], url) !== null) {
          res(i);
        }
      }

      res(false);
    });
  },
  detectSite: function() {
    let css = document.createElement("style");
    let head = document.head;

    css.type = "text/css";

    css.innerText = `* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`;

    function main() {
      try {
        let doc = document;
        let body = document.body;

        let docEvents = [
          (doc.oncontextmenu = null),
          (doc.onselectstart = null),
          (doc.ondragstart = null),
          (doc.onmousedown = null)
        ];

        let bodyEvents = [
          (body.oncontextmenu = null),
          (body.onselectstart = null),
          (body.ondragstart = null),
          (body.onmousedown = null),
          (body.oncut = null),
          (body.oncopy = null),
          (body.onpaste = null)
        ];

        [].forEach.call(
          ["copy", "cut", "paste", "select", "selectstart"],
          function(event) {
            document.addEventListener(
              event,
              function(e) {
                e.stopPropagation();
              },
              true
            );
          }
        );

        alwaysAbsoluteMode();
        enableCommandMenu();
        head.appendChild(css);
        document.addEventListener("keydown", keyPress);
      } catch (err) {
        console.log(err);
      }
    }

    function keyPress(event) {
      if (event.ctrlKey && event.keyCode == 192) {
        return confirm("Activate Absolute Right Click Mode!") == true
          ? absoluteMode()
          : null;
      }
    }

    function absoluteMode() {
      [].forEach.call(
        [
          "contextmenu",
          "copy",
          "cut",
          "paste",
          "mouseup",
          "mousedown",
          "keyup",
          "keydown",
          "drag",
          "dragstart",
          "select",
          "selectstart"
        ],
        function(event) {
          document.addEventListener(
            event,
            function(e) {
              e.stopPropagation();
            },
            true
          );
        }
      );
    }

    function alwaysAbsoluteMode() {
      let sites = ["example.com", "www.example.com"];
      const list = RegExp(sites.join("|")).exec(location.hostname);
      return list ? absoluteMode() : null;
    }

    function enableCommandMenu() {
      let commandMenu = true;
      try {
        if (typeof GM_registerMenuCommand == undefined) {
          return;
        } else {
          if (commandMenu == true) {
            GM_registerMenuCommand(
              "Enable Absolute Right Click Mode",
              function() {
                return confirm("Activate Absolute Right Click Mode!") == true
                  ? absoluteMode()
                  : null;
              }
            );
          }
        }
      } catch (err) {
        // console.log(err);
      }
    }

    let blackList = [
      "youtube.com",
      ".google.",
      ".google.com",
      "greasyfork.org",
      "twitter.com",
      "instagram.com",
      "facebook.com",
      "translate.google.com",
      ".amazon.",
      ".ebay.",
      "github.",
      "stackoverflow.com",
      "bing.com",
      "live.com",
      ".microsoft.com",
      "dropbox.com",
      "pcloud.com",
      "box.com",
      "sync.com",
      "onedrive.com",
      "mail.ru",
      "deviantart.com",
      "pastebin.com",
      "dailymotion.com",
      "twitch.tv",
      "spotify.com",
      "steam.com",
      "steampowered.com",
      "gitlab.com",
      ".reddit.com"
    ];

    let enabled = false;
    let url = window.location.hostname;
    let match = RegExp(blackList.join("|")).exec(url);

    if (window && typeof window != undefined && head != undefined) {
      if (!match && enabled != true) {
        main();
        enabled = true;

        //console.log(location.hostname);

        window.addEventListener(
          "contextmenu",
          function contextmenu(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            let handler = new eventHandler(event);
            window.removeEventListener(event.type, contextmenu, true);
            let eventsCallBack = new eventsCall(function() {});
            handler.fire();
            window.addEventListener(event.type, contextmenu, true);
            if (handler.isCanceled && eventsCallBack.isCalled) {
              event.preventDefault();
            }
          },
          true
        );
      }

      function eventsCall() {
        //this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
        this.events = ["DOMAttrModified"];
        this.bind();
      }

      eventsCall.prototype.bind = function() {
        this.events.forEach(
          function(event) {
            document.addEventListener(event, this, true);
          }.bind(this)
        );
      };

      eventsCall.prototype.handleEvent = function() {
        this.isCalled = true;
      };

      eventsCall.prototype.unbind = function() {
        this.events.forEach(function(event) {}.bind(this));
      };

      function eventHandler(event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
      }

      eventHandler.prototype.createEvent = function(type) {
        let target = this.event.target;
        let event = target.ownerDocument.createEvent("MouseEvents");
        event.initMouseEvent(
          type,
          this.event.bubbles,
          this.event.cancelable,
          target.ownerDocument.defaultView,
          this.event.detail,
          this.event.screenX,
          this.event.screenY,
          this.event.clientX,
          this.event.clientY,
          this.event.ctrlKey,
          this.event.altKey,
          this.event.shiftKey,
          this.event.metaKey,
          this.event.button,
          this.event.relatedTarget
        );
        return event;
      };

      eventHandler.prototype.fire = function() {
        let target = this.event.target;
        let contextmenuHandler = function(event) {
          event.preventDefault();
        }.bind(this);
        target.dispatchEvent(this.contextmenuEvent);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
      };
    }
  }
};

export default COMMON;
