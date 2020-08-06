<template>
  <v-dialog
    v-model="loginDialog"
    persistent
    overlay-opacity="10"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline" v-if="signInProcess === 1"
        >{{ LANG.DESCRIPTION_MESSAGE("D0062") }}
      </v-card-title>
      <v-card-text
        v-if="signInProcess === 1"
        v-html="LANG.DESCRIPTION_MESSAGE('D0063')"
      />

      <v-card-title class="headline" v-if="signInProcess === 2"
        >{{ LANG.DESCRIPTION_MESSAGE("D0065") }}
      </v-card-title>
      <v-card-text v-if="signInProcess === 2">
        [ <b>{{ googleEmail }}</b> ]<span
          v-html="LANG.DESCRIPTION_MESSAGE('D0064')"
        >
        </span>
        <v-text-field
          type="password"
          label="PASSWORD"
          v-model="password"
          outlined
          dense
          autofocus
          clearable
          @keyup.enter="passwordKeyUpEvent"
          :rules="[rules.required]"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 1"
          text
          :disabled="isDisabled"
          @click="googleSignin"
          >{{ LANG.BUTTON_MESSAGE("B0018") }}
        </v-btn>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 2"
          text
          @click="anotherMember"
          >{{ LANG.BUTTON_MESSAGE("B0019") }}
        </v-btn>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 2"
          text
          @click="checkMember"
          >{{ LANG.BUTTON_MESSAGE("B0013") }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay :value="backupOverlay">
      <v-progress-circular indeterminate size="32"></v-progress-circular>
    </v-overlay>
  </v-dialog>
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
    signInProcess: 1, //1 : 로그인 중 , 2: password 받아야함. 3. 완료
    googleEmail: "",
    password: "",
    rules: {
      required: value => !!value || "Required."
    },
    backupOverlay: false,
    LANG: LANG
  }),
  methods: {
    googleSignin() {
      this.backupOverlay = true;
      let accountGoogleLogin = () => {
        ACCOUNT.googleLogin()
          .then(accountInfo => {
            if (accountInfo === null) {
              MODAL.alert(LANG.ALERT_MESSAGE("A0010"), "error");
              return false;
            }
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
            console.log("error ", err);
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
        //입력한 비밀번호를 대입힌다.
        this.accountInfo.password = this.password;

        //카테고리의 최근IDX를 가져온다.
        let result = await CONTENT_LISTENER.sendMessage({
          type: "get.category.max.id",
          data: null
        });
        let categoryNewId;
        if (result === undefined || result[0].MAXID === null) {
          categoryNewId = 1;
        } else {
          categoryNewId = result[0].MAXID + 1;
        }

        let email = this.accountInfo.email;
        let initEnvironment = [
          CONTENT_LISTENER.sendMessage({
            type: "init.data.option",
            data: [email]
          }),
          CONTENT_LISTENER.sendMessage({
            type: "init.data.category",
            data: [email, email, categoryNewId, email, categoryNewId]
          }),
          CONTENT_LISTENER.sendMessage({
            type: "insert.member",
            data: this.accountInfo
          }),
          CONTENT_LISTENER.sendMessage({
            type: "insert.update.history",
            data: [email]
          })
        ];

        Promise.all(initEnvironment).then(async () => {
          this.isReloading();
        });
      } else {
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
