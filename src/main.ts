import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Button from '@/components/common/Button.vue';
import Alert from '@/components/common/Alert.vue';
// @ts-ignore
import VueCarousel from 'vue-carousel';

Vue.use(VueCarousel);
Vue.config.productionTip = false;
Vue.component('Button', Button);
Vue.component('Alert', Alert);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
