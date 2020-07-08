<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->

    <span class="title ml-3 mr-5" @click="processTest">
      WEBGALPI (
      <span style="color: #ff8b20;"
        ><v-icon color="#ff8b20" style="width: 12px;">mdi-beta</v-icon>eta
      </span>
      <span style="font-size: 12px">Ver.{{ version }}</span>
      )
    </span>
    <v-text-field
      solo-inverted
      flat
      hide-details
      label="Search"
      prepend-inner-icon="mdi-feature-search-outline"
      v-if="false"
    />
    <v-spacer />

    <v-menu
      transition="slide-y-transition"
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          {{ member.EMAIL }}
        </v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item class="pt-0 pb-0" @click="signOut">
          로그아웃
        </v-list-item>
      </v-list>
    </v-menu>

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <OptionPage ref="optionPage"></OptionPage>

    <SignArea ref="signout"></SignArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import OneTab from "../dialog/OneTab";
import BackupArea from "../dialog/setting/BackupArea";
import OptionPage from "./OptionPage";
import Common from "../../common/common";

export default {
  components: { OptionPage, BackupArea, OneTab, SignArea },
  data: () => ({
    ciPath: "",
    version: Common.getVersion()
  }),
  props: ["member"],
  created() {
    this.$nextTick(async () => {
      this.ciPath = Common.getAppDefaultUrl() + "/icons/icon_48.png";
    });
  },
  mounted() {},
  methods: {
    resetUrl() {
      history.pushState(null, null, Common.getDashboardUrl());
    },
    showInfo() {
      this.resetUrl();
      this.$refs.optionPage.openUpdateInfo();
    },
    showOnetab() {
      this.resetUrl();
      this.$refs.optionPage.openOneTab();
    },
    signOut() {
      this.$refs.signout.open();
    },
    async processTest() {
      /* let param = new Object();
                                    let result = await Utils.getLocalStorage("loginInfo");
                                    param.EMAIL = result.loginInfo.EMAIL;
                                    CONTENT_LISTENER.sendMessage({
                                        type: "get.update.history",
                                        data: param
                                    }).then(res => {
                                        console.log("res ", res);
                                    });*/
      /* let BACKUP_FOLDER_ID = await GOOGLE_DRIVE.getBackupFolderId();
                if (BACKUP_FOLDER_ID) {
                  GOOGLE_DRIVE.executeGoogleDriveRestore().then(async list => {
                    if (list) {
                      let confirm = `최근 백업한 데이타가 존재합니다.<br>복구하시겠습니까?<br><br>
                                                      복구 시 크롤링을 진행하며, 다소 시간이 걸릴수도 있습니다.<br><br>
                                                      <span style="color:red">
                                                      모든 데이타를 삭제한 후 복구를 진행하므로,<br>
                                                      절대 진행 도중 창을 닫거나, 새로고침을 하지 마세요!<br>
                                                       </span>
                                                      `;
                      let conf = await MODAL.confirm(
                        confirm,
                        "info",
                        null,
                        null,
                        "500px"
                      );
                      if (conf.value) {
                        GOOGLE_DRIVE.getBackupData(list[0]).then(originalText => {
                          this.$refs.restoreProcessArea.open(originalText);
                        });
                      }
                    }
                  });
                }*/
      /*
                                                                                            let url = "https://www.youtube.com/watch?v=w4gsttb9tMg";
                                                                                            let contents = await CRAWLER.getImportSiteContents(url);
                                                                                            contents.EMAIL = result.loginInfo.EMAIL;

                                                                                            CONTENT_LISTENER.sendMessage({
                                                                                              type: "post.site",
                                                                                              data: contents
                                                                                            });*/
      /*let result = await Utils.getLocalStorage("loginInfo");
                                              CONTENT_LISTENER.sendMessage({
                                                type: "get.backup.data",
                                                data: result.loginInfo.EMAIL
                                              }).then(backupData => {
                                                //let siteMap = backupData.sites.toHashMap('URL_KEY');
                                                backupData.sites = Common.toHashMap(backupData.sites, "URL_KEY");
                                                console.log("backupData.sites ", backupData);
                                              });*/
      //참고 : https://bumbu.me/gapi-in-chrome-extension  , https://qiita.com/takahiro1110/items/4ed2c4e894d2d359751e , https://developers.google.com/drive/api/v2/reference/files/list#javascript
    }
  }
};
</script>
