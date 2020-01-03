<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-timeline dense>
    <v-slide-x-reverse-transition group hide-on-leave>
      <v-timeline-item
        v-for="item in highlights"
        :key="item.IDX"
        :color="item.color"
        small
        fill-dot
      >
        {{ item.PRINT_TEXT }}
      </v-timeline-item>
    </v-slide-x-reverse-transition>
  </v-timeline>
</template>
<script>
export default {
  components: {},
  props: ["highlights"],
  data: () => ({}),
  created() {
    console.log("#");
  },
  methods: {}
};
</script>
