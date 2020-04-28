<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <UpdateCategoryDialog ref="updateCategoryDialog"></UpdateCategoryDialog>

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
                <v-expansion-panel-header>CATEGORY</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-btn
                    block
                    small
                    @click="editCategory(null, $event, false, 'insert')"
                    style="margin-top: 10px;"
                  >
                    <v-icon left>mdi-folder-plus</v-icon>
                    CATEGORY
                  </v-btn>

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

      <template v-slot:append>
        <OptionComponent></OptionComponent>
      </template>
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
import OptionComponent from "./component/OptionComponent";

export default {
  components: {
    OptionComponent,
    CategoryComponent,
    SystemCategoryComponent,
    UpdateCategoryDialog,
    SettingsManagerDialog,
    LostCategoryComponent
  },
  data: () => ({
    panel: [0], //accordian 의 오픈 index
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    categoryDialog: false, //카테고리 다이얼로그 open / close 여부
    settingDialog: false, //Setting 다이얼로그 open / close 여부
    drawer: true //왼쪽 메뉴 open / close 여부
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
            this.$refs.categoryComponent.category,
            checkRoot,
            statusFlag, //update , insert
            categoryFlag //system / custom/ lost
          );
        }
      );

      EventBus.$on("select.category", (category, event) => {
        this.selectCategory(category, event);
      });
    });
  },
  methods: {
    getReloadCategory() {
      //카테고리를 가져온다.
      this.$refs.systemCategoryComponent.getSystemCategory();
      this.$refs.lostCategoryComponent.getLostCategory();
      this.$refs.categoryComponent.getCategory();
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();
      this.$refs.updateCategoryDialog.openDialog(
        item,
        this.$refs.categoryComponent.category, // 어차피 대상은 이 category 뿐이므로..
        checkRoot,
        statusFlag, //update , insert
        "CUSTOM"
      );
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
