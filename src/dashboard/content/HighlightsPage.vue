<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-timeline dense>
    <v-slide-x-reverse-transition group hide-on-leave>
      <v-timeline-item
        v-for="item in highlights"
        :key="item.id"
        :color="item.color"
        small
        fill-dot
      >
        Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola
        imperdiet nec ut, sed euismod convenire principes at. Est et nobis
        iisque percipit, an vim zril disputando voluptatibus, vix an salutandi
        sententiae.
      </v-timeline-item>
    </v-slide-x-reverse-transition>
  </v-timeline>
</template>
<script>
export default {
  components: {},
  data: () => ({
    highlights: [
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      },
      {
        id: 1,
        color: "info"
      }
    ]
  }),
  created() {},
  methods: {}
};
</script>
