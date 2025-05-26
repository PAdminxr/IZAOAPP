// router/guard.js
export const setupRouterGuard = () => {
    uni.addInterceptor('navigateTo', {
      invoke(args) {
        const route = findRouteByPath(args.url);
        if (route && route.meta && route.meta.requiresAuth) {
          const userStore = useUserStore();
          if (!userStore.isLoggedIn) {
            uni.showToast({
              title: '请先登录',
              icon: 'none'
            });
            return false;
          }
        }
        return args;
      }
    });
    
    // 其他拦截器...
  };
  
  const findRouteByPath = (path) => {
    return routes.find(route => route.path === path);
  };