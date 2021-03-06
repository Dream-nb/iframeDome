import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/layout';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Layout,
      // redirect: "/index",
      children: [
        {
          path: '/index',
          name: 'Index',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: '/table',
          name: 'Table',
          component: () => import('@/views/tableManage.vue'),
        },
      ],
    },
  ],
});
