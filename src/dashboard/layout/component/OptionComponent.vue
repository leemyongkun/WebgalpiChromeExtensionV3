<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu top offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn text block v-on="on">
        <v-icon size="18px">mdi-settings</v-icon>
      </v-btn>
    </template>
    <v-card width="300px">
      <v-list v-for="(item, index) in menus" :key="index">
        <v-list-item @click="selectOption(item)">
          <v-list-item-content class="mt-0 pt-0 pb-0">
            <v-list-item-title class="align-center">
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.subTitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <ThemeArea ref="theme"></ThemeArea>
    <ColorArea ref="color"></ColorArea>
    <SlackArea ref="slack"></SlackArea>
    <BookmarkArea ref="bookmark"></BookmarkArea>
  </v-menu>
</template>
<script>
import ThemeArea from "../../dialog/setting/ThemeArea";
import ColorArea from "../../dialog/setting/ColorArea";
import SlackArea from "../../dialog/setting/SlackArea";
import BookmarkArea from "../../dialog/setting/BookmarkArea";
import EventBus from "../../event-bus";
import SignArea from "../../dialog/setting/SignArea";

export default {
  components: { SignArea, BookmarkArea, SlackArea, ColorArea, ThemeArea },
  computed: {},
  props: [],
  data: () => ({
    menus: [
      {
        code: "color",
        title: "COLOR",
        subTitle: "원하는 색상의 하이라이트 컬러를 지정."
      },
      {
        code: "theme",
        title: "THEME",
        subTitle: "화면의 테마를 변경."
      },
      {
        code: "slack",
        title: "SLACK",
        subTitle: "자신의 컨텐츠를 슬랙 채널에 공유."
      },
      {
        code: "bookmark",
        title: "BOOKMARK (준비중)",
        subTitle: "자신의 북마크로부터 추가."
      }
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    selectOption(item) {
      if (item.code === "theme") {
        this.$refs.theme.open();
      } else if (item.code === "color") {
        this.$refs.color.open();
      } else if (item.code === "slack") {
        this.$refs.slack.open();
      } else if (item.code === "bookmark") {
        EventBus.$emit(
          "open.snack",
          "Import Bookmark 기능은 준비중입니다.",
          "green"
        );
        this.$refs.bookmark.open();
      }
    }
  }
};
</script>
