<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-window v-model="window" class="elevation-1" vertical>
    <v-window-item>
      <v-card flat>
        <v-card-text>
          <v-row class="mb-4" align="center">
            <strong class="title">{{ previewTitle }}</strong>
            <v-spacer></v-spacer>
            <SiteFunction :previewStatus="previewStatus" />
          </v-row>
          <v-row>
            <v-divider />
          </v-row>
          <v-row style="max-height: 570px" class="overflow-y-auto">
            <div v-html="previewContent"></div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
</template>
<script>
import SiteFunction from "./function/SiteFunction";
export default {
  components: { SiteFunction },
  props: ["previewContent", "previewTitle", "previewStatus"],
  data: () => ({
    window: 0
  }),
  created() {},
  mounted() {},
  methods: {
    print() {}
  }
};
</script>
<style>
.galpi-preview-area {
  width: 80%;
}
.galpi-preview-area img {
  min-height: 80%;
}
.galpi-preview-area svg {
  width: 30%;
}
</style>
