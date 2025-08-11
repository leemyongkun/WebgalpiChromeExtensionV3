<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" persistent max-width="55%" overlay-opacity="0.9">
    <v-card>
      <v-card-title class="headline"
        >IMPORT BOOKMARK {{ isCrawling }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="7" style="border-right: 3px dashed;">
            <div style="max-height: 500px" class="overflow-y-auto">
              <v-treeview
                v-model="selectedBookmark"
                return-object
                hoverable
                selectable
                selected-color="red"
                item-text="title"
                :items="bookmarks"
              >
                <template v-slot:append="{ item }">
                  <v-icon
                    v-if="item.children === undefined"
                    @click="goSourceSite(item)"
                  >
                    mdi-home-outline
                  </v-icon>
                </template>
              </v-treeview>
            </div>
          </v-col>
          <v-col cols="5">
            <div style="color: #ff585f">
              {{ LANG.DESCRIPTION_MESSAGE("D0048") }}
            </div>
            <div class="pt-4">
              <v-select
                :items="category"
                item-value="id"
                item-text="name"
                v-model="selectCategory"
                label="CATEGORY"
                dense
                outlined
                class="ma-1"
              ></v-select>
            </div>
            <div>
              <v-btn
                block
                small
                color="success"
                @click="runCrawling"
                :disabled="
                  selectedBookmark.length === 0 || selectedBookmark.length > 10
                    ? true
                    : false
                "
              >
                실행
              </v-btn>
            </div>
            <div style="max-height: 500px" class="overflow-y-auto">
              <v-list dense class="pt-0 pb-0">
                <v-list-item
                  class="pr-0 pl-0"
                  v-for="(bookmark, index) in selectedBookmark"
                  :key="index"
                >
                  <v-list-item-content class="pt-0 pb-0">
                    <div>
                      <span>{{ getBookmarkStatus(bookmark.id) }}</span>
                      {{ index + 1 }}. {{ bookmark.title }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">
          {{ LANG.BUTTON_MESSAGE("B0010") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CRAWLER from "../../common/cheerio";
import CONTENT_LISTENER from "../../../common/content-listener";
import LANG from "../../../common/language";

let md5 = require("md5");

export default {
  components: {},
  props: [],
  data: () => ({
    dialog: false,
    bookmarks: [],
    selectedBookmark: [],
    crawling: {
      complete: [],
      fail: []
    },
    category: [],
    selectCategory: null,
    runHistory: new Map(),
    isCrawling: false,
    LANG: LANG
  }),
  created() {
    this.$nextTick(() => {
      this.setCategory();
    });
  },
  mounted() {},
  watch: {
    selectedBookmark() {
      /*   if (this.selectedBookmark.length > 10) {
                                 alert("10개이상 안됨");
                                 return false;
                             }*/

      this.selectedBookmark.forEach(item => {
        if (item.url !== undefined) {
          item.url_key = md5(item.url.split("#")[0]);
          item.result = 0; //0:대기 , 1:성공 , 2:실패

          /*chrome.storage.local.get(["loginInfo"], result => {
                                          let email = result.loginInfo.EMAIL;

                                          let param = new Object();
                                          param.EMAIL = email;
                                          param.URL_KEY = item.url_key;
                                          CONTENT_LISTENER.sendMessage({
                                              type: "get.site.info",
                                              data: param
                                          }).then(site => {
                                              console.log("site ", item, site)
                                              if (site.length === 0) {
                                                  item.isAlready = false; //이미 있는지 확인
                                              } else {
                                                  item.isAlready = true;
                                              }
                                          });
                                      });*/
        }
      });
    }
  },
  methods: {
    goSourceSite(item) {
      chrome.tabs.create({ url: item.url });
    },
    getBookmarkStatus(bookmarkId) {
      if (this.runHistory.size === 0) return 0;
      return this.runHistory.get(Number(bookmarkId));
    },
    async runCrawling() {
      this.isCrawling = true;
      const promise = this.selectedBookmark.map(bookmark => {
        CRAWLER.getImportSiteContents(bookmark.url)
          .then(result => {
            this.runHistory.set(Number(bookmark.id), 1);
          })
          .catch(error => {
            this.runHistory.set(Number(bookmark.id), 2);
          });
      });

      await Promise.all(promise);

      /*console.log("selectedBookmark ", this.selectedBookmark);
                          const promise= this.selectedBookmark.map(async bookmark => {
                              //console.log("bookmark >> " , bookmark.url);
                              let result = await CRAWLER.getImportSiteContents(bookmark.url);
                              console.log(
                                  "================================================== ",
                                  result
                              );
                              bookmark.result = 1;
                          });

                          await Promise.all(promise);*/

      /* var url = "http://lemonweb/MyDesk/Home/Index/160";
                          url = "https://www.fnnews.com/news/202004231837158267";*/
      //url = "http://182.162.91.27:7614/admin-webapp/";

      /*
                            DEFAULT_CATEGORY_IDX: 0
                            EMBEDURL: ""
                            FULL_TEXT: ""
                            HOST: "http://egloos.zum.com"
                            OG_DESCRIPTION: ""
                            OG_IMAGE: ""
                            OG_TITLE: ""
                            READERMODE_CONTENTS: ""
                            TAGS: ""
                            TITLE: "S2 & NAMU"
                            UPDATE_TITLE: "S2 & NAMU"
                            URL: "http://egloos.zum.com/littletrue/v/3987863"
                            URL_KEY: "10976b60347df5f9ab327e8f6a30be14"
                            URL_TYPE: "WEB"
                            USE_CURRENT_SITE: "N"
                            */

      //await CRAWLER.getOriginalSiteContents(url);
    },
    open() {
      this.dialog = true;
      this.getBookmarks();
    },
    close() {
      this.dialog = false;
    },

    getBookmarks() {
      chrome.bookmarks.getTree(itemTree => {
        this.bookmarks = itemTree[0].children;
      });
    },
    setCategory() {
      chrome.storage.local.get(["loginInfo"], result => {
        let param = new Object();
        param.EMAIL = result.loginInfo.EMAIL;

        CONTENT_LISTENER.sendMessage({
          type: "get.category",
          data: param
        }).then(category => {
          // 오름차순
          if (category !== undefined) {
            category.sort(function(a, b) {
              return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
            });

            this.category = category.filter(item => {
              return item.parent !== 0;
            });

            this.category.unshift({ id: -1, name: "NO CATEGORY" });

            if (this.category.length !== 0) {
              this.selectCategory = this.category[0].id;
            }
          }
        });
      });
    }
  }
};
</script>
