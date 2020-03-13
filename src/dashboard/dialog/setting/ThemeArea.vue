<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>THEME 설정</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-radio-group v-model="theme">
            <v-radio label="DARK" value="dark" @change="changeTheme"></v-radio>
            <v-radio
              label="LIGHT"
              value="light"
              @change="changeTheme"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="close">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";

export default {
  props: [],
  data: () => ({
    theme: "light",
    dialog: false
  }),
  created() {},
  mounted() {
    if (this.$vuetify.theme.dark) this.theme = "dark";
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    changeTheme() {
      this.$nextTick(() => {
        CONTENT_LISTENER.sendMessage({
          type: "update.option.theme",
          data: [this.theme] //[todo] 2번째 파라메터는 Email 로 한다.
        })
          .then(response => {
            //option을 수정한다.
            chrome.storage.local.get(["options"], result => {
              result.THEME = this.theme;
              chrome.storage.local.set({ options: result });
            });
          })
          .then(() => {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            EventBus.$emit(
              "open.snack",
              this.theme + "로 테마가 변경되었습니다."
            );
          });
      });
    }
  }
};
</script>
