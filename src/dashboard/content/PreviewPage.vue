<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-window v-model="window" class="elevation-1" vertical>
    <v-window-item>
      <v-card flat>
        <v-card-text>
          <v-row class="mb-4" align="center">
            <strong class="title">{{ previewTitle }}</strong>
            <v-spacer></v-spacer>
            <SiteFunction
              :sourceUrl="sourceUrl"
              :previewStatus="previewStatus"
            />
          </v-row>
          <v-row>
            <v-divider />
          </v-row>
          <v-row v-if="youtubeVideoId !== ''">
            <v-col cols="12">
              <iframe
                id="ytplayer"
                type="text/html"
                width="640"
                height="360"
                :src="
                  'https://www.youtube.com/embed/' +
                    youtubeVideoId +
                    '?autoplay=0&origin=http://example.com'
                "
                frameborder="0"
              ></iframe>
            </v-col>
          </v-row>
          <v-row :style="reviewAreaHeightStyle" class="overflow-y-auto">
            <div v-html="previewContent"></div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
</template>
<script>
import SiteFunction from "./function/SiteFunction";
import { GLOBAL_CONFIG } from "../../contents/global/config";
import CORE from "../../contents/core/core";

import { getIdFromURL, getTimeFromURL } from "vue-youtube-embed";

//https://www.npmjs.com/package/vue-youtube-embed
export default {
  components: { SiteFunction },
  props: [
    "youtubeVideoId",
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
  created() {},
  mounted() {},
  methods: {
    print() {},
    getLocation(url) {
      let l = document.createElement("a");
      l.href = url;
      console.log(">>> ", l.hostname, l.protocol);
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
</style>
