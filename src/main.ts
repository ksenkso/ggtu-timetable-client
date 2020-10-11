import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Button from '@/components/common/Button.vue';
import Alert from '@/components/common/Alert.vue';
// @ts-ignore
import VueCarousel from 'vue-carousel';
import { Cabinet, LessonType } from 'ggtu-timetable-api-client';

Vue.use(VueCarousel);
Vue.config.productionTip = false;
Vue.component('Button', Button);
Vue.component('Alert', Alert);
Vue.filter('lessonType', (type: LessonType) => {
  switch (type) {
    case LessonType.Empty:
      return 'Нет пары';
    case LessonType.Lab:
      return 'Лабораторное занятие';
    case LessonType.Lecture:
      return 'Лекция';
    case LessonType.Practice:
      return 'Практическое занятие';
    default:
      return 'Занятие';
  }
});
Vue.filter('cabinetName', (cabinet: Cabinet) => {
  return cabinet.building
    ? cabinet.building.name + ', ' + cabinet.name
    : cabinet.name;
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
