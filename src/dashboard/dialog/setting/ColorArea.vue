<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-list-item-action>
      <v-icon>mdi-format-color-fill</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        <v-expansion-panels focusable flat>
          <v-expansion-panel>
            <v-expansion-panel-header
              >COLOR : 5개의 컬러를 지정할 수 있습니다.
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    @change="change"
                    v-model="pickColor"
                    :value="item"
                    hide-details
                    v-for="item in colorStyle"
                  >
                    <template v-slot:label>
                      <div :style="item">
                        COLOR
                      </div>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
//color https://www.materialpalette.com/colors
export default {
  components: {},
  props: [],
  data: () => ({
    pickColor: [],
    colorStyle: [
      "color:#03A9F4",
      "color:#a1887f",
      "color:#CDDC39",
      "color:#4CAF50",
      "color:#FF9800",
      "color:#FFEB3B",
      "color:#FBC02D",
      "color:#B2EBF2",
      "color:#bdbdbd",
      "color:#90a4ae",
      "color:#ba68c8",
      "color:#5c6bc0",
      "color:#ef9a9a",
      "color:#64b5f6"
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    change() {
      console.log("cha", this.pickColor);
    }
  }
};
</script>
