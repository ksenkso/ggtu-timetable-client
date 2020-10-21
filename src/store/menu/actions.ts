import { ActionTree } from 'vuex';
import { MenuState } from '@/store/menu/types';
import { RootState } from '@/store/types';

export default {
  OPEN({ commit }) {
    document.body.classList.add('menu-open');
    commit('OPEN');
  },
  CLOSE({ commit }) {
    document.body.classList.remove('menu-open');
    commit('CLOSE');
  },
  TOGGLE({ commit }) {
    document.body.classList.toggle('menu-open');
    commit('TOGGLE');
  }
} as ActionTree<MenuState, RootState>;
