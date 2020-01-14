<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-list-item-action>
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>Theme</v-list-item-title>
      <v-list-item-subtitle>
        <v-radio-group v-model="theme" row>
          <v-radio label="DARK2" value="dark" @change="changeTheme"></v-radio>
          <v-radio label="LIGHT" value="light" @change="changeTheme"></v-radio>
        </v-radio-group>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
export default {
  components: {},
  props: [],
  data: () => ({
    theme: "dark"
  }),
  created() {},
  mounted() {},
  methods: {
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>
