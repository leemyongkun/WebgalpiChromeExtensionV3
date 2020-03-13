<!--사용하지 않음 : nouse-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- 다이얼로그 -->
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-row>
        <v-col cols="6">
          <v-list three-line subheader>
            <v-subheader>General</v-subheader>

            <v-expansion-panels focusable accordion>
              <!--THEME-->
              <ThemeArea></ThemeArea>
              <!--SLACK-->
              <SlackArea></SlackArea>
              <!--COLOR-->
              <ColorArea></ColorArea>
            </v-expansion-panels>
          </v-list>
        </v-col>

        <v-col cols="6">
          <v-btn color="secondary" fab x-small dark @click="backupDownload">
            <v-icon>mdi-television</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
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
