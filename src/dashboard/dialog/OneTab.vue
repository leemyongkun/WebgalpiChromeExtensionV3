<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="40%"
    overlay-opacity="1.0"
  >
    <v-row>
      <!-- <v-col cols="4">
                 <v-card class="mx-auto">
                     <v-card-title>
                         모아보기 이력
                     </v-card-title>
                     <v-card-text>
                         <v-data-table
                                 v-model="group"
                                 :headers="groupHeaders"
                                 :items="groupList"
                                 :items-per-page="1000"
                                 :hide-default-footer="true"
                                 @click:row="detailGroup"
                         >
                             <template v-slot:item.GROUP_ID="{ item }">
                                 {{ getConvertDate(item.GROUP_ID) }}
                             </template>
                         </v-data-table>
                     </v-card-text>
                 </v-card>
             </v-col>-->
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-card-title>
            모아보기
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  :items="groupList"
                  item-value="GROUP_ID"
                  item-text="GROUP_NAME"
                  v-model="selectGroup"
                  label="TAB GROUP"
                  dense
                  outlined
                  class="ma-1"
                  @change="detailGroup"
                  style="width: 80%"
                ></v-select>
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
                    <v-btn
                      color="green"
                      icon
                      @click="importSite(item)"
                      v-show="isCrawlingInvalidSite(item)"
                    >
                      <v-icon>mdi-cloud-download-outline</v-icon>
                    </v-btn>
                    <v-btn color="red" icon @click="removeSite(item)">
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
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

export default {
  props: [],
  data: () => ({
    dialog: false,
    tabList: [],
    groupList: [],
    selectGroup: 0,
    selected: [],
    group: [],
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
      source: false,
      import: false
    }
  }),
  created() {},
  mounted() {},
  methods: {
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
      return CONTENT_LISTENER.sendMessage({
        type: "select.tabinfo.group",
        data: null
      }).then(tabGroup => {
        this.groupList = tabGroup;
        if (this.groupList.length !== 0) {
          this.convertGroupList();
          this.selectGroup = this.groupList[0].GROUP_ID;
          this.getTabInfo(this.groupList[0]);
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
    async open() {
      this.dialog = true;
      this.getTabInfoGroupWithTabDetailInfo().then(() => {
        this.runOneTab();
      });
    },
    close() {
      this.dialog = false;
    },
    goSourceSite(item) {
      chrome.tabs.create({ url: item.URL });
    },
    removeSite(item) {},
    getTabInfo(groupInfo) {
      CONTENT_LISTENER.sendMessage({
        type: "get.tabinfos",
        data: groupInfo
      }).then(detail => {
        this.tabList = detail;
      });
    },
    isCrawlingInvalidSite(item) {
      for (var i = 0; i < SITE_MANAGER.DETECTE_SITES.length; i++) {
        if (item.URL.indexOf(SITE_MANAGER.DETECTE_SITES[i]) !== -1) {
          return false;
        }
      }

      if (item.URL_KEY !== null) {
        return false;
      }
      return true;
    },
    async importSite(item) {
      CRAWLER.getImportSiteContents(item.url)
        .then(result => {
          if (
            result.OG_DESCRIPTION === undefined &&
            result.OG_IMAGE === undefined &&
            result.OG_TITLE === undefined
          ) {
            alert("크롤링 할 수 없는 사이트입니다. 직접 가서 하실래요?");
            return false;
          }

          if (result.TITLE === undefined) {
            alert(
              "정상적으로 크롤링 할 수 없는 사이트입니다. 직접가서 할래요?"
            );
            return false;
          }
          CONTENT_LISTENER.sendMessage({
            type: "post.site",
            data: result
          }).then(() => {
            EventBus.$emit("open.snack", "IMPORT 되었습니다.", "primary");
          });
        })
        .catch(err => {
          alert("크롤링에 실패 했습니다. 방문하여 저장하세요.");
        });
    }
  }
};
</script>
