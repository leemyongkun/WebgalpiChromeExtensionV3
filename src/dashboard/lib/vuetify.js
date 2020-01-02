import Vue from "vue";
import Vuetify, {
  VTab,
  VTabs,
  VTabItem,
  VListItemAvatar,
  VSlideXReverseTransition,
  VTimeline,
  VTimelineItem,
  VImg,
  VCardTitle,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCard,
  VTreeview,
  VContent,
  VContainer,
  VApp,
  VIcon,
  VBadge,
  VChip,
  VAvatar,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
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
Vue.component("VListItemSubtitle", VListItemSubtitle);

Vue.component("VRow", VRow);
Vue.component("VCol", VCol);
Vue.component("VTooltip", VTooltip);

Vue.component("VListItem", VListItem);
Vue.component("VListItemAction", VListItemAction);
Vue.component("VBtn", VBtn);

Vue.component("VTreeview", VTreeview);

Vue.component("VCard", VCard);
Vue.component("VCardTitle", VCardTitle);
Vue.component("VCardActions", VCardActions);
Vue.component("VCardSubtitle", VCardSubtitle);
Vue.component("VCardText", VCardText);
Vue.component("VImg", VImg);

Vue.component("VTimeline", VTimeline);
Vue.component("VTimelineItem", VTimelineItem);
Vue.component("VSlideXReverseTransition", VSlideXReverseTransition);
Vue.component("VListItemAvatar", VListItemAvatar);

Vue.component("VTab", VTab);
Vue.component("VTabs", VTabs);
Vue.component("VTabItem", VTabItem);
//mcfibeekphjjdkofnojkofeligacaemn
const opts = {
  theme: { dark: true },
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
