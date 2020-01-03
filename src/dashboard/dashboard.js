import Vue from "vue";
import DashboardApp from "./DashboardApp";
import vuetify from "../lib/vuetify/vuetify";

//global.browser = require("webextension-polyfill");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify,
  render: h => h(DashboardApp)
});
