<template>
  <div>
    <ul class="list" v-if="highlights.length !== 0">
      <li class="list-item-title">
        <div class="row">
          <div class="col-auto pb-0 pt-0">
            HIGHLIGHT LIST
          </div>
          <div class="spacer"></div>
          <div class="col-auto pb-0 pt-0">
            <button
              @click="deleteAllHighlight(highlights[0])"
              v-show="highlights.length !== 0"
              class="btn small text red"
            >
              {{ LANG.BUTTON_MESSAGE("B0005") }}
            </button>
          </div>
        </div>
      </li>
      <template v-for="(item, index) in highlights" :key="item.IDX">
        <li class="list-item pr-2" @click="goPosition(item.IDX)">
          <div class="list-item-content mt-0 pr-2">
            <span
              ><span
                class="icon-highlight"
                :style="{ color: convertColor(item.COLOR) }"
                >🗒</span
              >&nbsp;&nbsp;{{ item.PRINT_TEXT }}</span
            ><br />
            <span class="pt-2" style="color: darkgray" v-if="item.MEMO !== ''"
              ><span class="icon-memo">💬</span> &nbsp;&nbsp;{{
                item.MEMO
              }}</span
            >
          </div>
          <div class="list-item-action mr-0 ml-0 pr-0 pl-0">
            <span class="icon-delete" @click="deleteHighlight(item, $event)"
              >🗑</span
            >
          </div>
        </li>
        <hr class="divider" />
      </template>
    </ul>
    <ul class="list" v-if="highlights.length === 0">
      <li class="list-item">
        <div class="list-item-content mt-0 pt-0">
          <div class="list-item-title text-center">
            NO HIGHLIGHTS
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
//https://i.picsum.photos/id/20/400/400.jpg
import CONTENT_LISTENER from "../../common/content-listener";
import Common from "../../common/common";
import MODAL from "../../common/modal";
import LANG from "../../common/language";

export default {
  name: "HighlightTab",
  data() {
    return {
      highlights: [],
      LANG: LANG
    };
  },
  methods: {
    convertColor(color) {
      if (!color) return "#000000"; // Default color if undefined
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
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
}

.list-item:hover {
  background: #f5f5f5;
}

.list-item-title {
  padding: 12px 16px;
  font-weight: 500;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.list-item-content {
  flex: 1;
  padding-right: 8px;
}

.list-item-action {
  display: flex;
  align-items: center;
}

.row {
  display: flex;
  align-items: center;
  width: 100%;
}

.col-auto {
  flex: 0 0 auto;
}

.spacer {
  flex: 1;
}

.btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn.small {
  padding: 2px 6px;
  font-size: 11px;
}

.btn.text {
  background: none;
  text-transform: uppercase;
}

.btn.red {
  color: #f44336;
}

.btn:hover {
  opacity: 0.8;
}

.icon-highlight {
  font-size: 15px;
}

.icon-memo {
  font-size: 15px;
}

.icon-delete {
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.icon-delete:hover {
  color: #f44336;
}

.divider {
  border: none;
  border-bottom: 1px solid #eee;
  margin: 0;
}

.text-center {
  text-align: center;
}

.pb-0 {
  padding-bottom: 0;
}

.pt-0 {
  padding-top: 0;
}

.pt-2 {
  padding-top: 8px;
}

.pr-2 {
  padding-right: 8px;
}

.mt-0 {
  margin-top: 0;
}

.mr-0 {
  margin-right: 0;
}

.ml-0 {
  margin-left: 0;
}

.pl-0 {
  padding-left: 0;
}
</style>
