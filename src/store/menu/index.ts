import { Module } from 'vuex';
import { MenuState } from '@/store/menu/types';
import { RootState } from '@/store/types';
import mutations from '@/store/menu/mutations';
import actions from '@/store/menu/actions';

export default {
  namespaced: true,
  state: () => ({
    isOpen: false
  }),
  mutations: {
    ...mutations
  },
  actions: {
    ...actions
  }
} as Module<MenuState, RootState>
