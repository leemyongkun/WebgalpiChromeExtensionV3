<template>
  <v-app>
    <v-main>
      <v-container class="pa-2" v-if="mainFlag === 1">
        <v-card max-width="490" class="mx-auto">
          <v-tabs v-model="tab" grow>
            <v-tab value="0">
              <v-icon>mdi-earth</v-icon>
            </v-tab>
            <v-tab value="1">
              <v-icon>mdi-pencil</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab" :style="style">
            <v-tabs-window-item value="0">
              <div class="overflow-y-auto">
                <SiteInfoTab></SiteInfoTab>
              </div>
            </v-tabs-window-item>
            <v-tabs-window-item value="1">
              <div class="overflow-y-auto">
                <HighlightTab></HighlightTab>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-container>

      <v-container class="pa-2" v-if="mainFlag === 2">
        <v-card max-width="344" class="mx-auto">
          <v-card-text>
            <v-list-item class="px-0">
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  로그인이 필요합니다.
                </v-list-item-title>
                <v-list-item-subtitle>
                  대쉬보드에서 계정등록 및 로그인을 하십시오.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" block @click="goDashboard">
              Dashboard 이동하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
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
    tab: "0",
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
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        });
        if (tab && chrome.scripting && tab.url) {
          // Skip chrome:// and other restricted URLs
          if (
            !tab.url.startsWith("chrome://") &&
            !tab.url.startsWith("chrome-extension://") &&
            !tab.url.startsWith("moz-extension://") &&
            !tab.url.startsWith("edge://")
          ) {
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
      chrome.storage.local.get(null, data => {
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
          document.body.classList.add("theme-dark");
        } else {
          document.body.classList.remove("theme-dark");
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
    document.body.classList.add("theme-dark");

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
.overflow-y-auto {
  overflow-y: auto;
}
</style>
