<template>
  <v-app>
    <AppBarPage ref="appBarPage" :member="member" />
    <MenuPage ref="menuPage" />
    <v-content>
      <v-container fluid class="pt-0 mt-0">
        <ContentBody ref="contentBody"></ContentBody>
      </v-container>
    </v-content>

    <SignDialog ref="signDialog"></SignDialog>
    <SelectMemberDialog ref="selectMemberDialog"></SelectMemberDialog>
    <SnackBar ref="snackbar"></SnackBar>
    <NotificationSnackBar ref="notification"></NotificationSnackBar>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
    <v-overlay :value="overlay.status">
      <v-progress-circular indeterminate size="64"
        >{{ overlay.message }}
      </v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";

import ContentBody from "./content/ContentBody";
import AppBarPage from "./layout/AppBarPage";
import CONTENT_LISTENER from "../common/content-listener";
import SignDialog from "./layout/dialog/SignDialog";
import SelectMemberDialog from "./layout/dialog/SelectMemberDialog";
import SnackBar from "./snack/SnackBar";
import EventBus from "./event-bus";
import Utils from "./utils/Utils";
import GOOGLE_DRIVE from "../common/GoogleDriveBackupAndRestore";
import NotificationSnackBar from "./snack/NotificationSnackBar";
import MODAL from "../common/modal";
import RestoreProcessArea from "./dialog/setting/backup/RestoreProcessArea";
import Common from "../common/common";
import LANG from "../common/language";

export default {
  components: {
    RestoreProcessArea,
    NotificationSnackBar,
    SnackBar,
    SelectMemberDialog,
    SignDialog,
    AppBarPage,
    ContentBody,
    MenuPage
  },
  data: () => ({
    member: {
      EMAIL: "",
      IMAGE_URL: null
    },
    overlay: {
      status: false,
      message: "loading.."
    },
    restoreTargetData: null,
    LANG: LANG
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
          console.log("###");
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
            this.$refs.contentBody.getSites("init");

            //todo : global emit 발생
          }
        }
      });
    },
    openUpdateInfomation() {
      //update라면 update 리스트를 열어준다.
      location.search
        .split(/[?&]/)
        .slice(1)
        .map(paramPair => {
          if (paramPair === "update") {
            this.$refs.appBarPage.showInfo();
          } else if (paramPair === "tabgroup") {
            this.$refs.appBarPage.showOnetab();
          }
        });

      //새탭을 열면서, 기존에 있는 탭은 제거한다.
      Common.closeDuplicateDashboard();
    },
    async runRestore() {
      let confirm = LANG.DESCRIPTION_MESSAGE("C0008");
      let conf = await MODAL.alert(confirm, "info", null, "500px");
      if (conf.value) {
        GOOGLE_DRIVE.getBackupData(this.restoreTargetData).then(
          originalText => {
            this.$refs.restoreProcessArea.open(originalText);
          }
        );
      }
    },
    async autoRestoreProcess() {
      let result = await Utils.getLocalStorage("loginInfo");
      let BACKUP_FOLDER_ID = await GOOGLE_DRIVE.getBackupFolderId();

      if (result.loginInfo === undefined) return false;
      let param = new Object();
      param.EMAIL = result.loginInfo.EMAIL;
      CONTENT_LISTENER.sendMessage({
        type: "get.update.history",
        data: param
      }).then(res => {
        let UPDATE_HISTORY = res[0];
        console.log("UPDATE_HISTORY ", UPDATE_HISTORY);
        if (UPDATE_HISTORY.LATEST_GOOGLE_RESTORE_DATE === null) {
          //복구 noti 표시
          if (BACKUP_FOLDER_ID) {
            GOOGLE_DRIVE.executeGoogleDriveRestore().then(async list => {
              if (list) {
                this.restoreTargetData = list[0];
                this.$refs.notification.open();
              }
            });
          }
        }
      });
    }
  },
  mounted() {},
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

      EventBus.$on("run.restore", (message, color) => {
        this.runRestore();
      });

      //Snack열기
      EventBus.$on("open.snack", (message, color) => {
        this.$refs.snackbar.open(message, color);
      });

      EventBus.$on("init.dashboard", () => {
        this.initDashboard();
      });

      EventBus.$on("open.full.overlay.loading", message => {
        this.overlay.status = true;
        this.overlay.message = message;
      });
      EventBus.$on("close.full.overlay.loading", () => {
        this.overlay.status = false;
      });

      //대쉬보드 초기화
      this.initDashboard();

      //업데이트 내역을 보여준다.
      this.openUpdateInfomation();

      setTimeout(() => {
        //복구여부 프로세스
        //this.autoRestoreProcess();
      }, 2000);
    });
  }
};
</script>
<style>
.v-navigation-drawer__content,
.custom-scroll {
  overflow: auto;
}

.v-navigation-drawer__content::-webkit-scrollbar,
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb,
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #656466;
  border-radius: 5px;
}

.v-navigation-drawer__content::-webkit-scrollbar-track,
.custom-scroll::-webkit-scrollbar-track {
  /*background-color: grey;*/
  background: none;
  border-radius: 10px;
}
</style>
