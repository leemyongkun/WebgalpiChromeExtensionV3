<template>
  <v-card max-width="400" class="mx-auto">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{
          siteInfo.TITLE
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-img :src="siteInfo.IMAGE" height="194"></v-img>

    <v-card-text>
      {{ siteInfo.DESCRIPTION }}
    </v-card-text>

    <v-card-actions>
      <v-autocomplete
        :items="category"
        item-value="id"
        item-text="name"
        v-model="selectCategory"
      ></v-autocomplete>
      <v-spacer></v-spacer>
      <v-btn text color="deep-purple accent-4">
        SAVE
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import CONTENT_LISTENER from "../../common/content-listener";

export default {
  name: "SiteInfoTab",
  components: {},
  data: () => ({
    category: [{ name: "1", id: "1" }],
    selectCategory: null,
    src:
      "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
    OG: {
      isTitle: false,
      isImage: false,
      isDescription: false
    },
    siteInfo: {
      TITLE: "",
      IMAGE: "",
      DESCRIPTION: "",
      USE_CURRENT_SITE: "N"
    },
    URL: {
      KEY: null,
      SITE: null
    },
    image: null,
    isCollapse: true
  }),
  methods: {
    saveSite: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        /*chrome.tabs.sendMessage(
                      tabId,
                      { action: "get.site.info" },
                      siteInfo => {
                        POPUP_LISTENER.postMessage(
                          "popup.save.site",
                          siteInfo
                        ).onMessage.addListener(response => {
                          GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
                        });
                      }
                    );*/
      });
    },
    capture: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(
          tabId,
          {
            action: "capture"
          },
          res => {}
        );
      });
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(
          tabId,
          { action: "get.site.info" },
          siteInfo => {
            console.log("siteInfo >> ", siteInfo);

            if (siteInfo.OG_IMAGE != null) {
              this.OG.isImage = true;
              this.siteInfo.IMAGE = siteInfo.OG_IMAGE;
            }
            if (siteInfo.OG_TITLE != null) {
              this.OG.isTitle = true;
              this.siteInfo.TITLE = siteInfo.OG_TITLE;
            }
            if (siteInfo.OG_DESCRIPTION != null) {
              this.OG.isDescription = true;
              this.siteInfo.DESCRIPTION = siteInfo.OG_DESCRIPTION;
            }
            this.siteInfo.USE_CURRENT_SITE = siteInfo.USE_CURRENT_SITE;
          }
        );
      });

      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: null
      }).then(category => {
        //this.category = category;
        // console.log("category ", this.category);
        /* let test = category.filter(item => {
                         return item.parent !== 0;
                     });
                     console.log("teszt ", test);*/
      });
    });
  }
};
</script>
