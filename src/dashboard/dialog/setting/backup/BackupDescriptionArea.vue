<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="550px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>
        {{ LANG.DESCRIPTION_MESSAGE("D0025") }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              outlined
              :label="LANG.DESCRIPTION_MESSAGE('D0026')"
              v-model="backupDescription"
              ref="backupDescriptionArea"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green" text @click="run">{{
          LANG.BUTTON_MESSAGE("B0009")
        }}</v-btn>
        <v-btn small color="blue" text @click="close">{{
          LANG.BUTTON_MESSAGE("B0010")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from "../../../event-bus";
import LANG from "../../../../common/language";

export default {
  components: {},
  props: [],
  data: () => ({
    dialog: false,
    backupDescription: "",
    LANG: LANG
  }),
  created() {},
  mounted() {},
  methods: {
    open() {
      this.backupDescription = new Date().format(
        LANG.DESCRIPTION_MESSAGE("D0027")
      );
      setTimeout(() => {
        this.$refs.backupDescriptionArea.focus();
      }, 100);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    run() {
      EventBus.$emit("run.backup", this.backupDescription);
      this.close();
    }
  }
};
</script>
