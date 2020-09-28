import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store';
import TimetableView from '@/views/TimetableView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: TimetableView
  },
  {
    path: '/first-visit',
    name: 'FirstVisit',
    component: () =>
      import(/* webpackChunkName: "first-visit" */ '@/views/FirstVisit.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (
    to.name !== 'FirstVisit' &&
    !(store.state.user.type && store.state.user.entityId)
  ) {
    next({ path: '/first-visit' });
  } else {
    next();
  }
});

export default router;
