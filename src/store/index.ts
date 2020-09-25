import Vue from 'vue';
import Vuex from 'vuex';
import { SET_USER_TYPE } from '@/store/mutation-types';
import { SET_USER_PREFERRED_ENTITY } from '@/store/mutation-types';

Vue.use(Vuex);
const USER_TYPE_KEY = 'ggtu_timetable/user_type';
const USER_PREFERRED_ENTITY_KEY = 'ggtu_timetable/user_entity';
export default new Vuex.Store({
  state: {
    user: {
      type: localStorage.getItem(USER_TYPE_KEY) || '',
      entityId: +(localStorage.getItem(USER_PREFERRED_ENTITY_KEY) || 0)
    }
  },
  mutations: {
    [SET_USER_TYPE](state, type: string) {
      localStorage.setItem(USER_TYPE_KEY, type);
      state.user.type = type;
    },
    [SET_USER_PREFERRED_ENTITY](state, id: number) {
      localStorage.setItem(USER_PREFERRED_ENTITY_KEY, id.toString());
      state.user.entityId = id;
    }
  },
  actions: {},
  modules: {}
});
