<template>
  <v-app>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <SiteInfoTab v-show="tab === 0"></SiteInfoTab>
      <HighlightTab v-show="tab === 1"></HighlightTab>
    </v-tabs-items>

    <!-- <v-tabs vertical>
            <v-tab>
                <v-icon left>mdi-account</v-icon>
            </v-tab>
            <v-tab>
                <v-icon left>mdi-lock</v-icon>
            </v-tab>
            <v-tab-item>
                <SiteInfoTab></SiteInfoTab>
            </v-tab-item>
            <v-tab-item>
                <HighlightTab></HighlightTab>
            </v-tab-item>
        </v-tabs>-->
  </v-app>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg
import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";

export default {
  components: {
    SiteInfoTab,
    HighlightTab
  },
  data: () => ({
    tab: null,
    items: ["SITE", "HIGHLIGHT"]
  }),
  created() {},
  methods: {},
  mounted() {}
};
</script>
