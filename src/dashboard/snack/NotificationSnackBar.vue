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
          <span class="subtitle-2"
            >최근 백업한 데이타가 있습니다.<br />복구를 진행하시겠습니까?</span
          >
        </v-col>
        <v-col class="shrink">
          <v-btn x-small @click="runRestore" text color="error accent-4">
            RESTORE
          </v-btn>
          <v-btn
            @click="showNotification = false"
            x-small
            text
            color="accent-4"
          >
            CLOSE
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>
<script>
import EventBus from "../event-bus";

export default {
  components: {},

  data: () => ({
    showNotification: false
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
