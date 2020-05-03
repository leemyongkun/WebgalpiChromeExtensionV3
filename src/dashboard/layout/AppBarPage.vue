<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5">WEB-GALPI </span>
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
          SIGNOUT
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn text @click="">
      <v-icon>mdi-information-outline</v-icon>&nbsp;README
    </v-btn>
    <SignArea ref="signout"></SignArea>
    <RestoreDialog ref="restoreDialog"></RestoreDialog>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import RestoreDialog from "../dialog/RestoreDialog";

export default {
  components: { RestoreDialog, SignArea },
  data: () => ({}),
  props: ["member"],
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    signOut() {
      this.$refs.signout.open();
    },
    openRestore() {
      this.$refs.restoreDialog.open();
    }
  }
};
</script>
