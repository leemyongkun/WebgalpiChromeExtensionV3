import * as types from "./mutation-types";

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  setMemberInfo(state, payload) {
    state.memberInfo = payload;
  }
};
