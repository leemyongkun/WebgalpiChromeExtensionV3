<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="900">
      <v-card>
        <v-card-title class="headline"
          >Bookmark를 WEBGALPI로 Import합니다.</v-card-title
        >
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
              <v-btn block small outlined style="margin-top: 10px;">
                실행
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false"
            >취소</v-btn
          >
          <v-btn color="green darken-1" text @click="check">데이타 체크</v-btn>
          <v-btn color="green darken-1" text @click="getData">GET DATA</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from "axios";

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
    open() {
      this.dialog = true;
      this.getBookmarks();
    },
    close() {
      this.dialog = false;
    },
    getData() {
      console.log("this.selectedBookmark ", this.selectedBookmark);
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
      console.log("selectedBookmark ", this.selectedBookmark);
      console.log("crawling.complete ", this.crawling.complete);
      console.log("crawling.fail ", this.crawling.fail);
    },
    getBookmarks() {
      chrome.bookmarks.getTree(itemTree => {
        this.bookmarks = itemTree[0].children;
      });
    }
  }
};
</script>
