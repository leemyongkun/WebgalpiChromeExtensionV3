<template>
  <v-app>
    <v-card id="scroll-target" max-width="490" v-if="mainFlag === 1">
      <v-tabs vertical>
        <!--<v-tab>
                            <v-icon>mdi-settings</v-icon>
                        </v-tab>-->
        <v-tab>
          <v-icon>mdi-web</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-grease-pencil</v-icon>
        </v-tab>
        <!-- <v-tab-item class="mx-auto overflow-y-auto" :style="style">
                            <SettingTab></SettingTab>
                        </v-tab-item>-->
        <v-tab-item class="mx-auto overflow-y-auto" :style="style">
          <SiteInfoTab></SiteInfoTab>
        </v-tab-item>
        <v-tab-item class="mx-auto overflow-y-auto" :style="style">
          <HighlightTab></HighlightTab>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <div v-if="mainFlag === 2">
      <v-btn color="primary" text @click="goDashboard" block
        >계정등록이 필요합니다.
      </v-btn>
    </div>
  </v-app>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";
import SettingTab from "./tabs/SettingTab";

export default {
  components: {
    SettingTab,
    HighlightTab,
    SiteInfoTab
  },
  data: () => ({
    tab: null,
    items: ["SITE", "HIGHLIGHT"],
    offsetTop: 0,
    style: "max-height: 390px; height: 463px; width: 400px;",
    mainFlag: 0 //0: 로딩중 , 1 : 로그인이 되어있을경우 , 2 : 되지 않았을경우
  }),
  created() {},
  methods: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    goDashboard() {
      let extensionDashboard =
        "chrome-extension://" + chrome.runtime.id + "/dashboard/dashboard.html";
      let open = window.open(extensionDashboard, "_blank");
      open.focus();
    }
  },
  mounted() {
    this.$vuetify.theme.dark = true;
    //로그인이 되어있는지 확인.
    chrome.storage.local.get(["loginInfo"], result => {
      let loginInfo = result.loginInfo;
      console.log("loginInfo ", loginInfo);
      if (result.loginInfo === undefined || loginInfo.EMAIL === "") {
        this.mainFlag = 2;
        document.getElementById("body").style.width = "200px";
      } else {
        document.getElementById("body").style.width = "456px";
        this.mainFlag = 1;
      }
    });
  }
};
</script>
<style>
.v-tab {
  min-width: 40px !important;
}
</style>
