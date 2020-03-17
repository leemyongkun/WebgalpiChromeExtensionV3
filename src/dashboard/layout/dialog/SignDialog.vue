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
        데이타 백업으로 Firebase를 사용예정이며, WEBGALPI는 한 PC에서 한명의
        사용자만 사용 가능합니다.
      </v-card-text>

      <v-card-title class="headline" v-if="signInProcess === 2"
        >Google 계정 인증이 정상완료 되었습니다.
      </v-card-title>
      <v-card-text v-if="signInProcess === 2">
        <span style="background: #cddc39">{{ googleEmail }}</span
        >님 WEBGALPI에 오신것을 환영합니다.<br />
        WEBGALPI에서 사용할 PASSWORD를 입력해주세요.<br />
        <span style="color: red;">데이타 백업/복구</span>에 사용합니다.<br /><br />
        <v-form ref="form">
          <v-text-field
            type="password"
            label="PASSWORD"
            v-model="password"
            outlined
            dense
            autofocus
            clearable
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
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
          @click="registerMember"
          >등록
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ACCOUNT from "../../../common/account";
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";

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
    }
  }),
  methods: {
    googleSignin() {
      let accountGoogleLogin = () => {
        ACCOUNT.googleLogin()
          .then(accountInfo => {
            console.log("accountInfo ", accountInfo);
            if (accountInfo === null) {
              alert("구글 계정 로그인 에러");
              return false;
            }
            this.accountInfo = accountInfo;
            this.googleEmail = accountInfo.email;
            this.signInProcess = 2;
          })
          .catch(err => {
            console.log("error ", err);
          });
      };
      this.isDisabled = true;

      chrome.storage.local.get(["googleToken"], result => {
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
        console.log("result ", result.googleToken);
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
    registerMember() {
      if (!this.$refs.form.validate()) {
        return false;
      }

      CONTENT_LISTENER.sendMessage({
        type: "get.all.members",
        data: null
      })
        .then(members => {
          //기존에 있는 계정인지 체크
          let result = members.filter(item => {
            return item.EMAIL === this.googleEmail;
          });

          if (result.length !== 0) {
            EventBus.$emit("open.snack", "이미 존재하는 계정입니다.", "red");
          } else {
            if (this.accountInfo !== null) {
              this.accountInfo.password = this.password;

              CONTENT_LISTENER.sendMessage({
                type: "init.data",
                data: this.accountInfo
              });
              CONTENT_LISTENER.sendMessage({
                type: "insert.member",
                data: this.accountInfo
              }).then(() => {
                location.reload();
              });
            } else {
              alert("계정정보가 존재 하지 않습니다.");
            }
          }
        })
        .then(() => {});
    },
    open() {
      this.loginDialog = true;
    }
  }
};
</script>
