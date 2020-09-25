import Vue from 'vue';
import Vuex from 'vuex';
import { SET_USER_TYPE } from '@/store/action-types';

Vue.use(Vuex);
const USER_TYPE_KEY = 'ggtu_timetable/user_type';
export default new Vuex.Store({
  state: {
    user: {
      type: localStorage.getItem(USER_TYPE_KEY) || ''
    }
  },
  mutations: {
    [SET_USER_TYPE](state, type: string) {
      localStorage.setItem(USER_TYPE_KEY, type);
      state.user.type = type;
    }
  },
  actions: {},
  modules: {}
});
