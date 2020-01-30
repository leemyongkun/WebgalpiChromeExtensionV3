<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card flat>
    <v-card-text>
      <v-row class="overflow-y-auto">
        <v-timeline :dense="true">
          <v-timeline-item
            v-for="item in highlights"
            :color="convertColor(item.COLOR)"
            :key="item.IDX"
            :fill-dot="true"
            :hide-dot="false"
            :small="true"
          >
            <span slot="opposite">Tus eu perfecto</span>
            <v-card class="elevation-2">
              <v-card-text>
                {{ item.PRINT_TEXT }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
//https://i.picsum.photos/id/20/400/400.jpg
import CONTENT_LISTENER from "../../common/content-listener";
import Common from "../../common/common";

export default {
  name: "SiteInfoTab",
  data() {
    return {
      highlights: []
    };
  },
  methods: {
    convertColor(color) {
      return Common.getConvertColor(color);
    },
    getDate: date => {
      return Common.getConvertDate(date);
    },
    getColor: colorClass => {
      return Common.getColor(colorClass);
    },
    goPosition: IDX => {
      console.log("go Position ", IDX);

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;
        chrome.tabs.sendMessage(
          tabId,
          {
            action: "position",
            data: IDX
          },
          null
        );
      });
    }
  },
  mounted() {
    console.log("HIGHLIGHT MOUNTED");
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, { action: "get.url.info" }, urlInfo => {
        chrome.storage.sync.get(String(tabId), items => {
          // items: 저장한 객체의 key/value

          CONTENT_LISTENER.sendMessage({
            type: "get.highlights",
            data: urlInfo
          }).then(response => {
            /*this.Highlight.activities = response;*/
            console.log("response ", response);
            this.highlights = response;
          });
        });
      });
    });
  }
};
</script>
