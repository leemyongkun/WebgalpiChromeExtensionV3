<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="300px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>{{ LANG.DESCRIPTION_MESSAGE("D0051") }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            {{ LANG.DESCRIPTION_MESSAGE("D0052") }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">{{
          LANG.BUTTON_MESSAGE("B0012")
        }}</v-btn>
        <v-btn small color="blue" text @click="logout">{{
          LANG.BUTTON_MESSAGE("B0002")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import ACCOUNT from "../../../common/account";
import LANG from "../../../common/language";

export default {
  props: [],
  data: () => ({
    dialog: false,
    LANG: LANG
  }),
  created() {},
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    logout() {
      chrome.storage.local.get(["loginInfo"], result => {
        let param = new Object();
        param.isUse = "N";
        param.EMAIL = result.loginInfo.EMAIL;

        CONTENT_LISTENER.sendMessage({
          type: "update.member.use",
          data: param
        }).then(() => {
          //대쉬보드 리프레시
          EventBus.$emit("init.dashboard");
          //현재 로그인 정보 제거
          chrome.storage.local.remove(["loginInfo"]);
          //구글 키 제거
          chrome.identity.getAuthToken({ interactive: true }, token => {
            ACCOUNT.removeGoogleTokenCache(token);
          });

          this.dialog = false;
        });
      });
    }
  }
};
</script>
