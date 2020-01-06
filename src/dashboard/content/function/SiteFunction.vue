<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-btn @click="print" icon v-if="previewStatus === 'Y'">
      <v-icon>mdi-printer</v-icon>
    </v-btn>
    <v-btn icon v-if="previewStatus === 'Y'">
      <v-icon>mdi-share-variant</v-icon>
    </v-btn>
    <v-btn icon v-if="previewStatus === 'Y'">
      <v-icon>mdi-delete-forever</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["previewStatus"],
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
