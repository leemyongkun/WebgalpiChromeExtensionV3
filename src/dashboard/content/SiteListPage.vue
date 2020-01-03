<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="3">
        <v-row v-for="(item, i) in sites" :key="i">
          <v-col cols="12" style="padding-top: 0px;">
            <v-card
              class="mx-auto"
              max-width="400"
              outlined
              style="cursor:pointer;"
              @click="selectSite(item)"
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
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="9">
        <v-tabs right>
          <v-tab>PREVIEW</v-tab>
          <v-tab>HIGHLIGHTS</v-tab>

          <v-tab-item v-for="n in 2" :key="n">
            <v-container fluid>
              <v-row>
                <v-col v-if="n == 1">
                  <PreviewPage
                    :previewContent="previewContent"
                    :previewTitle="previewTitle"
                  ></PreviewPage>
                </v-col>
                <v-col v-if="n == 2">
                  <HighlightsPage :highlights="highlights"></HighlightsPage>
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
import { POPUP_LISTENER } from "../../common/port-listener.js";
import PreviewPage from "./PreviewPage";
import HighlightsPage from "./HighlightsPage";
import CONTENT_LISTENER from "../../common/content-listener";

export default {
  components: { HighlightsPage, PreviewPage },
  data: () => ({
    sites: [],
    highlights: [],
    previewContent: null,
    previewTitle: null
  }),
  created() {},
  mounted() {
    CONTENT_LISTENER.sendMessage({
      type: "get.sites",
      data: null
    }).then(response => {
      console.log("getSites  response ", response);
      this.sites = response;
    });
  },
  methods: {
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
      this.previewContent = previewDoc.content;
      this.previewTitle = previewDoc.title;
    },
    selectSite(site) {
      //미리보기 생성
      this.generatePreviewDoc(site);

      let param = new Object();
      param.KEY = site.URL_KEY;
      //하이라이트 가져오기
      CONTENT_LISTENER.sendMessage({
        type: "get.highlights",
        data: param
      }).then(response => {
        this.highlights = response;
      });
    }
  }
};
</script>
