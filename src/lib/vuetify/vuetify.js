import Vue from "vue";
import Vuetify, {
  VRadio,
  VRadioGroup,
  VSnackbar,
  VHover,
  VExpandTransition,
  VToolbar,
  VToolbarItems,
  VToolbarTitle,
  VCheckbox,
  VDialog,
  VWindow,
  VWindowItem,
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
  VListGroup,
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

Vue.component("VSnackbar", VSnackbar);
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
Vue.component("VListGroup", VListGroup);
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

Vue.component("VWindow", VWindow);
Vue.component("VWindowItem", VWindowItem);

Vue.component("VDialog", VDialog);

Vue.component("VToolbar", VToolbar);
Vue.component("VToolbarItems", VToolbarItems);
Vue.component("VToolbarTitle", VToolbarTitle);
Vue.component("VCheckbox", VCheckbox);
Vue.component("VHover", VHover);
Vue.component("VExpandTransition", VExpandTransition);
Vue.component("VRadio", VRadio);
Vue.component("VRadioGroup", VRadioGroup);

//mcfibeekphjjdkofnojkofeligacaemn
const opts = {
  theme: { dark: false },
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
