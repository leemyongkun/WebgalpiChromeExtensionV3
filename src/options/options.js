import { createApp } from "vue";
import App from "./App.vue";

import browser from "webextension-polyfill";
global.browser = browser;

const app = createApp(App);
app.mount("#app");
