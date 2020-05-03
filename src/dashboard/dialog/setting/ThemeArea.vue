<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" persistent scrollable max-width="300px">
    <v-card>
      <v-card-title>THEME 설정</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pb-0">
        <v-radio-group v-model="theme">
          <v-row>
            <v-col cols="6">
              <v-radio
                label="DARK"
                value="dark"
                @change="changeTheme"
              ></v-radio>
            </v-col>
            <v-col cols="6">
              <v-radio
                label="LIGHT"
                value="light"
                @change="changeTheme"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";

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
      this.$nextTick(async () => {
        let result = await Utils.getLocalStorage("loginInfo");
        //Highlight 내용 가져오기
        CONTENT_LISTENER.sendMessage({
          type: "update.option.theme",
          data: [this.theme, result.loginInfo.EMAIL]
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
