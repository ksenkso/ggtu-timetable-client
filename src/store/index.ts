import Vue from 'vue';
import Vuex from 'vuex';
import { SET_USER_TYPE } from '@/store/mutation-types';
import { SET_USER_PREFERRED_ENTITY } from '@/store/mutation-types';
import api from '@/api';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import { SET_DEFAULT_TIMETABLE } from '@/store/mutation-types';

Vue.use(Vuex);
const USER_TYPE_KEY = 'ggtu_timetable/user_type';
const USER_PREFERRED_ENTITY_KEY = 'ggtu_timetable/user_entity';

function createEmptyTimetable(): TimetableEntry[][][] {
  return [
    [[], [], [], [], [], []],
    [[], [], [], [], [], []]
  ];
}

function conformTimetable(entries: TimetableEntry[]): TimetableEntry[][][] {
  const timetable: TimetableEntry[][][] = [
    [[], [], [], [], [], []],
    [[], [], [], [], [], []]
  ];
  return entries.reduce<TimetableEntry[][][]>((acc, entry) => {
    acc[entry.week][entry.day].push(entry);
    return acc;
  }, timetable);
}

export default new Vuex.Store({
  state: {
    user: {
      type: localStorage.getItem(USER_TYPE_KEY) || '',
      entityId: +(localStorage.getItem(USER_PREFERRED_ENTITY_KEY) || 0)
    },
    timetable: {
      default: createEmptyTimetable()
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
    },
    [SET_DEFAULT_TIMETABLE](state, entries) {
      state.timetable.default = conformTimetable(entries);
    }
  },
  actions: {
    [LOAD_DEFAULT_TIMETABLE](context) {
      let request: Promise<TimetableEntry[]>;
      if (context.state.user.type === 'group') {
        request = api.timetable.getForGroup(context.state.user.entityId);
      } else {
        request = api.timetable.getForTeacher(context.state.user.entityId);
      }
      return request.then(entries => {
        context.commit(SET_DEFAULT_TIMETABLE, entries);
      });
    }
  },
  modules: {}
});
