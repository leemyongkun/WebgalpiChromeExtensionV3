<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->

    <span class="title ml-3 mr-5" @click="processTest">
      WEBGALPI (
      <span style="color: #ff8b20;"
        ><v-icon color="#ff8b20" style="width: 12px;">mdi-beta</v-icon>eta
      </span>
      <span style="font-size: 12px">Ver.{{ version }}</span>
      )
    </span>
    <v-text-field
      solo-inverted
      flat
      hide-details
      label="Search"
      prepend-inner-icon="mdi-feature-search-outline"
      v-if="false"
    />
    <v-spacer />

    <v-menu
      transition="slide-y-transition"
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          {{ member.EMAIL }}
        </v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item class="pt-0 pb-0" @click="signOut">
          로그아웃
        </v-list-item>
      </v-list>
    </v-menu>

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <OptionPage ref="optionPage"></OptionPage>

    <SignArea ref="signout"></SignArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import OneTab from "../dialog/OneTab";
import BackupArea from "../dialog/setting/BackupArea";
import OptionPage from "./OptionPage";
import Common from "../../common/common";

export default {
  components: { OptionPage, BackupArea, OneTab, SignArea },
  data: () => ({
    ciPath: "",
    version: Common.getVersion()
  }),
  props: ["member"],
  created() {
    this.$nextTick(async () => {
      this.ciPath = Common.getAppDefaultUrl() + "/icons/icon_48.png";
    });
  },
  mounted() {},
  methods: {
    resetUrl() {
      history.pushState(null, null, Common.getDashboardUrl());
    },
    showInfo() {
      this.resetUrl();
      this.$refs.optionPage.openUpdateInfo();
    },
    showOnetab() {
      this.resetUrl();
      this.$refs.optionPage.openOneTabFromContextMenu();
    },
    signOut() {
      this.$refs.signout.open();
    },
    async processTest() {}
  }
};
</script>
