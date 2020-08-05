<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-lg-right">
    <span v-if="filter.search !== false">
      <span style="cursor: pointer;" @click="onClearClicked">
        <v-icon size="18px">mdi-close</v-icon>
      </span>
      검색키워드 : <span style="color: dodgerblue;">{{ filter.search }}</span>
    </span>

    <!--검색 버튼-->
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
      bottom
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-model="searchShow" color="blue" top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon v-on="{ ...menu, ...tooltip }" @click="openMenu">
              <v-icon size="18px">mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>{{ LANG.DESCRIPTION_MESSAGE("D0011") }}</span>
        </v-tooltip>
      </template>

      <v-card>
        <v-list class="pt-0 pb-0">
          <v-list-item class="pr-0 pl-0">
            <v-list-item-content class="pt-0 pb-0">
              <v-text-field
                ref="searchKeywordArea"
                clearable
                outlined
                :placeholder="LANG.DESCRIPTION_MESSAGE('D0012')"
                prepend-inner-icon="mdi-magnify"
                @keyup.enter="goSearch"
                v-model="searchKeyword"
                autofocus
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!--정렬 필터링 버튼-->
    <v-tooltip v-model="sortShow" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="setSort" v-on="on">
          <v-icon :color="filter.sort ? 'orange' : ''" size="18px"
            >mdi-sort
          </v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0013") }}</span>
    </v-tooltip>

    <!--별 필터링 버튼-->
    <v-tooltip v-model="starShow" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="setStar" v-on="on">
          <v-icon :color="filter.star ? 'yellow' : ''" size="18px"
            >mdi-star
          </v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0014") }}</span>
    </v-tooltip>

    <!--방지사이트 필터링 버튼-->
    <v-tooltip v-model="detectShow" color="blue" top>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="setDetect" v-on="on">
          <v-icon size="18px" :color="filter.detect ? 'red' : ''"
            >mdi-shield-off-outline
          </v-icon>
        </v-btn>
      </template>
      <span>{{ LANG.DESCRIPTION_MESSAGE("D0015") }}</span>
    </v-tooltip>

    <v-menu
      v-if="false"
      ref="calendar"
      v-model="calendar"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon size="18px">mdi-calendar-month</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="dates" range no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
        <v-btn text color="primary" @click="pickDate()">OK</v-btn>
      </v-date-picker>
    </v-menu>

    <!-- 잠시 가려두자 -->
    <v-menu
      v-if="false"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon size="18px">mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>John Leider</v-list-item-title>
              <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-title>Fail Contents</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable hints</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn small text block outlined @click="more">
      {{ LANG.BUTTON_MESSAGE("B0004") }} ( items : {{ itemCount }})
    </v-btn>
  </div>
</template>
<script>
import EventBus from "../event-bus";
import LANG from "../../common/language";

export default {
  props: ["itemCount"],
  components: {},
  data: () => ({
    sortShow: false,
    starShow: false,
    detectShow: false,
    searchShow: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dates: ["2020-05-07", "2020-05-07"],
    calendar: false,
    searchKeyword: null,
    filter: {
      star: false,
      detect: false,
      search: false,
      sort: false //f : 내림차순 , t : 오름차순
    },
    LANG: LANG
  }),
  methods: {
    openMenu() {
      setTimeout(() => {
        this.$refs.searchKeywordArea.focus();
      }, 100);
    },
    more() {
      EventBus.$emit("more.paging");
    },
    onClearClicked() {
      this.searchKeyword = "";
      this.goSearch();
    },
    goSearch() {
      this.searchKeyword = this.searchKeyword.trim();
      if (this.searchKeyword === null || this.searchKeyword === "") {
        this.filter.search = false;
      } else {
        this.filter.search = this.searchKeyword;
      }

      this.sendFilter();
    },
    setDetect() {
      this.filter.detect = !this.filter.detect;
      this.sendFilter();
    },
    setStar() {
      this.filter.star = !this.filter.star;
      this.sendFilter();
    },
    setSort() {
      this.filter.sort = !this.filter.sort;
      this.sendFilter();
    },
    sendFilter() {
      EventBus.$emit("setFilter", this.filter);
    },
    pickDate() {
      let date = this.dates.sort();
      let startDate = date[0] + " 00:00:00";
      let endDate = date[1] + " 23:59:59";
      this.calendar = false;
    }
  }
};
</script>
<style>
.v-input__slot {
  margin-bottom: 0px !important;
}
</style>
