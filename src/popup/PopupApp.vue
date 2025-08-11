<template>
  <div class="app">
    <div id="scroll-target" class="card" style="max-width: 490px" v-if="mainFlag === 1">
      <div class="tabs vertical">
        <!--<div class="tab">
                                                            <span>⚙️</span>
                                                        </div>-->
        <div class="tab" :class="{active: tab === 0}" @click="tab = 0">
          <span>🌐</span>
        </div>
        <div class="tab" :class="{active: tab === 1}" @click="tab = 1">
          <span>✏️</span>
        </div>

        <!-- <div class="tab-item mx-auto overflow-y-auto" :style="style">
                                                            <SettingTab></SettingTab>
                                                        </div>-->
        <div class="tab-item mx-auto overflow-y-auto" :style="style" v-show="tab === 0">
          <SiteInfoTab></SiteInfoTab>
        </div>
        <div class="tab-item mx-auto overflow-y-auto" :style="style" v-show="tab === 1">
          <HighlightTab></HighlightTab>
        </div>
      </div>
    </div>
    <div v-if="mainFlag === 2" style="max-width:490px">
      <div class="card mx-auto" style="max-width: 344px; border: 1px solid #ccc;">
        <div class="list-item three-line">
          <div class="list-item-content">
            <div class="list-item-title headline mb-1"
              >로그인이 필요합니다.
            </div>
            <div class="list-item-subtitle"
              >대쉬보드에서 계정등록 및 로그인을 하십시오.
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn primary" style="width: 100%" @click="goDashboard"
            >Dashboard 이동하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";
import SettingTab from "./tabs/SettingTab";
import Common from "../common/common";
import Utils from "../dashboard/utils/Utils";
import CONTENT_LISTENER from "../common/content-listener";
import LANG from "../common/language";

export default {
  components: {
    SettingTab,
    HighlightTab,
    SiteInfoTab
  },
  data: () => ({
    tab: 0,
    items: ["SITE", "HIGHLIGHT"],
    offsetTop: 0,
    style: "max-height: 390px; height: 463px; width: 400px;",
    mainFlag: 0 //0: 로딩중 , 1 : 로그인이 되어있을경우 , 2 : 되지 않았을경우
  }),
  created() {
    //지속적으로 로딩되고 있는 상태를 스톱한다.
    this.$nextTick(async () => {
      // Manifest V3: Use chrome.scripting.executeScript
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && chrome.scripting && tab.url) {
          // Skip chrome:// and other restricted URLs
          if (!tab.url.startsWith('chrome://') && 
              !tab.url.startsWith('chrome-extension://') && 
              !tab.url.startsWith('moz-extension://') && 
              !tab.url.startsWith('edge://')) {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => window.stop()
            });
          }
        }
      } catch (error) {
        console.warn("Could not execute script to stop loading:", error);
      }

      let result = await Utils.getLocalStorage("loginInfo");
      
      // Debug storage data
      console.log("Storage result:", result);
      console.log("All storage data:");
      chrome.storage.local.get(null, (data) => {
        console.log("All storage:", data);
      });
      
      // Check if login info exists
      if (!result || !result.loginInfo || !result.loginInfo.EMAIL) {
        console.warn("No login info found in storage, showing login screen");
        this.mainFlag = 2; // Show login required
        return;
      }
      
      let param = new Object();
      param.EMAIL = result.loginInfo.EMAIL;

      CONTENT_LISTENER.sendMessage({
        type: "get.option",
        data: param
      }).then(ret => {
        if (ret.length === 0) {
          return false;
        }
        let options = ret[0];

        if (options === undefined || options.THEME === "dark") {
          // Apply dark theme to body or root element
          document.body.classList.add('theme-dark');
        } else {
          document.body.classList.remove('theme-dark');
        }

        LANG.setLanguage(options.LANGUAGE);
      });
    });
  },
  methods: {
    goDashboard() {
      Common.goDashboard();
    }
  },
  mounted() {
    document.body.classList.add('theme-dark');

    //로그인이 되어있는지 확인.
    chrome.storage.local.get(["loginInfo"], result => {
      let loginInfo = result.loginInfo;
      if (result.loginInfo === undefined || loginInfo.EMAIL === "") {
        this.mainFlag = 2;
        document.getElementById("body").style.width = "350px";
      } else {
        document.getElementById("body").style.width = "456px";
        this.mainFlag = 1;
      }
    });
  }
};
</script>
<style>
.app {
  height: 100vh;
}

.card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px;
}

.tabs {
  display: flex;
}

.tabs.vertical {
  flex-direction: row;
}

.tab {
  min-width: 40px !important;
  padding: 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab.active {
  border-bottom-color: #1976d2;
}

.tab-item {
  flex: 1;
}

.list-item {
  padding: 16px;
}

.list-item-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.list-item-subtitle {
  color: #666;
  font-size: 0.875rem;
}

.card-actions {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
}

.btn.primary {
  background-color: #1976d2;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.overflow-y-auto {
  overflow-y: auto;
}

.mb-1 {
  margin-bottom: 8px;
}

.headline {
  font-size: 1.25rem;
  font-weight: 500;
}

/* Dark theme styles */
body.theme-dark .card {
  background: #2d2d2d;
  color: white;
}

body.theme-dark .list-item-subtitle {
  color: #ccc;
}
</style>
