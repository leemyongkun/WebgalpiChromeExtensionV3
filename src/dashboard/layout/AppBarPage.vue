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
import Firebase from "firebase";
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
  data: () => ({}),
  props: ["member"],
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    /*firebaseTest() {
      alert("!");
      Firebase.database()
        .ref("users/kkun24")
        .set({
          username: "leem",
          email: "kkuni.bear@gmail.com",
          image: "ajllji"
        })
        .then(res => {
          console.log("res ", res);
        });
    }*/
  }
};
</script>
