import { createApp } from "vue";
import PopupApp from "./PopupApp";
import vuetify from "../lib/vuetify/vuetify";

const app = createApp(PopupApp);
app.use(vuetify);
app.mount("#app");
