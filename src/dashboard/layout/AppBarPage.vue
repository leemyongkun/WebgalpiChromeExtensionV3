<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5" @click="googleLogout"
      >WEB&nbsp;<span class="font-weight-light" @click="googleLogin"
        >Galpi
      </span>
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
    <v-avatar :tile="true">
      <img
        v-if="member.IMAGE_URL !== null"
        :src="member.IMAGE_URL"
        alt="logo"
      />
    </v-avatar>
    {{ member.EMAIL }}
    <v-btn text @click="">
      <v-icon>mdi-information-outline</v-icon>&nbsp;README
    </v-btn>
  </v-app-bar>
</template>
<script>
import ACCOUNT from "../../common/account";

export default {
  data: () => ({}),
  props: ["member"],
  methods: {
    googleLogout() {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        console.log("token!", token);
        chrome.identity.removeCachedAuthToken({ token: token }, () => {
          alert("delete cache");
        });
      });
    },
    googleLogin() {
      ACCOUNT.googleLogin();
    }
  }
};
</script>
