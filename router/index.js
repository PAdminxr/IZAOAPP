// router/index.js
export const routes = [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/pages/index/index.vue'),
      meta: {
        title: '首页',
        requiresAuth: false
      }
    }
   
  ];
  
  