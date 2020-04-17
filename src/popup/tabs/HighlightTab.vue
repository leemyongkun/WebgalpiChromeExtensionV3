<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-list v-if="highlights.length !== 0">
      <template v-for="(item, index) in highlights">
        <v-list-item :key="item.IDX" class="pr-2" @click="goPosition(item.IDX)">
          <v-list-item-content class="mt-0">
            {{ item.PRINT_TEXT }}
          </v-list-item-content>
          <v-list-item-action class="mr-0 ml-0 pr-0 pl-0">
            <v-btn icon color="black" @click="deleteHighlight(item, $event)">
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
    <v-list v-if="highlights.length === 0">
      <v-list-item>
        <v-list-item-content class="mt-0 pt-0 ">
          <v-list-item-title class="align-center">
            NO HIGHLIGHTS
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
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
        this.highlights.map((highlight, index) => {
          if (item.IDX === highlight.IDX) {
            this.highlights.splice(index, 1);
          }
        });

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
