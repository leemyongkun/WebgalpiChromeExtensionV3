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
            <v-col cols="5">
              <v-text-field
                label="CATEGORY NAME"
                :value="categoryId"
                v-model="categoryName"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-autocomplete
                :items="category"
                item-value="id"
                item-text="name"
                v-model="categoryParent"
                :disabled="checkParent"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2" style="padding-left: 0px;">
              <v-checkbox
                v-model="checkParent"
                label="PARENT"
                required
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-show="checkParent" style="color: red;"
                >* PARENT로 지정 시, 컨텐츠들의 카테고리 정보를 모두 잃게
                됩니다.
              </span>
            </v-col>
          </v-row>
        </v-container>
        <small></small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">CLOSE</v-btn>
        <v-btn color="green darken-1" text @click="updateCategory"
          >UPDATE
        </v-btn>
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
    checkParent: false,
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
      /*let currentCategory = [];
                Object.assign(currentCategory, category);
                currentCategory.unshift({id: -1, name: "PARENT로 지정"});*/
      this.category = category;

      this.categoryName = categoryInfo.name;
      this.categoryParent = categoryInfo.parent;
      this.categoryId = categoryInfo.id;

      this.dialog = true;
    },
    insertCategory() {
      //todo : Category 등록
      //1. index 최대값을 가져온다.
      //2. PARENT / CHILD를 구분하여 parameter 를 구성한다.
      //3. 저장한다. (reload category)
      alert("insertCateory");

      let param = [
        0, //index
        "kkuni.bear@gmail.com", //email
        "NAME",
        0, //depth
        "N", //share
        "CUSTOM", //SYSTEM , CUSTOM
        "N",
        "N"
      ];

      this.category.map(item => {
        console.log("item >> ", item);
      });
    },
    updateParentCategory() {
      //todo : RELATION을 지운다.
      //todo : 해당 category의 parent를 null로 변경, title을 변경한다.
    },
    updateCategory() {
      let param = [];
      /* if (this.checkParent) {
                    if (confirm("해당 카테고리를 PARENT로 지정 시, 컨텐츠들은 카테고리 정보를 잃게 됩니다.")) {
                        param = [this.categoryName, null, this.categoryId];
                    }
                    return false;
                } else {
                    param = [this.categoryName, this.categoryParent, this.categoryId];
                }*/

      param = [
        this.categoryName,
        this.categoryParent,
        this.categoryId,
        this.checkParent
      ];

      //db 저장하기
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
