import { MutationTree } from 'vuex';
import { MenuState } from '@/store/menu/types';

export default {
  OPEN(state) {
    state.isOpen = true;
  },
  CLOSE(state) {
    state.isOpen = false;
  },
  TOGGLE(state) {
    state.isOpen = !state.isOpen;
  }
} as MutationTree<MenuState>;
