<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-lg-right">
    <v-btn icon>
      <v-icon color="gray">mdi-star</v-icon>
    </v-btn>

    <v-menu
      ref="calendar"
      v-model="calendar"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon color="gray">mdi-calendar-month</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="dates" range no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
        <v-btn text color="primary" @click="pickDate()">OK</v-btn>
      </v-date-picker>
    </v-menu>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>John Leider</v-list-item-title>
              <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-title>Fail Contents</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable hints</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  components: {},
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dates: ["2020-05-07", "2020-05-07"],
    calendar: false
  }),
  methods: {
    pickDate() {
      console.log("t", this.dates);
      this.calendar = false;
    }
  }
};
</script>
