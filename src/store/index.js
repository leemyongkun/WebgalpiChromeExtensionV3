import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    foo: "bar",
    memberInfo: null
  },
  getters,
  mutations,
  actions
});
export default store;
