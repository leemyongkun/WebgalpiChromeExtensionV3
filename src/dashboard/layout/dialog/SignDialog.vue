<template>
  <v-dialog
    v-model="loginDialog"
    persistent
    overlay-opacity="10"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline" v-if="signInProcess === 1"
        >Google 계정 등록을 하셨나요?</v-card-title
      >
      <v-card-text v-if="signInProcess === 1">
        WEBGALPI를 사용하기 위해, Google 계정으로 로그인을 하셔야 합니다.<br />
        데이타 백업으로 Google Drive 를 사용하며, 하나의 PC에서 여러명이 사용할
        경우 사용자로 데이타를 취급합니다.
      </v-card-text>

      <v-card-title class="headline" v-if="signInProcess === 2"
        >Google 계정 인증이 정상완료 되었습니다.</v-card-title
      >
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
          >Google SignIn
        </v-btn>
        <v-btn
          color="green darken-1"
          v-if="signInProcess === 2"
          text
          @click="registerMember"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ACCOUNT from "../../../common/account";
import CONTENT_LISTENER from "../../../common/content-listener";

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
      this.isDisabled = true;
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
    },
    registerMember() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      if (this.accountInfo !== null) {
        this.accountInfo.password = this.password;
        CONTENT_LISTENER.sendMessage({
          type: "insert.member",
          data: this.accountInfo
        }).then(() => {
          alert("등록이 완료 되었습니다.");
          this.$refs.form.reset();
          this.loginDialog = false;
        });
      } else {
        alert("계정정보가 존재 하지 않습니다.");
      }
    },
    open() {
      this.loginDialog = true;
    }
  }
};
</script>
