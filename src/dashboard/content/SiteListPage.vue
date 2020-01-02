<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col cols="4">
        <v-row v-for="(item, i) in sites" :key="i">
          <v-col cols="12" style="padding-top: 0px;">
            <v-card class="mx-auto" max-width="400" outlined>
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

            <!-- v-card dark style="cursor:pointer;">
                                        <div class="d-flex flex-no-wrap justify-space-between">
                                            <div>
                                                <v-card-title v-text="item.UPDATE_TITLE"></v-card-title>
                                                <v-card-subtitle v-text="item.OG_DESCRIPTION"></v-card-subtitle>
                                            </div>

                                            <v-avatar class="ma-3" size="125" tile>
                                                <v-img :src="item.OG_IMAGE"></v-img>
                                            </v-avatar>
                                        </div>
                                    </v-card -->
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
                  <PreviewPage />
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
import { POPUP_LISTENER } from "../../popup/listener";
import PreviewPage from "./PreviewPage";
import HighlightsPage from "./HighlightsPage";

export default {
  components: { HighlightsPage, PreviewPage },
  data: () => ({
    sites: []
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
      console.log(">>> ", sites);
      this.sites = sites;
    });
  },
  methods: {}
};
</script>
