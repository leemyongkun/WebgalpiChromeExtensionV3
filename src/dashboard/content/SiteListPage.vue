<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="3" style="max-height: 700px" class="overflow-y-auto">
        <v-row v-for="(item, i) in sites" :key="i">
          <v-col cols="12" style="padding-top: 0px;">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="mx-auto"
                max-width="400"
                outlined
                style="cursor:pointer;"
                @click="selectSite(item)"
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 30%;z-index: 9000;"
                  >
                    <v-btn small @click="goSourceSite(item, $event)">
                      <v-icon>mdi-home-outline</v-icon>
                    </v-btn>
                  </div>
                </v-expand-transition>

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
            </v-hover>
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
    previewTitle: null,
    previewStatus: "N"
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
    goSourceSite(item, event) {
      event.preventDefault();
      event.stopPropagation();
      let open = window.open(item.URL, "_blank");
      open.focus();
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
    },
    selectSite(site) {
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
    }
  }
};
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
