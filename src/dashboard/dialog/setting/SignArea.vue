<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" scrollable max-width="300px">
    <v-card>
      <v-card-title>ACCOUNT</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        로그아웃 하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
        <v-btn small color="blue" text @click="logout">YES</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";

export default {
  props: [],
  data: () => ({
    dialog: false
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
      chrome.storage.local.get(["member"], result => {
        let param = ["N", result.member.EMAIL];
        CONTENT_LISTENER.sendMessage({
          type: "update.member.use",
          data: param
        }).then(() => {
          location.reload();
        });
      });

      /* chrome.storage.local.get(["googleToken"], result => {
                     chrome.identity.removeCachedAuthToken(
                         {token: result.googleToken},
                         () => {
                             window
                                 .fetch(
                                     "https://accounts.google.com/o/oauth2/revoke?token=" +
                                     result.googleToken
                                 )
                                 .then(() => {
                                     //todo : 현재 계정 IS_USE=N 로 수정하기
                                     alert("로그아웃 완료.다른 계정 띄우기");
                                 });
                         }
                     );
                 });*/
    }
  }
};
</script>
