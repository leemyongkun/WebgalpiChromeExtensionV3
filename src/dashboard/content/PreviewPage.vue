<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card flat>
    <v-card-text>
      <v-row class="mb-4" align="center">
        <strong class="title headline">
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
      <v-row :style="reviewAreaHeightStyle" class="overflow-y-auto">
        <v-col cols="12" v-if="youtubeVideoId !== ''">
          <iframe
            type="text/html"
            width="640"
            height="360"
            :src="youtubeVideoId + '?autoplay=0'"
            frameborder="0"
          ></iframe>
        </v-col>

        <div v-html="previewContent" v-if="previewStatus === 'Y'"></div>
        <v-col cols="12" align="center" v-if="previewStatus === 'N'">
          NO CONTENTS
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
    "reviewAreaHeightStyle"
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
    copyUrl(url) {
      let t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = url;
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);

      this.$refs.snackbar.open("URL이 복사되었습니다.");
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
  max-width: 50% !important;
  max-height: 50% !important;
}

.galpi-preview-area {
  width: 80%;
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
