<template>
  <v-app-bar class="clipped-left">
    <v-app-bar-title class="ml-3 mr-5" @click="processTest">
      WEBGALPI (
      <span style="color: #ff8b20;">
        <span class="icon-beta" style="color: #ff8b20; font-size: 12px;">β</span
        >eta
      </span>
      <span style="font-size: 12px">Ver.{{ version }}</span>
      )
    </v-app-bar-title>

    <v-text-field
      class="solo-inverted flat hide-details"
      placeholder="Search"
      v-if="false"
    />

    <v-spacer></v-spacer>

    <!-- <div class="menu">
      <button class="btn text small">
        {{ member.EMAIL }}
      </button>
      <ul class="menu-list pt-0 pb-0">
        <li class="menu-item pt-0 pb-0" @click="signOut">
          {{ LANG.BUTTON_MESSAGE("B0002") }}
        </li>
      </ul>
    </div>-->

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
import LANG from "../../common/language";
import MODAL from "../../common/modal";

export default {
  components: { OptionPage, BackupArea, OneTab, SignArea },
  data: () => ({
    ciPath: "",
    version: Common.getVersion(),
    LANG: LANG
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
<style>
.app-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  background: #1976d2;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-bar.app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.app-bar.clipped-left {
  left: 0;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}

.text-field {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  min-width: 200px;
}

.text-field::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.text-field.solo-inverted {
  background: rgba(255, 255, 255, 0.1);
}

.text-field.flat {
  box-shadow: none;
}

.text-field.hide-details {
  margin-bottom: 0;
}

.spacer {
  flex: 1;
}

.menu {
  position: relative;
  display: inline-block;
}

.menu-list {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  color: black;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
}

.menu:hover .menu-list {
  display: block;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn.text {
  background: none;
  color: inherit;
}

.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.ml-3 {
  margin-left: 24px;
}

.mr-5 {
  margin-right: 40px;
}

.pt-0 {
  padding-top: 0;
}

.pb-0 {
  padding-bottom: 0;
}

.icon-beta {
  display: inline-block;
}

/* Dark theme styles */
body.theme-dark .app-bar {
  background: #212121;
}
</style>
