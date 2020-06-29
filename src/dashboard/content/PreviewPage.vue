<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card flat class="pl-3">
    <v-card-text>
      <v-row class="mb-4" align="center">
        <strong class="title headline text-truncate">
          {{ previewTitle }}
        </strong>
        <v-banner
          two-line
          style="width:100%; padding-left: 0px; padding-right: 10px;"
        >
          <span class="grey--text">
            <v-icon size="16px">mdi-timetable</v-icon>&nbsp;&nbsp;{{
              convertDate
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
            URL COPY
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

      <!-- <v-row v-if="youtubeVideoId !== ''">
                                                              <v-col cols="12">
                                                                <iframe
                                                                  id="ytplayer"
                                                                  type="text/html"
                                                                  width="640"
                                                                  height="360"
                                                                  :src="youtubeVideoId + '?autoplay=0'"
                                                                  frameborder="0"
                                                                ></iframe>
                                                              </v-col>
                                                            </v-row>-->
      <v-row
        :style="reviewAreaHeightStyle"
        class="overflow-y-auto custom-scroll"
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

        <v-col cols="auto" v-if="previewStatus === 'Y'">
          <div v-html="previewContent"></div>
        </v-col>

        <v-col cols="12" v-if="previewStatus === 'N'" class="text-center">
          <span class="display-1 font-weight-bold">NO CONTENTS</span
          ><br /><br />
          <span style="color: white"
            >컨텐츠 변환을 할 수 없는 사이트입니다.</span
          ><br /><br />
          <v-btn
            small
            color="primary"
            v-if="currentSite.FL_READMODE === 'N'"
            @click="reTryScrapping"
            >스크래핑 다시 시도하기
          </v-btn>
          <!--  <iframe
                    type="text/html"
                    width="100%"
                    height="100%"
                    src="https://www.notion.so/ff6862f6dee044e59c9d3d4ebc1268f2"
                    frameborder="0"
            ></iframe>-->
        </v-col>

        <!--  <iframe
                                                                                                          type="text/html"
                                                                                                          width="100%"
                                                                                                          height="603px"
                                                                                                          src="https://blog.naver.com/rachel0067/221780986497"
                                                                                                          frameborder="0"
                                                                                                  ></iframe>-->
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
    youtube: {
      videoId: "",
      startTime: ""
    }
  }),
  computed: {
    convertDate() {
      return Common.getConvertDate(this.currentSite.DATE_CREATE);
    }
  },
  created() {},
  mounted() {},
  methods: {
    print() {},
    reTryScrapping() {
      EventBus.$emit("open.full.overlay.loading", "Crawling..");
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
            EventBus.$emit("open.snack", "업데이트가 완료되었습니다.");
          });
        })
        .catch(err => {
          MODAL.alert("ERROR<br>" + err.message, "error");
        })
        .finally(() => {
          EventBus.$emit("close.full.overlay.loading");
        });
    },
    copyUrl(url) {
      let t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = url;
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);

      EventBus.$emit("open.snack", "URL이 복사되었습니다.");
    },
    getLocation(url) {
      let l = document.createElement("a");
      l.href = url;
      return l.hostname;
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

.galpi-preview-area {
  width: 85%;
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
</style>
