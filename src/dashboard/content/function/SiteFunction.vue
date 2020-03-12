<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-btn @click="goSourceSite" icon>
      <v-icon>mdi-home-outline</v-icon>
    </v-btn>
    <!--<v-btn @click="print" icon v-if="previewStatus === 'Y'">
      <v-icon>mdi-printer</v-icon>
    </v-btn>-->
    <v-btn icon v-if="previewStatus === 'Y'" @click="shareFacebook">
      <v-icon>mdi-facebook-box</v-icon>
    </v-btn>

    <ShareSlackDialog
      :currentSite="currentSite"
      v-if="previewStatus === 'Y'"
    ></ShareSlackDialog>

    <DeleteSiteDialog :currentSite="currentSite"></DeleteSiteDialog>
    |
    <span>HIGHLIGHT</span>
  </div>
</template>
<script>
import ShareSlackDialog from "./dialog/ShareSlackDialog";
import DeleteSiteDialog from "./dialog/DeleteSiteDialog";
export default {
  components: { DeleteSiteDialog, ShareSlackDialog },
  props: ["previewStatus", "sourceUrl", "currentSite"],
  data: () => ({
    window: 0
  }),
  created() {},
  mounted() {},
  methods: {
    print() {},
    shareFacebook() {
      let shareUrl = "http://www.facebook.com/share.php?u=" + this.sourceUrl;
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
