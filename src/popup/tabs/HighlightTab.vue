<template>
  <div style="padding: 10px">
    <div>
      <ul class="list-unstyled">
        <b-media
          tag="li"
          v-for="item in Highlight.activities"
          v-bind:key="item.IDX"
        >
          <template v-slot:aside>
            <b-img
              blank
              :blank-color="getColor(item.COLOR)"
              style="padding-top: 4px;
                            height: 100%;
                            width: 15px;
                        "
            ></b-img>
          </template>
          <p
            style="cursor: pointer;font-size: 11pt;margin-bottom: 0px"
            @click="goPosition(item.IDX)"
          >
            {{ item.PRINT_TEXT }}
          </p>
          <label style="font-size:12px; color: #aaaaaa">{{
            getDate(item.DATE_CREATE)
          }}</label>
        </b-media>
      </ul>
    </div>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg
import { POPUP_LISTENER } from "../listener.js";
import Common from "../../common/common";

export default {
  name: "SiteInfoTab",
  data() {
    return {
      Highlight: {
        activities: []
      }
    };
  },
  methods: {
    getDate: date => {
      return Common.getConvertDate(date);
    },
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
    });
  }
};
</script>
