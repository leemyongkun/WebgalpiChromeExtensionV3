<template>
  <v-app>
    <AppBarPage :member="member" />
    <MenuPage />
    <v-content>
      <v-container fluid class="pt-0 mt-0">
        <ContentBody></ContentBody>
        <!--<SiteListWidePage></SiteListWidePage>-->
      </v-container>
    </v-content>

    <SignDialog ref="signDialog"></SignDialog>
    <SelectMemberDialog ref="selectMemberDialog"></SelectMemberDialog>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";
import SiteListWidePage from "./content/SiteListWidePage";
import ContentBody from "./content/ContentBody";
import AppBarPage from "./layout/AppBarPage";
import CONTENT_LISTENER from "../common/content-listener";
import SignDialog from "./layout/dialog/SignDialog";
import SelectMemberDialog from "./layout/dialog/SelectMemberDialog";

export default {
  components: {
    SelectMemberDialog,
    SignDialog,
    AppBarPage,
    ContentBody,
    SiteListWidePage,
    MenuPage
  },
  data: () => ({
    member: {
      EMAIL: "",
      IMAGE_URL: null
    }
  }),
  methods: {},
  created() {
    this.$nextTick(() => {
      chrome.storage.local.get(["options"], result => {
        let options = result.options;
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
      console.log("members ", members);
      if (members.length === 0) {
        this.$refs.signDialog.open();
      }
      /* else {
                    //todo member중 isUse가 'Y' 인것들.
                    let result = members.filter(member => {
                        return member.IS_USE === 'Y';
                    });
                    console.log("result", result);
                    //this.$refs.selectMemberDialog.open(members);
                    if (result.length === 0) {
                        //todo : 선택할 수 있는 dialog를 오픈한다.
                        this.$refs.selectMemberDialog.open(members);
                    } else {
                        //Y인 회원으로 로그인처리 한다.
                        this.member = result[0];
                    }

                }*/
    });
  }
};
</script>
