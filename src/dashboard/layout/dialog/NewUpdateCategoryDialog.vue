<template>
  <v-dialog v-model="dialog" persistent max-width="650px" overlay-opacity="0.9">
    <v-card>
      <v-card-title>
        <span class="headline"
          ><v-icon>mdi-folder-outline</v-icon>&nbsp;CATEGORY</span
        >
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <ol>
              <li>
                카테고리를 상하로 Drag&Drop으로 자유롭게 순서를 정렬할 수
                있습니다.
              </li>
              <li>
                하위 카테고리에서 상위 카테고리로 Drag&Drop 하여 Tree 구조를
                자유롭게 구성할 수 있습니다.
              </li>
            </ol>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-list nav dense>
              <v-subheader
                >상위 카테고리
                <v-spacer />

                <v-menu
                  v-model="addMenu.parent"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                  left
                  bottom
                >
                  <template v-slot:activator="{ on: menu }">
                    <v-tooltip
                      v-model="categoryBtnDesc.parent"
                      color="blue"
                      top
                    >
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          color="success"
                          icon
                          v-on="{ ...menu, ...tooltip }"
                          @click="openFieldMenu('parent')"
                        >
                          <v-icon size="22px">mdi-folder-plus-outline</v-icon>
                        </v-btn>
                      </template>
                      <span> 상위 카테고리명을 추가 및 수정합니다.</span>
                    </v-tooltip>
                  </template>

                  <v-card>
                    <v-list class="pt-0 pb-0">
                      <v-list-item class="pr-0 pl-0">
                        <v-list-item-content class="pt-0 pb-0">
                          <v-text-field
                            ref="parentFieldMenu"
                            clearable
                            outlined
                            placeholder="카테고리명을 입력 후 엔터"
                            prepend-inner-icon="mdi-folder-plus-outline"
                            v-model="categoryName.parent"
                            @keyup.enter="insertCategory('parent')"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-subheader>

              <!-- 부모카테고리 영역 -->
              <v-list-item-group color="primary">
                <span v-if="categoryData.parent.length === 0"
                  >상위 카테고리가 없습니다.</span
                >

                <!-- 정렬을 위한 Drag-->
                <draggable
                  v-model="categoryData.parent"
                  :options="{
                    group: { name: 'parentCategory' },
                    animation: 250
                  }"
                  class="sortable-list"
                  @end="endDragParent"
                >
                  <v-list-item
                    :class="rootCategory.class"
                    :style="rootCategoryDropOverStyle(rootCategory)"
                    v-for="(rootCategory, i) in categoryData.parent"
                    :key="rootCategory.id"
                    @click="selectRootCategory(rootCategory)"
                    @dragover="rootCategory.dropOver = true"
                    @dragleave="rootCategory.dropOver = false"
                    @mouseover="rootCategory.mouseOver = true"
                    @mouseleave="rootCategory.mouseOver = false"
                    ref="rootCategoryList"
                  >
                    <!-- 자식카테고리에서 부모카테고리로 Drag&Drop할때 이벤트-->
                    <drop @drop="categoryDropEvent">
                      <!-- 부모 카테고리 드래그 할때 DIV Style-->
                      <drag>
                        <div slot="image" class="drag-image">
                          <v-chip class="ma-2" color="blue" text-color="white">
                            {{ rootCategory.name }}
                          </v-chip>
                        </div>

                        <v-list-item-content :id="rootCategory.id">
                          <v-list-item-title
                            v-if="rootCategory.isShow === 'y'"
                            class="updateCategoryName"
                            v-text="rootCategory.name"
                          ></v-list-item-title>

                          <v-text-field
                            v-if="rootCategory.isShow === 'n'"
                            class="pt-0 mt-0"
                            style="width: 250px"
                            append-icon="mdi-close-circle"
                            v-model="rootCategory.name"
                            append-outer-icon="mdi-check"
                            @click:append="cancelCategoryName(rootCategory)"
                            @click:append-outer="
                              updateCategoryName(rootCategory)
                            "
                            @keyup.enter="updateCategoryName(rootCategory)"
                            :value="rootCategory.name"
                          ></v-text-field>
                        </v-list-item-content>
                      </drag>
                    </drop>
                    <v-list-item-icon
                      v-show="rootCategory.mouseOver && !editableFlag"
                      v-if="rootCategory.isShow === 'y'"
                    >
                      <v-icon
                        dense
                        size="18px"
                        right
                        color="success"
                        @click="
                          editCategoryName($event, rootCategory, 'parent')
                        "
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        dense
                        size="18px"
                        right
                        color="error"
                        @click="deleteCategory($event, rootCategory, 'parent')"
                        >mdi-trash-can-outline
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </draggable>
              </v-list-item-group>
            </v-list>
          </v-col>

          <!----------------------########## 하위 카테고리 영역 ############# ------------------------------->
          <v-col cols="6">
            <v-list nav dense>
              <v-subheader
                >하위 카테고리
                <v-spacer />
                <v-spacer />

                <v-menu
                  v-model="addMenu.child"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                  left
                  bottom
                >
                  <template v-slot:activator="{ on: menu }">
                    <v-tooltip v-model="categoryBtnDesc.child" color="blue" top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          color="success"
                          icon
                          v-on="{ ...menu, ...tooltip }"
                          @click="openFieldMenu('children')"
                        >
                          <v-icon size="22px">mdi-folder-plus-outline</v-icon>
                        </v-btn>
                      </template>
                      <span> 하위 카테고리명을 추가 및 수정합니다.</span>
                    </v-tooltip>
                  </template>

                  <v-card>
                    <v-list class="pt-0 pb-0">
                      <v-list-item class="pr-0 pl-0">
                        <v-list-item-content class="pt-0 pb-0">
                          <v-text-field
                            ref="childFieldMenu"
                            clearable
                            outlined
                            placeholder="카테고리명을 입력 후 엔터"
                            prepend-inner-icon="mdi-folder-plus-outline"
                            v-model="categoryName.children"
                            @keyup.enter="insertCategory('children')"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-subheader>
              <v-list-item-group color="primary">
                <span v-if="categoryData.children.length === 0"
                  >상위 카테고리를 선택하지 않았거나, 하위 카테고리가 존재하지
                  않습니다.</span
                >
                <draggable
                  v-model="categoryData.children"
                  :options="{
                    group: { name: 'childrenCategory' },
                    animation: 250
                  }"
                  class="sortable-list"
                  @end="endDragChildren"
                >
                  <v-list-item
                    v-for="(children, i) in categoryData.children"
                    :key="children.id"
                    @mouseover="children.mouseOver = true"
                    @mouseleave="children.mouseOver = false"
                  >
                    <drag :transfer-data="children">
                      <!-- DRAG 시 보이는 영역-->
                      <div slot="image" class="drag-image">
                        <v-chip class="ma-2" color="blue" text-color="white">
                          {{ children.name }}
                          <!--<v-icon right>mdi-star</v-icon>-->
                        </v-chip>
                      </div>

                      <v-list-item-content>
                        <v-list-item-title
                          v-if="children.isShow === 'y'"
                          class="updateCategoryName"
                          v-text="children.name"
                        ></v-list-item-title>

                        <v-text-field
                          v-if="children.isShow === 'n'"
                          class="pt-0 mt-0"
                          style="width: 250px"
                          append-icon="mdi-close-circle"
                          v-model="children.name"
                          append-outer-icon="mdi-check"
                          @click:append="cancelCategoryName(children)"
                          @click:append-outer="updateCategoryName(children)"
                          @keyup.enter="updateCategoryName(children)"
                          :value="children.name"
                        ></v-text-field>
                      </v-list-item-content>
                    </drag>

                    <v-list-item-icon
                      v-show="children.mouseOver && !editableFlag"
                      v-if="children.isShow === 'y'"
                    >
                      <v-icon
                        dense
                        size="18px"
                        right
                        color="success"
                        @click="editCategoryName($event, children, 'children')"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        dense
                        size="18px"
                        right
                        color="error"
                        @click="deleteCategory($event, children, 'children')"
                        >mdi-trash-can-outline
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </draggable>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" text @click="close">DONE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";
import MODAL from "../../../common/modal";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  props: [],
  data: () => ({
    showParentCategoryField: false,
    addMenu: {
      parent: false,
      child: false
    },
    categoryBtnDesc: {
      parent: false,
      child: false
    },
    categoryData: {
      parent: [],
      children: []
    },
    categoryName: {
      parent: "",
      children: ""
    },
    editableFlag: false, //이름 변경 수정 모드
    copyCategory: new Object(),
    dialog: false,
    selectedCategoryParent: null,
    mouseOverRootCategoryId: 0,
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;" //드래드 시 오버 대상에 마우스 over 했을때 스타일
  }),
  created() {},
  mounted() {},
  methods: {
    async initCategory() {
      let result = await Utils.getLocalStorage("loginInfo");
      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: [result.loginInfo.EMAIL]
      })
        .then(category => {
          this.categoryData.parent = Utils.generateTree(category, 0);
        })
        .then(() => {
          if (this.selectedCategoryParent !== null) {
            let ret = this.categoryData.parent.filter(p => {
              return p.id === this.selectedCategoryParent.id;
            });

            if (ret.length !== 0) {
              this.selectRootCategory(ret[0]);
            }
          }
        })
        .then(() => {
          this.editableFlag = false;
        })
        .then(() => {});
    },
    /** 카테고리명 수정 취소 */
    cancelCategoryName(category) {
      //열려있는 창을 닫는다.
      this.categoryData.parent.map(item => {
        item.isShow = "y";
      });
      this.categoryData.children.map(item => {
        item.isShow = "y";
      });

      //cancel 할 경우, category 값이 있을 경우, 원상복구를 진행한다.
      if (category !== undefined) {
        category.name = this.copyCategory.name;
        this.copyCategory = new Object();
      }
      this.editableFlag = false;
    },
    /** 카테고리명 수정 액션 */
    updateCategoryName(category) {
      let object = new Object();
      object.CATEGORY_NAME = category.name;
      object.CATEGORY_PARENT = category.parent;
      object.CATEGORY_ID = category.id;
      if (category.parent === 0) {
        object.CHECK_ROOT = true;
      } else {
        object.CHECK_ROOT = false;
      }
      object.CATEGORY_TYPE = "CUSTOM";
      this.updateCategory(object);
      this.cancelCategoryName();
    },
    /** 카테고리명 수정 텍스트 필드 */
    editCategoryName(event, item, flag) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.editableFlag = true;

      item.isShow = "n";
      Object.assign(this.copyCategory, item);
    },

    rootCategoryDropOverStyle(rootCategory) {
      if (rootCategory.dropOver) {
        this.mouseOverRootCategoryId = rootCategory.id;
        return this.overColor;
      } else {
        return "";
      }
    },
    openFieldMenu(flag) {
      setTimeout(() => {
        if (flag === "parent") {
          this.$refs.parentFieldMenu.focus();
        } else {
          this.$refs.childFieldMenu.focus();
        }
      }, 100);
    },

    /**
     * Children -> Parent로 DragDrop 했을 때. 업데이트를 진행한다.
     */
    categoryDropEvent(data, event) {
      if (this.editableFlag) {
        EventBus.$emit(
          "open.snack",
          "편집 중에는, 하위 카테고리를 이동 할 수 없습니다.",
          "error"
        );
        return false;
      }

      this.categoryData.parent.map(root => {
        root.dropOver = false;
      });

      if (data !== undefined) {
        //!!! 순서가 매우 중요!!
        let object = new Object();
        object.CATEGORY_NAME = data.name;
        object.CATEGORY_PARENT = this.mouseOverRootCategoryId;
        object.CATEGORY_ID = data.id;
        object.CHECK_ROOT = false;
        object.CATEGORY_TYPE = "CUSTOM";

        this.updateCategory(object);
      }
    },
    endDragParent() {
      this.sort("parent");
    },
    endDragChildren() {
      setTimeout(() => {
        this.sort("children");
      }, 400);
    },
    /**
     * Parent Category 클릭 시, childrenCateogry를 출력
     */
    selectRootCategory(rootCategory) {
      if (this.editableFlag) {
        EventBus.$emit(
          "open.snack",
          "편집 중에는 선택할 수 없습니다.",
          "error"
        );
        return false;
      }
      this.selectedCategoryParent = rootCategory;
      if (rootCategory.children === undefined) {
        this.categoryData.children = [];
      } else {
        this.categoryData.children = rootCategory.children;
      }

      this.categoryData.parent.map(root => {
        root.class = "";
      });
      rootCategory.class = "active-category";
    },
    categoryNameKeyUpEvent(event) {},
    openDialog() {
      this.initCategory();
      this.dialog = true;
    },
    async deleteCategory(event, item, flag) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (item.children !== undefined) {
        MODAL.alert(
          "하위 카테고리를 포함하고 있어, 삭제할 수 없습니다.",
          "error",
          null,
          "420px"
        );
        return false;
      }

      let confirm = "[" + item.name + "] 카테고리를 삭제 하시겠습니까?";
      let result = await MODAL.confirm(confirm, "info", null, null, "420px");
      if (result.value === undefined) return false;

      let param = new Object();
      if (flag === "parent") {
        param.CHECK_ROOT = true;
      } else {
        param.CHECK_ROOT = false;
      }

      param.CATEGORY_ID = item.id;

      //category 삭제
      CONTENT_LISTENER.sendMessage({
        type: "delete.category.item",
        data: param
      })
        .then(() => {
          EventBus.$emit("reload.category");
        })
        .then(() => {
          this.initCategory();
        });
    },
    async insertCategory(flag) {
      let result = await Utils.getLocalStorage("loginInfo");

      let categoryName = this.categoryName.parent.trim();
      let categoryParent = 0;
      let depth = 1;

      if (flag === "children") {
        if (this.selectedCategoryParent === null) {
          MODAL.alert(
            "상위 카테고리를 지정(클릭)하셔야 합니다.",
            "error",
            null,
            "400px"
          );
          return false;
        }
        categoryName = this.categoryName.children.trim();
        categoryParent = this.selectedCategoryParent.id;
        depth = 2;
      }

      if (categoryName === "") {
        EventBus.$emit("open.snack", "카테고리명을 입력하세요.", "error");
        return false;
      }

      let obj = new Object();
      obj.EMAIL = result.loginInfo.EMAIL;
      obj.name = categoryName;
      obj.parent = categoryParent;
      obj.depth = depth;
      obj.sort = 0;
      obj.date = new Date().getTime();

      //부가적인기능을 위해 임의로 생성
      obj.class = "";
      obj.mouseOver = 0;
      obj.dropOver = 0;
      obj.isShow = "y";

      //db 저장하기
      CONTENT_LISTENER.sendMessage({
        type: "insert.category.item",
        data: obj
      })
        .then(() => {
          EventBus.$emit("reload.category");
          this.initCategory();
          this.addMenu.parent = false;
          this.addMenu.child = false;
          this.categoryName.parent = "";
          this.categoryName.children = "";
        })
        .then(() => {});
    },

    updateParentCategory() {
      //todo : RELATION을 지운다.
      //todo : 해당 category의 parent를 null로 변경, title을 변경한다.
    },
    updateCategory(param) {
      //db 저장하기
      CONTENT_LISTENER.sendMessage({
        type: "update.category.item",
        data: param
      }).then(() => {
        EventBus.$emit("reload.category");
        this.initCategory();
      });
    },
    close() {
      this.$parent.dialogCloseEvent();
      this.dialog = false;
    },
    sort(flag) {
      if (flag === "parent") {
        this.categoryData.parent.map((item, idx) => {
          let param = new Object();
          param.categoryIdx = item.id;
          param.categoryParentIdx = 0;
          param.index = idx;
          CONTENT_LISTENER.sendMessage({
            type: "update.category.sort",
            data: param
          });
        });
      } else {
        this.categoryData.children.map((item, idx) => {
          let param = new Object();
          param.categoryIdx = item.id;
          param.categoryParentIdx = this.selectedCategoryParent.id;
          param.index = idx;

          CONTENT_LISTENER.sendMessage({
            type: "update.category.sort",
            data: param
          });
        });
      }
    }
  }
};
</script>
<style>
.sortable-list {
  background-color: $ border-color;
  padding: 0.1px 0;
  display: block;
}

.sortable {
  line-height: $ item-height;
  margin: 1px;
  padding: 0 1em;
  background-color: white;
  cursor: move;
  list-style: none;
}

.sortable-ghost {
  opacity: 0.2;
}

.parent {
  padding-bottom: 1em;
}

.updateCategoryName {
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-category {
  border: 2px dashed orange;
}
</style>
