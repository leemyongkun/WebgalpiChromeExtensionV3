<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-list-item-action>
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>Theme</v-list-item-title>
      <v-list-item-subtitle>
        <v-radio-group v-model="theme" row>
          <v-radio label="DARK" value="dark" @change="changeTheme"></v-radio>
          <v-radio label="LIGHT" value="light" @change="changeTheme"></v-radio>
        </v-radio-group>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";

export default {
  components: {},
  props: [],
  data: () => ({
    theme: "light"
  }),
  created() {},
  mounted() {
    if (this.$vuetify.theme.dark) this.theme = "dark";
  },
  methods: {
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      setTimeout(() => {
        CONTENT_LISTENER.sendMessage({
          type: "update.option.theme",
          data: [this.theme] //[todo] 2번째 파라메터는 Email 로 한다.
        }).then(response => {
          //option을 수정한다.
          chrome.storage.sync.get(["options"], result => {
            result.THEME = this.theme;
            chrome.storage.sync.set({ options: result });
          });
        });
      }, 500);
    }
  }
};
</script>
