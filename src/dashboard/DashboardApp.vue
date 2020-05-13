<template>
  <v-app>
    <AppBarPage :member="member" />
    <MenuPage ref="menuPage" />
    <v-content>
      <v-container fluid class="pt-0 mt-0">
        <ContentBody ref="contentBody"></ContentBody>

        <!--<SiteListWidePage></SiteListWidePage>-->
      </v-container>
    </v-content>

    <SignDialog ref="signDialog"></SignDialog>
    <SelectMemberDialog ref="selectMemberDialog"></SelectMemberDialog>
    <SnackBar ref="snackbar"></SnackBar>
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
import SnackBar from "./snack/SnackBar";
import EventBus from "./event-bus";
import store from "../store";
import Utils from "./utils/Utils";

export default {
  components: {
    SnackBar,
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
  methods: {
    async initDashboard() {
      /**
       * - cookie 혹은 localStorage에 member data확인
       * - 1명 이상일경우, 선택할 수있는 popup
       * - 1명일경우 해당 사용자로 사용
       * - 없을경우 DB에서 조회 google login
       *
       */

      //RESOLVE : 어떠한 액션이 있을경우 reload를 한다. 이후, 항상 이 구간을 지나기 때문에 사용여부/loginInfo 의 값에 대한 validation 체크는 자동으로 이루어진다.
      //todo : 단, global emit을 통해, 열려있는 창에 대한 변경사항에 대한 update는 해주어야한다.
      CONTENT_LISTENER.sendMessage({
        type: "get.all.members",
        data: null
      }).then(members => {
        if (members === undefined || members.length === 0) {
          this.$refs.signDialog.open();
        } else {
          //member중 isUse가 'Y' 인것들.
          let result = members.filter(member => {
            return member.IS_USE === "Y";
          });
          //this.$refs.selectMemberDialog.open(members);
          if (result.length === 0) {
            //사용자 선택
            this.$refs.selectMemberDialog.open(members);
          } else {
            //로그인 정보를 localStorage에 저장해둔다.
            chrome.storage.local.set({
              loginInfo: result[0]
            });

            //전역에 저장한다.
            this.member = result[0];

            //MenuPage 초기화
            this.$refs.menuPage.getReloadCategory();

            //ContentBody 초기화
            this.$refs.contentBody.getSites(new Object());

            //todo : global emit 발생
          }
        }
      });

      //새탭을 열면서, 기존에 있는 탭은 제거한다.
      chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        let count = 0;
        chrome.tabs.query({}, tabs => {
          tabs.map(item => {
            if (
              currentTab[0].id !== item.id &&
              currentTab[0].url === item.url
            ) {
              chrome.tabs.remove(item.id);
              count++;
            }
          });
          if (count !== 0) {
            this.$refs.snackbar.open(
              "기존에 열려있는 Dashboard Tab은 닫았습니다.",
              "warning"
            );
          }
        });
      });
    }
  },
  created() {
    this.$nextTick(() => {
      chrome.storage.local.get(["options"], result => {
        let options = result.options;

        if (options === undefined || options.THEME === "dark") {
          this.$vuetify.theme.dark = true;
        } else {
          this.$vuetify.theme.dark = false;
        }
      });

      //Snack열기
      EventBus.$on("open.snack", (message, color) => {
        this.$refs.snackbar.open(message, color);
      });

      EventBus.$on("init.dashboard", () => {
        this.initDashboard();
      });
      this.initDashboard();
    });
  }
};
</script>
