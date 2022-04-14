import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/spider',
    },
    {
      path: '/spider',
      name: '爬虫',
      component: () => import(/* webpackChunkName: "report" */'./pages/spider'),
    },
    
  ],
});