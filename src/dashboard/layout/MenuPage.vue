<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <!--<UpdateCategoryDialog ref="updateCategoryDialog"></UpdateCategoryDialog>-->
    <NewUpdateCategoryDialog
      ref="newUpdateCategoryDialog"
      :key="updateCategoryDialogKey"
    ></NewUpdateCategoryDialog>
    <!--<SettingsManagerDialog
                                              :dialog="settingDialog"
                                              @closeDialog="switchDialogSetting"
                                            ></SettingsManagerDialog>-->

    <!--<v-navigation-drawer permanent v-model="drawer" app clipped>-->
    <v-navigation-drawer
      permanent
      ref="drawer"
      :width="navigation.width"
      v-model="navigation.shown"
    >
      <v-list dense style="padding-right: 5px;">
        <v-row align="center" style="padding-right: 5px;" class="pr-10">
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
                      location="top"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          elevation="0"
                          block
                          color="info"
                          class="pt-0 pb-1 mb-3"
                          style="height: 30px"
                          v-bind="props"
                          @click="editCategory($event)"
                        >
                          <v-icon size="18px">mdi-folder-edit-outline </v-icon
                          >&nbsp; {{ LANG.BUTTON_MESSAGE("B0001") }}
                        </v-btn>
                      </template>
                      <span v-html="LANG.DESCRIPTION_MESSAGE('D0002')" />
                    </v-tooltip>

                    <!-- 카테고리 검색 영역 -->
                    <v-text-field
                      :full-width="true"
                      ref="categorySearchField"
                      v-show="isShowSearchField"
                      v-model="keyword"
                      @keyup="searchCategory"
                      @click:clear="searchClear"
                      dense
                      clearable
                      :placeholder="LANG.DESCRIPTION_MESSAGE('D0001')"
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
import EventBus from "../event-bus";

import LostCategoryComponent from "./component/LostCategoryComponent";
import SystemCategoryComponent from "./component/SystemCategoryComponent";
import CategoryComponent from "./component/CategoryComponent";
import NewUpdateCategoryDialog from "./dialog/NewUpdateCategoryDialog";
import LANG from "../../common/language";

export default {
  components: {
    NewUpdateCategoryDialog,
    CategoryComponent,
    SystemCategoryComponent,
    LostCategoryComponent
  },
  data: () => ({
    navigation: {
      shown: false,
      width: 330,
      borderSize: 6
    },
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
    selectedParentCategoryId: 0, //선택된 Parent Category Id를 임시 저장해둔다.
    keyword: "", //검색키워드
    updateCategoryDialogKey: 0,
    LANG: LANG
  }),
  created() {
    this.$nextTick(() => {
      EventBus.$on("reload.category", () => {
        this.getReloadCategory();
      });

      EventBus.$on("select.parent.category", categoryId => {
        this.selectedParentCategoryId = categoryId;
      });

      EventBus.$on("select.category", (category, event) => {
        this.selectCategory(category, event);
      });
    });
  },
  mounted() {
    /** drawer width resize event */
    this.$nextTick(() => {
      this.setBorderWidth();
      this.setEvents();
    });
  },
  methods: {
    /** drawer width resize event */
    setBorderWidth() {
      // Skip border width setting for basic HTML drawer
      if (this.$refs.drawer && this.$refs.drawer.querySelector) {
        let i = this.$refs.drawer.querySelector(".v-navigation-drawer__border");
        if (i) {
          i.style.width = this.navigation.borderSize + "px";
          i.style.cursor = "ew-resize";
        }
      }
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer;
      if (!el) return;

      const drawerBorder = el.querySelector
        ? el.querySelector(".v-navigation-drawer__border")
        : null;

      // Skip event setup if drawerBorder doesn't exist (removed Vuetify components)
      if (!drawerBorder) {
        console.warn(
          "Drawer border element not found - skipping resize events"
        );
        return;
      }

      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right")
        ? "right"
        : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f =
          direction === "right"
            ? document.body.scrollWidth - e.clientX
            : e.clientX;

        if (f < 330 || f > 500) return;

        el.style.width = f + "px";
      }

      drawerBorder.addEventListener(
        "mousedown",
        e => {
          if (e.offsetX < minSize) {
            el.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        () => {
          el.style.transition = "";
          this.navigation.width = el.style.width;
          document.body.style.cursor = "";
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    },
    /** drawer width resize event */
    dialogCloseEvent() {
      this.getReloadCategory();
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
    editCategory(event) {
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

.v-expansion-panel::before {
  box-shadow: none !important;
}
</style>
