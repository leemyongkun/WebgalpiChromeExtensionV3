<template>
  <el-container>
    <el-header style="line-height: 30px; height:30px; text-align: right;">
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-edit"
      ></el-button>
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-share"
      ></el-button>
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-delete"
      ></el-button>
    </el-header>

    <el-main style="padding: 3px;">
      <el-tabs tab-position="left" style="height: 320px;">
        <el-tab-pane label="INFO">
          <div style="width: 380px">
            <div>
              <span style="height: 10px;" v-if="OG.isTitle">
                <h1>{{ siteInfo.OG_TITLE }}</h1>
              </span>
              <span style="height: 10px;" v-else="OG.isTitle">
                <h1>no title</h1>
              </span>
            </div>
            <div>
              <el-image :src="siteInfo.OG_IMAGE" fit="fill" v-if="OG.isImage">
                <div slot="placeholder" class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
              </el-image>
              <el-image :src="src" fit="fill" v-else="OG.isImage">
                <div slot="placeholder" class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div>
              <span v-if="OG.isDescription" style="color:gray;">
                {{ siteInfo.OG_DESCRIPTION }}
              </span>
              <span v-else="OG.isDescription">
                -
              </span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="HIGHLIGT">
          <el-scrollbar wrap-class="list" :native="false">
            <div style="height: 300px;">
              <el-timeline
                style="padding-left: 2px; margin-top: 12px; margin-right: 20px;"
              >
                <el-timeline-item
                  v-for="(activity, index) in Highlight.activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.COLOR"
                >
                  {{ activity.PRINT_TEXT }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="OPTION">OPTION</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { POPUP_LISTENER } from "./listener.js";

export default {
  name: "App",
  data() {
    return {
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      Highlight: {
        activities: []
      },
      OG: {
        isTitle: false,
        isImage: false,
        isDescription: false
      },
      siteInfo: null,
      image: null,
      isCollapse: true
    };
  },
  mounted() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let tabId = tabs[0].id;

      chrome.storage.sync.get(String(tabId), items => {
        // items: 저장한 객체의 key/value
        POPUP_LISTENER.postMessage(
          "popup.highlights",
          items[tabId]
        ).onMessage.addListener(response => {
          console.log("in popup.highlights ", response);
          this.Highlight.activities = response;
        });
      });

      chrome.tabs.sendMessage(
        tabId,
        {
          action: "get.site.info"
        },
        siteInfo => {
          console.log("siteInfo >> ", siteInfo);

          if (siteInfo.OG_IMAGE != null) {
            this.OG.isImage = true;
          }
          if (siteInfo.OG_TITLE != null) {
            this.OG.isTitle = true;
          }
          if (siteInfo.OG_DESCRIPTION != null) {
            this.OG.isDescription = true;
          }
          this.siteInfo = siteInfo;
        }
      );
    });
  },
  methods: {}
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
