import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Button from '@/components/Button.vue';
import Alert from '@/components/Alert.vue';

Vue.config.productionTip = false;
Vue.component('Button', Button);
Vue.component('Alert', Alert);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
