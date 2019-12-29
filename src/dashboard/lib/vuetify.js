import Vue from "vue";
import Vuetify, {
  VContent,
  VContainer,
  VApp,
  VIcon,
  VBadge,
  VChip,
  VAvatar
} from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);
Vue.component("VContent", VContent);
Vue.component("VContainer", VContainer);
Vue.component("VApp", VApp);
Vue.component("VIcon", VIcon);
Vue.component("VBadge", VBadge);
Vue.component("VChip", VChip);
Vue.component("VAvatar", VAvatar);

//mcfibeekphjjdkofnojkofeligacaemn
const opts = {
  theme: false,
  themes: {
    light: {
      primary: "#4682b4",
      secondary: "#b0bec5",
      accent: "#8c9eff",
      error: "#b71c1c"
    }
  }
};

export default new Vuetify(opts);
