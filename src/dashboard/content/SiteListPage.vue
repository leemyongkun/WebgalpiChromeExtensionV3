<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="4">
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
                  <v-img :src="item.OG_IMAGE"></v-img>
                </v-list-item-avatar>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="8">
        <v-tabs right>
          <v-tab>PREVIEW</v-tab>
          <v-tab>HIGHLIGHTS</v-tab>

          <v-tab-item v-for="n in 2" :key="n">
            <v-container fluid>
              <v-row>
                <v-col v-if="n == 1">
                  <PreviewPage :previewDoc="previewDoc"></PreviewPage>
                </v-col>
                <v-col v-if="n == 2">
                  <HighlightsPage></HighlightsPage>
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
import PreviewPage from "./PreviewPage";
import HighlightsPage from "./HighlightsPage";

export default {
  components: { HighlightsPage, PreviewPage },
  data: () => ({
    sites: [],
    previewDoc: null
  }),
  created() {},
  mounted() {
    let port = chrome.extension.connect({
      name: "POPUP COMMUNICATION"
    });
    port.postMessage({
      action: "all.sites"
    });
    port.onMessage.addListener(sites => {
      //this.parsePreviewMode(sites[0].READERMODE_CONTENTS, this);
      this.sites = sites;
    });
  },
  methods: {
    selectSite(site) {
      console.log("site ", site);
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
      this.previewDoc = previewDoc.content;
    },
    parsePreviewMode: (doc, _this) => {}
  }
};
</script>
