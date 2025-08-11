import { createApp } from "vue";
import PopupApp from "./PopupApp";
import vuetify from "../lib/vuetify/vuetify";
import _ from "lodash";

const app = createApp(PopupApp);
app.use(vuetify);

// Make lodash available globally
app.provide("$lodash", _);
app.config.globalProperties.$_ = _;

app.mount("#app");
