<template>
  <v-app>
    <v-card id="scroll-target" max-width="490" v-if="mainFlag === 1">
      <v-tabs vertical v-model="tab">
        <!--<v-tab>
                                                    <v-icon>mdi-settings</v-icon>
                                                </v-tab>-->
        <v-tab>
          <v-icon>mdi-web</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-grease-pencil</v-icon>
        </v-tab>
        <v-tab>
          <v-icon>mdi-settings</v-icon>
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
    <div v-if="mainFlag === 2" style="max-width:490px">
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1"
              >로그인이 필요합니다.
            </v-list-item-title>
            <v-list-item-subtitle
              >대쉬보드에서 계정등록 및 로그인을 하십시오.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn color="primary" text @click="goDashboard" block
            >Dashboard 이동하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";
import SettingTab from "./tabs/SettingTab";
import Common from "../common/common";

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
    goDashboard() {
      Common.goDashboard();
    }
  },
  mounted() {
    this.$vuetify.theme.dark = true;

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
.v-tab {
  min-width: 40px !important;
}
</style>
