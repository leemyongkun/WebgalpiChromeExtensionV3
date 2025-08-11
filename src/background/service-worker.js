// Service Worker for Manifest V3
import store from "../store";
import dbcon from "../database/dbcon.js";
import Api from "../api/api.js";
import LANG from "../common/language";
import SITE_MANAGER from "../common/site-manager";
import Common from "../common/common";
import COMMON_ACTION from "../common/commonAction";

// Use chrome APIs directly instead of global browser polyfill
const md5 = require("md5");

// Service Worker initialization
console.log("WEBGALPI Service Worker started - Version 1.0");

// Keep service worker alive during testing
self.addEventListener("install", event => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});

// Background module functionality
let isPopup = false;

const BackgroundModule = {
  isPopup: () => {
    chrome.windows.getCurrent(win => {
      if (win.type === "popup") isPopup = true;
    });
  },

  initApplication: (tabId, currentUrl) => {
    console.log("initApplication called with:", { tabId, currentUrl });

    if (isPopup) {
      isPopup = false;
      return false;
    }

    // Check if currentUrl is valid
    if (!currentUrl || typeof currentUrl !== "string") {
      console.warn("Invalid currentUrl:", currentUrl, "for tabId:", tabId);
      return false;
    }

    // Check blocked sites
    let isDetected = false;
    for (let i = 0; i < SITE_MANAGER.DETECTE_SITES.length; i++) {
      if (currentUrl.indexOf(SITE_MANAGER.DETECTE_SITES[i]) !== -1) {
        isDetected = true;
        chrome.action.setPopup({
          tabId: tabId,
          popup: "popup/detectPopup.html"
        });

        chrome.action.setBadgeText({
          text: "X",
          tabId: tabId
        });
        chrome.action.setBadgeBackgroundColor({
          color: "red",
          tabId: tabId
        });

        return false;
      }
    }
    if (isDetected) {
      return false;
    }

    chrome.action.setPopup({
      tabId: tabId,
      popup: "popup/popup.html"
    });

    chrome.action.setBadgeText({
      text: "",
      tabId: tabId
    });

    // Create initialization parameters
    let urlPath = currentUrl;
    let ext = urlPath.substr(urlPath.length - 4, urlPath.length);
    let urlKey = md5(currentUrl.split("#")[0]);

    let initParameter = {
      URL_KEY: urlKey,
      URL: urlPath,
      EXT: ext
    };

    // Store current urlKey
    chrome.storage.local.set({ [tabId]: urlKey }, null);

    // Get member info and initialize Content Scripts
    Api.getMemberInfo()
      .then(memberInfo => {
        console.log("🔍 Service Worker getMemberInfo result:", memberInfo);
        if (memberInfo.EMAIL === "") {
          console.log(
            "❌ No member info, skipping Content Script initialization"
          );
          return false;
        }

        // Store login info
        chrome.storage.local.set({ loginInfo: memberInfo });

        initParameter.EMAIL = memberInfo.EMAIL;

        Api.getInitInfo(initParameter)
          .then(res => {
            console.log("🔍 Service Worker getInitInfo result:", res);

            if (res.isRegist) {
              let highlightSize =
                res.allItems.HIGHLIGHT_LIST == null
                  ? 0
                  : res.allItems.HIGHLIGHT_LIST.length;
              console.log(
                "✅ Site registered, setting badge with highlight count:",
                highlightSize
              );
              BackgrounEvent.setBadge(tabId, highlightSize.toString(), "green");
            } else {
              console.log("ℹ️  Site not registered, setting empty badge");
              BackgrounEvent.setBadge(tabId, "", "green");
            }

            // Store options
            chrome.storage.local.set({ options: res.options });

            res.tabid = tabId;

            // Send initialization message to Content Scripts with retry mechanism
            console.log(
              "📤 Sending application.init message to Content Scripts for tabId:",
              tabId
            );

            const sendMessageWithRetry = (attempt = 1, maxAttempts = 5) => {
              // First check if tab is still active and loaded
              chrome.tabs.get(tabId, tab => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "❌ Tab no longer exists:",
                    chrome.runtime.lastError
                  );
                  return;
                }

                if (tab.status !== "complete") {
                  console.log(
                    `⏳ Tab still loading (status: ${tab.status}), waiting...`
                  );
                  if (attempt < maxAttempts) {
                    setTimeout(
                      () => sendMessageWithRetry(attempt + 1, maxAttempts),
                      1000
                    );
                  }
                  return;
                }

                chrome.tabs.sendMessage(
                  tabId,
                  {
                    action: "application.init",
                    data: res,
                    site: initParameter
                  },
                  response => {
                    if (chrome.runtime.lastError) {
                      const error = chrome.runtime.lastError.message;
                      if (
                        attempt < maxAttempts &&
                        (error.includes("port closed") ||
                          error.includes("Receiving end does not exist"))
                      ) {
                        console.warn(
                          `⚠️  Attempt ${attempt}/${maxAttempts} failed: ${error}. Retrying in ${attempt *
                            1000}ms...`
                        );
                        setTimeout(
                          () => sendMessageWithRetry(attempt + 1, maxAttempts),
                          attempt * 1000
                        );
                      } else {
                        console.error(
                          "❌ Could not send application.init to Content Scripts after",
                          maxAttempts,
                          "attempts:",
                          chrome.runtime.lastError
                        );
                      }
                    } else {
                      console.log(
                        "✅ Content Scripts initialized successfully for tabId:",
                        tabId,
                        "on attempt",
                        attempt
                      );
                    }
                  }
                );
              });
            };

            // Wait a bit before first attempt to ensure Content Scripts are loaded
            setTimeout(() => sendMessageWithRetry(), 500);
          })
          .catch(err => {
            console.error("Error getting init info:", err);
          });
      })
      .catch(err => {
        console.error("Error getting member info:", err);
      });
  }
};

const BackgrounEvent = {
  setBadge: (tabId, _text, _color) => {
    chrome.action.setBadgeText({
      text: _text,
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: _color,
      tabId: tabId
    });
  }
};

// Context menu functions
function contextAction(info, tab) {
  console.log("Context menu action:", info.menuItemId);

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
    COMMON_ACTION.getSiteInfo(tab.id)
      .then(siteInfo => {
        if (siteInfo.USE_CURRENT_SITE === "N") {
          Api.postSite(siteInfo).then(site => {
            console.log("Site saved:", LANG.ALERT_MESSAGE("A0014"));
          });
        } else {
          // Note: alert is not available in service worker
          console.warn("Already saved:", LANG.ALERT_MESSAGE("A0020"));
        }
      })
      .catch(err => {
        console.error("Error getting site info:", err);
      });
  }
}

// Message listener functions
let emitOptionsAllTabs = (actionCommand, data) => {
  chrome.tabs.query({ currentWindow: true, active: false }, tabs => {
    chrome.windows.getAll({ populate: true }, windows => {
      windows.forEach(window => {
        window.tabs.forEach(tab => {
          chrome.tabs.sendMessage(
            tab.id,
            { action: actionCommand, data: data },
            response => {
              checkLastError("emit.action");
            }
          );
        });
      });
    });
  });
};

function checkLastError(message) {
  let lastError = chrome.runtime.lastError;
  if (lastError) {
    console.log(message, lastError);
    return;
  }
}

// Event listeners - must be registered at top level
chrome.runtime.onInstalled.addListener(() => {
  console.log("WEBGALPI extension installed");
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (chrome.runtime.lastError) {
      console.warn("Error getting tab:", chrome.runtime.lastError);
      return;
    }
    if (tab && tab.url && tab.status === "complete") {
      BackgroundModule.initApplication(tab.id, tab.url);
    } else if (tab && tab.status === "loading") {
      console.log(
        "Tab still loading, skipping initialization for tabId:",
        tab.id
      );
    } else {
      console.warn("Tab missing URL or invalid status:", {
        id: tab ? tab.id : null,
        status: tab ? tab.status : null,
        url: tab ? !!tab.url : false
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab && tab.url) {
    BackgroundModule.initApplication(tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Service Worker received message:", msg.type || msg.action);

  // Handle messages from content scripts and other parts of extension
  if (msg.action === "getTabId") {
    sendResponse({ tabId: sender.tab ? sender.tab.id : null });
    return true;
  }

  // Database and API messages
  switch (msg.type) {
    case "get.all.members":
      Api.getAllMembers()
        .then(members => {
          console.log("getAllMembers response:", members);
          sendResponse(members);
        })
        .catch(err => {
          console.error("getAllMembers error:", err);
          sendResponse(undefined);
        });
      return true;

    case "get.category.max.id":
      Api.getCategoryMaxId()
        .then(result => {
          console.log("getCategoryMaxId response:", result);
          sendResponse(result);
        })
        .catch(err => {
          console.error("getCategoryMaxId error:", err);
          sendResponse([{ MAXID: null }]);
        });
      return true;

    case "get.category":
      Api.getCategory(msg.data)
        .then(result => {
          console.log("getCategory response:", result);
          sendResponse(result);
        })
        .catch(err => {
          console.error("getCategory error:", err);
          sendResponse([]);
        });
      return true;

    case "get.option":
      Api.getOptions(msg.data)
        .then(result => {
          console.log("getOptions response:", result);
          sendResponse(result);
        })
        .catch(err => {
          console.error("getOptions error:", err);
          sendResponse([]);
        });
      return true;

    case "init.data.option":
      Api.initDataOption(msg.data)
        .then(() => {
          console.log("initDataOption completed");
          sendResponse(true);
        })
        .catch(err => {
          console.error("initDataOption error:", err);
          sendResponse(false);
        });
      return true;

    case "init.data.category":
      Api.initDataCategory(msg.data)
        .then(() => {
          console.log("initDataCategory completed");
          sendResponse(true);
        })
        .catch(err => {
          console.error("initDataCategory error:", err);
          sendResponse(false);
        });
      return true;

    case "create.highlight":
      console.log("Creating highlight:", msg.data);
      if (msg.data.SITE_CHECK === "N") {
        Api.postSite(msg.data);
      }

      Api.updateSiteUpdateDate(msg.data);

      Api.postItem(msg.data)
        .then(() => {
          console.log("Highlight created successfully");
          sendResponse(true);
        })
        .catch(err => {
          console.error("create.highlight error:", err);
          sendResponse(false);
        });
      return true;

    case "update.highlight":
      console.log("Updating highlight:", msg.data);
      Api.updateItem(msg.data)
        .then(() => {
          console.log("Highlight updated successfully");
          sendResponse(true);
        })
        .catch(err => {
          console.error("update.highlight error:", err);
          sendResponse(false);
        });
      return true;

    case "delete.highlight":
      console.log("Deleting highlight:", msg.data);
      Api.deleteItem(msg.data)
        .then(() => {
          console.log("Highlight deleted successfully");
          sendResponse(true);
        })
        .catch(err => {
          console.error("delete.highlight error:", err);
          sendResponse(false);
        });
      return true;

    case "get.highlights":
      let highlightParam = new Object();
      if (msg.data === undefined) {
        sendResponse([]);
        return true;
      }
      highlightParam.URL_KEY = msg.data.KEY;
      highlightParam.EMAIL = msg.data.EMAIL;
      console.log("Getting highlights:", highlightParam);
      Api.getAllItems(highlightParam)
        .then(res => {
          console.log("getHighlights response:", res);
          sendResponse(res);
        })
        .catch(err => {
          console.error("get.highlights error:", err);
          sendResponse([]);
        });
      return true;

    case "insert.member":
      let data = msg.data;
      data.name = "";
      data.isUse = "Y";
      data.date = new Date().getTime();

      Api.postMember(data)
        .then(() => {
          console.log("postMember completed");
          sendResponse(true);
        })
        .catch(err => {
          console.error("postMember error:", err);
          sendResponse(false);
        });
      return true;

    case "insert.update.history":
      Api.insertUpdateHistory(msg.data)
        .then(updateHistory => {
          console.log("insertUpdateHistory completed");
          sendResponse(updateHistory);
        })
        .catch(err => {
          console.error("insertUpdateHistory error:", err);
          sendResponse(false);
        });
      return true;

    case "close.site":
      let target = msg.data;
      chrome.tabs.query({ currentWindow: true, active: false }, tabs => {
        chrome.windows.getAll({ populate: true }, windows => {
          windows.forEach(window => {
            window.tabs.forEach(tab => {
              if (tab.url === target) {
                chrome.tabs.remove(tab.id);
              }
            });
          });
        });
      });
      return true;

    case "reload.all.tab":
      // 설치, 업데이트 시 모든 탭을 리로딩 한다.
      chrome.tabs.query({ currentWindow: true, active: false }, tabs => {
        chrome.windows.getAll({ populate: true }, windows => {
          windows.forEach(window => {
            window.tabs.forEach(tab => {
              chrome.tabs.reload(tab.id);
            });
          });
        });
      });
      return true;

    default:
      console.warn("Unhandled message type:", msg.type);
      sendResponse({ error: "Unhandled message type", type: msg.type });
      return true;
  }
});

chrome.contextMenus.onClicked.addListener(contextAction);

// Create context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "dashboard",
    title: "Dashboard",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "tabgroup",
    title: "Tab Group",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "saveSite",
    title: "Save Site",
    contexts: ["page"]
  });
});

// Export for use by other modules if needed
self.BackgroundModule = BackgroundModule;
