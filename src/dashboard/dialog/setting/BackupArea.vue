<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" scrollable max-width="300px">
    <v-card>
      <v-card-title>백업/복구</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        backup / restore
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
    }
  }
};
</script>
