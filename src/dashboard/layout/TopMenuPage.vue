<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app-bar app clipped-left color="amber">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <span class="title ml-3 mr-5"
      >WEB&nbsp;<span class="font-weight-light">Galpi</span></span
    >
    <v-text-field
      solo-inverted
      flat
      hide-details
      label="Search"
      prepend-inner-icon="mdi-feature-search-outline"
    />
    <v-spacer />
  </v-app-bar>
</template>
<script>
export default {
  components: {},
  /*props: {
            drawer: {
                type: Boolean,
                default: null
            }
        },*/
  data: () => ({}),
  created() {},
  methods: {}
};
</script>
