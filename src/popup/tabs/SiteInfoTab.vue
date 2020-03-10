<template>
  <v-card flat>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline"
          >{{ siteInfo.OG_TITLE }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-overlay :value="overlay.status">
      <v-progress-circular indeterminate size="64"
        >{{ overlay.message }}
      </v-progress-circular>
    </v-overlay>
    <v-img :src="siteInfo.OG_IMAGE" height="194"></v-img>

    <v-card-text
      class="mx-auto overflow-y-auto"
      style="height:76px; max-height: 76px;"
    >
      {{ siteInfo.OG_DESCRIPTION }}
    </v-card-text>

    <v-card-actions>
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

      <v-btn v-if="siteInfo.USE_CURRENT_SITE === 'N'" @click="saveSite">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn
        v-if="siteInfo.USE_CURRENT_SITE === 'Y'"
        color="warning accent-4"
        @click="updateCategory"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
      <v-btn color="blue-grey" class="ma-1 white--text" @click="goDashboard">
        <v-icon right dark>mdi-view-dashboard</v-icon>
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
    updateCategory() {
      this.selectCategory = 2;
    },
    saveSite() {
      this.siteInfo.DEFAULT_CATEGORY_IDX = this.selectCategory;

      CONTENT_LISTENER.sendMessage({
        type: "post.site",
        data: this.siteInfo
      }).then(site => {
        this.siteInfo.USE_CURRENT_SITE = "Y";

        //카테고리 저장하기
        if (this.selectCategory !== -1) {
          let param = [
            this.selectCategory, //"CATEGORY_IDX":
            site[0].URL_KEY, //"URL_KEY":
            site[0].EMAIL, //"EMAIL":
            site[0].IDX, //"SITE_IDX":
            new Date().getTime() //"DATE_CREATE":
          ];
          CONTENT_LISTENER.sendMessage({
            type: "post.category.relation",
            data: param
          });
        }
      });

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, {
          action: "update.global.config.useCurrentSite"
        });
      });
      alert("저장완료");
    }
  },
  created() {},
  mounted() {
    this.overlay.message = "Loading..";
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
                siteInfo.OG_TITLE = "NO TITLE";
              }
              if (siteInfo.OG_DESCRIPTION === null) {
                siteInfo.OG_DESCRIPTION = "NO DESCRIPTION";
              }

              if (siteInfo.URL !== "") {
                clearInterval(interval);
                this.siteInfo = siteInfo;
                this.overlay.status = false;
              }
            }
          );
        });
      }, 300);

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
