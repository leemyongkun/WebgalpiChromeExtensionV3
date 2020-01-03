<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar app clipped-left color="amber" :hide-on-scroll="true">
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
              rounded
              hoverable
              activatable
              style="cursor:pointer"
              :items="trees"
            ></v-treeview>
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
export default {
  components: {},
  data: () => ({
    drawer: false,
    trees: [
      {
        id: 0,
        name: "전체",
        children: [
          {
            id: 1,
            name: "Applications :",
            children: [
              { id: 2, name: "Calendar : app" },
              { id: 3, name: "Chrome : app" },
              { id: 4, name: "Webstorm : app" }
            ]
          },
          {
            id: 5,
            name: "Documents :",
            children: [
              {
                id: 6,
                name: "vuetify :",
                children: [
                  {
                    id: 7,
                    name: "src :",
                    children: [
                      { id: 8, name: "index : ts" },
                      { id: 9, name: "bootstrap : ts" }
                    ]
                  }
                ]
              },
              {
                id: 10,
                name: "material2 :",
                children: [
                  {
                    id: 11,
                    name: "src :",
                    children: [
                      { id: 12, name: "v-btn : ts" },
                      { id: 13, name: "v-card : ts" },
                      { id: 14, name: "v-window : ts" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 15,
            name: "Downloads :",
            children: [
              { id: 16, name: "October : pdf" },
              { id: 17, name: "November : pdf" },
              { id: 18, name: "Tutorial : html" }
            ]
          },
          {
            id: 19,
            name: "Videos :",
            children: [
              {
                id: 20,
                name: "Tutorials :",
                children: [
                  { id: 21, name: "Basic layouts : mp4" },
                  { id: 22, name: "Advanced techniques : mp4" },
                  { id: 23, name: "All about app : dir" }
                ]
              },
              { id: 24, name: "Intro : mov" },
              { id: 25, name: "Conference introduction : avi" }
            ]
          }
        ]
      }
    ]
  }),
  created() {},
  methods: {}
};
</script>
