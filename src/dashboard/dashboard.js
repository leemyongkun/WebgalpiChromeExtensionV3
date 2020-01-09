import Vue from "vue";
import DashboardApp from "./DashboardApp";
import vuetify from "../lib/vuetify/vuetify";

import { Drag, Drop } from "vue-drag-drop";

Vue.component("drag", Drag);
Vue.component("drop", Drop);

//global.browser = require("webextension-polyfill");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify,
  render: h => h(DashboardApp)
});
