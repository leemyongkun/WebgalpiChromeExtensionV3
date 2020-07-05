<!--사용하지 않음 : nouse-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- 다이얼로그 -->
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
    overlay-opacity="0.9"
  >
  </v-dialog>
  <!-- 다이얼로그 -->
</template>
<script>
import SlackArea from "./setting/SlackArea";
import ThemeArea from "./setting/ThemeArea";
import ColorArea from "./setting/ColorArea";

export default {
  components: { ColorArea, ThemeArea, SlackArea },
  props: ["dialog"],
  data: () => ({
    notifications: false,
    widgets: false,
    color1: "ff90c3"
  }),
  created() {},
  mounted() {},
  methods: {
    backupDownload() {
      let obj = new Object();
      let filename = "test.json";

      obj.category = this.category;
      let ele = document.createElement("a");
      ele.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(JSON.stringify(obj))
      );
      ele.setAttribute("download", filename);

      ele.style.display = "none";
      document.body.appendChild(ele);
      ele.click();
      document.body.removeChild(ele);
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
