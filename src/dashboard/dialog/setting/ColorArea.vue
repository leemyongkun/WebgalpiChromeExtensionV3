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
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                  v-for="(item, idx) in colorValue"
                  :key="idx"
                >
                  <v-checkbox
                    @change="selectedColor"
                    v-model="pickColor"
                    :value="item.className"
                    hide-details
                  >
                    <template v-slot:label>
                      <div :style="item.style">
                        <span style="color: black">COLOR</span>
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
    pickColor: ["color-1", "color-2", "color-4", "color-8", "color-3"],
    colorValue: [
      {
        className: "color-1",
        style: "background: #a1887f; border-radius: 5px;"
      },
      {
        className: "color-2",
        style: "background: #CDDC39; border-radius: 5px;"
      },
      {
        className: "color-3",
        style: "background: #4CAF50; border-radius: 5px;"
      },
      {
        className: "color-4",
        style: "background: #FF9800; border-radius: 5px;"
      },
      {
        className: "color-5",
        style: "background: #FBC02D; border-radius: 5px;"
      },
      {
        className: "color-6",
        style: "background: #B2EBF2; border-radius: 5px;"
      },
      {
        className: "color-7",
        style: "background: #90a4ae; border-radius: 5px;"
      },
      {
        className: "color-8",
        style: "background: #ba68c8; border-radius: 5px;"
      },
      {
        className: "color-9",
        style: "background: #5c6bc0; border-radius: 5px;"
      },
      {
        className: "color-10",
        style: "background: #ef9a9a; border-radius: 5px;"
      },
      {
        className: "color-11",
        style: "background: #64b5f6; border-radius: 5px;"
      }
    ],
    colorList: [
      "#a1887f",
      "#CDDC39",
      "#4CAF50",
      "#FF9800",
      "#FBC02D",
      "#B2EBF2",
      "#90a4ae",
      "#ba68c8",
      "#5c6bc0",
      "#ef9a9a",
      "#64b5f6"
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    selectedColor() {
      if (this.pickColor.length === 6) {
        alert("5개까지입니다.");
        this.pickColor = this.pickColor.slice(0, 5);
      }
    }
  }
};
</script>
