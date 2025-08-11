<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card flat class="pl-3">
    <v-card-text>
      <v-row class="mb-4" align="center">
        <strong class="title headline text-truncate" v-html="previewTitle">
        </strong>
        <v-banner
          two-line
          style="width:100%; padding-left: 0px; padding-right: 10px;"
        >
          <span class="grey--text">
            <v-icon size="16px">mdi-timetable</v-icon>&nbsp;&nbsp;{{
              convertDate(currentSite.DATE_CREATE)
            }}<br />
            <img :src="`chrome://favicon/` + currentSite.URL" />&nbsp;&nbsp;{{
              getLocation(currentSite.URL)
            }}
          </span>
          <v-btn
            text
            outlined
            x-small
            color="green"
            @click="copyUrl(currentSite.URL)"
          >
            COPY URL
          </v-btn>
          <v-spacer></v-spacer>
          <template v-slot:actions>
            <SiteFunction
              :currentSite="currentSite"
              :sourceUrl="sourceUrl"
              :previewStatus="previewStatus"
              :highlights="highlights"
              :reviewAreaHeightStyle="reviewAreaHeightStyle"
            />
          </template>
        </v-banner>
      </v-row>

      <v-row
        :style="reviewAreaHeightStyle"
        class="overflow-y-auto overflow-x-auto custom-scroll"
      >
        <v-col cols="auto" v-if="youtubeVideoId !== ''">
          <iframe
            type="text/html"
            width="640"
            height="360"
            :src="youtubeVideoId + '?autoplay=0'"
            frameborder="0"
          ></iframe>
        </v-col>

        <!-- 컨텐츠 영역 -->
        <v-col
          cols="auto"
          v-if="previewStatus === 'Y'"
          style="width: 100%;overflow-x: hidden"
        >
          <v-row class="ma-0 pa-0">
            <!-- 본문 영역-->
            <v-col cols="8">
              <div id="startArea" v-html="previewContent"></div>
            </v-col>
            <!-- 하이라이트 영역 -->
            <v-col cols="4" class="pa-0" v-if="highlights.length != 0">
              <div class="font-weight-bold ml-8 mb-2" style="width: 100%">
                <v-chip>HIGHLIGHTS</v-chip>
              </div>
              <v-timeline dense>
                <v-timeline-item
                  v-for="highlight in highlights"
                  :key="highlight.IDX"
                  :color="convertColor(highlight.COLOR)"
                  small
                >
                  <v-card class="elevation-2">
                    <v-card-text class="pb-0">
                      <div class="pb-2">{{ convertDate(highlight.IDX) }}</div>
                      <v-divider />
                      <div class="pt-2">{{ highlight.TEXT }}</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <!--<v-btn
                        right
                        class="mx-0"
                        small
                        text
                    >
                      삭제
                    </v-btn>-->

                      <v-btn icon @click="deleteHighlight(highlight)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-col>

        <!-- 컨텐츠 없음 -->
        <v-col cols="12" v-if="previewStatus === 'N'" class="text-center">
          <div>
            <span class="display-1 font-weight-bold">NO CONTENTS</span
            ><br /><br />
            <span style="color: white">{{
              LANG.DESCRIPTION_MESSAGE("D0022")
            }}</span
            ><br /><br />

            <span v-if="currentSite.FL_READMODE === 'N'" style="color: orange">
              {{ LANG.DESCRIPTION_MESSAGE("D0023") }}<br />
            </span>
            <span
              v-if="currentSite.FL_READMODE === 'N'"
              style="padding-top: 10px"
            >
              {{ LANG.DESCRIPTION_MESSAGE("D0024") }}
              <img
                :src="penIcon"
                style="width: 20px; position: relative; top: 4px"
              />
              >
              <v-icon style="position: relative; bottom: 2px;"
                >mdi-folder-lock-open</v-icon
              >
            </span>

            <br />
            <br />
            <v-btn small color="green" @click="goSourceSite"
              >{{ LANG.BUTTON_MESSAGE("B0007") }}
            </v-btn>
            <v-btn
              small
              color="primary"
              v-if="currentSite.FL_READMODE === 'N'"
              @click="reTryScrapping"
              >{{ LANG.BUTTON_MESSAGE("B0008") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <SnackBar ref="snackbar"></SnackBar>
  </v-card>
</template>
<script>
import SiteFunction from "./function/SiteFunction";
import Common from "../../common/common";
import SnackBar from "../snack/SnackBar";
import EventBus from "../event-bus";
import CRAWLER from "../common/cheerio";
import MODAL from "../../common/modal";
import CONTENT_LISTENER from "../../common/content-listener";
import CONTENTS from "../../contents/contents";
import LANG from "../../common/language";

import $ from "jquery";

//https://www.npmjs.com/package/vue-youtube-embed
export default {
  components: { SnackBar, SiteFunction },
  props: [
    "youtubeVideoId",
    "currentSite",
    "previewContent",
    "previewTitle",
    "previewStatus",
    "sourceUrl",
    "reviewAreaHeightStyle",
    "highlights"
  ],
  data: () => ({
    window: 0,
    penIcon: Common.getAppDefaultUrl() + "/icons/icon_48.png",
    youtube: {
      videoId: "",
      startTime: ""
    },
    LANG: LANG
  }),
  computed: {
    /*convertDate() {
      return Common.getConvertDate(this.currentSite.DATE_CREATE);
    }*/
  },
  watch: {
    previewContent() {
      setTimeout(() => {
        Common.unwrapTags(document, "code");

        //하이라이팅 된 태그에 font color 넣기
        Common.styleWebgalpiTabFont();

        //todo : 본문 A 태그에 기능삽입
      }, 100);
    }
  },
  created() {},
  mounted() {},
  methods: {
    print() {},
    goSourceSite() {
      let open = window.open(this.currentSite.URL, "_blank");
      open.focus();
    },
    reTryScrapping() {
      EventBus.$emit("open.full.overlay.loading", "Crawling..");
      console.log("this.sourceUrl", this.currentSite);
      CRAWLER.getOriginalSiteContents(this.sourceUrl)
        .then(async res => {
          //컨텐츠 저장
          this.currentSite.FL_READMODE = "Y";
          this.currentSite.READERMODE_CONTENTS = await CONTENTS.getReadmodeContents(
            res.body,
            this.currentSite.URL
          );
          this.currentSite.FULL_TEXT = res.fullText;
          this.currentSite.OG_TITLE = res.ogTitle;
          this.currentSite.OG_DESCRIPTION = res.ogDescription;
          this.currentSite.OG_IMAGE = res.ogImage;

          CONTENT_LISTENER.sendMessage({
            type: "update.scrap.site",
            data: this.currentSite
          }).then(() => {
            EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0007"));
          });
        })
        .catch(err => {
          MODAL.alert("ERROR<br>" + err.message, "error");
        })
        .finally(() => {
          EventBus.$emit("close.full.overlay.loading");
        });
    },
    async deleteHighlight(item) {
      let confirm = LANG.CONFIRM_MESSAGE("C0003");
      let result = await MODAL.confirm(confirm, "info", null, null, "450px");
      if (result.value === undefined) return false;
      item.HIGHLIGHT_IDX = item.IDX;
      CONTENT_LISTENER.sendMessage({
        type: "delete.highlight",
        data: item
      }).then(() => {
        this.highlights.map((highlight, index) => {
          if (item.IDX === highlight.IDX) {
            this.highlights.splice(index, 1);
          }
        });
      });
    },
    copyUrl(url) {
      let t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = url;
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);

      EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0008"));
    },
    getLocation(url) {
      let l = document.createElement("a");
      l.href = url;
      return l.hostname;
    },
    convertColor(color) {
      return Common.getConvertColor(color);
    },
    convertDate(timestamp) {
      return Common.getConvertDate(timestamp);
    }
  }
};
</script>
<style>
img {
  width: auto;
  height: auto;
  max-width: 90%;
  max-height: 90%;
}

.galpi-preview-area img {
  min-height: 80%;
}

.galpi-preview-area svg {
  width: 30%;
}

.v-banner__actions {
  margin-left: 0px !important;
}

.v-banner__wrapper {
  padding-left: 0px !important;
  padding-top: 0px !important;
}

#galpi-privew-area-contents {
  align: left !important;
}

#galpi-privew-area {
  word-break: break-all;
}

/*code {
                  background-color: transparent !important;
                  box-shadow: none !important;
                }
                code::after,
                code::before {
                  content: "" !important;
                }*/
</style>
