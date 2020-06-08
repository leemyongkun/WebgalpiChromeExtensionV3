<template>
  <v-dialog
    v-model="loginDialog"
    persistent
    overlay-opacity="10"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline" v-if="signInProcess === 1"
        >Google 계정 등록을 하셨나요?
      </v-card-title>
      <v-card-text v-if="signInProcess === 1">
        WEBGALPI를 사용하기 위해, Google 계정으로 로그인을 하셔야 합니다.<br />
        데이타 백업으로 GOOGLE DRIVE를 사용합니다.
      </v-card-text>

      <v-card-title class="headline" v-if="signInProcess === 2"
        >Google 계정 인증이 정상완료 되었습니다.
      </v-card-title>
      <v-card-text v-if="signInProcess === 2">
        [ <b>{{ googleEmail }}</b> ]님 WEBGALPI에 오신것을 환영합니다.<br />
        WEBGALPI에서 사용할 PASSWORD를 입력해주세요.<br />
        <span style="color: red;">계정변경 및 백업/복구</span>에 사용합니다.<br /><br />
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
          >구글 로그인
        </v-btn>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 2"
          text
          @click="anotherMember"
          >다른계정으로 변경하기
        </v-btn>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 2"
          text
          @click="checkMember"
          >등록
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
    backupOverlay: false
  }),
  methods: {
    googleSignin() {
      this.backupOverlay = true;
      let accountGoogleLogin = () => {
        ACCOUNT.googleLogin()
          .then(accountInfo => {
            if (accountInfo === null) {
              alert("구글 계정 로그인 에러");
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
          })
        ];

        let confirm = `<b>계정등록을 완료 했습니다.</b><br><br>
                                  WEBGALPI 즉시 반영하기 위해서는, <br>
                                  열려있는 모든 페이지를 새로고침 해야합니다.<br>
                                  진행 하시겠습니까?<br><br>
                                  <span style="color: red;">※ 한번에 새로고침을 진행합니다.</span>
                                    `;
        let conf = await MODAL.confirm(confirm, null, null, null, "450px");
        if (conf.value === undefined) {
          location.reload();
        } else {
          Promise.all(initEnvironment).then(values => {
            CONTENT_LISTENER.sendMessage({
              type: "reload.all.tab",
              data: null
            });
          });
        }
      } else {
        alert("계정정보가 존재 하지 않습니다.");
      }
    },
    checkMember() {
      /*if (!this.$refs.form.validate()) {
                                        return false;
                                    }*/

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
            EventBus.$emit("open.snack", "이미 존재하는 계정입니다.", "red");
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
