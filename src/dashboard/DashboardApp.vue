<template>
  <v-app>
    <!--SideMenu-->
    <MenuPage />
    <v-content>
      <v-container fluid>
        <SiteListPage />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";
import SiteListPage from "./content/SiteListPage";

export default {
  components: { SiteListPage, MenuPage },
  data: () => ({}),
  methods: {}
};
</script>
