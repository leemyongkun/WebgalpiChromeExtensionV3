<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5"
      >WEB&nbsp;<span class="font-weight-light" @click="firebaseTest"
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
  </v-app-bar>
</template>
<script>
import Firebase from "firebase";
import CONTENT_LISTENER from "../../common/content-listener";
import SignArea from "../dialog/setting/SignArea";

let firebaseConfig = {
  apiKey: "AIzaSyABpHVfr6b4twYbVxyDbYutJEPGLSAHibo",
  authDomain: "chrome-webgalpi.firebaseapp.com",
  databaseURL: "https://chrome-webgalpi.firebaseio.com",
  projectId: "chrome-webgalpi",
  storageBucket: "chrome-webgalpi.appspot.com",
  messagingSenderId: "360661693058",
  appId: "1:360661693058:web:bb726edb30cafe2cd4fa9b",
  measurementId: "G-P4BNDS8D9S"
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig);

export default {
  components: { SignArea },
  data: () => ({}),
  props: ["member"],
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    signOut() {
      this.$refs.signout.open();
    },
    firebaseTest() {
      alert("!");
      /*console.log(
                            Firebase.database()
                              .ref("users/kkun24")
                              .toString()
                          );*/
      /*let result = await Utils.getLocalStorage("loginInfo");
                          result.loginInfo.EMAIL*/
      /*CONTENT_LISTENER.sendMessage({
                            type: "get.backup.data"
                          }).then(backupData => {
                            console.log("backupData ", backupData);
                            Firebase.database()
                              .ref("users/kkuni_bear_gmail_com")
                              .set({
                                username: "leem",
                                email: "kkuni.bear@gmail.com",
                                image:
                                  "https://lh4.googleusercontent.com/-SaJAd76NDOM/AAAAAAAAAAI/AAAAAAAAAAA/ZJdVidSY2HU/photo.jpg",
                                items: backupData
                              })
                              .then(res => {
                                console.log("res ", res);
                              });
                          });*/
    }
  }
};
</script>
