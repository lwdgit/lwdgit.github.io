import Vue from 'vue';

const root = Vue.component('root', {
  template: '<router-view></router-view>'
});

let routes = [
  {
    path: '/login',
    component: resolve => require(['./pages/login/login'], resolve),
    name: 'login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: resolve => require(['./pages/common/404'], resolve),
    name: '404',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'root',
    component: root,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        component: resolve => require(['./pages/editor/'], resolve)
      },
      {
        path: '*',
        iconClass: 'el-icon-document',
        type: 'filelist'
      }
    ]
  },
  {
    path: '*',
    redirect: {path: '/404'}
  }
];
let menuCount = routes.length;
routes[menuCount - 2].children.forEach(route => {
  if (route.children) {
    if (!route.meta) route.meta = {};
    route.meta.children = route.children;
  }
});

export default routes;
