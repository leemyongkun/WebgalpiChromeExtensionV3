<template>
  <v-dialog
    v-model="loginDialog"
    persistent
    overlay-opacity="10"
    max-width="300"
  >
    <v-list subheader>
      <v-subheader>Members</v-subheader>

      <v-list-item v-for="item in members" :key="item.title" @click="">
        <v-list-item-avatar>
          <v-img :src="item.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    loginDialog: false,
    rules: {
      required: value => !!value || "Required."
    },
    members: [
      {
        active: true,
        title: "Jason Oner",
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
      },
      {
        active: true,
        title: "Ranee Carlson",
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg"
      },
      {
        title: "Cindy Baker",
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg"
      },
      {
        title: "Ali Connors",
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg"
      }
    ]
  }),
  methods: {
    open(members) {
      this.members = members;
      this.loginDialog = true;
    }
  }
};
</script>
