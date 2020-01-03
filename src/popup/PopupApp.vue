<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="SITE INFO">
          <SiteInfoTab></SiteInfoTab>
        </b-tab>

        <b-tab no-body title="HIGHLIGHT">
          <HighlightTab :urlInfo="urlInfo"></HighlightTab>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg
import SiteInfoTab from "./tabs/SiteInfoTab";
import HighlightTab from "./tabs/HighlightTab";

export default {
  name: "App",
  components: {
    SiteInfoTab,
    HighlightTab
  },
  data() {
    return {
      urlInfo: null
    };
  },
  methods: {},
  mounted() {}
};
</script>
