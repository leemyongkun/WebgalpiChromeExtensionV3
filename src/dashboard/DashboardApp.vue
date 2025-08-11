<template>
  <v-app>
    <AppBarPage ref="appBarPage" :member="member" />
    <MenuPage ref="menuPage" />
    <v-main class="content">
      <v-container class="fluid pt-0 mt-0">
        <ContentBody ref="contentBody"></ContentBody>
      </v-container>
    </v-main>

    <SignDialog ref="signDialog"></SignDialog>
    <SelectMemberDialog ref="selectMemberDialog"></SelectMemberDialog>
    <snack-bar ref="snackbar"></snack-bar>
    <NotificationSnackBar ref="notification"></NotificationSnackBar>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
    <div class="overlay" v-show="overlay.status">
      <div class="progress-circular">{{ overlay.message }}</div>
    </div>

    <!-- 임시 데이터 초기화 버튼 -->
    <div style="position: fixed; top: 10px; right: 10px; z-index: 9999;">
      <button
        @click="clearAllData"
        style="background: red; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;"
      >
        🔄 데이터 초기화
      </button>
    </div>
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
  name: "DashboardApp",
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
  data() {
    return {
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
    };
  },
  async mounted() {
    console.log(
      "DashboardApp mounted, methods available:",
      typeof this.initDashboard
    );

    // EventBus 이벤트 등록
    EventBus.$on("run.restore", (message, color) => {
      this.runRestore();
    });

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

    try {
      // DOM이 완전히 준비된 후 실행
      await this.$nextTick();

      // 대쉬보드 초기화
      await this.initDashboard();

      // 업데이트 내역을 보여준다.
      this.openUpdateInfomation();

      setTimeout(() => {
        // 복구여부 프로세스
        // this.autoRestoreProcess();
      }, 2000);
    } catch (error) {
      console.error("Error in DashboardApp mounted:", error);
    }
  },
  methods: {
    async initDashboard() {
      console.log("initDashboard called successfully!");

      try {
        // Check for URL parameter to force reset
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("reset") === "true") {
          this.clearAllData();
          return;
        }

        // Debug: Check what's actually in storage
        chrome.storage.local.get(null, allData => {
          console.log("🔍 All storage data:", allData);
          console.log("🔍 Storage keys:", Object.keys(allData));
        });

        const members = await CONTENT_LISTENER.sendMessage({
          type: "get.all.members",
          data: null
        });
        console.log("🔍 getAllMembers result:", members);
        document.body.classList.add("theme-dark");

        if (members === undefined || members.length === 0) {
          console.log("🔍 No members found, opening sign dialog");
          this.$refs.signDialog.open();
        } else {
          let result = members[0];
          this.member.EMAIL = result.EMAIL;
          this.member.IMAGE_URL = result.IMAGE_URL;

          if (result.EMAIL !== "" && result.EMAIL !== undefined) {
            setTimeout(async () => {
              let loginResult = await Utils.getLocalStorage("loginInfo");
              if (loginResult.loginInfo) {
                return false;
              }
              let param = new Object();
              param.EMAIL = result.EMAIL;

              CONTENT_LISTENER.sendMessage({
                type: "get.option",
                data: param
              }).then(ret => {
                if (!ret || ret.length === 0) {
                  return false;
                }
                let options = ret[0] || {};

                if (options === undefined || options.THEME === "dark") {
                  document.body.classList.add("theme-dark");
                } else {
                  document.body.classList.remove("theme-dark");
                }

                LANG.setLanguage(options.LANGUAGE || "KR");
              });
            }, 0);
          }
        }
      } catch (error) {
        console.error("Error in initDashboard:", error);
        // 에러가 발생해도 앱이 계속 실행되도록 함
        document.body.classList.add("theme-dark");
        this.$refs.signDialog?.open();
      }
    },

    openUpdateInfomation() {
      try {
        // 더 안전한 URL 파라미터 검사
        const search = window.location.search || "";
        if (search) {
          const params = new URLSearchParams(search);

          if (params.has("update")) {
            this.$refs.appBarPage?.showInfo();
          } else if (params.has("tabgroup")) {
            this.$refs.appBarPage?.showOnetab();
          }
        }
      } catch (error) {
        console.log("URL parameter parsing error:", error);
      }

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

    async clearAllData() {
      console.log("🔄 Clearing all extension data...");

      try {
        // Clear chrome.storage.local
        await new Promise(resolve => {
          chrome.storage.local.clear(() => {
            console.log("✅ Chrome storage cleared");
            resolve();
          });
        });

        // Clear localStorage if any
        localStorage.clear();
        console.log("✅ LocalStorage cleared");

        // Show reset complete message
        alert("모든 데이터가 초기화되었습니다. 새로 로그인해주세요.");

        // Reload without reset parameter
        window.location.href = window.location.pathname;
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("데이터 초기화 중 오류가 발생했습니다.");
      }
    }
  }
};
</script>

<style>
@import "../css/vuetify-compat.css";

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circular {
  color: white;
  font-size: 18px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.fluid {
  width: 100%;
  max-width: none;
}

.pt-0 {
  padding-top: 0;
}

.mt-0 {
  margin-top: 0;
}
</style>
