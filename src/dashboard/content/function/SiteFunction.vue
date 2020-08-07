<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-tooltip v-model="tooltip.source" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn @click="goSourceSite" icon v-on="on">
          <v-icon>mdi-home-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0018") }}</span>
    </v-tooltip>

    <!--<v-btn @click="print" icon v-if="previewStatus === 'Y'">
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>-->

    <v-tooltip v-model="tooltip.facebook" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="shareFacebook" v-on="on">
          <v-icon>mdi-facebook-box</v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0019") }}</span>
    </v-tooltip>

    <v-tooltip v-model="tooltip.trashbox" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="deleteSite" v-on="on">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0020") }}</span>
    </v-tooltip>

    |
    <HighlightsWidget
      :highlights="highlights"
      :currentSite="currentSite"
    ></HighlightsWidget>
  </div>
</template>
<script>
import MODAL from "../../../common/modal";
import HighlightsWidget from "./widget/HighlightsWidget";
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Common from "../../../common/common";
import LANG from "../../../common/language";

let facebookUrl = "http://www.facebook.com/share.php?u=";
export default {
  components: { HighlightsWidget },
  props: [
    "previewStatus",
    "sourceUrl",
    "currentSite",
    "highlights",
    "reviewAreaHeightStyle"
  ],
  data: () => ({
    window: 0,
    tooltip: {
      source: false,
      facebook: false,
      trashbox: false
    },
    LANG: LANG
  }),
  created() {},
  mounted() {},
  methods: {
    print() {},
    shareFacebook() {
      let shareUrl = facebookUrl + this.sourceUrl;
      window.open(
        shareUrl,
        "",
        "width=370, height=360, resizable=no, scrollbars=no, status=no;"
      );
    },
    goSourceSite() {
      let open = window.open(this.sourceUrl, "_blank");
      open.focus();
    },
    async deleteSite() {
      let confirm = LANG.CONFIRM_MESSAGE("C0004");
      let result = await MODAL.confirm(
        confirm,
        null,
        LANG.BUTTON_MESSAGE("B0011"),
        null,
        "400px"
      );
      if (result.value === undefined) return false;

      //모든 하이라이트 삭제
      await CONTENT_LISTENER.sendMessage({
        type: "delete.all.highlight",
        data: this.currentSite
      });

      //category에 포함된 사이트 삭제
      await CONTENT_LISTENER.sendMessage({
        type: "delete.site.in.category",
        data: this.currentSite
      });

      //사이트 삭제
      CONTENT_LISTENER.sendMessage({
        type: "delete.site",
        data: this.currentSite
      }).then(() => {
        //처음 저장 하므로 같은 사이트를 리로딩 한다.
        Common.reloadingSameSite(this.currentSite);
        EventBus.$emit("reload.category");
        EventBus.$emit("hideSite", this.currentSite.URL_KEY);
      });
    }
  }
};
</script>
