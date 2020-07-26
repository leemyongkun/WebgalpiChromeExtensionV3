<template>
  <v-dialog v-model="dialog" persistent max-width="650px" overlay-opacity="0.9">
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
              <v-list nav dense>
                <v-subheader
                  >상위 카테고리 (PARENT)
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
                            <v-icon size="18px">mdi-folder-plus-outline</v-icon>
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
                              autofocus
                            ></v-text-field>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-subheader>

                <!-- 부모카테고리 영역 -->
                <v-list-item-group color="primary">
                  <!-- 정렬을 위한 Drag-->
                  <draggable
                    v-model="categoryData.parent"
                    :options="{
                      group: { name: 'parentCategory', pull: true },
                      animation: 250
                    }"
                    class="sortable-list"
                    @end="endDragParent"
                  >
                    <v-list-item
                      :style="rootCategoryDropOverStyle(rootCategory)"
                      v-for="(rootCategory, i) in categoryData.parent"
                      :key="i"
                      @click="selectRootCategory(rootCategory)"
                      @dragover="rootCategory.dropOver = true"
                      @dragleave="rootCategory.dropOver = false"
                      @mouseover="rootCategory.mouseOver = true"
                      @mouseleave="rootCategory.mouseOver = false"
                    >
                      <!-- 자식카테고리에서 부모카테고리로 Drag&Drop할때 이벤트-->
                      <drop @drop="categoryDropEvent">
                        <!-- 부모 카테고리 드래그 할때 DIV Style-->
                        <drag>
                          <div slot="image" class="drag-image">
                            <v-chip
                              class="ma-2"
                              color="blue"
                              text-color="white"
                            >
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
                              style="width: 220px"
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
                        v-show="rootCategory.mouseOver"
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
                        <v-icon dense size="18px" right color="error"
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
                  >하위 카테고리 (CHILDREN)
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
                      <v-tooltip
                        v-model="categoryBtnDesc.child"
                        color="blue"
                        top
                      >
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="success"
                            icon
                            v-on="{ ...menu, ...tooltip }"
                            @click="openFieldMenu('children')"
                          >
                            <v-icon size="18px">mdi-folder-plus-outline</v-icon>
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
                              autofocus
                            ></v-text-field>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-subheader>
                <v-list-item-group color="primary">
                  <span
                    style="color:red;"
                    v-if="categoryData.children.length === 0"
                    >상위 카테고리를 선택하지 않았거나, 하위 카테고리가 존재하지
                    않습니다.</span
                  >
                  <draggable
                    v-model="categoryData.children"
                    :options="{
                      group: { name: 'childrenCategory', pull: true },
                      animation: 250
                    }"
                    class="sortable-list"
                    @end="endDragChildren"
                  >
                    <v-list-item
                      v-for="(children, i) in categoryData.children"
                      :key="i"
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
                            style="width: 220px"
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
                        v-show="children.mouseOver"
                        v-if="children.isShow === 'y'"
                      >
                        <v-icon
                          dense
                          size="18px"
                          right
                          color="success"
                          @click="
                            editCategoryName($event, children, 'children')
                          "
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon dense size="18px" right color="error"
                          >mdi-trash-can-outline
                        </v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </draggable>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
        <small></small>
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
    copyCategory: new Object(),
    autofocus: true,
    currentCategoryInfo: new Object(),
    checkRoot: false,
    autocompleteDisabled: false,
    dialog: false,
    selectedCategoryParent: null,
    categoryStatus: "", //insert / update/ delete 버튼 체크
    mouseOverRootCategoryId: 0,
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;" //드래드 시 오버 대상에 마우스 over 했을때 스타일
  }),
  created() {
    this.$nextTick(() => {
      this.initCategory();
    });
  },
  mounted() {},
  methods: {
    cancelCategoryName(category) {
      this.categoryData.parent.map(item => {
        item.isShow = "y";
      });
      this.categoryData.children.map(item => {
        item.isShow = "y";
      });

      if (category !== undefined) {
        category.name = this.copyCategory.name;
        this.copyCategory = new Object();
      }
    },
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
    },
    editCategoryName(event, item, flag) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.cancelCategoryName();

      item.isShow = "n";
      Object.assign(this.copyCategory, item);

      console.log("event ", event);
      console.log("item ", item);
      console.log("flag ", flag);
    },
    async initCategory() {
      let result = await Utils.getLocalStorage("loginInfo");
      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: [result.loginInfo.EMAIL]
      }).then(category => {
        this.categoryData.parent = Utils.generateTree(category, 0);
        this.categoryData.children = [];
      });
    },
    rootCategoryDropOverStyle(rootCategory) {
      if (rootCategory.dropOver) {
        this.mouseOverRootCategoryId = rootCategory.id;
        return this.overColor;
      } else {
        return "";
      }
      //return rootCategory.dropOver ? this.overColor : ''
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
    endDragParent(evt) {
      console.log("endDragParent ", evt);
      /*this.category.map(c => {
                                        console.log("c.name ", c.id, c.name);
                                    })*/
    },
    endDragChildren(evt) {
      /*console.log("endDragChildren ", evt);*/
      /*this.childrenCategory.map(c => {
                                        console.log("c.name ", c.id, c.name);
                                    })*/
    },
    /**
     * Parent Category 클릭 시, childrenCateogry를 출력
     */
    selectRootCategory(rootCategory) {
      this.selectedCategoryParent = rootCategory.id;
      if (rootCategory.children === undefined) {
        this.categoryData.children = [];
      } else {
        this.categoryData.children = rootCategory.children;
      }
    },
    categoryNameKeyUpEvent(event) {},
    openDialog() {
      this.dialog = true;
    },

    async deleteCategory() {
      let confirm = "카테고리를 삭제 하시겠습니까?";
      let result = await MODAL.confirm(confirm);
      if (result.value === undefined) return false;

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
    async insertCategory(flag) {
      let result = await Utils.getLocalStorage("loginInfo");

      let categoryName = this.categoryName.parent.trim();
      let categoryParent = 0;
      let depth = 1;

      if (flag === "children") {
        if (this.selectedCategoryParent === null) {
          alert("상위 카테고리를 지정하셔야 합니다.(클릭)");
          return false;
        }
        categoryName = this.categoryName.children.trim();
        categoryParent = this.selectedCategoryParent;
        depth = 2;
      }

      if (categoryName === "") {
        alert("카테고리명을 입력하세요.");
        return false;
      }

      let obj = new Object();
      obj.EMAIL = result.loginInfo.EMAIL;
      obj.CATEGORY_NAME = categoryName;
      obj.CATEGORY_PARENT = categoryParent;
      obj.DEPTH = depth;
      obj.SORT = 0;
      obj.DATE = new Date().getTime();

      //db 저장하기
      CONTENT_LISTENER.sendMessage({
        type: "insert.category.item",
        data: obj
      }).then(() => {
        EventBus.$emit("reload.category");
        this.initCategory();
        this.categoryName.parent = "";
        this.categoryName.children = "";
      });
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
      this.dialog = false;
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
</style>
