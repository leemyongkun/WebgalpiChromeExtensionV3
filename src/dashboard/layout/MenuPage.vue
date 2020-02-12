<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <UpdateCategoryDialog
      :category="category"
      ref="updateCategoryDialog"
    ></UpdateCategoryDialog>

    <SettingsManagerDialog
      :dialog="settingDialog"
      @closeDialog="switchDialogSetting"
    ></SettingsManagerDialog>

    <v-navigation-drawer permanent v-model="drawer" app clipped>
      <v-list dense>
        <v-row align="center">
          <v-col style="padding-bottom:0px; padding-top:0px;">
            <v-expansion-panels focusable multiple v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header>FILTER</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div>
                    <v-text-field
                      solo-inverted
                      flat
                      hide-details
                      label="Search"
                      prepend-inner-icon="mdi-feature-search-outline"
                    />
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>CATEGORY</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-btn
                    block
                    small
                    @click="editCategory(null, $event, false, 'insert')"
                    style="margin-top: 10px;"
                  >
                    <v-icon left>mdi-folder-plus</v-icon>
                    CATEGORY
                  </v-btn>
                  <v-list>
                    <!-- <v-list-item-group>
                                           <v-list-item
                                             @click="selectCategory(0, $event)"
                                             active-class="border"
                                             ref="allCategory"
                                           >
                                             <v-list-item-content>
                                               <v-list-item-title
                                                 class="text-center"
                                                 v-text="`ALL CONTENTS`"
                                               ></v-list-item-title>
                                             </v-list-item-content>
                                           </v-list-item>
                                         </v-list-item-group>
                                         <br />-->
                    <!--  <p v-if="category.length === 0" class="text-center">
                                            EMPTY CATEGORY
                                          </p>-->
                    <div v-for="(item, i) in category" :key="i">
                      <v-list-group
                        sub-group
                        no-action
                        value="true"
                        class="custom_style"
                        @mouseover="item.mouseOver = true"
                        @mouseleave="item.mouseOver = false"
                      >
                        <!-- parent menu -->
                        <template v-slot:activator>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-icon
                            @click="editCategory(item, $event, true, 'update')"
                            v-show="item.mouseOver"
                          >
                            <v-icon dense size="18px" right
                              >mdi-settings
                            </v-icon>
                          </v-list-item-icon>
                        </template>

                        <div
                          v-for="(subItem, index) in item.children"
                          :key="subItem.name"
                        >
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
                                @click="
                                  editCategory(subItem, $event, false, 'update')
                                "
                                v-show="subItem.mouseOver"
                              >
                                <v-icon dense size="18px" right
                                  >mdi-settings
                                </v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </drop>
                        </div>
                      </v-list-group>
                    </div>
                  </v-list>

                  <!-- 미아가 된 카테고리 -->
                  <v-divider
                    v-if="lostCategory.length !== 0"
                    dark
                    class="my-4"
                  />
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
                        <v-list-item-title
                          >{{ lostItem.name }}
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-icon
                        @click="editCategory(lostItem, $event, false, 'update')"
                        v-show="lostItem.mouseOver"
                      >
                        <v-icon size="18px" dense right>mdi-settings</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- CATEGORY : END -->
      </v-list>

      <template v-slot:append>
        <v-btn text block class="text-right" @click="switchDialogSetting">
          <v-icon size="18px">mdi-file-settings-variant-outline</v-icon>
        </v-btn>
      </template>
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
import SettingsManagerDialog from "../dialog/SettingsManagerDialog";
import EventBus from "../event-bus";
import UpdateCategoryDialog from "./dialog/UpdateCategoryDialog";
import { POPUP_LISTENER } from "../../common/port-listener";

export default {
  components: {
    UpdateCategoryDialog,
    SettingsManagerDialog
  },
  data: () => ({
    panel: [1], //accordian 의 오픈 index
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;", //드래드 시 오버 대상에 마우스 over 했을때 스타일
    categoryDialog: false, //카테고리 다이얼로그 open / close 여부
    settingDialog: false, //Setting 다이얼로그 open / close 여부
    drawer: true, //왼쪽 메뉴 open / close 여부
    category: [], //Category
    lostCategory: [],
    icon: {
      on: "mdi-bookmark",
      off: "mdi-bookmark-outline"
    }
  }),
  created() {
    this.$nextTick(() => {
      this.getCategory();

      EventBus.$on("reload.category", () => {
        this.getCategory();
      });
    });
  },
  mounted() {},
  computed: {},
  methods: {
    getCategory() {
      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: null
      }).then(category => {
        this.category = this.generateTree(category, 0);
      });

      //미아 카테고리(Parent가 없는 자식 Category)
      CONTENT_LISTENER.sendMessage({
        type: "get.lost.category",
        data: null
      }).then(lostCategory => {
        this.lostCategory = lostCategory;
      });

      //[todo] SYSTEM Category 의 갯수를 가져온다.
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();
      this.$refs.updateCategoryDialog.openDialog(
        item,
        this.category,
        checkRoot,
        statusFlag //update , insert
      );
      //alert(JSON.stringify(item));
    },
    selectCategory(category, event) {
      this.category.forEach(item => {
        if (item.children !== undefined) {
          item.children.forEach(subItem => {
            subItem.class = "";
          });
        }
      });

      if (category !== 0) category.class = "border";

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
      })
        .then(() => {
          EventBus.$emit("hideSite", data.URL_KEY);
        })
        .then(() => {
          this.getCategory();
        });
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

.v-expansion-panel-header {
  min-height: 45px !important;
}

.v-expansion-panel-content__wrap {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.v-list-group__header {
  padding-left: 10px !important;
}

.v-list-item__icon {
  margin-right: 5px !important;
}

.v-list-item__action {
  margin-right: 10px !important;
}
</style>
