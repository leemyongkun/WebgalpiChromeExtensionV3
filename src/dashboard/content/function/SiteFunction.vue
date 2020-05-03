<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-btn @click="goSourceSite" icon>
      <v-icon>mdi-home-outline</v-icon>
    </v-btn>
    <!--<v-btn @click="print" icon v-if="previewStatus === 'Y'">
          <v-icon>mdi-printer</v-icon>
        </v-btn>-->
    <v-btn icon @click="shareFacebook">
      <v-icon>mdi-facebook-box</v-icon>
    </v-btn>

    <ShareSlackDialog :currentSite="currentSite"></ShareSlackDialog>

    <DeleteSiteDialog :currentSite="currentSite"></DeleteSiteDialog>
    |
    <HighlightsWidget :highlights="highlights"></HighlightsWidget>
  </div>
</template>
<script>
let facebookUrl = "http://www.facebook.com/share.php?u=";
import ShareSlackDialog from "./dialog/ShareSlackDialog";
import DeleteSiteDialog from "./dialog/DeleteSiteDialog";
import HighlightsWidget from "./widget/HighlightsWidget";

export default {
  components: { HighlightsWidget, DeleteSiteDialog, ShareSlackDialog },
  props: [
    "previewStatus",
    "sourceUrl",
    "currentSite",
    "highlights",
    "reviewAreaHeightStyle"
  ],
  data: () => ({
    window: 0
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
      /*event.preventDefault();
                                    event.stopPropagation();*/
      let open = window.open(this.sourceUrl, "_blank");
      open.focus();
    }
  }
};
</script>
