import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/ko";

global.browser = require("webextension-polyfill");

Vue.use(ElementUI, { locale });
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
