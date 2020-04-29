<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="700px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title class="headline">복구를 시작합니다.</v-card-title>

      <v-card-text>
        <v-stepper v-model="step" vertical>
          <v-stepper-step step="1" :complete="process.step1.status">
            사용자 정보
          </v-stepper-step>
          <v-stepper-content step="1">
            {{ process.step1.message }}
          </v-stepper-content>

          <v-stepper-step step="2" complete>카테고리 정보</v-stepper-step>
          <v-stepper-content step="2">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="step = 3">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3">옵션 정보</v-stepper-step>

          <v-stepper-content step="3">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="step = 1">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">사이트 정보</v-stepper-step>

          <v-stepper-content step="4">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="step = 1">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step step="5">하이라이트 정보</v-stepper-step>

          <v-stepper-content step="5">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="step = 1">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :rules="[() => false]" step="6">
            Ad templates
            <small>Alert message</small>
          </v-stepper-step>

          <v-stepper-content step="6">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="step = 4">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    step: 1,
    process: {
      step1: {
        status: false,
        message: "진행중",
        onerror: null
      }
    },
    dialog: false
  }),
  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.step++;
        this.step1.status = true;
      }, 2000);
    });
  },
  methods: {
    open() {
      this.dialog = true;
    }
  }
};
</script>
