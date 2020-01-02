<template>
  <v-app id="keep">
    <TopMenuPage />
    <SideMenuPage />
    <v-content>
      <v-container fluid>
        <SiteListPage />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SideMenuPage from "./layout/SideMenuPage";
import TopMenuPage from "./layout/TopMenuPage";
import SiteListPage from "./content/SiteListPage";
export default {
  components: { SiteListPage, TopMenuPage, SideMenuPage },
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  })
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
