<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <!-- SYSTEM CATEGORY : START -->
    <div v-for="(item, i) in systemCategory" :key="i">
      <v-list-group
        sub-group
        no-action
        value="true"
        @mouseover="item.mouseOver = true"
        @mouseleave="item.mouseOver = false"
      >
        <!-- parent menu -->
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon
            @click="editCategory(item, $event, true, 'update')"
            v-show="item.mouseOver"
          >
            <v-icon dense size="18px" right>mdi-settings</v-icon>
          </v-list-item-icon>
        </template>

        <div v-for="(subItem, index) in item.children" :key="subItem.name">
          <!-- child menu -->
          <v-list-item
            style="padding-right: 3px;padding-left: 30px;"
            :style="subItem.dropOver ? overColor : ''"
            @click="selectCategory(subItem, $event)"
            @mouseover="subItem.mouseOver = true"
            @mouseleave="subItem.mouseOver = false"
            :id="subItem.id"
            :class="subItem.class"
          >
            <v-list-item-icon style="margin-right: 2px;">
              <v-icon size="15px" color="green" left
                >mdi-folder-outline
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content :id="subItem.id">
              <v-list-item-title
                v-html="
                  subItem.name +
                    ` <span class='red--text text--lighten-2'> ` +
                    subItem.cnt +
                    `</span>`
                "
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon
              @click="editCategory(subItem, $event, false, 'update')"
              v-show="subItem.mouseOver"
            >
              <v-icon dense size="18px" right>mdi-settings</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </div>
      </v-list-group>
    </div>
  </div>
  <!-- SYSTEM CATEGORY : END -->
</template>

<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import Utils from "../../utils/Utils";
import EventBus from "../../event-bus";
import store from "../../../store";
export default {
  components: {},
  data: () => ({
    systemCategory: [],
    allCategoryCount: 0,
    noCategoryCount: 0
  }),
  created() {
    this.$nextTick(() => {
      this.getSystemCategory();
    });
  },
  methods: {
    //시스템 카테고리
    getSystemCategory() {
      CONTENT_LISTENER.sendMessage({
        type: "get.system.category",
        data: null
      })
        .then(systemCategory => {
          this.systemCategory = Utils.generateTree(systemCategory, 0);
          return this.systemCategory[0].children;
        })
        .then(children => {
          let systemCategoryCount = [
            CONTENT_LISTENER.sendMessage({
              type: "get.system.all.category.count",
              data: null
            }),
            CONTENT_LISTENER.sendMessage({
              type: "get.system.no.category.count",
              data: null
            })
          ];

          Promise.all(systemCategoryCount).then(values => {
            children.map(item => {
              if (item.flag === "all") {
                item.cnt = values[0][0].COUNT;
              } else if (item.flag === "nocategory") {
                item.cnt = values[1][0].COUNT;
              }
            });
          });
        });
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();

      EventBus.$emit("edit.category", item, checkRoot, statusFlag, "SYSTEM");
    },
    selectCategory(category, event) {
      EventBus.$emit("select.category", category, event);
    }
  }
};
</script>
