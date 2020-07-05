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

    <OneTab ref="onetab"></OneTab>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import Common from "../../common/common";
import CRAWLER from "../common/cheerio";
import CONTENT_LISTENER from "../../common/content-listener";
import Utils from "../utils/Utils";
import ONETAB from "../../common/onetab";
import OneTab from "../dialog/OneTab";

export default {
  components: { OneTab, SignArea },
  data: () => ({
    ciPath: "",
    infoMenu: false,
    infoTooltip: false,
    update: {
      version: Common.getVersion(),
      improvement: [
        "[대쉬보드] 검색기능이 추가되었습니다.",
        "[대쉬보드] 백업파일 삭제 기능이 추가되었습니다.",
        "[대쉬보드] 스크래핑을 다시 시도하기 기능이 추가되었습니다.",
        "[대쉬보드] 등록날짜로 정렬기능이 추가되었습니다."
      ],
      debug: [
        "[대쉬보드] 하이라이트 버튼에 갯수 표시",
        "[대쉬보드] Windows OS, ScrollBar Design 변경. (POPUP 진행예정)",
        "[공통] 하이라이팅이 사라지는 현상 수정"
      ],
      todo: [
        "[진행중] BOOKMARK -> WEBGALPI로 IMPORT",
        "[진행중] Auto Backup/Restore ",
        "OneTab 기능 추가. (사이트를 하나의 Tab으로 모아보기)",
        "다국어처리 (한국어/영어/일본어)",
        "Google 검색 시, WEBGALPI에 이미 등록한 내용을 검색.",
        "개발자에게 메일전송."
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
      //ONETAB Test
      this.$refs.onetab.open();

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
