import { createApp } from "vue";
import DetectPopupApp from "./DetectPopupApp";
import vuetify from "../lib/vuetify/vuetify";

// Import Vuetify compatibility CSS
import "../css/vuetify-compat.css";

const app = createApp(DetectPopupApp);
app.use(vuetify);
app.mount("#app");
