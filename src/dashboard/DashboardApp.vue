<template>
  <div>
    <v-app>
      <v-content>
        <v-container
          >{{ test }}

          <div class="text-center">
            <v-badge>
              <template v-slot:badge
                >0</template
              >
              <v-icon>mdi-email</v-icon>
            </v-badge>
          </div>

          <div id="chip-usage-example" class="text-center">
            <v-chip>Default</v-chip>
            <v-chip close>Close</v-chip>
            <v-chip outlined>Outlined</v-chip>
            <v-chip v-model="value" filter>Filter</v-chip>
            <v-chip pill>
              <v-avatar left color="red">
                P
              </v-avatar>
              Pill
            </v-chip>
            <v-chip>
              <v-icon left color="red">mdi-account</v-icon>
              Icon
            </v-chip>
          </div>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

export default {
  name: "App",
  components: {},
  data() {
    return {
      test: "TS"
    };
  },
  methods: {},
  mounted() {
    alert("!");
  }
};
</script>
