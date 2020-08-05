<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="40%"
    overlay-opacity="1.0"
  >
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-card-title>
            모아보기
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-select
                  :items="groupList"
                  item-value="GROUP_ID"
                  item-text="GROUP_NAME"
                  v-model="selectGroup"
                  label="TAB GROUP"
                  dense
                  outlined
                  @change="detailGroup"
                ></v-select>
              </v-col>
              <v-col cols="auto">
                <v-tooltip v-model="tooltip.delete" color="blue" top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteGroup"
                      :disabled="deleteBtnDisabled"
                      v-on="on"
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>TAB GROUP을 삭제합니다.</span>
                </v-tooltip>

                <v-tooltip v-model="tooltip.filter" color="blue" top>
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" icon @click="runOneTab" v-on="on">
                      <v-icon>mdi-filter</v-icon>
                    </v-btn>
                  </template>
                  <span>열려있는 모든 탭을 모아서 관리합니다.</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="tabList"
                  :items-per-page="1000"
                  :hide-default-footer="true"
                >
                  <template v-slot:item.TITLE="{ item }">
                    <img :src="`chrome://favicon/` + item.URL" />&nbsp;&nbsp;{{
                      item.TITLE
                    }}
                  </template>

                  <template v-slot:item.URL_KEY="{ item }">
                    <!--  <v-btn
                                                                                        color="green"
                                                                                        icon
                                                                                        @click="importSite(item)"
                                                                                        v-show="isCrawlingInvalidSite(item)"
                                                                                >
                                                                                    <v-icon>mdi-cloud-download-outline</v-icon>
                                                                                </v-btn>-->
                    <!-- <v-btn color="red" icon @click="removeSite(item)">
                                                                                                         <v-icon>mdi-trash-can-outline</v-icon>
                                                                                                     </v-btn>-->
                    <v-btn icon @click="goSourceSite(item)">
                      <v-icon>mdi-home-outline</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close">
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>
<script>
import ONETAB from "../../common/onetab";
import CONTENT_LISTENER from "../../common/content-listener";
import CRAWLER from "../common/cheerio";
import EventBus from "../event-bus";
import MODAL from "../../common/modal";
import SITE_MANAGER from "../../common/site-manager";
import Utils from "../utils/Utils";
import LANG from "../../common/language";

export default {
  props: [],
  data: () => ({
    deleteBtnDisabled: true,
    dialog: false,
    tabList: [],
    groupList: [],
    selectGroup: 0,
    selected: [],
    groupHeaders: [
      {
        text: "저장일자",
        align: "left",
        value: "GROUP_ID",
        width: "80%"
      },
      {
        text: "TAB 갯수",
        align: "center",
        sortable: false,
        value: "TAB_COUNT",
        width: "20%"
      }
    ],
    headers: [
      {
        text: "TITLE",
        align: "left",
        value: "TITLE",
        width: "70%"
      },
      {
        text: "",
        align: "right",
        sortable: false,
        value: "URL_KEY",
        width: "30%"
      }
    ],
    tooltip: {
      delete: false,
      filter: false
    }
  }),
  created() {},
  mounted() {},
  methods: {
    async deleteGroup() {
      let ret = await MODAL.confirm(
        `선택 한 TAB GROUP을 삭제하시겠습니까?<br>(모든 TAB 정보가 삭제됩니다.)`,
        "info",
        null,
        null,
        "450px"
      );
      if (ret.value) {
        let result = await Utils.getLocalStorage("loginInfo");
        let param = new Object();
        param.GROUP_ID = this.selectGroup;
        param.EMAIL = result.loginInfo.EMAIL;

        CONTENT_LISTENER.sendMessage({
          type: "delete.tabinfo.group",
          data: param
        }).then(res => {
          if (res) {
            this.tabList = [];
            this.getTabInfoGroupWithTabDetailInfo();
          }
        });
      }
    },
    detailGroup(groupId) {
      let param = new Object();
      param.GROUP_ID = groupId;
      this.getTabInfo(param);
    },
    async runOneTab() {
      let ret = await MODAL.confirm(
        "현재 탭을 제외한 모든 윈도우와 탭이 닫힙니다.<br>",
        "info",
        null,
        null,
        "450px"
      );
      if (ret.value) {
        let list = await ONETAB.closeAllTab();
        await ONETAB.insertTabInfo(list);
        this.getTabInfoGroupWithTabDetailInfo();
      }
    },
    async getTabInfoGroupWithTabDetailInfo() {
      let result = await Utils.getLocalStorage("loginInfo");
      let param = new Object();
      param.EMAIL = result.loginInfo.EMAIL;

      return CONTENT_LISTENER.sendMessage({
        type: "select.tabinfo.group",
        data: param
      }).then(tabGroup => {
        this.groupList = tabGroup;
        if (this.groupList.length !== 0) {
          this.convertGroupList();
          this.selectGroup = this.groupList[0].GROUP_ID;
          this.getTabInfo(this.groupList[0]);
          this.deleteBtnDisabled = false;
        }
      });
    },
    convertGroupList() {
      this.groupList.map(item => {
        item.GROUP_NAME =
          new Date(item.GROUP_ID).format(
            "(E) yyyy년 MM월 dd일 a/p hh시 mm분 ss초"
          ) +
          " ( " +
          item.TAB_COUNT +
          "건 )";
      });
    },

    async openOneTabFromContextMenu() {
      this.dialog = true;
      this.getTabInfoGroupWithTabDetailInfo().then(() => {
        this.runOneTab();
      });
    },
    async open() {
      this.dialog = true;
      this.getTabInfoGroupWithTabDetailInfo();
    },
    close() {
      this.dialog = false;
    },
    goSourceSite(item) {
      chrome.tabs.create({ url: item.URL });
    },
    removeSite(item) {},
    async getTabInfo(groupInfo) {
      let result = await Utils.getLocalStorage("loginInfo");
      groupInfo.EMAIL = result.loginInfo.EMAIL;
      CONTENT_LISTENER.sendMessage({
        type: "get.tabinfos",
        data: groupInfo
      }).then(detail => {
        this.tabList = detail;
      });
    }
  }
};
</script>
