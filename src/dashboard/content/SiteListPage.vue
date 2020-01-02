<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row v-for="(item, i) in items" :key="i">
      <v-col cols="3">
        <v-card :color="item.color" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="item.title"></v-card-title>

              <v-card-subtitle v-text="item.artist"></v-card-subtitle>
            </div>

            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="item.src"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { POPUP_LISTENER } from "../../popup/listener";

export default {
  components: {},
  data: () => ({
    items: [
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "Supermodel",
        artist: "Foster the People"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      },
      {
        color: "#c1bfbe",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      }
    ]
  }),
  created() {},
  mounted() {
    let port = chrome.extension.connect({
      name: "POPUP COMMUNICATION"
    });
    port.postMessage({
      action: "all.sites"
    });
    port.onMessage.addListener(response => {
      console.log(">>> ", response);
    });
  },
  methods: {}
};
</script>
