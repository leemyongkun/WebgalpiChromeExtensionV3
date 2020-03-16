<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-divider v-if="lostCategory.length !== 0" dark class="my-4" />

    <v-list>
      <v-list-item
        v-for="(lostItem, index) in lostCategory"
        style="padding-right: 3px;padding-left: 30px;"
        :style="lostItem.dropOver ? overColor : ''"
        @click="selectCategory(lostItem, $event)"
        @mouseover="lostItem.mouseOver = true"
        @mouseleave="lostItem.mouseOver = false"
        :id="lostItem.id"
        active-class="border"
        :key="index"
      >
        <v-list-item-icon>
          <v-icon size="15px" color="red" left
            >mdi-comment-question-outline
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ lostItem.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon
          @click="editCategory(lostItem, $event, false, 'update')"
          v-show="lostItem.mouseOver"
        >
          <v-icon size="18px" dense right>mdi-settings</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";

export default {
  components: {},
  data: () => ({
    lostCategory: []
  }),
  created() {
    this.$nextTick(() => {
      this.getLostCategory();
    });
  },
  methods: {
    async getLostCategory() {
      let result = await Utils.getLocalStorage("loginInfo");
      //미아 카테고리(Parent가 없는 자식 Category)
      CONTENT_LISTENER.sendMessage({
        type: "get.lost.category",
        data: [result.loginInfo.EMAIL]
      }).then(lostCategory => {
        console.log("lostCategory ", lostCategory, lostCategory.length);
        this.lostCategory = lostCategory;
      });
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();

      EventBus.$emit("edit.category", item, checkRoot, statusFlag, "LOST");
    },

    selectCategory(category, event) {
      EventBus.$emit("select.category", category, event);
    }
  }
};
</script>
