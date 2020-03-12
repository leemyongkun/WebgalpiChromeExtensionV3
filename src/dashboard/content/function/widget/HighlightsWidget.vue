<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu
    transition="slide-y-transition"
    offset-y
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="test">
        <v-icon>mdi-grease-pencil</v-icon>
      </v-btn>
    </template>
    <v-card width="300px" :style="maxHeightWidget">
      <v-list v-for="item in highlightItems" :cols="3" :key="item.IDX">
        <v-list-item>
          <!--<v-list-item-avatar>
                                            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                                        </v-list-item-avatar>-->

          <v-list-item-content class="mt-0 pt-0">
            {{ item.PRINT_TEXT }}
          </v-list-item-content>

          <v-list-item-action class="mr-0 ml-0 pr-0 pl-0">
            <v-btn icon>
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
import Common from "../../../../common/common";

export default {
  components: {},
  computed: {},
  props: ["highlights"],
  data: () => ({
    highlightItems: [],
    maxHeightWidget: ""
  }),
  created() {},
  mounted() {
    this.$nextTick(function() {
      this.getWindowHeight();
      window.addEventListener("resize", this.getWindowHeight);
    });
  },
  methods: {
    getWindowHeight(event) {
      this.maxHeightWidget =
        "max-height: " + (document.documentElement.clientHeight - 220) + "px;";
    },
    test() {
      this.highlightItems = this.highlights;
    },
    convertColor(color) {
      return Common.getConvertColor(color);
    }
  }
};
</script>
