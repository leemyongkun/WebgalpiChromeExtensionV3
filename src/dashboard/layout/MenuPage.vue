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
              <v-list-group value="true" color="white">
                <template v-slot:activator>
                  <v-list-item-title>카테고리</v-list-item-title>
                </template>

                <v-list-group
                  v-for="(item, i) in category"
                  :key="i"
                  color="white"
                  active-class="border"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <drop
                    @drop="dropEvent"
                    :class="{ dropOver }"
                    @dragover="dropOver = true"
                    @dragleave="dropOver = false"
                  >
                    <v-list-item
                      v-for="subItem in item.children"
                      :key="subItem.name"
                      @click="selectCategory(subItem, $event)"
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
              </v-list-group>
            </v-list>
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
      console.log("this.category ", this.category);
      // let b =  treeModel(category, null);
      // console.log("b ", b)
    });
  },
  methods: {
    selectCategory(category, event) {
      alert(JSON.stringify(category));
    },
    dropEvent(data, event) {
      this.snackbarMessage = "카테고리에 저장되었습니다.";
      this.snackbar = true;
      console.log(">> ", event.target.id, event.target.innerHTML);
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
