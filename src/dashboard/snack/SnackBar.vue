<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-snackbar
    v-model="snackbar"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
    top
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
  props: ["snackbar", "snackbarTimeout", "snackbarMessage"],
  data: () => ({
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    snackbarColor: "green"
  }),
  methods: {}
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
