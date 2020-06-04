import Vue from "vue";
import DetectPopupApp from "./DetectPopupApp";
import vuetify from "../lib/vuetify/vuetify";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify,
  render: h => h(DetectPopupApp)
});
