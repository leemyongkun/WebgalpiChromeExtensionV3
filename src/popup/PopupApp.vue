<template>
  <v-app>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <SiteInfoTab></SiteInfoTab>
    </v-tabs-items>

    <!--<b-card no-body>
          <b-tabs card>
            <b-tab title="SITE INFO">
              <SiteInfoTab></SiteInfoTab>
            </b-tab>

            <b-tab no-body title="HIGHLIGHT">
              <HighlightTab></HighlightTab>
            </b-tab>
          </b-tabs>
        </b-card>-->
  </v-app>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg
import SiteInfoTab from "./tabs/SiteInfoTab";
//import HighlightTab from "./tabs/HighlightTab";

export default {
  components: {
    SiteInfoTab
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
