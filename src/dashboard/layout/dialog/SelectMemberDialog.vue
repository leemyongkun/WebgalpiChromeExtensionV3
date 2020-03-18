<template>
  <v-dialog
    v-model="loginDialog"
    persistent
    overlay-opacity="10"
    :max-width="width"
  >
    <v-row class="ma-0">
      <v-col :cols="cols" class="pa-0 ma-0">
        <v-list-item-group v-model="memberIndex" color="primary">
          <v-list subheader>
            <v-subheader>Members</v-subheader>
            <v-list-item
              v-for="item in members"
              :key="item.EMAIL"
              @click="selectMember"
            >
              <v-list-item-avatar>
                <v-img :src="item.IMAGE_URL"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.EMAIL"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item-action>
              <v-row>
                <v-col cols="12">
                  <v-btn block small outlined @click="registMember"
                    >사용자 등록
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-action>
          </v-list>
        </v-list-item-group>
      </v-col>
      <v-col :cols="cols" v-if="viewPasswordArea" class="pr-0 pt-0 pb-0">
        <v-list subheader>
          <v-subheader
            >login
            <v-spacer />
            <span @click="cancelPassword" style="cursor:pointer"
              >닫기</span
            ></v-subheader
          >
          <v-list-item>
            <v-list-item-content class="pb-0">
              <v-text-field
                dense
                label="Password"
                prepend-inner-icon="mdi-feature-search-outline"
                v-model="password"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item-action align="center">
            <v-spacer></v-spacer>
            <v-btn small text @click="login">로그인</v-btn>
          </v-list-item-action>
        </v-list>
      </v-col>
    </v-row>

    <SignDialog ref="signDialog"></SignDialog>
  </v-dialog>
</template>

<script>
import SignDialog from "./SignDialog";
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";

export default {
  components: {
    SignDialog
  },
  data: () => ({
    loginDialog: false,
    rules: {
      required: value => !!value || "Required."
    },
    members: [],
    memberIndex: null,
    password: null,
    viewPasswordArea: false,
    width: 300,
    cols: 12
  }),
  methods: {
    open(members) {
      this.members = members;
      this.loginDialog = true;
    },
    selectMember() {
      this.viewPasswordArea = true;
      this.width = 600;
      this.cols = 6;
    },
    cancelPassword() {
      this.viewPasswordArea = false;
      this.width = 300;
      this.cols = 12;
    },
    registMember() {
      this.$refs.signDialog.open();
    },
    login() {
      CONTENT_LISTENER.sendMessage({
        type: "get.all.members",
        data: null
      }).then(members => {
        let selectedMemberEmail = this.members[this.memberIndex].EMAIL;
        console.log("members", members);
        let member = members.filter(item => {
          return item.EMAIL === selectedMemberEmail;
        });

        if (member[0].PASSWORD === this.password) {
          let param = ["Y", member[0].EMAIL];
          CONTENT_LISTENER.sendMessage({
            type: "update.member.use",
            data: param
          }).then(() => {
            EventBus.$emit("init.dashboard");
            this.loginDialog = false;
          });
        } else {
          EventBus.$emit("open.snack", "패스워드가 맞지 않습니다.", "red");
        }
      });
    }
  }
};
</script>
