<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline"
          ><v-icon>mdi-folder-outline</v-icon>&nbsp;CATEGORY</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="CATEGORY NAME"
                :value="categoryId"
                v-model="categoryName"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" sm="6">
              <v-autocomplete
                :items="category"
                item-value="id"
                item-text="name"
                v-model="categoryParent"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <small></small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">CLOSE</v-btn>
        <v-btn color="green darken-1" text @click="update">UPDATE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";

export default {
  components: {},
  props: [],
  data: () => ({
    dialog: false,
    categoryParent: "",
    categoryName: "",
    categoryId: "",
    category: []
  }),
  created() {},
  mounted() {},
  methods: {
    openDialog(categoryInfo, category) {
      //category.unshift({'id': -1, 'name': 'PARENT로 지정'});
      this.category = category;

      this.categoryName = categoryInfo.name;
      this.categoryParent = categoryInfo.parent;
      this.categoryId = categoryInfo.id;

      this.dialog = true;
    },
    update() {
      if (this.categoryParent === null) {
        alert("null 은 안되요");
        return false;
      }

      let param = [this.categoryName, this.categoryParent, this.categoryId];
      //todo : db 저장하기

      CONTENT_LISTENER.sendMessage({
        type: "update.category.item",
        data: param
      }).then(() => {
        EventBus.$emit("reload.category");
        this.close();
      });
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
