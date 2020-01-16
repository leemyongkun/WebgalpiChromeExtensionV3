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
          <v-row :style="rowStyle" class="overflow-y-auto">
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
  props: ["previewContent", "previewTitle", "previewStatus", "highlights"],
  data: () => ({
    rowStyle: "max-height: 570px"
  }),
  created() {
    console.log("#");
  },
  methods: {
    convertColor(color) {
      console.log("convertColor ", color);
      switch (color) {
        case "highlight-color-1":
          return "#a1887f";
        case "highlight-color-2":
          return "#CDDC39";
        case "highlight-color-3":
          return "#4CAF50";
        case "highlight-color-4":
          return "#FF9800";
        case "highlight-color-5":
          return "#FBC02D";
        case "highlight-color-6":
          return "#B2EBF2";
      }
    }
  }
};
</script>
