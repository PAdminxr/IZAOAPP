// router/index.js
export const routes = [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/pay-to-merchant',
      name: 'pay-to-merchant',
      component: () => import('@/pages/pay-to-merchant/pay-to-merchant.vue'),
      meta: {
        title: '向商家付款',
        requiresAuth: false
      }
    }
   
  ];
  
  