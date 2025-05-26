// store/modules/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: uni.getStorageSync('token') || '',
    permissions: []
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission);
    }
  },
  
  actions: {
    async login(username, password) {
      try {
        // 调用登录API
        const { token, userInfo } = await this.$axios.post('/auth/login', {
          username,
          password
        });
        
        // 保存用户信息
        this.token = token;
        this.userInfo = userInfo;
        
        // 获取用户权限
        await this.fetchPermissions();
        
        // 保存token到本地存储
        uni.setStorageSync('token', token);
        
        return true;
      } catch (error) {
        console.error('登录失败', error);
        return false;
      }
    },
    
    async fetchPermissions() {
      const permissions = await this.$axios.get('/auth/permissions');
      this.permissions = permissions;
    },
    
    logout() {
      this.userInfo = null;
      this.token = '';
      this.permissions = [];
      uni.removeStorageSync('token');
    }
  }
});