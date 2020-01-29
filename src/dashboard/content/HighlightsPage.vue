<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-window class="elevation-1" vertical>
    <v-window-item>
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

            <!--<v-timeline dense>
                                        <v-slide-x-reverse-transition group hide-on-leave>
                                            <v-timeline-item
                                                    v-for="item in highlights"
                                                    :key="item.IDX"
                                                    :color="convertColor(item.COLOR)"
                                                    :small="true"
                                            >
                                                {{ item.PRINT_TEXT }}
                                            </v-timeline-item>
                                        </v-slide-x-reverse-transition>
                                    </v-timeline>-->
          </v-row>
        </v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
</template>
<script>
import SiteFunction from "./function/SiteFunction";
import SiteListPage from "./SiteListPage";

export default {
  components: { SiteListPage, SiteFunction },
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
      console.log("convertColor ", color);
      switch (color) {
        case "highlight-color-1":
          return "#e35a69";
        case "highlight-color-2":
          return "#f7b900";
        case "highlight-color-3":
          return "#2da64e";
        case "highlight-color-4":
          return "#d9c3ff";
        case "highlight-color-5":
          return "#97c2dd";
        case "highlight-color-6":
          return "#ef9a9a";
        case "highlight-color-7":
          return "#90a4ae";
        case "highlight-color-8":
          return "#CDDC39";
        case "highlight-color-9":
          return "#ffb540";
        case "highlight-color-10":
          return "#B2EBF2";
        case "highlight-color-11":
          return "#c0b6a7";
      }
    }
  }
};
</script>
