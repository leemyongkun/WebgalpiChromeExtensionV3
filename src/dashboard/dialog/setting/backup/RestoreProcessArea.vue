<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="700px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>복구</v-card-title>
      <v-card-text>
        <v-expansion-panels v-model="panel" multiple>
          <!--백업 정보-->
          <v-expansion-panel readonly v-show="isShowBackupInfo">
            <v-expansion-panel-header disable-icon-rotate>
              백업 정보
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="green">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-chip>ACCOUNT : {{ data.info.email }}</v-chip>
              <v-chip>VERSION : {{ data.info.version }}</v-chip>
              <v-chip>CREATED : {{ data.info.created }}</v-chip>
              <br />
              <v-chip class="mt-3"
                >CHROME ID : {{ data.info.chrome_id }}
              </v-chip>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--카테고리 정보-->
          <v-expansion-panel readonly>
            <v-expansion-panel-header disable-icon-rotate>
              카테고리 정보 ({{ data.category.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="green">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="data.category.length > 0">
              COMPLETE ({{ progress.categoryComplete }} /
              {{ progress.categoryCompletePer }}%)
              <v-progress-linear
                :value="progress.categoryCompletePer"
                height="5"
                color="success"
              ></v-progress-linear>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--카테고리에 사이트 정보-->
          <v-expansion-panel readonly>
            <v-expansion-panel-header disable-icon-rotate>
              카테고리 사이트 포함 정보 ({{ data.categoryRelation.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="green">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="data.categoryRelation.length > 0">
              COMPLETE ({{ progress.categoryRelationComplete }} /
              {{ progress.categoryRelationCompletePer }}%)
              <v-progress-linear
                :value="progress.categoryRelationCompletePer"
                height="5"
                color="success"
              ></v-progress-linear>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--사이트 정보-->
          <v-expansion-panel readonly>
            <v-expansion-panel-header disable-icon-rotate>
              사이트 정보 ({{ data.site.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="green">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="data.site.length > 0">
              <v-row>
                <v-col cols="12">
                  ※ Progress는 크롤링에 대한 완료여부이며, 기본 데이타는 모두
                  복구 됩니다.<br />
                  ※ private service의 데이타를 외부로의 유출을 방지하기
                  위함입니다.<br />
                  ※ FAIL이 발생 하는 경우는 아래와 같으며, Contents View
                  영역에서 크롤링을 다시 시도할 수 있습니다.
                  <br />
                  <ul>
                    <li>
                      Connection Timeout이 10초가 넘었을 경우.
                    </li>
                    <li>
                      더 이상 Service를 하지 않는 경우.
                    </li>
                    <li>
                      사내망(Private Service)의 경우. (외부에서 차단된 사이트)
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  COMPLETE ({{ progress.siteComplete }} /
                  {{ progress.siteCompletePer }}%)
                  <v-progress-linear
                    :value="progress.siteCompletePer"
                    height="5"
                    color="success"
                  ></v-progress-linear>
                  FAIL ({{ progress.siteFail }} / {{ progress.siteFailPer }}%)
                  <v-progress-linear
                    :value="progress.siteFailPer"
                    height="5"
                    color="error"
                  ></v-progress-linear>
                </v-col>
              </v-row>
              <v-row v-if="errorSite.length > 0">
                <v-col cols="12">
                  <v-btn color="error" @click="checkFail">
                    FAIL 확인하기
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--하이라이팅 정보 -->
          <v-expansion-panel readonly>
            <v-expansion-panel-header disable-icon-rotate>
              하이라이팅 정보 ({{ data.highlight.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="green">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content v-if="data.highlight.length > 0">
              COMPLTE ({{ progress.highlightCompletePer }}%)
              <v-progress-linear
                :value="progress.highlightCompletePer"
                height="5"
                color="success"
              ></v-progress-linear>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          small
          text
          color="success"
          v-if="showRestoreBtn"
          @click="runRestore"
          >RESTORE
        </v-btn>
        <v-btn small text color="primary" v-if="showCloseBtn" @click="close"
          >DONE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../../common/content-listener";
import CRAWLER from "../../../common/cheerio";
import CONTENTS from "../../../../contents/contents";
import dbcon from "../../../../database/dbcon";
import EventBus from "../../../event-bus";
import Utils from "../../../utils/Utils";
import ACCOUNT from "../../../../common/account";
import MODAL from "../../../../common/modal";

let CryptoJS = require("crypto-js");
export default {
  props: [],
  data: () => ({
    dialog: false,
    isShowBackupInfo: true,
    showRestoreBtn: true,
    showCloseBtn: true,
    panel: [0, 1, 2, 3, 4],
    data: {
      info: [],
      category: [],
      categoryRelation: [],
      site: [],
      highlight: []
    },
    progress: {
      siteComplete: 0,
      siteCompletePer: 0,
      siteFail: 0,
      siteFailPer: 0,
      highlightComplete: 0,
      highlightCompletePer: 0,
      categoryComplete: 0,
      categoryCompletePer: 0,
      categoryRelationComplete: 0,
      categoryRelationCompletePer: 0
    },
    errorSite: []
  }),
  created() {},
  mounted() {},
  methods: {
    checkFail() {
      console.log("fail sites ", this.errorSite);
    },
    async runRestore(values) {
      let confirm = `복구를 시작 하시겠습니까?<br>
                        Site의 경우 크롤링을 진행하며, 다소 시간이 걸릴수도 있습니다.<br><br>
                        <span style="color:red">절대 진행 도중 창을 닫거나, 새로고침을 하지 마세요!</span>`;
      let result = await MODAL.confirm(confirm);
      if (result.value === undefined) return false;

      this.isShowBackupInfo = false; //백업정보를 가린다.
      this.showRestoreBtn = false;
      this.showCloseBtn = false;
      EventBus.$emit("start.restore");

      //TBL_SITE / TBL_HIGHLIGHTS / TBL_CATEGORY(REL) 모두 삭제.
      dbcon.truncateTable();

      setTimeout(async values => {
        //카테고리 저장 시작
        if (this.data.category.length !== 0) await this.runRestoreCategory();

        //사이트 릴레이션 저장 시작
        if (this.data.categoryRelation.length !== 0)
          await this.runRestoreCategoryRelation();

        //사이트 크롤링 및 저장 시작
        if (this.data.site.length !== 0) await this.runRestoreSiteCrawling();

        //하이라이트 저장 시작
        if (this.data.highlight.length !== 0) await this.runRestoreHighlight();

        MODAL.alert("복구가 완료 되었습니다.");
        EventBus.$emit("init.dashboard");
        this.close();
      }, 1000);
    },
    runRestoreHighlight() {
      return new Promise(async res => {
        const promise = this.data.highlight.map(async highlight => {
          this.progress.highlightComplete += 1;
          this.progress.highlightCompletePer = Math.floor(
            (this.progress.highlightComplete / this.data.highlight.length) * 100
          );

          await CONTENT_LISTENER.sendMessage({
            type: "restore.highlight",
            data: highlight
          });
        });
        await Promise.all(promise);
        res(true);
      });
    },
    runRestoreCategoryRelation() {
      return new Promise(async res => {
        const promise = this.data.categoryRelation.map(async relation => {
          this.progress.categoryRelationComplete += 1;
          this.progress.categoryRelationCompletePer = Math.floor(
            (this.progress.categoryRelationComplete /
              this.data.categoryRelation.length) *
              100
          );

          await CONTENT_LISTENER.sendMessage({
            type: "restore.category.relation",
            data: relation
          });
        });
        await Promise.all(promise);
        res(true);
      });
    },
    runRestoreCategory() {
      return new Promise(async res => {
        const promise = this.data.category.map(async category => {
          this.progress.categoryComplete += 1;
          this.progress.categoryCompletePer = Math.floor(
            (this.progress.categoryComplete / this.data.category.length) * 100
          );

          await CONTENT_LISTENER.sendMessage({
            type: "restore.category",
            data: category
          });
        });

        await Promise.all(promise);
        res(true);
      });
    },
    runRestoreSiteCrawling() {
      return new Promise(async res => {
        const promise = this.data.site.map(async site => {
          await CRAWLER.getHtml(site.URL)
            .then(async data => {
              this.progress.siteComplete += 1;
              this.progress.siteCompletePer = Math.floor(
                (this.progress.siteComplete / this.data.site.length) * 100
              );

              site.FULL_TEXT = data.fullText;
              site.READERMODE_CONTENTS = await CONTENTS.getReadmodeContents(
                data.body,
                site.URL
              );

              await CONTENT_LISTENER.sendMessage({
                type: "restore.site",
                data: site
              });
            })
            .catch(async error => {
              this.progress.siteFail += 1;
              this.progress.siteFailPer = Math.floor(
                (this.progress.siteFail / this.data.site.length) * 100
              );

              this.errorSite.push(error);
              site.FULL_TEXT = null;
              site.READERMODE_CONTENTS = null;
              site.FL_READMODE = "N";
              await CONTENT_LISTENER.sendMessage({
                type: "restore.site",
                data: site
              });
            });
        });
        await Promise.all(promise);
        res(true);
      });

      /* var url = "http://lemonweb/MyDesk/Home/Index/160";
                                                                   url = "https://www.fnnews.com/news/202004231837158267";*/
      //url = "http://182.162.91.27:7614/admin-webapp/";
    },
    async dataParsing(data) {
      let result = await Utils.getLocalStorage("loginInfo");
      if (result.loginInfo.EMAIL !== data.info.email) {
        MODAL.alert("백업 대상과 로그인 계정이 다릅니다.");
        let token = await Utils.getLocalStorage("googleToken");
        ACCOUNT.removeGoogleTokenCache(token.googleToken).then(res => {
          if (res) {
            ACCOUNT.googleLogin();
            this.close();
          }
        });

        return false;
      }
      this.data.category = data.categorys;
      this.data.categoryRelation = data.categoryRelation;
      this.data.site = data.sites;
      this.data.highlight = data.highlights;
      this.data.info = data.info;
    },
    open(restoreData) {
      /*  let bytes = CryptoJS.AES.decrypt(
                                          JSON.parse(restoreData).data,
                                          "KKUNI_BEAR_GMAIL.COM_KKUNI"
                                      );
                                      let originalText = bytes.toString(CryptoJS.enc.Utf8);

                                      let obj = JSON.parse(originalText);

                                      console.log("OBJ ", obj);*/

      //로딩된 데이타를 분석하여 화면에 출력한다.
      this.dataParsing(JSON.parse(restoreData));

      this.dialog = true;
    },
    close() {
      this.data.info = [];
      this.data.category = [];
      this.data.categoryRelation = [];
      this.data.site = [];
      this.data.highlight = [];

      this.progress.siteComplete = 0;
      this.progress.siteCompletePer = 0;
      this.progress.siteFail = 0;
      this.progress.siteFailPer = 0;
      this.progress.highlightComplete = 0;
      this.progress.highlightCompletePer = 0;
      this.progress.categoryComplete = 0;
      this.progress.categoryCompletePer = 0;
      this.progress.categoryRelationComplete = 0;
      this.progress.categoryRelationCompletePer = 0;

      this.errorSite = [];

      this.showRestoreBtn = true;
      this.showCloseBtn = true;
      this.dialog = false;
    }
  }
};
</script>
