<template>
  <v-dialog v-model="deleteDialog" persistent max-width="290">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        <v-icon>mdi-delete-forever</v-icon> 사이트 삭제</v-card-title
      >
      <v-card-text
        >하이라이트도 함께 삭제됩니다.<br />(복구되지 않음)</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="remove">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  components: {},
  props: [],
  data: () => ({
    deleteDialog: false
  }),
  created() {},
  mounted() {},
  methods: {
    remove() {
      alert("삭제!");
    },
    close() {
      this.deleteDialog = false;
    }
  }
};
</script>
