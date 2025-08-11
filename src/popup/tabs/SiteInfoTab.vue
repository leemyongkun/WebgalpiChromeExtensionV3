<template>
  <div class="card flat">
    <div class="list-item">
      <div class="list-item-content">
        <div class="list-item-title headline"
          >{{ siteInfo.OG_TITLE }}
        </div>
      </div>
    </div>

    <div class="overlay" v-show="overlay.status">
      <div class="progress-circular"
        >{{ overlay.message }}
      </div>
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

      <select
        v-model="selectCategory"
        class="select dense outlined ma-1"
      >
        <option disabled value="">CATEGORY</option>
        <option v-for="item in category" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      
      <div class="tooltip-container" v-if="siteStatus === 0">
        <button class="btn-icon pa-0" @click="saveSite" @mouseenter="tooltip.saveSite = true" @mouseleave="tooltip.saveSite = false">
          <span>💾</span>
        </button>
        <div class="tooltip" v-show="tooltip.saveSite">{{ LANG.DESCRIPTION_MESSAGE("D0075") }}</div>
      </div>

      <div class="tooltip-container" v-if="siteStatus === 1">
        <button class="btn-icon pa-0" @click="updateCategory" @mouseenter="tooltip.category = true" @mouseleave="tooltip.category = false">
          <span>📁</span>
        </button>
        <div class="tooltip" v-show="tooltip.category">{{ LANG.DESCRIPTION_MESSAGE("D0076") }}</div>
      </div>

      <div class="tooltip-container" v-if="siteStatus === 2">
        <button class="btn-icon pa-0" @click="unlockSite" @mouseenter="tooltip.unlockSite = true" @mouseleave="tooltip.unlockSite = false">
          <span>🔓</span>
        </button>
        <div class="tooltip" v-show="tooltip.unlockSite">{{ LANG.DESCRIPTION_MESSAGE("D0077") }}</div>
      </div>

      <div class="tooltip-container">
        <button class="btn-icon ma-1 pa-0" @click="goDashboard" @mouseenter="tooltip.dashboard = true" @mouseleave="tooltip.dashboard = false">
          <span>📊</span>
        </button>
        <div class="tooltip" v-show="tooltip.dashboard">{{ LANG.DESCRIPTION_MESSAGE("D0078") }}</div>
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
            if (siteInfo.URL !== "") {
              chrome.storage.local.get(["loginInfo"], result => {
                siteInfo.EMAIL = result.loginInfo.EMAIL;
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
            chrome.tabs.sendMessage(tabId, {
              action: "update.global.config.useCurrentSite"
            });
          });
        });
    },
    setCategory() {
      chrome.storage.local.get(["loginInfo"], result => {
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
    }
  },
  mounted() {
    this.overlay.message = "Loading..";
    this.$nextTick(() => {
      let interval = setInterval(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          let tabId = tabs[0].id;

          chrome.tabs.sendMessage(
            tabId,
            { action: "get.site.info" },
            siteInfo => {
              if (siteInfo === undefined) {
                clearInterval(interval);
                alert(LANG.ALERT_MESSAGE("A0018"));
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

              if (siteInfo.URL !== "") {
                chrome.storage.local.get(["loginInfo"], result => {
                  siteInfo.EMAIL = result.loginInfo.EMAIL;
                  clearInterval(interval);

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
        });
      }, 300);
    });
  }
};
</script>
<style>
.card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  content: '';
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
