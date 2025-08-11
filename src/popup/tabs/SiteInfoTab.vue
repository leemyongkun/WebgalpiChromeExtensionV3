<template>
  <div class="card flat">
    <div class="list-item">
      <div class="list-item-content">
        <div class="list-item-title headline">{{ siteInfo.OG_TITLE }}</div>
      </div>
    </div>

    <div class="overlay" v-show="overlay.status">
      <div class="progress-circular">{{ overlay.message }}</div>
    </div>

    <img :src="siteInfo.OG_IMAGE" class="site-image" height="194" />

    <div
      class="card-text mx-auto overflow-y-auto text-center"
      style="height:76px; max-height: 76px;"
    >
      {{ siteInfo.OG_DESCRIPTION }}
    </div>

    <div class="card-actions">
      <div class="spacer"></div>

      <select v-model="selectCategory" class="select dense outlined ma-1">
        <option disabled value="">CATEGORY</option>
        <option v-for="item in category" :key="item.id" :value="item.id">{{
          item.name
        }}</option>
      </select>

      <div class="tooltip-container" v-if="siteStatus === 0">
        <button
          class="btn-icon pa-0"
          @click="saveSite"
          @mouseenter="tooltip.saveSite = true"
          @mouseleave="tooltip.saveSite = false"
        >
          <span>💾</span>
        </button>
        <div class="tooltip" v-show="tooltip.saveSite">
          {{ LANG.DESCRIPTION_MESSAGE("D0075") }}
        </div>
      </div>

      <div class="tooltip-container" v-if="siteStatus === 1">
        <button
          class="btn-icon pa-0"
          @click="updateCategory"
          @mouseenter="tooltip.category = true"
          @mouseleave="tooltip.category = false"
        >
          <span>📁</span>
        </button>
        <div class="tooltip" v-show="tooltip.category">
          {{ LANG.DESCRIPTION_MESSAGE("D0076") }}
        </div>
      </div>

      <div class="tooltip-container" v-if="siteStatus === 2">
        <button
          class="btn-icon pa-0"
          @click="unlockSite"
          @mouseenter="tooltip.unlockSite = true"
          @mouseleave="tooltip.unlockSite = false"
        >
          <span>🔓</span>
        </button>
        <div class="tooltip" v-show="tooltip.unlockSite">
          {{ LANG.DESCRIPTION_MESSAGE("D0077") }}
        </div>
      </div>

      <div class="tooltip-container">
        <button
          class="btn-icon ma-1 pa-0"
          @click="goDashboard"
          @mouseenter="tooltip.dashboard = true"
          @mouseleave="tooltip.dashboard = false"
        >
          <span>📊</span>
        </button>
        <div class="tooltip" v-show="tooltip.dashboard">
          {{ LANG.DESCRIPTION_MESSAGE("D0078") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import CONTENT_LISTENER from "../../common/content-listener";
import Common from "../../common/common";
import MODAL from "../../common/modal";
import LANG from "../../common/language";

export default {
  name: "SiteInfoTab",
  components: {},
  data: () => ({
    tooltip: {
      dashboard: false,
      category: false,
      saveSite: false,
      unlockSite: false
    },
    overlay: {
      status: true,
      message: ""
    },
    category: [],
    selectCategory: null,
    src:
      "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",

    siteInfo: {
      OG_TITLE: "",
      OG_IMAGE: "",
      OG_DESCRIPTION: ""
    },
    URL: {
      KEY: null,
      SITE: null
    },
    image: null,
    isCollapse: true,
    siteStatus: 0, // 0: 미등록 / 1:등록 / 2:잠김
    LANG: LANG
  }),
  methods: {
    goDashboard() {
      Common.goDashboard();
    },
    updateCategory() {
      if (this.selectCategory === -1) {
        alert(LANG.ALERT_MESSAGE("A0015"));
        return false;
      }
      let object = new Object();
      object = Object.assign(object, this.siteInfo);
      object.CATEGORY_ID = this.selectCategory;
      object.DATE_CREATE = new Date().getTime();
      CONTENT_LISTENER.sendMessage({
        type: "post.category.relation",
        data: object
      }).then(() => {
        alert(LANG.ALERT_MESSAGE("A0016"));
      });
    },
    async unlockSite() {
      let confirm = LANG.CONFIRM_MESSAGE("C0010");
      let result = await MODAL.confirm(confirm, "info", null, null, "400px");
      if (result.value === undefined) return false;

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(
          tabId,
          { action: "get.site.info" },
          siteInfo => {
            if (chrome.runtime.lastError) {
              console.warn(
                "Failed to get site info:",
                chrome.runtime.lastError
              );
              return;
            }

            if (siteInfo && siteInfo.URL !== "") {
              chrome.storage.local.get(["loginInfo"], result => {
                if (result && result.loginInfo && result.loginInfo.EMAIL) {
                  siteInfo.EMAIL = result.loginInfo.EMAIL;
                } else {
                  console.warn("No login info found for unlock site");
                  return;
                }
                siteInfo.FULL_TEXT = Common.replaceSpecialWord(
                  siteInfo.FULL_TEXT
                );
                siteInfo.READERMODE_CONTENTS = Common.replaceSpecialWord(
                  siteInfo.READERMODE_CONTENTS
                );

                //Lock된 Site를 UnLock한다.
                CONTENT_LISTENER.sendMessage({
                  type: "unlock.site",
                  data: siteInfo
                })
                  .then(() => {
                    alert(LANG.ALERT_MESSAGE("A0017"));
                    this.siteStatus = 1; //등록으로 변경
                  })
                  .then(() => {
                    //todo : dashboard refresh
                  });
              });
            }
          }
        );
      });
    },
    saveSite() {
      this.siteInfo.DEFAULT_CATEGORY_IDX = this.selectCategory;
      this.siteStatus = 0;

      CONTENT_LISTENER.sendMessage({
        type: "post.site",
        data: this.siteInfo
      })
        .then(site => {
          this.siteInfo.USE_CURRENT_SITE = "Y";

          //카테고리 저장하기
          if (this.selectCategory !== -1) {
            let param = new Object();
            param.CATEGORY_ID = this.selectCategory;
            param.URL_KEY = site[0].URL_KEY;
            param.EMAIL = site[0].EMAIL;
            param.IDX = site[0].IDX;
            param.DATE_CREATE = new Date().getTime();

            CONTENT_LISTENER.sendMessage({
              type: "post.category.relation",
              data: param
            });
          }
        })
        .then(() => {
          //처음 저장 하므로 같은 사이트를 리로딩 한다.
          Common.reloadingSameSite();
          //Dashboard를 리로딩한다.
          Common.reloadingDashboard();
        })
        .then(() => {
          alert(LANG.ALERT_MESSAGE("A0014"));
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            let tabId = tabs[0].id;
            chrome.tabs.sendMessage(
              tabId,
              {
                action: "update.global.config.useCurrentSite"
              },
              response => {
                if (chrome.runtime.lastError) {
                  console.warn(
                    "Failed to update site config:",
                    chrome.runtime.lastError
                  );
                }
              }
            );
          });
        });
    },
    setCategory() {
      chrome.storage.local.get(["loginInfo"], result => {
        if (!result || !result.loginInfo || !result.loginInfo.EMAIL) {
          console.warn("No login info found for categories");
          return;
        }
        let param = new Object();
        param.EMAIL = result.loginInfo.EMAIL;

        CONTENT_LISTENER.sendMessage({
          type: "get.category",
          data: param
        }).then(category => {
          console.log("category ", category);
          if (category !== undefined) {
            // 오름차순
            category.sort(function(a, b) {
              return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
            });

            this.category = category.filter(item => {
              return item.parent !== 0;
            });

            this.category.unshift({ id: -1, name: "NO CATEGORY" });

            if (this.category.length !== 0) {
              this.selectCategory = this.category[0].id;
            }
          }
        });
      });
    },
    setDefaultSiteInfo() {
      // Content Scripts가 로드되지 않았을 때 기본값 설정
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs && tabs[0]) {
          const tab = tabs[0];
          console.log("Setting default site info for:", tab.url);

          this.siteInfo = {
            URL: tab.url || "",
            TITLE: tab.title || "Untitled",
            UPDATE_TITLE: tab.title || "Untitled",
            OG_IMAGE: "",
            OG_TITLE: tab.title || "Untitled",
            OG_DESCRIPTION: this.isRestrictedUrl(tab.url)
              ? "This is a browser system page"
              : "No description available",
            USE_CURRENT_SITE: "N",
            SITE_OPEN: "Y"
          };
          this.overlay.status = false;
        } else {
          console.warn("No active tab found for default site info");
          this.siteInfo = {
            URL: "",
            TITLE: "Unknown",
            UPDATE_TITLE: "Unknown",
            OG_IMAGE: "",
            OG_TITLE: "Unknown",
            OG_DESCRIPTION: "No page information available",
            USE_CURRENT_SITE: "N",
            SITE_OPEN: "Y"
          };
          this.overlay.status = false;
        }
      });
    },
    async tryGetSiteInfo(attempt = 1, maxAttempts = 3) {
      try {
        const tabs = await new Promise((resolve, reject) => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(tabs);
            }
          });
        });

        if (!tabs || tabs.length === 0) {
          console.warn("No active tab found, using default info");
          this.setDefaultSiteInfo();
          return;
        }

        const tab = tabs[0];

        // Skip restricted URLs immediately
        if (this.isRestrictedUrl(tab.url)) {
          console.log(
            "Restricted URL detected, using default info for:",
            tab.url
          );
          this.setDefaultSiteInfo();
          return;
        }

        // Wait a bit longer on first attempt for content scripts to load
        if (attempt === 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        chrome.tabs.sendMessage(
          tab.id,
          { action: "get.site.info" },
          siteInfo => {
            if (chrome.runtime.lastError) {
              const errorMsg =
                chrome.runtime.lastError.message ||
                chrome.runtime.lastError.toString();

              // Don't log as error on first attempt - it's common for content scripts to not be ready
              if (attempt === 1) {
                console.log(
                  `Content Scripts not ready on first attempt, will retry...`
                );
              } else {
                console.warn(
                  `Failed to get site info (attempt ${attempt}/${maxAttempts}):`,
                  errorMsg
                );
              }

              // "Could not establish connection" 오류 시 즉시 기본값 사용
              if (
                errorMsg.includes("Could not establish connection") ||
                errorMsg.includes("Receiving end does not exist")
              ) {
                if (attempt === maxAttempts) {
                  console.log(
                    "Content Scripts not available after all attempts, using default info"
                  );
                } else {
                  console.log(
                    `Content Scripts not ready (attempt ${attempt}), will retry in 2 seconds...`
                  );
                }

                if (attempt >= maxAttempts) {
                  this.setDefaultSiteInfo();
                  return;
                }

                // 2초 후 재시도 (더 긴 간격)
                setTimeout(() => {
                  this.tryGetSiteInfo(attempt + 1, maxAttempts);
                }, 2000);
                return;
              }

              // 최대 시도 횟수에 도달했으면 기본값 사용
              if (attempt >= maxAttempts) {
                console.log("Max attempts reached, using default info");
                this.setDefaultSiteInfo();
                return;
              }

              // 2초 후 재시도
              setTimeout(() => {
                this.tryGetSiteInfo(attempt + 1, maxAttempts);
              }, 2000);
              return;
            }

            if (siteInfo === undefined) {
              alert(LANG.ALERT_MESSAGE("A0018"));
              this.setDefaultSiteInfo();
              return;
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

            if (siteInfo.URL !== "") {
              chrome.storage.local.get(["loginInfo"], result => {
                if (result && result.loginInfo && result.loginInfo.EMAIL) {
                  siteInfo.EMAIL = result.loginInfo.EMAIL;
                } else {
                  console.warn("No login info found for site info");
                  return;
                }
                // 성공적으로 데이터를 받았음

                if (siteInfo.USE_CURRENT_SITE === "Y") {
                  this.siteStatus = 1;
                }

                if (siteInfo.SITE_OPEN === "N") {
                  this.siteStatus = 2;
                }

                this.siteInfo = siteInfo;
                this.overlay.status = false;
              });

              this.setCategory();
            }
          }
        );
      } catch (error) {
        console.error("Error in tryGetSiteInfo:", error);
        this.setDefaultSiteInfo();
      }
    },

    isRestrictedUrl(url) {
      if (!url) return true;

      const restrictedPrefixes = [
        "chrome://",
        "chrome-extension://",
        "moz-extension://",
        "edge://",
        "about:",
        "file://",
        "data:"
      ];

      return restrictedPrefixes.some(prefix => url.startsWith(prefix));
    }
  },
  mounted() {
    this.tryGetSiteInfo();
  }
};
</script>
<style>
.card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card.flat {
  box-shadow: none;
}

.list-item {
  padding: 16px;
}

.list-item-content {
  display: flex;
  flex-direction: column;
}

.list-item-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.headline {
  font-size: 1.25rem;
  font-weight: 500;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.progress-circular {
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 16px;
  border: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.site-image {
  width: 100%;
  object-fit: cover;
}

.card-text {
  padding: 16px;
}

.card-actions {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spacer {
  flex: 1;
}

.select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  min-width: 120px;
}

.select.outlined {
  border: 1px solid #ccc;
}

.select.dense {
  padding: 4px 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.1);
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1001;
  margin-bottom: 4px;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #333;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.overflow-y-auto {
  overflow-y: auto;
}

.text-center {
  text-align: center;
}

.ma-1 {
  margin: 8px;
}

.pa-0 {
  padding: 0;
}
</style>
