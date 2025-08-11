<template>
  <div v-if="loginDialog" class="dialog-overlay">
    <div class="dialog-card">
      <div class="dialog-title" v-if="signInProcess === 0">
        {{ LANG.DESCRIPTION_MESSAGE("D0000") }}
      </div>
      <div class="dialog-content" v-if="signInProcess === 0">
        <br />
        <button @click="setLanguage('EN')" class="lang-btn">English</button>
        <button @click="setLanguage('KR')" class="lang-btn">한국어</button>
        <button @click="setLanguage('JP')" class="lang-btn">日本語</button>
      </div>

      <div class="dialog-title" v-if="signInProcess === 1">
        {{ LANG.DESCRIPTION_MESSAGE("D0062") }}
      </div>
      <div
        class="dialog-content"
        v-if="signInProcess === 1"
        v-html="LANG.DESCRIPTION_MESSAGE('D0063')"
      />

      <div class="dialog-title" v-if="signInProcess === 2">
        {{ LANG.DESCRIPTION_MESSAGE("D0065") }}
      </div>
      <div class="dialog-content" v-if="signInProcess === 2">
        [ <b>{{ googleEmail }}</b> ]<span
          v-html="LANG.DESCRIPTION_MESSAGE('D0064')"
        >
        </span>
      </div>

      <div class="dialog-actions">
        <button
          v-if="signInProcess === 0"
          class="action-btn"
          :disabled="isDisabled"
          @click="signInProcess = 1"
        >
          {{ LANG.BUTTON_MESSAGE("B0015") }}
        </button>
        <button
          v-if="signInProcess === 1"
          class="action-btn"
          :disabled="isDisabled"
          @click="googleSignin"
        >
          {{ LANG.BUTTON_MESSAGE("B0018") }}
        </button>
        <button
          v-if="signInProcess === 2"
          class="action-btn secondary"
          @click="anotherMember"
        >
          {{ LANG.BUTTON_MESSAGE("B0019") }}
        </button>
        <button
          v-if="signInProcess === 2"
          class="action-btn"
          @click="checkMember"
        >
          {{ LANG.BUTTON_MESSAGE("B0013") }}
        </button>
      </div>
    </div>

    <div v-if="backupOverlay" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import ACCOUNT from "../../../common/account";
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import MODAL from "../../../common/modal";
import LANG from "../../../common/language";

export default {
  data: () => ({
    accountInfo: null,
    loginDialog: false,
    isDisabled: false,
    signInProcess: 0, //0: 언어선택 , 1 : 로그인 중 , 2: password 받아야함. 3. 완료
    googleEmail: "",
    password: "0000",
    rules: {
      required: value => !!value || "Required."
    },
    backupOverlay: false,
    LANG: LANG
  }),
  methods: {
    setLanguage(lang) {
      LANG.setLanguage(lang);
    },
    googleSignin() {
      this.backupOverlay = true;
      let accountGoogleLogin = () => {
        ACCOUNT.googleLogin()
          .then(accountInfo => {
            console.log("🔍 Google Login Result:", accountInfo);
            if (accountInfo === null) {
              console.error("❌ Google Login failed - null response");
              MODAL.alert(LANG.ALERT_MESSAGE("A0010"), "error");
              return false;
            }

            // 응답 데이터 확인
            console.log("✅ Google account info received:", {
              email: accountInfo.email,
              name: accountInfo.name,
              picture: accountInfo.picture,
              id: accountInfo.id
            });

            this.accountInfo = accountInfo;
            this.googleEmail = accountInfo.email;
            this.signInProcess = 2;

            CONTENT_LISTENER.sendMessage({
              type: "close.site",
              data: "https://www.google.com/"
            });
            this.backupOverlay = false;
          })
          .catch(err => {
            this.backupOverlay = false;
            console.error("❌ Google Login Error:", err);
          });
      };

      this.isDisabled = true;

      chrome.storage.local.get(["googleToken"], async result => {
        if (result.googleToken === undefined) {
          accountGoogleLogin();
        } else {
          chrome.identity.removeCachedAuthToken(
            { token: result.googleToken },
            () => {
              window
                .fetch(
                  "https://accounts.google.com/o/oauth2/revoke?token=" +
                    result.googleToken
                )
                .then(() => {
                  accountGoogleLogin();
                });
            }
          );
        }
      });
    },
    anotherMember() {
      chrome.storage.local.get(["googleToken"], result => {
        chrome.identity.removeCachedAuthToken(
          { token: result.googleToken },
          () => {
            window
              .fetch(
                "https://accounts.google.com/o/oauth2/revoke?token=" +
                  result.googleToken
              )
              .then(() => {
                this.googleSignin();
              });
          }
        );
      });
    },
    async registMember() {
      if (this.accountInfo !== null) {
        console.log(
          "🔍 Registering member with accountInfo:",
          this.accountInfo
        );

        // Google API 응답 형식에 맞게 멤버 데이터 구성
        const memberData = {
          EMAIL: this.accountInfo.email || "",
          name: this.accountInfo.name || this.accountInfo.given_name || "",
          IMAGE_URL: this.accountInfo.picture || null,
          password: this.password,
          isUse: "Y",
          date: new Date().getTime()
        };

        console.log("📝 Member data to save:", memberData);

        //카테고리의 최근IDX를 가져온다.
        let result = await CONTENT_LISTENER.sendMessage({
          type: "get.category.max.id",
          data: null
        });
        let categoryNewId;
        console.log("🔍 getCategoryMaxId result:", result);

        // 안전한 MAXID 처리
        if (
          !result ||
          !Array.isArray(result) ||
          result.length === 0 ||
          !result[0] ||
          result[0].MAXID === null ||
          result[0].MAXID === undefined
        ) {
          categoryNewId = 1;
          console.log("⚠️  Using default categoryNewId:", categoryNewId);
        } else {
          categoryNewId = result[0].MAXID + 1;
          console.log("✅ Using calculated categoryNewId:", categoryNewId);
        }

        let param = new Object();
        param.EMAIL = this.accountInfo.email;
        param.LANG = this.LANG.lang;
        param.categoryNewId = categoryNewId;

        let initEnvironment = [
          CONTENT_LISTENER.sendMessage({
            type: "init.data.option",
            data: param
          }),
          CONTENT_LISTENER.sendMessage({
            type: "init.data.category",
            data: param
          }),
          CONTENT_LISTENER.sendMessage({
            type: "insert.member",
            data: memberData // 구성한 memberData 사용
          }),
          CONTENT_LISTENER.sendMessage({
            type: "insert.update.history",
            data: param
          })
        ];

        Promise.all(initEnvironment).then(async () => {
          console.log("✅ Member registration completed");

          // 다이얼로그 닫기
          this.loginDialog = false;
          this.signInProcess = 0;

          // 성공 메시지 표시
          console.log("🎉 Registration successful - dialog closed");

          // 대시보드 새로고침
          setTimeout(() => {
            this.isReloading();
          }, 500);
        });
      } else {
        console.error("❌ Cannot register member - accountInfo is null");
        MODAL.alert(LANG.ALERT_MESSAGE("A0011"), "error");
      }
    },
    /* async isRestore() {
                         let BACKUP_FOLDER_ID = await GOOGLE_DRIVE.getBackupFolderId();
                         if (BACKUP_FOLDER_ID) {
                             GOOGLE_DRIVE.executeGoogleDriveRestore().then(async list => {
                                 if (list) {
                                     let confirm = `최근 백업한 데이타가 존재합니다.<br>복구하시겠습니까?<br><br>
                                                     복구 시 크롤링을 진행하며, 다소 시간이 걸릴수도 있습니다.<br><br>
                                                     <span style="color:red">
                                                     모든 데이타를 삭제한 후 복구를 진행하므로,<br>
                                                     절대 진행 도중 창을 닫거나, 새로고침을 하지 마세요!<br>
                                                      </span>
                                                     `;
                                     let conf = await MODAL.confirm(confirm, "info", null, null, "500px");
                                     if (conf.value) {
                                         GOOGLE_DRIVE.getBackupData(list[0]).then(originalText => {
                                             this.$refs.restoreProcessArea.open(originalText);
                                         })
                                     }
                                 }
                             });
                         }
                     },*/
    async isReloading() {
      let confirm = LANG.CONFIRM_MESSAGE("C0009");
      let conf = await MODAL.confirm(confirm, null, null, null, "450px");
      if (conf.value === undefined) {
        location.reload();
      } else {
        CONTENT_LISTENER.sendMessage({
          type: "reload.all.tab",
          data: null
        });
      }
    },
    checkMember() {
      if (this.password === "") {
        return false;
      }
      //신규 사용자 등록을 위해, 현재 모든 Member를 가져와 비교한다.
      CONTENT_LISTENER.sendMessage({
        type: "get.all.members",
        data: null
      })
        .then(async members => {
          //처음 가입일 경우
          if (members === undefined) {
            this.registMember();
            return false;
          }
          //기존에 있는 계정인지 체크
          let result = members.filter(item => {
            return item.EMAIL === this.googleEmail;
          });

          //이미 존재하면 에러.
          if (result.length !== 0) {
            EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0017"), "red");
          } else {
            this.registMember();
          }
        })
        .then(() => {});
    },
    passwordKeyUpEvent() {
      this.checkMember();
    },
    open() {
      this.loginDialog = true;
    },
    close() {
      this.loginDialog = false;
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.dialog-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  padding: 24px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.dialog-content {
  margin-bottom: 24px;
  color: #666;
  line-height: 1.6;
}

.lang-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 4px 8px 4px 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.lang-btn:hover {
  background: #5a6268;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}

.action-btn:hover {
  background: #218838;
}

.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dark theme support */
.theme-dark .dialog-card {
  background: #2d2d2d;
  color: white;
}

.theme-dark .dialog-title {
  color: #fff;
}

.theme-dark .dialog-content {
  color: #ccc;
}
</style>
