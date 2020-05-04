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
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              백업 정보
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="teal">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-chip>ACCOUNT : {{ data.info.email }}</v-chip>
              <v-chip>VERSION : {{ data.info.version }}</v-chip>
              <v-chip>CREATED : {{ data.info.created }}</v-chip>
              <br />
              <v-chip class="mt-3"
                >CHROME ID : {{ data.info.chrome_id }}</v-chip
              >
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--카테고리 정보-->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              카테고리 정보 ({{ data.category.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="teal">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content> </v-expansion-panel-content>
          </v-expansion-panel>

          <!--사이트 정보-->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              사이트 정보 ({{ data.site.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="error">mdi-alert-circle</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  COMPLETE ({{ progress.siteCompletePer }}%)
                  <v-progress-linear
                    :value="progress.siteCompletePer"
                    height="5"
                    color="success"
                  ></v-progress-linear>
                  FAIL ({{ progress.siteFailPer }}%)
                  <v-progress-linear
                    :value="progress.siteFailPer"
                    height="5"
                    color="error"
                  ></v-progress-linear>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--하이라이팅 정보-->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              하이라이팅 정보 ({{ data.highlight.length }} 건)
              <template v-slot:actions>
                <!-- teal / primary -->
                <v-icon color="error">mdi-alert-circle</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
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
        <v-btn small text color="success" @click="runRestore">RESTORE</v-btn>
        <v-btn small text color="primary" @click="close">DONE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";

let CryptoJS = require("crypto-js");
import CRAWLER from "../../common/cheerio";
import CONTENTS from "../../../contents/contents";

export default {
  props: [],
  data: () => ({
    dialog: false,
    panel: [0, 1, 2, 3],
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
      highlightCompletePer: 0
    }
  }),
  created() {},
  mounted() {},
  methods: {
    runRestore() {
      if (
        !confirm(
          "복구를 시작 하시겠습니까?\nSite의 경우 크롤링을 진행하며, 다소 시간이 걸릴수도 있습니다.\n중간에 창을 닫지 말아주세요."
        )
      )
        return false;
      this.runCrawling();
    },
    async runCrawling() {
      this.data.site.map(async site => {
        CRAWLER.getHtml(site.URL)
          .then(async data => {
            this.progress.siteComplete += 1;
            this.progress.siteCompletePer =
              (this.progress.siteComplete / this.data.site.length) * 100;

            let readmodeContents = await CONTENTS.getReadmodeContents(
              data.body,
              site.URL
            );
            site.FULL_TEXT = data.fullText;
            site.READERMODE_CONTENTS = readmodeContents;

            await CONTENT_LISTENER.sendMessage({
              type: "restore.site",
              data: site
            });
          })
          .catch(error => {
            console.log("error ", error);
            this.progress.siteFail += 1;
            this.progress.siteFailPer =
              (this.progress.siteFail / this.data.site.length) * 100;
            //console.log("error " , error)
          });
      });

      /* var url = "http://lemonweb/MyDesk/Home/Index/160";
                 url = "https://www.fnnews.com/news/202004231837158267";*/
      //url = "http://182.162.91.27:7614/admin-webapp/";
    },
    dataParsing(data) {
      this.data.category = data.categorys;
      this.data.categoryRelation = data.categoryRelation;
      this.data.site = data.sites;
      this.data.highlight = data.highlights;
      this.data.info = data.info;
    },
    open(restoreData) {
      let bytes = CryptoJS.AES.decrypt(
        JSON.parse(restoreData).data,
        "KKUNI_BEAR_GMAIL.COM_KKUNI"
      );
      let originalText = bytes.toString(CryptoJS.enc.Utf8);

      let obj = JSON.parse(originalText);

      console.log("OBJ ", obj.categorys);

      //로딩된 데이타를 분석하여 화면에 출력한다.
      this.dataParsing(JSON.parse(originalText));

      this.dialog = true;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
