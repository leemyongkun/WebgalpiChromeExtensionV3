<template>
  <div>
    <v-card max-width="400" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline"
            >{{ siteInfo.OG_TITLE }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-img :src="siteInfo.OG_IMAGE" height="194"></v-img>

      <v-card-text>
        {{ siteInfo.OG_DESCRIPTION }}
      </v-card-text>

      <v-card-actions>
        <v-btn color="blue-grey" class="ma-1 white--text" @click="goDashboard">
          <v-icon right dark>mdi-view-dashboard</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-select
          :items="category"
          item-value="id"
          item-text="name"
          v-model="selectCategory"
          label="CATEGORY"
          dense
          outlined
          class="ma-1"
        ></v-select>

        <v-btn color="primary accent-4" @click="saveSite">
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay :value="overlay.status">
      <v-progress-circular indeterminate size="64">{{
        overlay.message
      }}</v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import CONTENT_LISTENER from "../../common/content-listener";

export default {
  name: "SiteInfoTab",
  components: {},
  data: () => ({
    overlay: {
      status: true,
      message: ""
    },
    category: [],
    selectCategory: null,
    src:
      "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",

    siteInfo: {
      OG_TITLE: "",
      OG_IMAGE: "",
      OG_DESCRIPTION: ""
    },
    URL: {
      KEY: null,
      SITE: null
    },
    image: null,
    isCollapse: true
  }),
  methods: {
    goDashboard() {
      let extensionDashboard =
        "chrome-extension://" + chrome.runtime.id + "/dashboard/dashboard.html";
      let open = window.open(extensionDashboard, "_blank");
      open.focus();
    },
    saveSite() {
      this.siteInfo.DEFAULT_CATEGORY_IDX = this.selectCategory;

      CONTENT_LISTENER.sendMessage({
        type: "post.site",
        data: this.siteInfo
      }).then(() => {
        this.siteInfo.USE_CURRENT_SITE = "Y";
      });

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, {
          action: "update.global.config.useCurrentSite"
        });
      });
      alert("저장완료");
    }
    /*,capture() {
                chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                    let tabId = tabs[0].id;

                    chrome.tabs.sendMessage(
                        tabId,
                        {
                            action: "capture"
                        },
                        res => {
                        }
                    );
                });
            }*/
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      let interval = setInterval(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          let tabId = tabs[0].id;

          chrome.tabs.sendMessage(
            tabId,
            { action: "get.site.info" },
            siteInfo => {
              if (siteInfo.OG_IMAGE === null) {
                siteInfo.OG_IMAGE = "";
              }
              if (siteInfo.OG_TITLE === null) {
                siteInfo.OG_TITLE = "";
              }
              if (siteInfo.OG_DESCRIPTION === null) {
                siteInfo.OG_DESCRIPTION = "";
              }

              if (siteInfo.URL === "") {
                this.overlay.message = "Loading";
              } else {
                clearInterval(interval);
                this.siteInfo = siteInfo;
                this.overlay.status = false;
              }
              console.log("this.siteInfo ", this.siteInfo);
            }
          );
        });
      }, 1000);

      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: null
      }).then(category => {
        this.category = category.filter(item => {
          return item.parent !== 0;
        });
        this.category.unshift({ id: -1, name: "NO CATEGORY" });
        if (this.category.length !== 0) {
          this.selectCategory = this.category[0].id;
        }
      });
    });
  }
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}

.v-input__slot {
  margin-bottom: 0px !important;
}
</style>
