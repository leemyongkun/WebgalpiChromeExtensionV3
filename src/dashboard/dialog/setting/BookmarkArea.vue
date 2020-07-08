<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" persistent max-width="900" overlay-opacity="0.9">
    <v-card>
      <v-card-title class="headline"
        >Bookmark를 WEBGALPI로 Import합니다.
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <div style="max-height: 500px" class="overflow-y-auto">
              <v-treeview
                v-model="selectedBookmark"
                return-object
                hoverable
                selectable
                selected-color="red"
                item-text="title"
                :items="bookmarks"
              ></v-treeview>
            </div>
          </v-col>
          <v-divider vertical />
          <v-col cols="4">
            <v-btn
              block
              small
              outlined
              style="margin-top: 10px;"
              @click="runCrawling"
            >
              실행
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">취소 </v-btn>
        <v-btn color="green darken-1" text @click="check">데이타 체크</v-btn>
        <v-btn color="green darken-1" text @click="getData">GET DATA</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import CRAWLER from "../../common/cheerio";

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
    }
  }),
  created() {},
  mounted() {},
  methods: {
    async runCrawling() {
      //console.log("selectedBookmark ", this.selectedBookmark);
      /*   if(this.selectedBookmark.length === 0){
            alert("선택 된 BOOKMARK가 없습니다.");
            return false;
        }*/

      /*if(this.selectedBookmark.length > 10){
            alert("한번에 10개 까지 가능합니다.");
            return false;
        }*/

      this.selectedBookmark.map(async bookmark => {
        //console.log("bookmark >> " , bookmark.url);
        let result = await CRAWLER.getImportSiteContents(bookmark.url);
        console.log(
          "================================================== ",
          result
        );
      });

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
    getData() {
      this.selectedBookmark.map(bookmark => {
        axios
          .get(bookmark.url)
          .then(result => {
            result.bookmarkInfo = bookmark;
            this.crawling.complete.push(result);
          })
          .catch(error => {
            error.bookmarkInfo = bookmark;
            this.crawling.fail.push(error);
          });
      });

      this.check();
    },
    check() {
      /* console.log("selectedBookmark ", this.selectedBookmark);
      console.log("crawling.complete ", this.crawling.complete);
      console.log("crawling.fail ", this.crawling.fail);*/
    },
    getBookmarks() {
      chrome.bookmarks.getTree(itemTree => {
        this.bookmarks = itemTree[0].children;
      });
    }
  }
};
</script>
