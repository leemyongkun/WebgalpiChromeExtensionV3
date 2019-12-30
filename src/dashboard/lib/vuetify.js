import Vue from "vue";
import Vuetify, {
  VContent,
  VContainer,
  VApp,
  VIcon,
  VBadge,
  VChip,
  VAvatar,
  VListItemContent,
  VListItemTitle,
  VRow,
  VCol,
  VTooltip,
  VListItem,
  VListItemAction,
  VBtn,
  VNavigationDrawer,
  VAppBar,
  VAppBarNavIcon,
  VTextField,
  VSpacer,
  VDivider,
  VSubheader,
  VList
} from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

Vue.component("VNavigationDrawer", VNavigationDrawer);
Vue.component("VAppBar", VAppBar);
Vue.component("VAppBarNavIcon", VAppBarNavIcon);
Vue.component("VTextField", VTextField);
Vue.component("VSpacer", VSpacer);
Vue.component("VDivider", VDivider);
Vue.component("VSubheader", VSubheader);
Vue.component("VList", VList);
Vue.component("VContent", VContent);
Vue.component("VContainer", VContainer);
Vue.component("VApp", VApp);
Vue.component("VIcon", VIcon);
Vue.component("VBadge", VBadge);
Vue.component("VChip", VChip);
Vue.component("VAvatar", VAvatar);

Vue.component("VListItemContent", VListItemContent);
Vue.component("VListItemTitle", VListItemTitle);
Vue.component("VRow", VRow);
Vue.component("VCol", VCol);
Vue.component("VTooltip", VTooltip);

Vue.component("VListItem", VListItem);
Vue.component("VListItemAction", VListItemAction);
Vue.component("VBtn", VBtn);

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
