import { createApp } from "vue";
import DashboardApp from "./DashboardApp.vue";
import _ from "lodash";

// Import Vuetify compatibility CSS
import "../css/vuetify-compat.css";

// Import Vuetify stub
import vuetify from "../lib/vuetify/vuetify";

const app = createApp(DashboardApp);

// Use Vuetify stub
app.use(vuetify);

// Make lodash available globally
app.provide('$lodash', _);
app.config.globalProperties.$_ = _;

app.mount("#app");
