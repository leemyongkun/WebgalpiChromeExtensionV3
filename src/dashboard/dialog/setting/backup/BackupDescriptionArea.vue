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
        구글 드라이브로 백업을 진행하시겠습니까?
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              outlined
              label="간단한 Description을 입력하세요."
              v-model="backupDescription"
              ref="backupDescriptionArea"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green" text @click="run">RUN</v-btn>
        <v-btn small color="blue" text @click="close">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from "../../../event-bus";

export default {
  components: {},
  props: [],
  data: () => ({
    dialog: false,
    backupDescription: ""
  }),
  created() {},
  mounted() {},
  methods: {
    open() {
      this.backupDescription = "";
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
