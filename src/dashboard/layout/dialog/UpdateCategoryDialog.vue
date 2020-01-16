<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="CATEGORY NAME"
                :value="categoryInfo.name"
                v-model="categoryInfo.name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" sm="6">
              <v-autocomplete
                :items="category"
                item-value="id"
                item-text="name"
                v-model="parent"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Close</v-btn>
        <v-btn color="green darken-1" text @click="update">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  components: {},
  props: ["categoryInfo", "category"],
  data: () => ({
    dialog: false,
    parent: null
  }),
  created() {},
  mounted() {},
  methods: {
    openDialog() {
      this.dialog = true;
    },
    update() {
      if (this.parent === null) {
        alert("null 은 안되요");
        return false;
      }

      let param = [this.categoryInfo.id, this.categoryInfo.name, this.parent];

      console.log(">> ", this.categoryInfo);
      console.log("parent", this.parent);
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
