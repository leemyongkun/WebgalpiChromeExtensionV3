<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->

    <span class="title ml-3 mr-5" @click="processTest">
      WEBGALPI (
      <span style="color: #ff8b20;"
        ><v-icon color="#ff8b20" style="width: 12px;">mdi-beta</v-icon>eta
      </span>
      <span style="font-size: 12px">Ver.{{ update.version }}</span>
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

    <v-menu
      v-model="infoMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      max-width="500px"
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-model="infoTooltip" color="blue" bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon v-on="{ ...menu, ...tooltip }">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <span>UPDATE를 확인합니다.</span>
        </v-tooltip>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>UPDATE WEBGALPI</v-list-item-title>
              <v-list-item-subtitle>
                Ver.{{ update.version }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <!--<v-btn :class="''" icon>
                                                                                                                                                <v-icon>mdi-heart</v-icon>
                                                                                                                                            </v-btn>-->
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-card>
                <v-card-title>개선 및 기능추가</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.improvement"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>디버깅</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.debug"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>해야할 기능</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.todo"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="infoMenu = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <SignArea ref="signout"></SignArea>
    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import Common from "../../common/common";
import GOOGLE_DRIVE from "../../common/GoogleDriveBackupAndRestore";
import MODAL from "../../common/modal";
import RestoreProcessArea from "../dialog/setting/backup/RestoreProcessArea";
import CONTENT_LISTENER from "../../common/content-listener";
import EventBus from "../event-bus";
import Utils from "../utils/Utils";
import { URL } from "../../contents/global/config";

export default {
  components: { RestoreProcessArea, SignArea },
  data: () => ({
    ciPath: "",
    infoMenu: false,
    infoTooltip: false,
    update: {
      version: Common.getVersion(),
      improvement: [
        /*
                                                                               1.0.10

                                                                               "[공통] 차단된 사이트에서는 WEBGALPI의 사용이 제한되며, ICON에 (X)가 표시됩니다.",
                                                                                "[공통] 업데이트 시, notification이 발생하여, 업데이트 내역을 확인 할 수 있습니다.",
                                                                                "[ALL PAGE] 네이버 BLOG 에서도 하이라이팅이 가능하게 되었습니다.",
                                                                                "[대쉬보드]SLACK 공유 기능이 제거되었습니다.",
                                                                                "[대쉬보드] 각 기능마다 툴팁으로 간략한 설명이 포함됩니다.",
                                                                                "[팝업] 아이콘이 변경되었습니다."*/
        "[대쉬보드] 검색기능이 추가되었습니다.",
        "[대쉬보드] 백업파일 삭제 기능이 추가되었습니다.",
        "[대쉬보드] 스크래핑을 다시 시도하기 기능이 추가되었습니다."
      ],
      debug: ["[대쉬보드] 하이라이트 버튼에 갯수 표시"],
      todo: [
        "[진행중] BOOKMARK -> WEBGALPI로 IMPORT기능을 추가한다.",
        "OneTab과 같은 기능을 추가한다.",
        "다국어처리를 한다. (한국어/영어/일본어)",
        "제목/본문 키워드 검색기능을 추가한다.",
        "Google 검색 시, WEBGALPI에 이미 등록한 내용을 추천한다.",
        "스크래핑 재시도 기능을 추가한다.",
        "[복구] 시, 스크래핑이 되지 않은 컨텐츠 정보를 보여준다."
        /*"Private Backup Server를 개발한다.",*/
      ]
    }
  }),
  props: ["member"],
  created() {
    this.$nextTick(async () => {
      this.ciPath =
        "chrome-extension://" + chrome.runtime.id + "/icons/icon_48.png";
    });
  },
  methods: {
    showInfo() {
      this.infoMenu = true;
      let extensionDashboard =
        "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";
      history.pushState(null, null, extensionDashboard);
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

      let BACKUP_FOLDER_ID = await GOOGLE_DRIVE.getBackupFolderId();
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
      }

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
