import Vue from 'vue';
import Vuex from 'vuex';
import {
  SET_DEFAULT_TIMETABLE,
  SET_PATCHES,
  SET_TIMETABLE_LOADED,
  SET_USER_PREFERRED_ENTITY,
  SET_USER_TYPE,
  LOGOUT
} from '@/store/mutation-types';
import api from '@/api';
import { LOAD_DEFAULT_TIMETABLE, LOAD_PATCHES } from '@/store/action-types';
import { EntityType, Patch, RegularTimetable } from 'ggtu-timetable-api-client';
import { Week } from 'ggtu-timetable-api-client/src/interfaces/index';
import { Lesson } from 'ggtu-timetable-api-client/src/interfaces/index';
import { v4 } from 'uuid';
import { RootState } from '@/store/types';
import menu from './menu';

Vue.use(Vuex);
const USER_TYPE_KEY = 'ggtu_timetable/user_type';
const USER_PREFERRED_ENTITY_KEY = 'ggtu_timetable/user_entity';
export type KeyedTimetable = Record<
  string,
  Record<string, { id: string; lesson: Lesson | null }[]>
>;
export default new Vuex.Store({
  state: {
    user: {
      type: localStorage.getItem(USER_TYPE_KEY) || '',
      entityId: +(localStorage.getItem(USER_PREFERRED_ENTITY_KEY) || 0)
    },
    timetable: {
      default: {} as KeyedTimetable,
      hasLoaded: false,
      patches: [] as Patch[]
    }
  } as RootState,
  mutations: {
    [SET_USER_TYPE](state, type: string) {
      localStorage.setItem(USER_TYPE_KEY, type);
      state.user.type = type;
    },
    [SET_USER_PREFERRED_ENTITY](state, id: number) {
      localStorage.setItem(USER_PREFERRED_ENTITY_KEY, id.toString());
      state.user.entityId = id;
    },
    [LOGOUT](state) {
      localStorage.removeItem(USER_TYPE_KEY);
      localStorage.removeItem(USER_TYPE_KEY);
      state.user.type = '';
      state.user.entityId = 0;
    },
    [SET_DEFAULT_TIMETABLE](state, timetable: RegularTimetable) {
      const mapped = {} as KeyedTimetable;
      Object.keys(timetable).forEach(week => {
        mapped[week] = {};
        const currentWeek = timetable[(week as unknown) as Week];
        Object.keys(currentWeek).forEach(day => {
          mapped[week][day] = currentWeek[day].map(lesson => ({
            id: v4(),
            lesson
          }));
        });
      });
      state.timetable.default = mapped;
    },
    [SET_TIMETABLE_LOADED](state, hasLoaded: boolean) {
      state.timetable.hasLoaded = hasLoaded;
    },
    [SET_PATCHES](state, patches: Patch[]) {
      state.timetable.patches = patches;
    }
  },
  actions: {
    [LOAD_DEFAULT_TIMETABLE](context) {
      context.commit(SET_TIMETABLE_LOADED, false);
      let request: Promise<RegularTimetable>;
      if (context.state.user.type === 'group') {
        request = api.timetable.getForGroup(context.state.user.entityId);
      } else {
        request = api.timetable.getForTeacher(context.state.user.entityId);
      }
      return request.then(timetable => {
        context.commit(SET_DEFAULT_TIMETABLE, timetable);
        context.commit(SET_TIMETABLE_LOADED, true);
      });
    },
    [LOAD_PATCHES](
      context,
      { type = EntityType.Group, id }: { type: EntityType; id: number }
    ) {
      let request;
      switch (type) {
        case EntityType.Teacher: {
          request = api.patches.getForTeacher(id);
          break;
        }
        case EntityType.Cabinet: {
          request = api.patches.getForCabinet(id);
          break;
        }
        default:
          {
            request = api.patches.getForGroup(id);
          }
          return request.then(patches => {
            context.commit(SET_PATCHES, patches);
          });
      }
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user.type;
    }
  },
  modules: {
    menu
  }
});
