<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- 다이얼로그 -->
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card style="height: 400px">
      <v-card-title class="headline">Category Editor</v-card-title>
      <v-card-text style="height: 270px">
        <v-row>
          <v-col cols="6">
            <v-list style="max-height: 260px" class="overflow-y-auto">
              <v-list-group
                v-for="item in category"
                :key="item.name"
                v-model="item.active"
                no-action
                dense
                value
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="subItem in item.children"
                  :key="subItem.name"
                  @click="selectCategory(subItem)"
                  style="padding-left: 30px;"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="subItem.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
            <!-- <v-treeview
                                open-all
                                hoverable
                                activatable
                                style="cursor:pointer;max-height: 260px"
                                class="overflow-y-auto"
                                return-object
                                v-model="categoryItem"
                                :items="category"
                                @click="selectCategory"
                        >
                            <template v-slot:prepend="{ item, active }">
                                <v-icon>mdi-folder-outline</v-icon>
                            </template>
                        </v-treeview>-->
          </v-col>
          <v-col cols="6">
            <div>
              {{ selectedItem }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">Disagree</v-btn>
        <v-btn color="green darken-1" text @click="closeDialog">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 다이얼로그 -->
</template>
<script>
export default {
  components: {},
  props: ["dialog", "category"],
  data: () => ({
    categoryItem: [],
    selectedItem: null
  }),
  created() {},
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    selectCategory(subItem) {
      this.selectedItem = subItem;
      console.log(">>  ", subItem);
    }
  }
};
</script>
