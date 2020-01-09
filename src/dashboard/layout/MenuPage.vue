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
          <v-col style="padding-bottom:0px; padding-top:0px;margin-left: 15px;">
            <v-list>
              <v-list-group
                v-for="item in category"
                :key="item.name"
                v-model="item.active"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <drop
                  @drop="drop"
                  :class="{ over }"
                  @dragover="over = true"
                  @dragleave="over = false"
                >
                  <v-list-item
                    v-for="subItem in item.children"
                    :key="subItem.name"
                    @click=""
                    style="padding-left: 30px;"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        :id="subItem.id"
                        v-text="subItem.name"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </drop>
              </v-list-group>
            </v-list>

            <!--<v-treeview
                                            hoverable
                                            activatable
                                            style="cursor:pointer"
                                            return-object
                                            v-model="categoryItem"
                                            :items="category"
                                    >
                                        <template v-slot:prepend="{ item, active }">
                                            <v-icon>mdi-folder-outline</v-icon>
                                        </template>
                                    </v-treeview>-->
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
  </div>
</template>
<script>
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
    over: false,
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
      this.category = this.generateTree(category, null);
      // let b =  treeModel(category, null);
      // console.log("b ", b)
    });
  },
  methods: {
    drop(data, event) {
      //console.log("drop item ", data, event);
      console.log(event.target.id, event.target.innerHTML);
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
        console.log("11");
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
/**
     let treeModel = function (arrayList, rootId) {
                    var rootNodes = [];
                    var traverse = function (nodes, item, index) {
                        if (nodes instanceof Array) {
                            return nodes.some(function (node) {
                                if (node.id === item.parentId) {
                                    node.children = node.children || [];
                                    return node.children.push(arrayList.splice(index, 1)[0]);
                                }

                                return traverse(node.children, item, index);
                            });
                        }
                    };

                    while (arrayList.length > 0) {
                        arrayList.some(function (item, index) {
                            if (item.parentId === rootId) {
                                return rootNodes.push(arrayList.splice(index, 1)[0]);
                            }

                            return traverse(rootNodes, item, index);
                        });
                    }

                    return rootNodes;
                };

     //javascript tree jsfiddle traverse
     */
</script>
<style>
.drop.over {
  border-color: #aaa;
  background: #ccc;
}
</style>
