<template> </template>

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
  methods: {
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
  }
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
