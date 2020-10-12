import Vue from 'vue';
import Vuex from 'vuex';
import {
  SET_DEFAULT_TIMETABLE,
  SET_PATCHES,
  SET_TIMETABLE_LOADED,
  SET_USER_PREFERRED_ENTITY,
  SET_USER_TYPE
} from '@/store/mutation-types';
import api from '@/api';
import { LOAD_DEFAULT_TIMETABLE, LOAD_PATCHES } from '@/store/action-types';
import { EntityType, Patch, RegularTimetable } from 'ggtu-timetable-api-client';

Vue.use(Vuex);
const USER_TYPE_KEY = 'ggtu_timetable/user_type';
const USER_PREFERRED_ENTITY_KEY = 'ggtu_timetable/user_entity';

export default new Vuex.Store({
  state: {
    user: {
      type: localStorage.getItem(USER_TYPE_KEY) || '',
      entityId: +(localStorage.getItem(USER_PREFERRED_ENTITY_KEY) || 0)
    },
    timetable: {
      default: {} as RegularTimetable,
      hasLoaded: false,
      patches: [] as Patch[]
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
    [SET_DEFAULT_TIMETABLE](state, timetable: RegularTimetable) {
      state.timetable.default = timetable;
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
        default: {
          request = api.patches.getForGroup(id);
        }
        request.then(patches => {
          context.commit(SET_PATCHES, patches);
        })
      }
    }
  },
  modules: {}
});
