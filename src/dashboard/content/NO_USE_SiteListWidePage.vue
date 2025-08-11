<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>
    <v-col v-for="item in sites" :cols="3" :key="item.URL_KEY">
      <v-card max-width="344" class="mx-auto">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">{{
              item.TITLE
            }}</v-list-item-title>
            <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-img :src="item.OG_IMAGE" height="194"></v-img>

        <v-card-text>
          {{ item.OG_DESCRIPTION }}
        </v-card-text>

        <v-card-actions>
          <v-btn text color="deep-purple accent-4">
            Read
          </v-btn>
          <v-btn text color="deep-purple accent-4">
            Bookmark
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
//https://www.npmjs.com/package/vue-drag-drop
//https://cameronhimself.github.io/vue-drag-drop/

import CONTENT_LISTENER from "../../common/content-listener";
import EventBus from "../event-bus";

export default {
  components: {},
  data: () => ({
    sites: []
  }),
  created() {},
  mounted() {
    this.getSites(null);
    //카테고리 클릭 시
    EventBus.$on("selectCategoryForSite", categoryInfo => {
      if (categoryInfo === 0) {
        //전체일
        this.getSites(null);
      } else {
        let param = [categoryInfo.id];
        this.getSites(param);
      }
    });
  },

  methods: {
    getSites(param) {
      CONTENT_LISTENER.sendMessage({
        type: "get.sites",
        data: param
      }).then(response => {
        this.sites = response;
      });
    }
  }
};
</script>

<style>
.v-card--reveal {
  /*align-items: left;
                                                                                            justify-content: center;*/
  padding-left: 3px;
  justify-content: center;
  bottom: 0;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

.border {
  border: 2px dashed orange;
}
</style>
