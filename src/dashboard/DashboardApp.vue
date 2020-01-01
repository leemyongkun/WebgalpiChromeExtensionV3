<template>
  <v-app id="keep">
    <v-app-bar app clipped-left color="amber">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5"
        >WEB&nbsp;<span class="font-weight-light">Galpi</span></span
      >
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-feature-search-outline"
      />

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
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

        <v-row align="center">
          <v-col>
            <v-treeview activatable :items="trees"></v-treeview>
          </v-col>
        </v-row>

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

    <v-content>
      <v-container fluid class="grey lighten-4 fill-height">
        <v-row justify="center" align="center">
          <v-col class="shrink"> </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    menus: [
      { heading: "Labels" },
      { icon: "mdi-tooltip-plus-outline", text: "Create new label" },
      { divider: true },
      { icon: "mdi-archive-arrow-up-outline", text: "Archive" },
      { icon: "mdi-delete", text: "Trash" },
      { divider: true },
      { icon: "mdi-file-settings-variant-outline", text: "Settings" },
      { icon: "mdi-trash-can-outline", text: "Trash" },
      { icon: "mdi-help-circle-outline", text: "Help" }
    ],
    trees: [
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
  })
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
