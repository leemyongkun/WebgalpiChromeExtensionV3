import Vue from "vue";
import PopupApp from "./PopupApp";
import vuetify from "../lib/vuetify/vuetify";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify,
  render: h => h(PopupApp)
});
