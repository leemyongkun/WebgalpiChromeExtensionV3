<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card flat>
    <v-card-text>
      <v-row class="mb-4" align="center">
        <strong class="title">{{ previewTitle }}</strong>
        <v-spacer></v-spacer>
        <!-- SiteFunction :previewStatus="previewStatus" / -->
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row :style="reviewAreaHeightStyle" class="overflow-y-auto">
        <v-timeline :dense="true">
          <v-timeline-item
            v-for="item in highlights"
            :color="convertColor(item.COLOR)"
            :key="item.IDX"
            :fill-dot="true"
            :hide-dot="false"
            :small="true"
          >
            <span slot="opposite">Tus eu perfecto</span>
            <v-card class="elevation-2">
              <v-card-text>
                {{ item.PRINT_TEXT }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import SiteFunction from "./function/SiteFunction";
import Common from "../../common/common";

export default {
  components: { SiteFunction },
  props: [
    "previewContent",
    "previewTitle",
    "previewStatus",
    "highlights",
    "reviewAreaHeightStyle"
  ],
  data: () => ({}),
  created() {},
  methods: {
    convertColor(color) {
      return Common.getConvertColor(color);
    }
  }
};
</script>
