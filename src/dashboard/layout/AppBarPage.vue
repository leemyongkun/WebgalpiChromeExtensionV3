<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5" @click="processTest">WEB-GALPI</span>
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
import RestoreProcessArea from "../dialog/setting/backup/RestoreProcessArea";
import dbcon from "../../database/dbcon";
import Utils from "../utils/Utils";

export default {
  components: { RestoreProcessArea, SignArea },
  data: () => ({}),
  props: ["member"],
  created() {
    this.$nextTick(async () => {});
  },
  methods: {
    signOut() {
      this.$refs.signout.open();
    },
    processTest() {
      gapi.load("auth2", function() {
        //참고 : https://console.developers.google.com/apis/credentials/oauthclient/360661693058-c9d47b1kepjbq00cg3hi1lrtdhpol892.apps.googleusercontent.com?project=chrome-webgalpi
        var gauth = gapi.auth2.init({
          cookie_policy: "https://www.google.com",
          client_id:
            "360661693058-c9d47b1kepjbq00cg3hi1lrtdhpol892.apps.googleusercontent.com"
        });

        gauth.then(
          function() {
            console.log("init success");
          },
          function() {
            console.error("init fail");
          }
        );
      });
      //참고 : https://bumbu.me/gapi-in-chrome-extension  , https://qiita.com/takahiro1110/items/4ed2c4e894d2d359751e , https://developers.google.com/drive/api/v2/reference/files/list#javascript
    }
  }
};
</script>
