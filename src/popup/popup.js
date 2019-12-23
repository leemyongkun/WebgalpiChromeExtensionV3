import Vue from "vue";
import PopupApp from "./PopupApp";
import BootstrapVue from "bootstrap-vue";

//global.browser = require("webextension-polyfill");
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(PopupApp)
});
