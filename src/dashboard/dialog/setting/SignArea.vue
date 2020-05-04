<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="300px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>SignOut</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            로그아웃 하시겠습니까?
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">닫기</v-btn>
        <v-btn small color="blue" text @click="logout">로그아웃</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";

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
      chrome.storage.local.get(["loginInfo"], result => {
        let param = ["N", result.loginInfo.EMAIL];
        CONTENT_LISTENER.sendMessage({
          type: "update.member.use",
          data: param
        }).then(() => {
          EventBus.$emit("init.dashboard");
          this.dialog = false;
        });
      });
    }
  }
};
</script>
