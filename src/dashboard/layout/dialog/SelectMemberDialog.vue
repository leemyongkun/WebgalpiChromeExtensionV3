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
                    >{{ LANG.BUTTON_MESSAGE("B0016") }}
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
            >{{ LANG.DESCRIPTION_MESSAGE("D0061") }}
            <v-spacer />
            <span @click="cancelPassword" style="cursor:pointer">{{
              LANG.BUTTON_MESSAGE("B0012")
            }}</span></v-subheader
          >
          <v-list-item>
            <v-list-item-content class="pb-0">
              <v-text-field
                dense
                :rules="[rules.required]"
                label="Password"
                prepend-inner-icon="mdi-feature-search-outline"
                v-model="password"
                :type="'password'"
                :error="passwordError"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item-action align="center">
            <v-spacer></v-spacer>
            <v-btn small text @click="login">{{
              LANG.BUTTON_MESSAGE("B0017")
            }}</v-btn>
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
import LANG from "../../../common/language";

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
    passwordError: false,
    viewPasswordArea: false,
    width: 300,
    cols: 12,
    LANG: LANG
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
          this.passwordError = true;
          EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0016"), "red");
        }
      });
    }
  }
};
</script>
