<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div v-for="(item, i) in category" :key="i">
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
          <drop
            @drop="dropEvent"
            @dragover="subItem.dropOver = true"
            @dragleave="subItem.dropOver = false"
          >
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
                  :id="subItem.id"
                ></v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon
                @click="editCategory(subItem, $event, false, 'update')"
                v-show="subItem.mouseOver"
              >
                <v-icon dense size="18px" right>mdi-settings</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </drop>
        </div>
      </v-list-group>
    </div>
  </div>
</template>

<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import Utils from "../../utils/Utils";
import EventBus from "../../event-bus";

export default {
  components: {},
  data: () => ({
    category: [],
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;" //드래드 시 오버 대상에 마우스 over 했을때 스타일
  }),
  created() {},
  methods: {
    async getCategory() {
      let result = await Utils.getLocalStorage("loginInfo");
      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: [result.loginInfo.EMAIL]
      }).then(category => {
        if (category.length !== 0) {
          console.log("category", JSON.stringify(category));
          this.category = Utils.generateTree(category, 0);
        }
      });
    },
    dropEvent(data, event) {
      this.snackbarMessage = "카테고리에 저장되었습니다.";
      this.snackbar = true;

      this.category.forEach(item => {
        if (item.children !== undefined) {
          item.children.forEach(subItem => {
            subItem.dropOver = false;
          });
        }
      });

      //DB에 저장하기
      /*let param = [
                    event.target.id, //"CATEGORY_IDX":
                    data.URL_KEY, //"URL_KEY":
                    data.EMAIL, //"EMAIL":
                    data.IDX, //"SITE_IDX":
                    new Date().getTime() //"DATE_CREATE":
                ];*/
      /*
                    data.URL_KEY, //"URL_KEY":
                    data.EMAIL, //"EMAIL":
                    data.IDX, //"SITE_IDX":
                 */
      data.CATEGORY_ID = event.target.id;
      data.DATE_CREATE = new Date().getTime();

      CONTENT_LISTENER.sendMessage({
        type: "post.category.relation",
        data: data
      })
        .then(() => {
          EventBus.$emit("hideSite", data.URL_KEY);
        })
        .then(() => {
          this.getCategory();
        });
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();

      EventBus.$emit("edit.category", item, checkRoot, statusFlag, "CUSTOM");
    },
    selectCategory(category, event) {
      EventBus.$emit("select.category", category, event);
    }
  }
};
</script>
