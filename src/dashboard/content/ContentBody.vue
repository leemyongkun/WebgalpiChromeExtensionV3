<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="3" :style="documentHeightStyle" class="overflow-y-auto">
        <v-row :style="listAreaHeightStyle" class="overflow-y-auto">
          <v-col v-if="sites.length === 0">
            <v-card class="mx-auto">
              <v-card-text>
                <div>Contents List</div>
                <p class="display-1 text--primary">
                  NO CONTENTS
                </p>
                <div class="text--primary">
                  사이트에 방문하여 원하는 컬러로 하이라이팅을 해보세요.<br />
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text outlined color="green accent-4">
                  연습하기
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col v-else>
            <v-list style="background: none;padding: 0;">
              <div v-for="(item, index) in sites" :key="index">
                <v-row>
                  <v-col cols="12" style="padding-top: 0px;">
                    <v-hover v-slot:default="{ hover }">
                      <drag :transfer-data="item" :class="item.CLASS">
                        <div slot="image" class="drag-image">
                          <v-chip
                            class="ma-2"
                            color="orange"
                            text-color="white"
                          >
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
                          @dblclick="goSourceSite(item, $event)"
                          :key="item.URL_KEY"
                          ref="siteList"
                        >
                          <!--<v-expand-transition>
                                                                                                                                      <div
                                                                                                                                              v-if="hover"
                                                                                                                                              class="d-flex transition-fast-in-fast-out darken-2 v-card&#45;&#45;reveal display-3 white&#45;&#45;text"
                                                                                                                                              style="height: 40%;z-index: 9000;"
                                                                                                                                      >
                                                                                                                                          <v-spacer/>
                                                                                                                                          &lt;!&ndash;<v-btn
                                                                                                                                                  small
                                                                                                                                                  @click="goSourceSite(item, $event)"
                                                                                                                                                  color="orange"
                                                                                                                                          >
                                                                                                                                              <v-icon>mdi-home-outline</v-icon>
                                                                                                                                          </v-btn>&ndash;&gt;
                                                                                                                                          <v-checkbox style="background-color: orangered">j</v-checkbox>
                                                                                                                                      </div>
                                                                                                                                  </v-expand-transition>-->

                          <v-list-item three-line>
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ item.UPDATE_TITLE }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                <span
                                  v-if="item.OG_DESCRIPTION !== 'undefined'"
                                  >{{ item.OG_DESCRIPTION }}</span
                                >
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 12px;">
                                <v-icon
                                  size="12px"
                                  color="green"
                                  left
                                  v-if="item.CATEGORY_NAME !== 'NO_CATEGORY'"
                                  >mdi-folder-outline
                                </v-icon>
                                {{ item.CATEGORY_NAME }}
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
              </div>
            </v-list>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="9" :style="documentHeightStyle" v-if="currentSite !== ''">
        <v-tabs right>
          <v-tab v-show="viewMode === '1'"
            ><v-icon>mdi-content-paste</v-icon></v-tab
          >
          <v-tab v-show="viewMode === '1'"
            ><v-icon>mdi-grease-pencil</v-icon></v-tab
          >

          <v-tab-item v-for="n in 2" :key="n">
            <v-container fluid v-if="viewMode === '1'" style="padding-top: 0px">
              <v-row>
                <v-col v-if="n == 1" style="padding-top: 0px">
                  <PreviewPage
                    :currentSite="currentSite"
                    :youtubeVideoId="youtubeVideoId"
                    :reviewAreaHeightStyle="reviewAreaHeightStyle"
                    :sourceUrl="sourceUrl"
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                    :previewStatus="previewStatus"
                  ></PreviewPage>
                </v-col>
                <v-col v-if="n == 2">
                  <HighlightsPage
                    :reviewAreaHeightStyle="reviewAreaHeightStyle"
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
                    :currentSite="currentSite"
                    :youtubeVideoId="youtubeVideoId"
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
                    :currentSite="currentSite"
                    :youtubeVideoId="youtubeVideoId"
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
    <v-row>
      <v-col cols="3" class="pb-0 pt-2">
        <v-btn small text block outlined>
          MORE
        </v-btn>
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
    documentHeightStyle: "max-height: 660px;",
    reviewAreaHeightStyle: "max-height: 660px;",
    listAreaHeightStyle: "max-height: 400px;",
    sites: [],
    highlights: [],
    previewContent: null,
    previewTitle: null,
    previewStatus: "N",
    youtubeVideoId: "",
    sourceUrl: "",
    viewMode: "1",
    currentSite: "",
    page: 1
  }),
  created() {
    EventBus.$on("view-mode", viewMode => {
      this.viewMode = viewMode;
    });
  },
  mounted() {
    //2초에 한번씩 Dashboard 진입을 확인한다.
    setInterval(() => {
      chrome.storage.local.get(["activeDashboardStatus"], result => {
        if (result.activeDashboardStatus === true) {
          //this.getSites(null);
        }
        chrome.storage.local.set({ activeDashboardStatus: false });
      });
    }, 2000);

    // 로딩 시 호출 (최근 10건만)
    this.getSites(null);

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

    //window resize event
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowHeight);
      //Init
      this.getWindowHeight();
    });
  },

  methods: {
    getWindowHeight(event) {
      //"max-height: " + (document.documentElement.clientHeight - 84) + "px;";

      this.reviewAreaHeightStyle =
        "max-height: " + (document.documentElement.clientHeight - 315) + "px;";
      this.listAreaHeightStyle =
        "max-height: " + (document.documentElement.clientHeight - 130) + "px;";
      this.documentHeightStyle =
        "max-height: " + (document.documentElement.clientHeight - 130) + "px;";
    },
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
            setTimeout(() => {
              this.$refs.siteList[0].click();
              this.$refs.siteList[0].CLASS = "border";
              this.currentSite = this.sites[0];
              console.log("this.currentSite ", this.currentSite);
            }, 500);
          } else {
            this.currentSite = "";
          }
        });
    },
    goSourceSite(site, event) {
      event.preventDefault();
      let open = window.open(site.URL, "_blank");
      open.focus();
    },
    selectSite(site, key) {
      this.sites.map(item => {
        item.CLASS = "";
      });

      site.CLASS = "border";
      this.sourceUrl = site.URL;
      //미리보기 생성
      this.generatePreviewDoc(site);

      //하이라이트 가져오기
      let param = new Object();
      param.KEY = site.URL_KEY;
      CONTENT_LISTENER.sendMessage({
        type: "get.highlights",
        data: param
      })
        .then(response => {
          this.highlights = response;
        })
        .then(() => {
          this.currentSite = site;
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

      this.youtubeVideoId = site.EMBEDURL;
      //변환할 수없는 사이트 일경우
      if (previewDoc === null) {
        this.previewContent = "PREVIEW 정보가 없습니다.";
        this.previewTitle = site.TITLE;
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
