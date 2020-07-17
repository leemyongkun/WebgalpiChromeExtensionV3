<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div v-for="(item, i) in category" :key="i">
      <!--:value="false"-->
      <v-list-group
        v-show="item.isShow === 'y'"
        sub-group
        @mouseover="item.mouseOver = true"
        @mouseleave="item.mouseOver = false"
        @click="selectParentCategory(item)"
        @dragover="dragOverInParentCategory(item)"
        @dragleave="dragLeave"
        :value="dragOverValue.includes(item.id)"
      >
        <!--                    :value="dragOverValue === item.id ? true : false" -->
        <!-- parent menu -->

        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              class="categoryName"
              v-text="item.name"
            ></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon
            @click="editCategory(item, $event, true, 'update')"
            v-show="item.mouseOver"
          >
            <v-icon dense size="18px" right>mdi-settings</v-icon>
          </v-list-item-icon>
        </template>

        <!-- child menu -->
        <div v-for="(subItem, index) in item.children" :key="subItem.name">
          <drop
            @drop="dropEvent"
            @dragover="subItem.dropOver = true"
            @dragleave="subItem.dropOver = false"
          >
            <!-- child menu -->
            <v-list-item
              style="padding-right: 3px;padding-left: 30px;"
              :style="subItem.dropOver ? overColor : ''"
              @click="selectCategory(subItem, $event)"
              @mouseover="subItem.mouseOver = true"
              @mouseleave="subItem.mouseOver = false"
              :id="subItem.id"
              :class="subItem.class"
            >
              <!--  <v-list-item-icon style="margin-right: 2px;">
                                                                                                                    <v-icon size="15px" color="green" left>mdi-folder-outline
                                                                                                                    </v-icon>
                                                                                                                </v-list-item-icon>-->

              <v-list-item-content :id="subItem.id">
                <v-list-item-title
                  class="categoryName"
                  v-html="getItemTitle(subItem.name, subItem.cnt)"
                  :id="subItem.id"
                ></v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon
                @click="editCategory(subItem, $event, false, 'update')"
                v-show="subItem.mouseOver"
              >
                <v-icon dense size="18px" right>mdi-settings</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </drop>
        </div>
      </v-list-group>
    </div>
    <v-card v-show="noChild" style="background-color: #e35a69; opacity: 0.8">
      <v-card-subtitle style="color: white"
        ><b
          >상위 카테고리에는 컨텐츠를 담을 수 없습니다. 하위 카테고리를 만들어
          시도 해보세요.<br /><br />
          ※ 10초 후, 자동으로 사라집니다.</b
        >
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import Utils from "../../utils/Utils";
import EventBus from "../../event-bus";

export default {
  components: {},
  data: () => ({
    timeoutRet: null,
    noChild: false, //드래그 했을때, 자식 카테고리가 없을 경우 메시지를 열기위한 변수
    dragOverValue: [], //아이템 Drag 했을 시, 상위 카테고리가 열리도록 하기 위한 변수이며, 또한, 검색했을 시, 모든 메뉴를 펼친다.
    category: [],
    originalCategory: [],
    dragOverTimeout: null, //dragOver 했을 때, 바로 열리게 되면 정신 없으므로, 약간의 텀을 주기 위해 timeout을 넣는다. 만약 mouseLeave 했을 시, 해당 값은 clear 처리 한다.
    overColor: "background-color: rgba(255, 0, 0, 0.3); border-radius: 10px;" //드래드 시 오버 대상에 마우스 over 했을때 스타일
  }),
  created() {},
  methods: {
    search(keyword) {
      if (keyword === null || keyword.trim() === "") {
        this.dragOverValue = [];
        this.category.map(item => {
          item.isShow = "y";
        });
        return false;
      }

      let parent = new Array();
      this.originalCategory.filter(item => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          //상위카테고리만 가져온다
          if (item.parent === 0) {
            parent.push(item.id);
          } else {
            parent.push(item.parent);
          }
        }
      });

      this.category.map(item => {
        if (!parent.includes(item.id)) {
          item.isShow = "n";
        } else {
          item.isShow = "y";
          this.dragOverValue.push(item.id);
        }
      });
    },
    dragLeave() {
      clearTimeout(this.dragOverTimeout);
    },
    dragOverInParentCategory(item) {
      this.dragOverTimeout = setTimeout(() => {
        if (this.dragOverValue.includes(item.id)) return false;
        this.dragOverValue = [];
        this.dragOverValue.push(item.id);

        if (item.children === undefined) {
          this.noChild = true; //메시지를 열것인가 체크
          clearTimeout(this.timeoutRet);
          this.timeoutRet = setTimeout(() => {
            this.noChild = false;
            clearTimeout(this.timeoutRet);
          }, 10000); //메시지를 10초간 유지하며, 마우스가 올라가있는동안은 없어지지 않도록 한다.
        } else {
          this.noChild = false;
        }
      }, 400);
    },
    async getCategory() {
      let result = await Utils.getLocalStorage("loginInfo");
      CONTENT_LISTENER.sendMessage({
        type: "get.category",
        data: [result.loginInfo.EMAIL]
      }).then(category => {
        this.category = [];
        if (category.length !== 0) {
          Object.assign(this.originalCategory, category);
          this.category = Utils.generateTree(category, 0);
        }
      });
    },
    dropEvent(data, event) {
      if (event.target.id === "") {
        EventBus.$emit(
          "open.snack",
          "카테고리 저장에 실패하였습니다. 다시 시도바랍니다.",
          "error"
        );
        return false;
      }

      this.category.forEach(item => {
        if (item.children !== undefined) {
          item.children.forEach(subItem => {
            subItem.dropOver = false;
          });
        }
      });

      /**
                 *
                 ## 이미 포함 ##
                 param.CATEGORY_ID,
                 param.URL_KEY, //"URL_KEY":
                 param.EMAIL, //"EMAIL":
                 param.IDX, //"SITE_IDX":

                 */

      data.CATEGORY_ID = event.target.id;
      data.DATE_CREATE = new Date().getTime();

      CONTENT_LISTENER.sendMessage({
        type: "post.category.relation",
        data: data
      }).then(() => {
        EventBus.$emit("reload.category");
        EventBus.$emit("hideSite", data.URL_KEY);
        EventBus.$emit("open.snack", "카테고리에 저장되었습니다.", "primary");
      });
    },
    getItemTitle(title, count) {
      return (
        title + ` <span class='red--text text--lighten-2'> ` + count + `</span>`
      );
    },
    editCategory(item, event, checkRoot, statusFlag) {
      event.preventDefault();
      event.stopPropagation();

      EventBus.$emit("edit.category", item, checkRoot, statusFlag, "CUSTOM");
    },
    selectCategory(category, event) {
      EventBus.$emit("select.category", category, event);
      EventBus.$emit("select.parent.category", category.parent);
    },
    selectParentCategory(item) {
      EventBus.$emit("select.parent.category", item.id);
    }
  }
};
</script>
<style>
.categoryName {
  width: 50px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
