<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-expansion-panel>
    <v-expansion-panel-header>
      THEME : 색상 커스텀 할 수 있도록 개발 진행중
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-radio-group v-model="theme" row>
        <v-radio label="DARK" value="dark" @change="changeTheme"></v-radio>
        <v-radio label="LIGHT" value="light" @change="changeTheme"></v-radio>
      </v-radio-group>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import SnackBar from "../../snack/SnackBar";
export default {
  components: { SnackBar },
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
            this.snackbarMessage = "테마가 변경되었습니다."; //스낵바 기본 메시지
            this.snackbar = true; //스낵바 open /close 여부
          });
      });
    }
  }
};
</script>
