<template>
  <v-app>
    <AppBarPage />
    <MenuPage />
    <v-content>
      <v-container fluid>
        <ContentBody></ContentBody>
        <!--<SiteListWidePage></SiteListWidePage>-->
      </v-container>
    </v-content>

    <SignDialog ref="signDialog"></SignDialog>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";
import SiteListWidePage from "./content/SiteListWidePage";
import ContentBody from "./content/ContentBody";
import AppBarPage from "./layout/AppBarPage";
import CONTENT_LISTENER from "../common/content-listener";
import SignDialog from "./layout/dialog/SignDialog";

export default {
  components: {
    SignDialog,
    AppBarPage,
    ContentBody,
    SiteListWidePage,
    MenuPage
  },
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
  mounted() {
    /**
     * - cookie 혹은 localStorage에 member data확인
     * - 1명 이상일경우, 선택할 수있는 popup
     * - 1명일경우 해당 사용자로 사용
     * - 없을경우 DB에서 조회 google login
     *
     */
    CONTENT_LISTENER.sendMessage({
      type: "get.members",
      data: null
    }).then(members => {
      if (members.length === 0) {
        this.$refs.signDialog.open();
      }
    });
  }
};
</script>
