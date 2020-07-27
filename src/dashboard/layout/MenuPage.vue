<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <UpdateCategoryDialog ref="updateCategoryDialog"></UpdateCategoryDialog>
    <NewUpdateCategoryDialog
      ref="newUpdateCategoryDialog"
      :key="updateCategoryDialogKey"
    ></NewUpdateCategoryDialog>
    <!--<SettingsManagerDialog
                                  :dialog="settingDialog"
                                  @closeDialog="switchDialogSetting"
                                ></SettingsManagerDialog>-->

    <v-navigation-drawer permanent v-model="drawer" app clipped>
      <v-list dense>
        <v-row align="center">
          <v-col style="padding-bottom:0px; padding-top:0px;">
            <v-expansion-panels focusable multiple v-model="panel">
              <v-expansion-panel>
                <!-- <v-expansion-panel-header>CATEGORY</v-expansion-panel-header>-->

                <v-row>
                  <v-col cols="auto"></v-col>
                  <v-col cols="auto">
                    <!-- ######## 카테고리 추가 ########-->
                    <v-tooltip
                      v-model="categoryBtnTooltip.plus"
                      color="blue"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon
                          left
                          v-on="on"
                          @click="editCategory(null, $event, false, 'insert')"
                          color="success"
                          >mdi-folder-plus-outline
                        </v-icon>
                      </template>
                      <span>
                        <b
                          >새로운 카테고리를 생성하여,<br />컨텐츠를
                          분류해보세요.
                        </b>
                      </span>
                    </v-tooltip>

                    <!-- ######## 카테고리 검색 ########-->
                    <!-- <v-tooltip
                                                              v-model="categoryBtnTooltip.search"
                                                              color="blue"
                                                              top
                                                            >
                                                              <template v-slot:activator="{ on }">
                                                                <v-icon
                                                                  left
                                                                  v-on="on"
                                                                  @click="isShowSearchFieldToggle"
                                                                  color="info"
                                                                  >mdi-folder-search-outline
                                                                </v-icon>
                                                              </template>
                                                              <span>
                                                                <b
                                                                  >카테고리가 많으신가요?<br />검색을 통해 빠르게
                                                                  찾아보세요.
                                                                </b>
                                                              </span>
                                                            </v-tooltip>-->

                    <!-- ######## 카테고리 정렬 ########-->
                    <v-tooltip
                      v-model="categoryBtnTooltip.sort"
                      color="blue"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon
                          left
                          v-on="on"
                          @click="sortCategory"
                          color="grey"
                          >mdi-folder-download-outline
                        </v-icon>
                      </template>
                      <span>
                        개발중입니다
                        <!--<b>카테고리를 원하는 순서로 변경할 수 있습니다.</b>-->
                      </span>
                    </v-tooltip>

                    <!-- 카테고리 검색 영역 -->
                    <v-text-field
                      ref="categorySearchField"
                      v-show="isShowSearchField"
                      v-model="keyword"
                      @keyup="searchCategory"
                      @click:clear="searchClear"
                      dense
                      clearable
                      placeholder="카테고리 검색"
                      prepend-inner-icon="mdi-magnify"
                      style="width: 90%"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider />
                <v-expansion-panel-content>
                  <v-list>
                    <!-- SYSTEM CATEGORY : START -->
                    <SystemCategoryComponent ref="systemCategoryComponent" />

                    <!-- CATEGORY :START -->
                    <CategoryComponent ref="categoryComponent" />
                  </v-list>

                  <!-- 미아가 된 카테고리 -->
                  <LostCategoryComponent ref="lostCategoryComponent" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- CATEGORY : END -->
      </v-list>

      <!--<template v-slot:append>
                                <OptionComponent></OptionComponent>
                              </template>-->
    </v-navigation-drawer>

    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      :color="`success`"
      top
    >
      {{ snackbarMessage }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
//https://cameronhimself.github.io/vue-drag-drop/
import CONTENT_LISTENER from "../../common/content-listener";
import SettingsManagerDialog from "../dialog/SettingsManagerDialog";
import EventBus from "../event-bus";
import UpdateCategoryDialog from "./dialog/UpdateCategoryDialog";

import LostCategoryComponent from "./component/LostCategoryComponent";
import SystemCategoryComponent from "./component/SystemCategoryComponent";
import CategoryComponent from "./component/CategoryComponent";
import NewUpdateCategoryDialog from "./dialog/NewUpdateCategoryDialog";

export default {
  components: {
    NewUpdateCategoryDialog,
    CategoryComponent,
    SystemCategoryComponent,
    UpdateCategoryDialog,
    SettingsManagerDialog,
    LostCategoryComponent
  },
  data: () => ({
    categoryBtnTooltip: {
      plus: false,
      search: false,
      sort: false
    },
    isShowSearchField: true,
    panel: [0], //accordian 의 오픈 index
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    categoryDialog: false, //카테고리 다이얼로그 open / close 여부
    settingDialog: false, //Setting 다이얼로그 open / close 여부
    drawer: true, //왼쪽 메뉴 open / close 여부
    selectedParentCategoryId: 0, //선택된 Parent Category Id를 임시 저장해둔다.
    keyword: "", //검색키워드
    updateCategoryDialogKey: 0
  }),
  created() {
    this.$nextTick(() => {
      EventBus.$on("reload.category", () => {
        this.getReloadCategory();
      });

      EventBus.$on(
        "edit.category",
        (item, checkRoot, statusFlag, categoryFlag) => {
          this.$refs.updateCategoryDialog.openDialog(
            item,
            categoryFlag === "SYSTEM"
              ? this.$refs.systemCategoryComponent.systemCategory
              : this.$refs.categoryComponent.category,
            checkRoot,
            statusFlag, //update , insert
            categoryFlag //system / custom/ lost
          );
        }
      );

      EventBus.$on("select.parent.category", categoryId => {
        this.selectedParentCategoryId = categoryId;
      });

      EventBus.$on("select.category", (category, event) => {
        this.selectCategory(category, event);
      });
    });
  },
  methods: {
    /*isShowSearchFieldToggle() {
                      this.isShowSearchField = !this.isShowSearchField;
                      setTimeout(() => {
                        this.$refs.categorySearchField.focus();
                        this.searchClear();
                      }, 100);
                    },*/
    dialogCloseEvent() {
      this.updateCategoryDialogKey += 1;
    },
    searchCategory() {
      this.$refs.categoryComponent.search(this.keyword);
    },
    searchClear() {
      this.keyword = "";
      this.$refs.categoryComponent.search(this.keyword);
    },
    sortCategory() {
      /*EventBus.$emit("open.snack", "준비중입니다.");*/
    },
    getReloadCategory() {
      //카테고리를 가져온다.
      this.$refs.systemCategoryComponent.getSystemCategory();
      this.$refs.lostCategoryComponent.getLostCategory();
      this.$refs.categoryComponent.getCategory();
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();
      this.$refs.newUpdateCategoryDialog.openDialog();

      /*this.$refs.updateCategoryDialog.openDialog(
                            item,
                            this.$refs.categoryComponent.category, // 어차피 대상은 이 category 뿐이므로..
                            checkRoot,
                            statusFlag, //update , insert
                            "CUSTOM"
                          );*/
    },
    selectCategory(category, event) {
      this.clearCheckCategory();

      if (category !== 0) category.class = "border";

      EventBus.$emit("selectCategoryForSite", category);
    },
    clearCheckCategory() {
      //선택 영역을 지운다. (클릭할때마다)
      let categoryList = [
        this.$refs.categoryComponent.category,
        this.$refs.systemCategoryComponent.systemCategory,
        this.$refs.lostCategoryComponent.lostCategory
      ];
      categoryList.forEach(category => {
        category.forEach(item => {
          if (item.children !== undefined) {
            item.children.forEach(subItem => {
              subItem.class = "";
            });
          }
        });
      });
    },
    switchDialogSetting() {
      this.settingDialog = !this.settingDialog;
    }
  }
};
</script>
<style>
.drop.over {
  border-color: #aaa;
  background: #ccc;
}

.border {
  border: 2px dashed orange;
}

.v-expansion-panel-header {
  min-height: 45px !important;
}

.v-expansion-panel-content__wrap {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.v-list-group__header {
  padding-left: 10px !important;
}

.v-list-item__icon {
  margin-right: 5px !important;
}

.v-list-item__action {
  margin-right: 10px !important;
}
</style>
