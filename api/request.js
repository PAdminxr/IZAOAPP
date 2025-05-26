// api/request.js
import env from '@/config';
import { showLoading, hideLoading, showToast } from '@/utils';

class Request {
  constructor() {
    this.baseURL = env.API_BASE_URL;
    this.timeout = 10000;
  }

  async request(options) {
    const { url, method = 'GET', data = {}, showLoad = true, headers = {} } = options;
    
    showLoad && showLoading();
    
    try {
      const [error, res] = await uni.request({
        url: this.baseURL + url,
        method,
        data,
        header: { ...headers },
        timeout: this.timeout
      });
      
      showLoad && hideLoading();
      
      if (error) throw new Error(error.errMsg);
      
      const { statusCode, data: responseData } = res;
      
      if (statusCode === 200) {
        return responseData;
      } else {
        throw new Error(`请求错误 ${statusCode}`);
      }
    } catch (error) {
      showLoad && hideLoading();
      showToast(error.message);
      return null;
    }
  }
  
  // 常用方法封装
  get(url, data = {}, options = {}) {
    return this.request({ url, method: 'GET', data, ...options });
  }
  
  post(url, data = {}, options = {}) {
    return this.request({ url, method: 'POST', data, ...options });
  }
}

export default new Request();