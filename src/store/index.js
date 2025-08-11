import { createStore } from "vuex";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

const store = createStore({
  state: {
    foo: "bar",
    memberInfo: null
  },
  getters,
  mutations,
  actions
});

export default store;
