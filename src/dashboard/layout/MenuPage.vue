<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar app clipped-left color="" :hide-on-scroll="true">
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
        <!-- template v-for="(item, i) in menus" -->
        <v-row align="center">
          <v-col cols="6">
            <v-subheader>
              LABEL
            </v-subheader>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn small text>edit</v-btn>
          </v-col>
        </v-row>

        <!-- CATEGORY : START -->
        <v-divider dark class="my-4" />
        <v-row align="center">
          <v-col style="padding-bottom:0px; padding-top:0px;margin-left: 15px;">
            <v-treeview
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
            </v-treeview>
          </v-col>
        </v-row>
        <!-- CATEGORY : END -->

        <v-divider dark class="my-4" />
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-tooltip-plus-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              create new Label
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
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

export default {
  components: {},
  data: () => ({
    drawer: false,
    categoryItem: null,
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
      this.category = this.gen(category, null);
      // let b =  treeModel(category, null);
      // console.log("b ", b)
    });
  },
  methods: {
    gen(arrayList, rootId) {
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
