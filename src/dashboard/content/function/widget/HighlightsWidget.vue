<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu
    transition="slide-y-transition"
    offset-y
    :close-on-content-click="false"
    :v-show="true"
  >
    <template v-slot:activator="{ on: menu }">
      <v-tooltip v-model="highlightTooltip" color="blue" top>
        <template v-slot:activator="{ on: tooltip }">
          <v-badge bordered overlap color="green">
            <template v-slot:badge>
              <span>{{ highlights.length }}</span>
            </template>
            <v-btn icon v-on="{ ...menu, ...tooltip }" @click="setHighlights">
              <v-icon>mdi-book-outline</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>저장된 하이라이트를 표시합니다.</span>
      </v-tooltip>
    </template>

    <v-card width="600px" :style="maxHeightWidget">
      <v-card-subtitle v-show="highlightItems.length !== 0">
        <v-row>
          <v-col cols="auto" class="pb-0 pt-0">
            HIGHLIGHT LIST
          </v-col>
          <v-spacer />
          <v-col @click="deleteAllHighlight" cols="auto" class="pb-0 pt-0">
            <v-btn small text color="red">일괄 삭제</v-btn>
          </v-col>
        </v-row>
      </v-card-subtitle>

      <v-divider></v-divider>
      <v-list
        v-if="highlightItems.length !== 0 && currentSite.FL_READMODE === 'Y'"
      >
        <template v-for="(item, index) in highlightItems">
          <v-list-item :key="item.IDX" class="pr-2">
            <v-list-item-content class="mt-0 body-2">
              <span
                ><v-icon size="15px">mdi-format-color-highlight</v-icon
                >{{ item.PRINT_TEXT }}</span
              ><br />
              <span class="pt-2" style="color: darkgray" v-if="item.MEMO !== ''"
                ><v-icon size="15px">mdi-message-reply-text</v-icon>
                {{ item.MEMO }}</span
              >
            </v-list-item-content>

            <v-list-item-action class="mr-0 ml-0 pr-0 pl-0">
              <v-icon @click="deleteHighlight(item)">mdi-delete-forever</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list>

      <v-list
        v-if="highlightItems.length === 0 || currentSite.FL_READMODE === 'N'"
      >
        <v-list-item>
          <v-list-item-content class="mt-0 pt-0 ">
            <v-list-item-title
              class="title text-center"
              v-if="currentSite.FL_READMODE === 'Y'"
            >
              NO HIGHLIGHTS
            </v-list-item-title>
            <v-list-item-title
              class="title text-center"
              v-if="currentSite.FL_READMODE === 'N'"
            >
              잠겨있는 컨텐츠입니다.<br />스크래핑을 다시 시도해보세요.
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
import Common from "../../../../common/common";
import CONTENT_LISTENER from "../../../../common/content-listener";
import MODAL from "../../../../common/modal";
import EventBus from "../../../event-bus";

export default {
  components: {},
  computed: {},
  props: ["highlights", "currentSite"],
  data: () => ({
    hover: false,
    highlightItems: [],
    maxHeightWidget: "",
    highlightTooltip: false
  }),
  created() {
    this.$nextTick(function() {
      this.getWindowHeight();
      window.addEventListener("resize", this.getWindowHeight);
    });
  },
  methods: {
    async deleteAllHighlight() {
      let confirm = "모든 하이라이트를 삭제하시겠습니까?";
      let result = await MODAL.confirm(confirm, "info", null, null, "450px");
      if (result.value === undefined) return false;

      CONTENT_LISTENER.sendMessage({
        type: "delete.all.highlight",
        data: this.currentSite /*EMAIL과 URL_KEY 활용*/
      }).then(() => {
        this.highlightItems = [];
      });
    },
    async deleteHighlight(item) {
      let confirm = "하이라이트를 삭제하시겠습니까?";
      let result = await MODAL.confirm(confirm, "info", null, null, "450px");
      if (result.value === undefined) return false;
      item.HIGHLIGHT_IDX = item.IDX;
      CONTENT_LISTENER.sendMessage({
        type: "delete.highlight",
        data: item
      }).then(() => {
        this.highlightItems.map((highlight, index) => {
          if (item.IDX === highlight.IDX) {
            this.highlightItems.splice(index, 1);
          }
        });
      });
    },
    getWindowHeight(event) {
      this.maxHeightWidget =
        "max-height: " + (document.documentElement.clientHeight - 220) + "px;";
    },
    setHighlights() {
      this.highlightItems = this.highlights;
    },
    convertColor(color) {
      return Common.getConvertColor(color);
    }
  }
};
</script>
