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
            <!-- Option -->
            <OptionDialog></OptionDialog>

            <!-- 컨텐츠 리스트 -->
            <v-list style="background: none;padding: 0;" id="contentsList">
              <div v-for="(item, index) in sites" :key="index">
                <v-row>
                  <v-col cols="12" style="padding-top: 0px;">
                    <drag :transfer-data="item" :class="item.CLASS">
                      <!-- DRAG 시 보이는 영역-->
                      <div slot="image" class="drag-image">
                        <v-chip class="ma-2" color="orange" text-color="white">
                          {{ item.UPDATE_TITLE }}
                          <v-icon right>mdi-star</v-icon>
                        </v-chip>
                      </div>
                      <!------------------>
                      <v-hover v-slot:default="{ hover }">
                        <v-card
                          aria-selected="true"
                          class="mx-auto"
                          outlined
                          style="cursor:pointer;"
                          @click="selectSite(item, item.URL_KEY)"
                          @dblclick="goSourceSite(item, $event)"
                          :key="item.URL_KEY"
                          ref="siteList"
                        >
                          <v-list-item three-line>
                            <v-expand-transition>
                              <div
                                v-if="hover"
                                class="v-card--reveal white--text text-lg-right pr-3"
                                style="height: 30%;z-index: 99;"
                              >
                                <v-btn
                                  @click="setFavorite($event, item)"
                                  small
                                  color="warning"
                                >
                                  <v-icon>mdi-star</v-icon>
                                </v-btn>
                              </div>
                            </v-expand-transition>

                            <v-list-item-content>
                              <v-list-item-title style="padding-bottom: 5px;">
                                {{ item.UPDATE_TITLE }}
                              </v-list-item-title>
                              <v-list-item-subtitle style="font-size: 13px;">
                                <span
                                  v-if="item.OG_DESCRIPTION !== 'undefined'"
                                  >{{ item.OG_DESCRIPTION }}</span
                                >
                              </v-list-item-subtitle>
                              <v-list-item-subtitle
                                style="font-size: 10px; margin-top: 4px;"
                              >
                                <v-icon
                                  size="16px"
                                  color="green"
                                  left
                                  style="margin-right: 1px;"
                                  v-if="item.CATEGORY_NAME !== 'NO_CATEGORY'"
                                  >mdi-folder-outline
                                </v-icon>
                                {{ item.CATEGORY_NAME }}

                                <v-icon
                                  size="16px"
                                  color="yellow"
                                  left
                                  style="margin-right: 1px;"
                                  v-if="item.FL_FAVORITE === 'Y'"
                                  >mdi-star
                                </v-icon>
                              </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-avatar
                              tile
                              size="70"
                              style="margin-top: 14px;padding-bottom: 0px;margin-bottom: 0px;"
                              color="grey"
                            >
                              <v-img
                                v-if="item.OG_IMAGE !== 'undefined'"
                                :src="checkImagePath(item.OG_IMAGE)"
                              ></v-img>
                            </v-list-item-avatar>
                          </v-list-item>
                        </v-card>
                      </v-hover>
                    </drag>
                  </v-col>
                </v-row>
              </div>
            </v-list>
          </v-col>
        </v-row>
      </v-col>

      <!-- 본문:프리뷰 -->
      <v-col cols="9" :style="documentHeightStyle" v-if="currentSite !== ''">
        <v-row>
          <v-col cols="12" class="ml-0 pl-0">
            <PreviewPage
              :currentSite="currentSite"
              :youtubeVideoId="youtubeVideoId"
              :reviewAreaHeightStyle="reviewAreaHeightStyle"
              :sourceUrl="sourceUrl"
              :previewContent="previewContent"
              :previewTitle="previewTitle"
              :previewStatus="previewStatus"
              :highlights="highlights"
            ></PreviewPage>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="pb-0 pt-0">
        <v-row>
          <v-col cols="12">
            <v-btn
              small
              text
              block
              outlined
              @click="more"
              :disabled="moreBtnDisabled"
            >
              MORE ( items : {{ sites.length }} )
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
//https://www.npmjs.com/package/vue-drag-drop
//https://cameronhimself.github.io/vue-drag-drop/
import PreviewPage from "./PreviewPage";
// import HighlightsPage from "./HighlightsPage";
import CONTENT_LISTENER from "../../common/content-listener";
import EventBus from "../event-bus";
import store from "../../store";
import Utils from "../utils/Utils";
import { GLOBAL_CONFIG } from "../../contents/global/config";
import CORE from "../../contents/core/core";
import OptionDialog from "../dialog/OptionDialog";

let OFFSET_START = 0;
let OFFSET_END = 10;

export default {
  components: { OptionDialog, PreviewPage },
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
    currentSite: "",
    moreBtnDisabled: false,
    offset: {
      //페이징
      start: OFFSET_START,
      end: OFFSET_END
    },
    currentSiteParameter: null,
    currentCategoryInfo: null
  }),
  created() {
    this.$nextTick(() => {
      //카테고리 클릭 시
      EventBus.$on("selectCategoryForSite", categoryInfo => {
        //페이징 offset 초기화
        this.offset.start = OFFSET_START;
        this.offset.end = OFFSET_END;
        this.sites = [];

        this.currentCategoryInfo = categoryInfo;
        //let param = [categoryInfo.id];
        this.getSites(categoryInfo);
      });

      //카테고리 이동 완료 시, SITE를 제거한다.
      EventBus.$on("hideSite", siteUrlKey => {
        this.hideSites(siteUrlKey);
      });

      //window resize event
      this.$nextTick(() => {
        window.addEventListener("resize", this.getWindowHeight);
        //Init
        this.getWindowHeight();

        // 로딩 시 호출 처음 호출
      });
    });
  },

  methods: {
    async setFavorite(event, item) {
      event.preventDefault();
      event.stopPropagation();
      let type = "update.favorite";
      if (item.FL_FAVORITE === "Y") {
        type = "delete.favorite";
      }

      let result = await Utils.getLocalStorage("loginInfo");
      let param = [result.loginInfo.EMAIL, item.IDX];
      CONTENT_LISTENER.sendMessage({
        type: type,
        data: param
      }).then(() => {
        if (item.FL_FAVORITE === "Y") {
          item.FL_FAVORITE = "N";
          EventBus.$emit("open.snack", "STAR를 해제하였습니다.", "warning");
        } else {
          item.FL_FAVORITE = "Y";
          EventBus.$emit("open.snack", "STAR로 지정하였습니다.", "primary");
        }
      });
    },
    getWindowHeight(event) {
      //"max-height: " + (document.documentElement.clientHeight - 84) + "px;";

      this.reviewAreaHeightStyle =
        "height: " + (document.documentElement.clientHeight - 237) + "px;";
      this.listAreaHeightStyle =
        "max-height: " + (document.documentElement.clientHeight - 120) + "px;";
      this.documentHeightStyle =
        "max-height: " + (document.documentElement.clientHeight - 110) + "px;";
    },
    hideSites(siteUrlKey) {
      let i = this.sites.map(item => item.URL_KEY).indexOf(siteUrlKey);
      this.sites.splice(i, 1);
      setTimeout(() => {
        this.autoSelectSite();
      }, 200);
    },
    checkImagePath(imgUrl) {
      if (imgUrl !== null) {
        if (imgUrl.startsWith("//")) {
          imgUrl = "http:" + imgUrl;
        }
      }
      return imgUrl;
    },

    autoSelectSite() {
      if (this.$refs.siteList.length !== 0) {
        this.$refs.siteList[0].click();
        this.$refs.siteList[0].CLASS = "border";
        this.currentSite = this.sites[0];
      }
    },
    more() {
      this.offset.start = this.offset.start + this.offset.end;
      this.getSites(this.currentSiteParameter);
    },
    async getSites(param) {
      //페이징 처리를 한다.
      param.startOffset = this.offset.start;
      param.endOffset = this.offset.end;

      let result = await Utils.getLocalStorage("loginInfo");
      param.EMAIL = result.loginInfo.EMAIL;
      //more 버튼 클릭시, parameter를 유지하기 위해, 임시로 저장해둔다.
      this.currentSiteParameter = param;

      CONTENT_LISTENER.sendMessage({
        type: "get.sites",
        data: param
      })
        .then(response => {
          if (response.length !== 0) {
            console.log("response ", response);
            this.sites = this.sites.concat(response);
            return this.sites;
          } else {
            if (this.sites.length === 0) {
              EventBus.$emit("open.snack", "ITEM(s)이 없습니다.");
            } else {
              EventBus.$emit("open.snack", "마지막 ITEM 입니다.");
            }
            return response;
          }
        })
        .then(sites => {
          setTimeout(() => {
            this.autoSelectSite();
          }, 100);
        });
    },
    goSourceSite(site, event) {
      event.preventDefault();
      let open = window.open(site.URL, "_blank");
      open.focus();
    },
    async selectSite(site, key) {
      let result = await Utils.getLocalStorage("loginInfo");

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
      param.EMAIL = result.loginInfo.EMAIL;

      CONTENT_LISTENER.sendMessage({
        type: "get.highlights",
        data: param
      })
        .then(response => {
          this.highlights = response;

          GLOBAL_CONFIG.ELEMENT = document.getElementById("galpi-privew-area");
          CORE.printHighlightForDashboard(this.highlights);
        })
        .then(() => {
          this.currentSite = site;
        });
    },
    async generatePreviewDoc(site) {
      let preiveContent = "";
      /*if (site.FL_READMODE === "N") {
                                                                    let parser = new DOMParser();
                                                                    let idoc = parser.parseFromString(
                                                                      site.READERMODE_CONTENTS,
                                                                      "text/html"
                                                                    );
                                                                    let previewDoc = new PreviewMode(uri, idoc).parse();
                                                                    if (previewDoc === null) {
                                                                      preiveContent = null;
                                                                    } else {
                                                                      preiveContent = previewDoc.content;
                                                                    }

                                                                    let result = await Utils.getLocalStorage("loginInfo");

                                                                    CONTENT_LISTENER.sendMessage({
                                                                      type: "update.convert.viewmode",
                                                                      data: [
                                                                        preiveContent,
                                                                        new Date().getTime(),
                                                                        site.URL_KEY,
                                                                        result.loginInfo.EMAIL
                                                                      ]
                                                                    }).then(() => {
                                                                      this.sites.map(item => {
                                                                        if (item.URL_KEY === site.URL_KEY) {
                                                                          item.FL_READMODE = "Y";
                                                                          item.READERMODE_CONTENTS = preiveContent;
                                                                        }
                                                                      });
                                                                    });
                                                                  } else {
                                                                    preiveContent = site.READERMODE_CONTENTS;
                                                                  }*/
      preiveContent = site.READERMODE_CONTENTS;

      this.youtubeVideoId = site.EMBEDURL;
      //변환할 수없는 사이트 일경우
      if (preiveContent === null) {
        this.previewContent = "PREVIEW 정보가 없습니다.";
        this.previewTitle = site.TITLE;
        this.previewStatus = "N";
      } else {
        this.previewContent = preiveContent;
        this.previewTitle = site.TITLE;
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

  position: absolute;
  width: 100%;
}

.border {
  border: 2px dashed orange;
}

.highlight-color-1 {
  background: #e35a69 !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-2 {
  background: #f7b900 !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-3 {
  background: #2da64e !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-4 {
  background: #d9c3ff !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-5 {
  background: #97c2dd !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-6 {
  background: #ef9a9a !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-7 {
  background: #90a4ae !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-8 {
  background: #cddc39 !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-9 {
  background: #ffb540 !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-10 {
  background: #b2ebf2 !important;
  display: inline !important;
  cursor: pointer;
}

.highlight-color-11 {
  background: #c0b6a7 !important;
  display: inline !important;
  cursor: pointer;
}
</style>
