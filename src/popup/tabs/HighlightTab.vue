<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-list v-if="highlights.length !== 0">
      <v-list-item-title>
        <v-row>
          <v-col cols="auto" class="pb-0 pt-0">
            HIGHLIGHT LIST
          </v-col>
          <v-spacer />
          <v-col cols="auto" class="pb-0 pt-0">
            <v-btn
              @click="deleteAllHighlight(highlights[0])"
              v-show="highlights.length !== 0"
              small
              text
              color="red"
              >일괄 삭제
            </v-btn>
          </v-col>
        </v-row>
      </v-list-item-title>
      <template v-for="(item, index) in highlights">
        <v-list-item :key="item.IDX" class="pr-2" @click="goPosition(item.IDX)">
          <v-list-item-content class="mt-0 pr-2">
            <span
              ><v-icon size="15px" :color="convertColor(item.COLOR)"
                >mdi-format-color-highlight</v-icon
              >&nbsp;&nbsp;{{ item.PRINT_TEXT }}</span
            ><br />
            <span class="pt-2" style="color: darkgray" v-if="item.MEMO !== ''"
              ><v-icon size="15px">mdi-message-reply-text</v-icon>
              &nbsp;&nbsp;{{ item.MEMO }}</span
            >
          </v-list-item-content>
          <v-list-item-action class="mr-0 ml-0 pr-0 pl-0">
            <v-icon @click="deleteHighlight(item, $event)"
              >mdi-delete-forever
            </v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
    <v-list v-if="highlights.length === 0">
      <v-list-item>
        <v-list-item-content class="mt-0 pt-0 ">
          <v-list-item-title class="text-center">
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
import MODAL from "../../common/modal";

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
    unwrapHighlight(item) {
      //본문의 highlight를 삭제한다.
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "unwrap.highlight",
          data: item
        });
      });
    },
    async deleteAllHighlight(highlight) {
      let confirm = "모든 하이라이트를 삭제하시겠습니까?";
      let result = await MODAL.confirm(confirm, "info", null, null, "350px");
      if (result.value === undefined) return false;

      CONTENT_LISTENER.sendMessage({
        type: "delete.all.highlight",
        data: highlight /*EMAIL과 URL_KEY 활용*/
      })
        .then(() => {
          this.highlights.map(highlight => {
            this.unwrapHighlight(highlight);
          });
        })
        .then(() => {
          this.highlights = [];
          Common.reloadingSameSite();
        });
    },
    async deleteHighlight(item, event) {
      event.preventDefault();
      event.stopPropagation();
      item.HIGHLIGHT_IDX = item.IDX;

      // if (!confirm("하이라이트를 삭제하시겠습니까?")) return false;
      let confirm = "하이라이트를 삭제하시겠습니까?";
      let result = await MODAL.confirm(confirm, "info", null, null, "350px");
      if (result.value === undefined) return false;

      CONTENT_LISTENER.sendMessage({
        type: "delete.highlight",
        data: item
      }).then(() => {
        this.highlights.map((highlight, index) => {
          if (item.IDX === highlight.IDX) {
            this.highlights.splice(index, 1);
          }
        });

        this.unwrapHighlight(item);

        Common.reloadingSameSite();
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
