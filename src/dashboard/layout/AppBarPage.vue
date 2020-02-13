<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5"
      >WEB&nbsp;<span class="font-weight-light" @click="googleLogin"
        >Galpi</span
      >
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
    <v-btn text @click="">
      <v-icon>mdi-information-outline</v-icon>&nbsp;README
    </v-btn>
  </v-app-bar>
</template>
<script>
import ACCOUNT from "../../common/account";

export default {
  data: () => ({}),
  methods: {
    googleLogin() {
      ACCOUNT.googleLogin();
    }
  }
};
</script>
