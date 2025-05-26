import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// 注册Pinia插件
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  
  return {
    app,
    pinia
  }
}