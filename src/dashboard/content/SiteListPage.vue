<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="3" style="max-height: 700px" class="overflow-y-auto">
        <v-list style="background: none;padding: 0;">
          <v-list-item-group active-class="border">
            <v-row v-for="(item, index) in sites" :key="index">
              <v-col cols="12" style="padding-top: 0px;">
                <v-hover v-slot:default="{ hover }">
                  <drag :transfer-data="item">
                    <div slot="image" class="drag-image">
                      <v-chip class="ma-2" color="orange" text-color="white">
                        {{ item.UPDATE_TITLE }}
                        <v-icon right>mdi-star</v-icon>
                      </v-chip>
                    </div>

                    <v-card
                      aria-selected="true"
                      class="mx-auto"
                      max-width="400"
                      outlined
                      style="cursor:pointer;"
                      @click="selectSite(item, item.URL_KEY)"
                      @dblclick="goSourceSite(item)"
                      :key="item.URL_KEY"
                    >
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.UPDATE_TITLE }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.OG_DESCRIPTION }}
                          </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar tile size="100" color="grey">
                          <v-img
                            v-if="item.OG_IMAGE !== 'undefined'"
                            :src="item.OG_IMAGE"
                          ></v-img>
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-card>
                  </drag>
                </v-hover>
              </v-col>
            </v-row>
          </v-list-item-group>
        </v-list>
      </v-col>

      <v-col cols="9">
        <v-tabs right>
          <v-tab v-show="viewMode === '1'">PREVIEW</v-tab>
          <v-tab v-show="viewMode === '1'">HIGHLIGHTS</v-tab>

          <v-tab-item v-for="n in 2" :key="n">
            <v-container fluid v-if="viewMode === '1'">
              <v-row>
                <v-col v-if="n == 1">
                  <PreviewPage
                    :sourceUrl="sourceUrl"
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                  ></PreviewPage>
                </v-col>
                <v-col v-if="n == 2">
                  <HighlightsPage
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                    :highlights="highlights"
                  ></HighlightsPage>
                </v-col>
              </v-row>
            </v-container>

            <v-container fluid v-if="viewMode === '2'">
              <v-row>
                <v-col cols="6">
                  <PreviewPage
                    :sourceUrl="sourceUrl"
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                  ></PreviewPage>
                </v-col>
                <v-col cols="6">
                  <HighlightsPage
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                    :highlights="highlights"
                  ></HighlightsPage>
                </v-col>
              </v-row>
            </v-container>

            <v-container fluid v-if="viewMode === '3'">
              <v-row>
                <v-col cols="12">
                  <PreviewPage
                    :sourceUrl="sourceUrl"
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                  ></PreviewPage>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <HighlightsPage
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                    :highlights="highlights"
                  ></HighlightsPage>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>
<script>
//https://www.npmjs.com/package/vue-drag-drop
//https://cameronhimself.github.io/vue-drag-drop/
import { POPUP_LISTENER } from "../../common/port-listener.js";
import PreviewPage from "./PreviewPage";
import HighlightsPage from "./HighlightsPage";
import CONTENT_LISTENER from "../../common/content-listener";
import EventBus from "../event-bus";

export default {
  components: { HighlightsPage, PreviewPage },
  data: () => ({
    sites: [],
    highlights: [],
    previewContent: null,
    previewTitle: null,
    previewStatus: "N",
    sourceUrl: "",
    viewMode: "1"
  }),
  created() {
    EventBus.$on("view-mode", viewMode => {
      this.viewMode = viewMode;
    });
  },
  mounted() {
    // 로딩 시 호출 (최근 10건만)
    //this.getSites(null);

    //카테고리 클릭 시
    EventBus.$on("selectCategoryForSite", categoryInfo => {
      if (categoryInfo === 0) {
        //전체일
        this.getSites(null);
      } else {
        let param = [categoryInfo.id];
        this.getSites(param);
      }
    });

    //카테고리 이동 완료 시, SITE를 제거한다.
    EventBus.$on("hideSite", siteUrlKey => {
      this.hideSites(siteUrlKey);
    });
  },

  methods: {
    hideSites(siteUrlKey) {
      let i = this.sites.map(item => item.URL_KEY).indexOf(siteUrlKey);
      this.sites.splice(i, 1);
    },

    getSites(param) {
      CONTENT_LISTENER.sendMessage({
        type: "get.sites",
        data: param
      })
        .then(response => {
          this.sites = response;
        })
        .then(() => {
          if (this.sites.length > 0) {
          }
        });
    },
    goSourceSite(site) {
      let open = window.open(site.URL, "_blank");
      open.focus();
    },
    selectSite(site, key) {
      this.sourceUrl = site.URL;
      //미리보기 생성
      this.generatePreviewDoc(site);

      //하이라이트 가져오기
      let param = new Object();
      param.KEY = site.URL_KEY;
      CONTENT_LISTENER.sendMessage({
        type: "get.highlights",
        data: param
      }).then(response => {
        this.highlights = response;
      });
    },
    generatePreviewDoc(site) {
      let loc = document.location;
      let uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + "//" + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
        pathBase:
          loc.protocol +
          "//" +
          loc.host +
          loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
      };

      let parser = new DOMParser();
      let idoc = parser.parseFromString(site.READERMODE_CONTENTS, "text/html");
      let previewDoc = new PreviewMode(uri, idoc).parse();
      //변환할 수없는 사이트 일경우
      if (previewDoc === null) {
        this.previewContent = "";
        this.previewTitle = "Can't Create Preview";
        this.previewStatus = "N";
      } else {
        this.previewContent = previewDoc.content;
        this.previewTitle = previewDoc.title;
        this.previewStatus = "Y";
      }
    }
  }
};
</script>

<style>
.v-card--reveal {
  /*align-items: left;
                                                                    justify-content: center;*/
  padding-left: 3px;
  justify-content: center;
  bottom: 0;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

.border {
  border: 2px dashed orange;
}
</style>
