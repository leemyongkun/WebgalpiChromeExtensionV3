<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
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
    <!-- CATEGORY : END -->

    <v-app-bar app clipped-left color="">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5"
        >WEB&nbsp;<span class="font-weight-light">Galpi</span>
      </span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-feature-search-outline"
      />
      <v-spacer />
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
            <v-expansion-panels focusable flat>
              <v-expansion-panel>
                <v-expansion-panel-header>CATEGORY</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list>
                    <v-list-group
                      v-for="(item, i) in category"
                      :key="i"
                      active-class="border"
                    >
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>

                      <v-list-item-group>
                        <div
                          v-for="subItem in item.children"
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
                            >
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

export default {
  components: {
    SettingsManagerDialog,
    CategoryManagerDialog,
    CategoryManagerDialog
  },
  data: () => ({
    snackbarTimeout: 3000,
    snackbarMessage: "",
    snackbar: false,
    dropOver: false,
    mouseover: false,
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;",
    categoryDialog: false,
    settingDialog: false,
    drawer: true,
    categoryItem: [],
    category: [],
    icon: {
      on: "mdi-bookmark",
      off: "mdi-bookmark-outline"
    }
  }),
  created() {},
  mounted() {
    CONTENT_LISTENER.sendMessage({
      type: "get.menus",
      data: null
    }).then(category => {
      console.log("category ", category);
      this.category = this.generateTree(category, null);
      console.log("this.category ", this.category);
      // let b =  treeModel(category, null);
      // console.log("b ", b)
    });
  },
  methods: {
    settingCategory(item, event) {
      event.preventDefault();
      event.stopPropagation();
      alert(JSON.stringify(item));
    },
    selectCategory(category, event) {
      alert(JSON.stringify(category));
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
      //todo : DB에 저장하기
      //alert(event.target.id);
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
</style>
