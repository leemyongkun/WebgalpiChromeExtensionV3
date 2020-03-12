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
    <v-card width="300px" max-height="600px">
      <v-list v-for="item in highlightItems" :cols="3" :key="item.IDX">
        <v-list-item>
          <!--<v-list-item-avatar>
                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-list-item-avatar>-->

          <v-list-item-content>
            {{ item.PRINT_TEXT }}
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
    </v-card>
  </v-menu>
</template>
<script>
import Common from "../../../../common/common";

export default {
  components: {},
  props: ["highlights"],
  data: () => ({
    highlightItems: []
  }),
  created() {},
  methods: {
    test() {
      this.highlightItems = this.highlights;
    },
    convertColor(color) {
      return Common.getConvertColor(color);
    }
  }
};
</script>
