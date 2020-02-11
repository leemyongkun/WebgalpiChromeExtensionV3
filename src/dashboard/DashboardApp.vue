<template>
  <v-app>
    <!--SideMenu-->
    <MenuPage />
    <v-content>
      <v-container fluid>
        <ContentBody></ContentBody>
        <!--<SiteListWidePage></SiteListWidePage>-->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";
import SiteListWidePage from "./content/SiteListWidePage";
import ContentBody from "./content/ContentBody";

export default {
  components: { ContentBody, SiteListWidePage, MenuPage },
  data: () => ({}),
  methods: {},
  created() {
    this.$nextTick(() => {
      chrome.storage.local.get(["options"], result => {
        let options = result.options;
        console.log(" >>> options ", options);
        if (options.THEME === "dark") {
          this.$vuetify.theme.dark = true;
        } else {
          this.$vuetify.theme.dark = false;
        }
      });
    });
  },
  mounted() {}
};
</script>
