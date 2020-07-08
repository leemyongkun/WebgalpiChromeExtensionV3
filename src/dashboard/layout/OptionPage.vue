<template>
  <div>
    <!-- ONETAB -->
    <v-tooltip bottom color="blue">
      <template v-slot:activator="{ on }">
        <v-icon
          class="pr-2"
          v-on="on"
          size="20px"
          style="cursor: pointer"
          @click="openOneTab"
        >
          mdi-filter
        </v-icon>
      </template>
      <span>모든 창을 닫고 이력 관리</span>
    </v-tooltip>
    <OneTab ref="onetab"></OneTab>

    <!-- BOOKMARK -->
    <v-tooltip bottom color="blue">
      <template v-slot:activator="{ on }">
        <v-icon
          class="pr-2"
          v-on="on"
          size="20px"
          style="cursor: pointer"
          @click="openBookmarkArea"
        >
          mdi-bookmark-plus-outline
        </v-icon>
      </template>
      <span>IMPORT BOOKMARK</span>
    </v-tooltip>
    <BookmarkArea ref="bookmark"></BookmarkArea>

    <!-- THEME -->
    <v-tooltip bottom color="blue">
      <template v-slot:activator="{ on }">
        <v-icon
          class="pr-2"
          v-on="on"
          size="20px"
          style="cursor: pointer"
          @click="openThemeArea"
        >
          mdi-theme-light-dark
        </v-icon>
      </template>
      <span>대쉬보드의 테마설정</span>
    </v-tooltip>
    <ThemeArea ref="theme"></ThemeArea>

    <!-- GOOGLE DRIVE BACKUP -->
    <v-tooltip bottom color="blue">
      <template v-slot:activator="{ on }">
        <v-icon
          class="pr-2"
          v-on="on"
          size="20px"
          style="cursor: pointer"
          @click="openBackupArea"
        >
          mdi-google-drive
        </v-icon>
      </template>
      <span>컨텐츠를 구글 드라이브에 백업/복구</span>
    </v-tooltip>
    <BackupArea ref="backup"></BackupArea>

    <!-- Color 변경 -->
    <v-tooltip bottom color="blue">
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          class="pr-2"
          size="20px"
          style="cursor: pointer"
          @click="openColorArea"
          >mdi-palette-outline
        </v-icon>
      </template>
      <span>원하는 색상의 하이라이트 컬러를 지정</span>
    </v-tooltip>
    <ColorArea ref="color"></ColorArea>

    <!-- UPDATE INFO Menu-->
    <v-menu
      v-model="infoMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      max-width="500px"
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-model="infoTooltip" color="blue" bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-icon
              size="22px"
              v-on="{ ...menu, ...tooltip }"
              style="cursor: pointer"
              >mdi-information-outline
            </v-icon>
          </template>
          <span>UPDATE를 확인합니다.</span>
        </v-tooltip>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>UPDATE WEBGALPI</v-list-item-title>
              <v-list-item-subtitle>
                Ver.{{ update.version }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <!--<v-btn :class="''" icon>
                                                                                                                                                                                                                      <v-icon>mdi-heart</v-icon>
                                                                                                                                                                                                                  </v-btn>-->
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-card>
                <v-card-title>개선 및 기능추가</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.improvement"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>디버깅</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.debug"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>해야할 기능</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.todo"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="infoMenu = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import BackupArea from "../dialog/setting/BackupArea";
import ColorArea from "../dialog/setting/ColorArea";
import ThemeArea from "../dialog/setting/ThemeArea";
import EventBus from "../event-bus";
import BookmarkArea from "../dialog/setting/BookmarkArea";
import OneTab from "../dialog/OneTab";
import Common from "../../common/common";
import Utils from "../utils/Utils";

export default {
  components: { OneTab, BookmarkArea, ThemeArea, ColorArea, BackupArea },
  data: () => ({
    infoTooltip: false,
    infoMenu: false,
    update: {
      version: Common.getVersion(),
      improvement: [
        "[대쉬보드] TAB 모아보기 기능 추가",
        "[대쉬보드] 옵션설정 메뉴, 상단으로 위치 수정",
        "[공통] 하이라이트 일괄삭제 기능 추가"
      ],
      debug: [
        "컨텐츠 드래그 시, 상위카테고리가 자동으로 열리도록 수정",
        "'TAB 모아보기' 실행 시, 대쉬보드가 2개이상 유지되는 현상 제거"
      ],
      todo: [
        "[진행중] BOOKMARK -> WEBGALPI로 IMPORT",
        "[진행중] Auto Backup/Restore ",
        "다국어처리 (한국어/영어/일본어)",
        "Google 검색 시, WEBGALPI에 이미 등록한 내용을 검색.",
        "개발자에게 메일전송."
      ]
    }
  }),
  props: [],
  created() {},
  methods: {
    openBackupArea() {
      this.$refs.backup.open();
    },
    openColorArea() {
      this.$refs.color.open();
    },
    openThemeArea() {
      this.$refs.theme.open();
    },
    openBookmarkArea() {
      EventBus.$emit(
        "open.snack",
        "'IMPORT BOOKMARK' 기능은 준비중입니다.",
        "green"
      );
      //this.$refs.bookmark.open();
    },
    async openOneTab() {
      let result = await Utils.getLocalStorage("loginInfo");
      if (result.loginInfo !== undefined) {
        this.$refs.onetab.open();
      }
    },
    openUpdateInfo() {
      this.infoMenu = true;
    }
  }
};
</script>
