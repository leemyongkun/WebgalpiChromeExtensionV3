import Vue from "vue";
import VueLodash from "vue-lodash";
import DashboardApp from "./DashboardApp";
import vuetify from "../lib/vuetify/vuetify";

import { Drag, Drop } from "vue-drag-drop";

import VueYouTubeEmbed from "vue-youtube-embed";
Vue.use(VueYouTubeEmbed);

Vue.component("drag", Drag);
Vue.component("drop", Drop);

const lodashOption = { name: "lodash" };
Vue.use(VueLodash, lodashOption);

//global.browser = require("webextension-polyfill");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify,
  render: h => h(DashboardApp)
});
