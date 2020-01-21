<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <UpdateCategoryDialog
      :category="category"
      ref="updateCategoryDialog"
    ></UpdateCategoryDialog>
    <!-- CATEGORY : START -->
    <CategoryManagerDialog
      :dialog="categoryDialog"
      :category="category"
      @closeDialog="switchDialogCategoryEditor"
    ></CategoryManagerDialog>
    <SettingsManagerDialog
      :dialog="settingDialog"
      @closeDialog="switchDialogSetting"
    ></SettingsManagerDialog>

    <v-app-bar app clipped-left color="">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5"
        >WEB&nbsp;<span class="font-weight-light" @click="clickMain"
          >Galpi
        </span>
      </span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-feature-search-outline"
      />
      <v-spacer />
      <v-btn text @click=""
        ><v-icon>mdi-information-outline</v-icon>&nbsp;README
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-row align="center">
          <v-col
            cols="12"
            class="text-right"
            style="padding-top: 0px;padding-bottom: 0px;"
          >
            <v-btn small text @click="switchDialogCategoryEditor">edit</v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col style="padding-bottom:0px; padding-top:0px;">
            <v-expansion-panels focusable flat multiple v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header>CATEGORY</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list>
                    <v-btn block small @click="">
                      <v-icon>mdi-playlist-plus</v-icon>
                    </v-btn>

                    <v-list-item-group>
                      <v-list-item
                        @click="selectCategory(0, $event)"
                        active-class="border"
                        ref="allCategory"
                      >
                        <!-- <v-list-item-icon style="margin-right: 4px;">
                                                                                                                                     <v-icon right  color="green">mdi-settings</v-icon>
                                                                                                                                 </v-list-item-icon>-->

                        <v-list-item-content>
                          <v-list-item-title
                            v-text="`전체`"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>

                    <v-list-group v-for="(item, i) in category" :key="i">
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>

                      <v-list-item-group>
                        <div
                          v-for="(subItem, index) in item.children"
                          :key="subItem.name"
                        >
                          <drop
                            @drop="dropEvent"
                            @dragover="subItem.dropOver = true"
                            @dragleave="subItem.dropOver = false"
                          >
                            <v-list-item
                              :style="subItem.dropOver ? overColor : ''"
                              @click="selectCategory(subItem, $event)"
                              @mouseover="subItem.mouseOver = true"
                              @mouseleave="subItem.mouseOver = false"
                              :id="subItem.id"
                              active-class="border"
                            >
                              <v-list-item-icon style="margin-right: 2px;">
                                <v-icon color="green" left
                                  >mdi-folder-outline
                                </v-icon>
                              </v-list-item-icon>
                              <!-- <v-list-item-icon style="margin-right: 4px;">
                                                                                                                                                           <v-icon right  color="green">mdi-settings</v-icon>
                                                                                                                                                       </v-list-item-icon>-->

                              <v-list-item-content :id="subItem.id">
                                <v-list-item-title
                                  v-text="subItem.name"
                                  :id="subItem.id"
                                ></v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-icon
                                @click="settingCategory(subItem, $event)"
                                v-show="subItem.mouseOver"
                              >
                                <v-icon right>mdi-settings</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </drop>
                        </div>
                      </v-list-item-group>
                    </v-list-group>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- CATEGORY : END -->

        <v-divider dark class="my-4" />
        <v-list-item link @click="switchDialogSetting">
          <v-list-item-action>
            <v-icon>mdi-file-settings-variant-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              Settings
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- /template -->
      </v-list>
    </v-navigation-drawer>

    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      :color="`success`"
      top
    >
      {{ snackbarMessage }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
//https://cameronhimself.github.io/vue-drag-drop/
import CONTENT_LISTENER from "../../common/content-listener";
import CategoryManagerDialog from "../dialog/CategoryManagerDialog";
import SettingsManagerDialog from "../dialog/SettingsManagerDialog";
import EventBus from "../event-bus";
import UpdateCategoryDialog from "./dialog/UpdateCategoryDialog";
import { POPUP_LISTENER } from "../../common/port-listener";

export default {
  components: {
    UpdateCategoryDialog,
    SettingsManagerDialog,
    CategoryManagerDialog,
    CategoryManagerDialog
  },
  data: () => ({
    panel: [0], //accordian 의 오픈 index
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;", //드래드 시 오버 대상에 마우스 over 했을때 스타일
    categoryDialog: false, //카테고리 다이얼로그 open / close 여부
    settingDialog: false, //Setting 다이얼로그 open / close 여부
    drawer: true, //왼쪽 메뉴 open / close 여부
    category: [], //Category
    icon: {
      on: "mdi-bookmark",
      off: "mdi-bookmark-outline"
    }
  }),
  created() {
    this.$nextTick(() => {
      /*  this.getCategory();

                  EventBus.$on("reload.category", () => {
                      this.getCategory();
                  });*/
    });
  },
  mounted() {},
  methods: {
    clickMain() {
      this.getCategory();
    },
    getCategory() {
      CONTENT_LISTENER.sendMessage({
        type: "get.menus",
        data: null
      })
        .then(category => {
          console.log("category ", category);
          this.category = this.generateTree(category, null);
        })
        .then(() => {
          // 첫번째꺼 클릭
          //this.$refs.allCategory.click();
        });

      /*POPUP_LISTENER.postMessage("get.menus.port", null).onMessage.addListener(
                  response => {
                    console.log("response ", response);
                    /!*  response.then( res =>{
                          console.log("category " , res);
                      })*!/
                  }
                );*/
    },
    settingCategory(item, event) {
      event.preventDefault();
      event.stopPropagation();
      this.$refs.updateCategoryDialog.openDialog(item, this.category);
      //alert(JSON.stringify(item));
    },
    selectCategory(category, event) {
      EventBus.$emit("selectCategoryForSite", category);
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
      let param = [
        event.target.id, //"CATEGORY_IDX":
        data.URL_KEY, //"URL_KEY":
        data.EMAIL, //"EMAIL":
        data.IDX, //"SITE_IDX":
        new Date().getTime() //"DATE_CREATE":
      ];
      CONTENT_LISTENER.sendMessage({
        type: "post.category.relation",
        data: param
      }).then(() => {
        EventBus.$emit("hideSite", data.URL_KEY);
      });
    },
    switchDialogCategoryEditor() {
      this.categoryDialog = !this.categoryDialog;
    },
    switchDialogSetting() {
      this.settingDialog = !this.settingDialog;
    },
    generateTree(arrayList, rootId) {
      let rootNodes = [];
      let traverse = function(nodes, item, index) {
        if (nodes instanceof Array) {
          return nodes.some(node => {
            if (node.id === item.parent) {
              node.children = node.children || [];
              return node.children.push(arrayList.splice(index, 1)[0]);
            }

            return traverse(node.children, item, index);
          });
        }
      };

      while (arrayList.length > 0) {
        arrayList.some((item, index) => {
          if (item.parent === rootId) {
            return rootNodes.push(arrayList.splice(index, 1)[0]);
          }

          return traverse(rootNodes, item, index);
        });
      }

      return rootNodes;
    }
  }
};
</script>
<style>
.drop.over {
  border-color: #aaa;
  background: #ccc;
}

.border {
  border: 2px dashed orange;
}

.v-expansion-panel-content__wrap {
  padding-left: 10px;
}
</style>
