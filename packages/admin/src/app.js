import Vue from 'vue';
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import App from './app.vue';
import routes from './routes';
import './style.scss';

Vue.use(VueRouter);
Vue.use(ElementUI);

export const router = new VueRouter({
  routes,
  mode: 'hash',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      return next({path: '/login', query: {redirect: to.fullPath}});
    }
  }
  next();
});

window.$bus = new Vue({
  render: h => h(App),
  router
}).$mount('#app');
