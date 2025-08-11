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
              <v-container class="pa-2">
                <div class="overflow-y-auto">
                  <SiteInfoTab></SiteInfoTab>
                </div>
              </v-container>
            </v-tabs-window-item>
            <v-tabs-window-item value="1">
              <v-container class="pa-2">
                <div class="overflow-y-auto">
                  <HighlightTab></HighlightTab>
                </div>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-container>

      <v-container class="pa-2" v-if="mainFlag === 2">
        <v-card max-width="344" class="mx-auto">
          <v-card-text>
            <div class="px-0">
              <div class="text-h6 mb-1">
                로그인이 필요합니다.
              </div>
              <div class="text-body-2 text-medium-emphasis">
                대쉬보드에서 계정등록 및 로그인을 하십시오.
              </div>
            </div>
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
        document.body.style.width = "350px";
        return;
      }

      let param = new Object();
      param.EMAIL = result.loginInfo.EMAIL;

      // Show main content first
      this.mainFlag = 1;
      document.body.style.width = "456px";

      // Try to get user options, but don't block the UI
      CONTENT_LISTENER.sendMessage({
        type: "get.option",
        data: param
      })
        .then(ret => {
          if (!ret || ret.length === 0) {
            console.log("No user options found, creating default options");
            // Create default options for first-time users
            this.createDefaultOptions(param.EMAIL);
            return;
          }

          let options = ret[0];
          console.log("Loaded user options:", options);

          // Apply theme based on user preference
          if (options.THEME === "dark" || options.THEME === undefined) {
            document.body.classList.add("theme-dark");
          } else {
            document.body.classList.remove("theme-dark");
          }

          // Set language if available
          if (options.LANGUAGE) {
            LANG.setLanguage(options.LANGUAGE);
          }
        })
        .catch(error => {
          console.log(
            "Could not load user options, creating defaults:",
            error.message
          );
          // Create default options as fallback
          this.createDefaultOptions(param.EMAIL);
        });
    });
  },
  methods: {
    goDashboard() {
      Common.goDashboard();
    },
    async createDefaultOptions(email) {
      console.log("Creating default options for user:", email);

      // Apply default theme immediately
      document.body.classList.add("theme-dark");

      try {
        // Create default theme option
        await CONTENT_LISTENER.sendMessage({
          type: "update.option.theme",
          data: {
            EMAIL: email,
            THEME: "dark"
          }
        });

        // Create default language option
        await CONTENT_LISTENER.sendMessage({
          type: "update.option.language",
          data: {
            EMAIL: email,
            LANGUAGE: "KR" // Korean as default
          }
        });

        console.log("✅ Default options created successfully");
        LANG.setLanguage("KR");
      } catch (error) {
        console.warn("Failed to create default options:", error);
        // Continue with defaults even if saving failed
      }
    }
  },
  mounted() {
    // Safety fallback - if created() failed to set mainFlag, try again
    if (this.mainFlag === 0) {
      console.warn("mainFlag not set, running fallback check");
      chrome.storage.local.get(["loginInfo"], result => {
        try {
          if (!result || !result.loginInfo || !result.loginInfo.EMAIL) {
            this.mainFlag = 2;
            document.body.style.width = "350px";
          } else {
            this.mainFlag = 1;
            document.body.style.width = "456px";
          }
        } catch (error) {
          console.error("Error in mounted fallback:", error);
          // Default to login screen on error
          this.mainFlag = 2;
          document.body.style.width = "350px";
        }
      });
    }
  }
};
</script>
<style>
.overflow-y-auto {
  overflow-y: auto;
}
</style>
