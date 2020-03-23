<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row
      v-for="item in highlights"
      :key="item.IDX"
      @click="goPosition(item.IDX)"
      style="cursor:pointer;"
    >
      <v-banner
        two-line
        style="width:100%; padding-left: 10px; padding-right: 10px;"
      >
        <v-avatar slot="icon" :color="convertColor(item.COLOR)" size="40">
        </v-avatar>

        {{ item.PRINT_TEXT }}
        <template v-slot:actions>
          <v-btn text color="accent-4" @click="deleteHighlight(item, $event)">
            <v-icon>mdi-delete-forever</v-icon>
          </v-btn>
        </template>
      </v-banner>
    </v-row>
  </div>
</template>
<script>
//https://i.picsum.photos/id/20/400/400.jpg
import CONTENT_LISTENER from "../../common/content-listener";
import Common from "../../common/common";
import Utils from "../../dashboard/utils/Utils";

export default {
  name: "HighlightTab",
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
    deleteHighlight(item, event) {
      event.preventDefault();
      event.stopPropagation();

      if (!confirm("하이라이트를 삭제하시겠습니까?")) return false;
      CONTENT_LISTENER.sendMessage({
        type: "delete.highlight",
        data: item
      }).then(() => {
        let index = this.highlights.filter((highlight, index) => {
          return item.IDX === highlight.IDX ? index : null;
        });
        this.highlights.splice(index, 1);

        //본문의 highlight를 삭제한다.
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "unwrap.highlight",
            data: item
          });
        });
      });
    },
    goPosition(IDX) {
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
    },
    getHighlights() {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, { action: "get.url.info" }, urlInfo => {
          chrome.storage.local.get(String(tabId), items => {
            // items: 저장한 객체의 key/value

            chrome.storage.local.get(["loginInfo"], result => {
              urlInfo.EMAIL = result.loginInfo.EMAIL;

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
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.getHighlights();
    });
  }
};
</script>
<style>
.v-banner__actions {
  padding-top: 0px !important;
}
</style>
