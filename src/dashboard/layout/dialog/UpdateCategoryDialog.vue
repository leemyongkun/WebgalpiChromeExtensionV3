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
                :disabled="checkRoot"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2" style="padding-left: 0px;">
              <v-checkbox
                v-model="checkRoot"
                label="ROOT"
                @change="checkRootChange"
                required
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-show="checkRoot" style="color: red;"
                >* PARENT로 지정 시, 컨텐츠들의 카테고리 정보를 모두 잃게
                됩니다.
              </span>
            </v-col>
          </v-row>
        </v-container>
        <small></small>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="red darken-1"
          text
          @click="deleteCategory"
          v-if="categoryStatus === 'update'"
          >DELETE
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">CANCEL</v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="updateCategory"
          v-if="categoryStatus === 'update'"
        >
          <span>UPDATE</span>
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="insertCategory"
          v-if="categoryStatus === 'insert'"
        >
          <span>CREATE</span>
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
    checkRoot: false,
    dialog: false,
    categoryParent: "",
    categoryName: "",
    categoryId: "",
    category: [],
    categoryStatus: ""
  }),
  created() {},
  mounted() {},
  methods: {
    openDialog(categoryInfo, category, checkRoot, statusFlag) {
      this.categoryStatus = statusFlag;

      //수정일때 수행
      if (statusFlag === "update") {
        //현재 root 인지 child인지 구분.
        this.checkRoot = checkRoot;

        //root를 수정 시, 자기자신으로 변경할 수 없도록 category에서 제외시킨다.
        let targetRootId;
        if (categoryInfo.parent === 0) {
          targetRootId = categoryInfo.id;
          this.category = category.filter(item => {
            return item.id !== targetRootId;
          });
        } else {
          this.category = category;
        }

        this.categoryName = categoryInfo.name;
        if (categoryInfo.parent === -1) {
          //미아가 된 카테고리일경우, category의 첫번째를 지정한다.
          this.categoryParent = category[0].id;
        } else {
          this.categoryParent = categoryInfo.parent;
        }
        this.categoryId = categoryInfo.id;
      } else {
        //신규생성일때.
        this.category = category;
        if (this.category.length !== 0) {
          this.categoryParent = this.category[0].id;
        }
      }

      this.dialog = true;
    },
    checkRootChange() {
      this.$nextTick(() => {
        if (this.checkRoot) {
          this.categoryParent = 0;
        } else {
          this.categoryParent = this.category[0].id;
        }
      });
    },
    deleteCategory() {},
    insertCategory() {
      //todo : Category 등록
      //1. index 최대값을 가져온다.
      //2. PARENT / CHILD를 구분하여 parameter 를 구성한다.
      //3. 저장한다. (reload category)

      console.log("this categoryName", this.categoryName);
      console.log("categoryParent", this.categoryParent);
      console.log("this.checkRoot ", this.checkRoot);

      this.categoryName = this.categoryName.replace(/ /g, "");
      if (this.categoryName === "") {
        alert("카테고리명을 입력하세요.");
        return false;
      }

      let categoryParent = this.categoryParent;
      let depth = 1;

      if (this.checkRoot) {
        depth = 0;
        categoryParent = 0; //rootid
      }

      if (depth !== 0 && categoryParent === "") {
        alert("ROOT를 지정하지않고, 카테고리를 설정할 수 없습니다.");
        return false;
      }

      let param = [
        "kkuni.bear@gmail.com", //email
        this.categoryName, //NAME
        categoryParent, //parent
        depth, //depth
        0, //sort
        new Date().getTime() //create date
      ];
      //db 저장하기
      CONTENT_LISTENER.sendMessage({
        type: "insert.category.item",
        data: param
      }).then(() => {
        EventBus.$emit("reload.category");
        this.close();
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
        this.checkRoot
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
      this.checkRoot = false;
      this.dialog = false;
      this.categoryParent = "";
      this.categoryName = "";
      this.categoryId = "";
      this.category = [];
      this.categoryStatus = "";

      this.dialog = false;
    }
  }
};
</script>
