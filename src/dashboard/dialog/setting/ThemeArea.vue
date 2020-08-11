<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="300px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>{{ LANG.DESCRIPTION_MESSAGE("D0050") }}</v-card-title>
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
        <v-btn small color="blue" text @click="close">{{
          LANG.BUTTON_MESSAGE("B0012")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";
import LANG from "../../../common/language";

export default {
  props: [],
  data: () => ({
    theme: "light",
    dialog: false,
    LANG: LANG
  }),
  created() {},
  mounted() {
    this.$nextTick(() => {
      chrome.storage.local.get(["options"], result => {
        this.theme = result.options.THEME;
      });
    });
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async changeTheme() {
      let result = await Utils.getLocalStorage("loginInfo");

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
          if (this.theme === "light") {
            this.$vuetify.theme.dark = false;
          } else {
            this.$vuetify.theme.dark = true;
          }

          EventBus.$emit(
            "open.snack",
            this.theme + LANG.SNACK_MESSAGE("S0018"),
            "success"
          );
        });
    }
  }
};
</script>
