<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-list-item-action>
      <v-icon>mdi-slack</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        <v-expansion-panels focusable flat>
          <v-expansion-panel>
            <v-expansion-panel-header>SLACK</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row v-for="(item, index) in 5" :key="index">
                <v-col cols="4">
                  <v-text-field
                    label="Outlined"
                    placeholder="slack channel name"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="Outlined"
                    placeholder="week hook address"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
export default {
  components: {},
  props: [],
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {}
};
</script>
