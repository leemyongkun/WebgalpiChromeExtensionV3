<template>
  <v-app>
    <v-card id="scroll-target" max-width="490">
      <v-tabs vertical>
        <v-tab>
          <v-icon color="green">mdi-web</v-icon>
        </v-tab>
        <v-tab>
          <v-icon color="blue">mdi-grease-pencil</v-icon>
        </v-tab>
        <v-tab-item
          class="mx-auto overflow-y-auto"
          v-scroll:#scroll-target="onScroll"
          :style="style"
        >
          <SiteInfoTab></SiteInfoTab>
        </v-tab-item>
        <v-tab-item
          class="mx-auto overflow-y-auto"
          v-scroll:#scroll-target="onScroll"
          :style="style"
        >
          <HighlightTab></HighlightTab>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-app>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";

export default {
  components: {
    HighlightTab,
    SiteInfoTab
  },
  data: () => ({
    tab: null,
    items: ["SITE", "HIGHLIGHT"],
    offsetTop: 0,
    style: "max-height: 390px; height: 463px; width: 400px;"
  }),
  created() {},
  methods: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    }
  },
  mounted() {}
};
</script>
<style>
.v-tab {
  min-width: 40px !important;
}
</style>
