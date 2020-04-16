<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu
    transition="slide-y-transition"
    offset-y
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="setHighlights">
        <v-icon>mdi-grease-pencil</v-icon>
      </v-btn>
    </template>

    <v-card width="400px" :style="maxHeightWidget">
      <v-list v-if="highlightItems.length !== 0">
        <template v-for="(item, index) in highlightItems">
          <v-list-item :key="item.IDX" class="pr-2">
            <v-list-item-content class="mt-0 pt-0">
              {{ item.PRINT_TEXT }}
            </v-list-item-content>

            <v-list-item-action class="mr-0 ml-0 pr-0 pl-0">
              <v-btn icon color="black" @click="deleteHighlight(item)">
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list>

      <v-list v-if="highlightItems.length === 0">
        <v-list-item>
          <v-list-item-content class="mt-0 pt-0 ">
            <v-list-item-title class="align-center">
              NO HIGHLIGHTS
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
import { GLOBAL_CONFIG } from "../../../../contents/global/config";

export default {
  components: {},
  computed: {},
  props: ["highlights"],
  data: () => ({
    hover: false,
    highlightItems: [],
    maxHeightWidget: ""
  }),
  created() {
    this.$nextTick(function() {
      this.getWindowHeight();
      window.addEventListener("resize", this.getWindowHeight);
    });
  },
  methods: {
    deleteHighlight(item) {
      if (!confirm("하이라이트를 삭제하시겠습니까?")) return false;

      CONTENT_LISTENER.sendMessage({
        type: "delete.highlight",
        data: item
      }).then(() => {
        let index = this.highlightItems.filter((highlight, index) => {
          return item.IDX === highlight.IDX ? index : null;
        });
        this.highlightItems = this.highlightItems.splice(index, 1);
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
