<template>
  <v-dialog v-model="dialog" persistent max-width="600px" overlay-opacity="0.9">
    <v-card>
      <v-card-title>
        <span class="headline"
          ><v-icon>mdi-folder-outline</v-icon>&nbsp;CATEGORY</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="auto" style="padding-left: 0px;">
              <v-checkbox
                v-model="checkRoot"
                label="Depth-1"
                :disabled="categoryType === 'SYSTEM' || useCategory === false"
                @change="checkRootChange"
                required
              ></v-checkbox>
            </v-col>
            <v-col cols="auto">
              <v-autocomplete
                label="Depth-1"
                :items="category"
                item-value="id"
                item-text="name"
                v-model="categoryParent"
                :disabled="autocompleteDisabled"
              ></v-autocomplete>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                label="카테고리 이름"
                :value="categoryId"
                v-model="categoryName"
                @keyup.enter="categoryNameKeyUpEvent"
                required
                ref="categoryNameArea"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span
                >※ <u><b>Depth-1</b></u
                >로 생성된 카테고리는, 컨텐츠를 담을 수 없습니다.</span
              ><br />
              <span
                >※ 컨텐츠는 <u><b>Depth-2</b></u> 카테고리부터 담을 수 있으며,
                Drag&Drop으로 가능합니다.</span
              ><br />
              <span v-show="categoryType === 'SYSTEM'"
                >※ SYSTEM 카테고리는 이름만 수정 가능합니다.
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
          v-if="categoryStatus === 'update' && categoryType !== 'SYSTEM'"
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
import Utils from "../../utils/Utils";
import MODAL from "../../../common/modal";

export default {
  components: {},
  props: [],
  data: () => ({
    autofocus: true,
    currentCategoryInfo: new Object(),
    checkRoot: false,
    autocompleteDisabled: false,
    dialog: false,
    categoryParent: "",
    categoryName: "",
    categoryId: "",
    category: [],
    categoryStatus: "",
    categoryType: "CUSTOM",
    useCategory: true //category가 없을때 ROOT로 지정하지않았을 경우, 에러발생이므로 이를 강제로 막아준다.
  }),
  created() {},
  mounted() {},
  methods: {
    categoryNameKeyUpEvent(event) {
      //string length byte : https://stove99.tistory.com/83
      if (this.categoryStatus === "insert") this.insertCategory();
      else this.updateCategory();
    },
    openDialog(categoryInfo, category, checkRoot, statusFlag, categoryType) {
      this.currentCategoryInfo = categoryInfo;

      this.categoryType = categoryType;
      if (category === null || category.length === 0) {
        this.useCategory = false; //Parent(ROOT)가 없으면 ROOT체크를 해제하지 못하도록 한다.
      }

      this.categoryStatus = statusFlag;

      //수정일때 수행
      if (statusFlag === "update") {
        //현재 root 인지 child인지 구분.
        this.checkRoot = checkRoot;

        if (this.checkRoot) {
          this.autocompleteDisabled = true;
        }
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
          if (category.length !== 0) {
            this.categoryParent = category[0].id;
          }
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

      //Category가 없을때, ROOT를 강제로 체크한다.
      if (this.category.length === 0) {
        this.checkRoot = true;
        this.autocompleteDisabled = true;
      }

      //위의 조건들은 categoryType이 CUSTOM일경우이며, SYSTEM일경우, autocomplete와 ROOT 체크박스는 비활성한다.
      if (this.categoryType === "SYSTEM") {
        this.autocompleteDisabled = true;
      }

      //선택 된 카테고리가 있다면, 상위(parent) 카테고리 ID를 셋팅한다.
      if (this.$parent.selectedParentCategoryId !== 0) {
        this.categoryParent = this.$parent.selectedParentCategoryId; //전달받지 않고 상위의 값을 참조하여 가져온다.
      }

      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.categoryNameArea.focus();
        }, 100);
      });
      this.dialog = true;
    },
    checkRootChange() {
      this.$nextTick(() => {
        if (this.checkRoot) {
          this.categoryParent = "";
          this.autocompleteDisabled = true;
        } else {
          this.categoryParent = this.category[0].id;
          this.autocompleteDisabled = false;
        }
      });
    },
    async deleteCategory() {
      let confirm = "카테고리를 삭제 하시겠습니까?";
      let result = await MODAL.confirm(confirm);
      if (result.value === undefined) return false;

      /*
                                                                  root의경우 :
                                                                  1. 하위 카테고리의 연결을 제거한다.
                                                                  2. 끊긴 하위 카테고리들은 '미아'카테고리로 분류된다.
                                                                  3. 하위 카테고리와 연결 되어있는 Contents는 '미아' 카테고리로 유지된다.

                                                                  child의 경우 :
                                                                  1. root와의 연결을 끊는다.
                                                                  2. Contents들은 NO_CATEGORY 상태로 변경한다.
                                                                   */

      let param = new Object();
      if (this.currentCategoryInfo.parent === 0) {
        param.CHECK_ROOT = true;
      } else {
        param.CHECK_ROOT = false;
      }

      param.CATEGORY_ID = this.currentCategoryInfo.id;

      //category 삭제
      CONTENT_LISTENER.sendMessage({
        type: "delete.category.item",
        data: param
      }).then(() => {
        EventBus.$emit("reload.category");
        this.close();
      });
    },
    async insertCategory() {
      //Category 등록
      //1. index 최대값을 가져온다.
      //2. PARENT / CHILD를 구분하여 parameter 를 구성한다.
      //3. 저장한다. (reload category)

      this.categoryName = this.categoryName.trim();
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

      let result = await Utils.getLocalStorage("loginInfo");
      let param = [
        result.loginInfo.EMAIL, //email
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
      this.categoryName = this.categoryName.trim();

      let param = new Object();
      param.CATEGORY_NAME = this.categoryName;
      param.CATEGORY_PARENT = this.categoryParent;
      param.CATEGORY_ID = this.categoryId;
      param.CHECK_ROOT = this.checkRoot;
      param.CATEGORY_TYPE = this.categoryType;

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
      this.autocompleteDisabled = false;
      this.checkRoot = false;
      this.dialog = false;
      this.categoryParent = "";
      this.categoryName = "";
      this.categoryId = "";
      this.category = [];
      this.categoryStatus = "";
      this.useCategory = true;
      this.dialog = false;
    }
  }
};
</script>
