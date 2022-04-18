import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/justdance',
    },
    {
      path: '/spider',
      name: '爬虫',
      component: () => import(/* webpackChunkName: "report" */'./pages/spider'),
    },
    {
      path: '/justdance',
      name: 'justdance',
      component: () => import(/* webpackChunkName: "report" */'./pages/justdance'),
    },
  ],
});