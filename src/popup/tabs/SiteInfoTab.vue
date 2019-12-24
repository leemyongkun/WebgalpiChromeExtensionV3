<template>
  <div>
    <div
      style="position: absolute;
                                    z-index: 100;
                                    top: 80%;
                                    left: 85%;"
    >
      <b-badge href="#" variant="primary" style="width:50px">저장</b-badge>
    </div>
    <div>
      <b-card no-body class="overflow-hidden" style="max-width: 540px;">
        <b-row no-gutters>
          <b-col cols="4">
            <b-card-img
              :src="siteInfo.IMAGE"
              style="width: 159px; height: 159px"
              class="rounded-0"
            ></b-card-img>
          </b-col>
          <b-col cols="8">
            <b-card-body style="padding: 0.25rem;">
              <h6>{{ siteInfo.TITLE }}</h6>
              <b-card-text style="font-size: 10pt; padding-top: 4px">
                {{ siteInfo.DESCRIPTION }}
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg
import { POPUP_LISTENER } from "../listener.js";

export default {
  name: "SiteInfoTab",
  data() {
    return {
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      OG: {
        isTitle: false,
        isImage: false,
        isDescription: false
      },
      siteInfo: {
        TITLE: null,
        IMAGE: null,
        DESCRIPTION: null
      },
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

      chrome.tabs.sendMessage(tabId, { action: "get.site.info" }, siteInfo => {
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
      });
    });
  }
};
</script>
