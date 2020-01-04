<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-window v-model="window" class="elevation-1" vertical>
    <v-window-item>
      <v-card flat>
        <v-card-text>
          <v-row class="mb-4" align="center">
            <strong class="title">{{ previewTitle }}</strong>
            <v-spacer></v-spacer>

            <v-btn @click="print" icon v-if="previewStatus === 'Y'">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn icon v-if="previewStatus === 'Y'">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn icon v-if="previewStatus === 'Y'">
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </v-row>
          <v-row>
            <!--<p>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                      enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                      reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                      nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                      sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>-->

            <div v-html="previewContent"></div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
</template>
<script>
export default {
  components: {},
  props: ["previewContent", "previewTitle", "previewStatus"],
  data: () => ({
    window: 0
  }),
  created() {},
  mounted() {},
  methods: {
    print() {}
  }
};
</script>
