<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-snackbar
    v-model="snackbar"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
    right
  >
    {{ snackbarMessage }}
    <v-btn dark text @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  components: {},

  data: () => ({
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    snackbarColor: "info"
  }),
  methods: {
    open(message, color) {
      this.snackbar = true;
      this.snackbarMessage = message;
      if (color !== undefined) {
        this.snackbarColor = color;
      }
    }
  }
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
