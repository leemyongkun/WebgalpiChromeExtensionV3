<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-list-item-action>
      <v-icon>mdi-view-dashboard</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>VIEW MODE</v-list-item-title>
      <v-list-item-subtitle>
        <v-radio-group v-model="view" row>
          <v-radio label="1" value="1" @change="changeViewMode"></v-radio>
          <v-radio label="2" value="2" @change="changeViewMode"></v-radio>
          <v-radio label="3" value="3" @change="changeViewMode"></v-radio>
        </v-radio-group>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import EventBus from "../../event-bus";

export default {
  components: {},
  props: [],
  data: () => ({
    view: "1"
  }),
  created() {},
  mounted() {},
  methods: {
    changeViewMode() {
      this.$nextTick(() => {
        EventBus.$emit("view-mode", this.view);
      });
    }
  }
};
</script>
