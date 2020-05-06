<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5" @click="processTest">WEB-GALPI </span>
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
        <v-btn text x-small v-on="on">
          {{ member.EMAIL }}
        </v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item class="pt-0 pb-0" @click="signOut">
          로그아웃
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn text @click="">
      <v-icon>mdi-information-outline</v-icon>&nbsp;README
    </v-btn>
    <SignArea ref="signout"></SignArea>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import RestoreProcessArea from "../dialog/setting/RestoreProcessArea";
import dbcon from "../../database/dbcon";
export default {
  components: { RestoreProcessArea, SignArea },
  data: () => ({}),
  props: ["member"],
  created() {
    this.$nextTick(() => {});
  },
  methods: {
    signOut() {
      this.$refs.signout.open();
    },
    processTest() {
      dbcon.truncateTable();
      alert("초기화 되었습니다.");
      location.reload();
      /*let str = '';
      this.$refs.restoreProcessArea.open(str);*/
    }
  }
};
</script>
