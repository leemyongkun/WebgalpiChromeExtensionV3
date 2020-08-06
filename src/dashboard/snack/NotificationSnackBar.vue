<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div align="right" style="padding-right: 12px">
    <v-alert
      v-model="showNotification"
      outlined
      color="info"
      text
      width="20%"
      dense
      class="pt-0 pb-0"
    >
      <v-row align="center">
        <v-col>
          <span class="subtitle-2" v-html="LANG.DESCRIPTION_MESSAGE('D0073')">
          </span>
        </v-col>
        <v-col class="shrink">
          <v-btn x-small @click="runRestore" text color="error accent-4">
            {{ LANG.BUTTON_MESSAGE("B0020") }}
          </v-btn>
          <v-btn
            @click="showNotification = false"
            x-small
            text
            color="accent-4"
          >
            {{ LANG.BUTTON_MESSAGE("B0012") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>
<script>
import EventBus from "../event-bus";
import LANG from "../../common/language";

export default {
  components: {},

  data: () => ({
    showNotification: false,
    LANG: LANG
  }),
  methods: {
    open() {
      this.showNotification = true;
    },
    runRestore() {
      EventBus.$emit("run.restore");
    }
  }
};
</script>
