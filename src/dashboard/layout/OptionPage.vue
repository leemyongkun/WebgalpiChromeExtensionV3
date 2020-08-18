<template>
  <div>
    <v-menu transition="slide-y-transition" offset-y>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-model="languageTooltip" color="blue" bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-icon
              class="pr-2"
              v-on="{ ...menu, ...tooltip }"
              size="20px"
              style="cursor: pointer"
              >mdi-web
            </v-icon>
          </template>
          <span>{{ LANG.DESCRIPTION_MESSAGE("D0084") }}</span>
        </v-tooltip>
      </template>

      <v-list class="pt-0 pb-0">
        <v-btn text block @click="changeLanguage('KR')">한국어</v-btn>
        <v-btn text block @click="changeLanguage('EN')">English</v-btn>
        <v-btn text block @click="changeLanguage('JP')">日本語</v-btn>
      </v-list>
    </v-menu>

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
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0066") }}</span>
    </v-tooltip>
    <OneTab ref="onetab"></OneTab>

    <!-- BOOKMARK -->
    <!--<v-tooltip bottom color="blue">
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
                </v-tooltip>-->
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
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0067") }}</span>
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
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0068") }}</span>
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
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0069") }}</span>
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
          <span>{{ LANG.DESCRIPTION_MESSAGE("D0070") }}</span>
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
                <v-card-title
                  >{{ LANG.DESCRIPTION_MESSAGE("D0071") }}
                </v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.improvement"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title
                  >{{ LANG.DESCRIPTION_MESSAGE("D0072") }}
                </v-card-title>
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
          <v-btn text @click="infoMenu = false"
            >{{ LANG.BUTTON_MESSAGE("B0012") }}
          </v-btn>
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
import LANG from "../../common/language";
import CONTENT_LISTENER from "../../common/content-listener";

export default {
  components: { OneTab, BookmarkArea, ThemeArea, ColorArea, BackupArea },
  data: () => ({
    languageTooltip: false,
    infoTooltip: false,
    infoMenu: false,
    update: {
      version: Common.getVersion(),
      improvement: ["Multi Language (한국어/English/日本語)"],
      debug: [],
      todo: [
        "[PROGRESS] IMPORT BOOKMARK -> WEBGALPI",
        "[PROGRESS] Auto Backup/Restore "
      ]
    },
    LANG: LANG
  }),
  props: [],
  created() {},
  methods: {
    async changeLanguage(lang) {
      LANG.setLanguage(lang);
      //todo : 언어 update
      let result = await Utils.getLocalStorage("loginInfo");
      let param = new Object();
      param.EMAIL = result.loginInfo.EMAIL;
      param.LANGUAGE = lang;

      CONTENT_LISTENER.sendMessage({
        type: "update.option.language",
        data: param
      }).then(() => {
        EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0020"), "green");
      });
    },
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
      EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0019"), "green");
      //this.$refs.bookmark.open();
    },
    async openOneTab() {
      let result = await Utils.getLocalStorage("loginInfo");
      if (result.loginInfo !== undefined) {
        this.$refs.onetab.open();
      }
    },
    async openOneTabFromContextMenu() {
      let result = await Utils.getLocalStorage("loginInfo");
      if (result.loginInfo !== undefined) {
        this.$refs.onetab.openOneTabFromContextMenu();
      }
    },
    openUpdateInfo() {
      this.infoMenu = true;
    }
  }
};
</script>
