import Vue from "vue";
import DashboardApp from "./DashboardApp";

//global.browser = require("webextension-polyfill");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(DashboardApp)
});
