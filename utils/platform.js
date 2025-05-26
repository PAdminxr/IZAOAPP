// utils/platform.js
export const isWeChat = () => {
    return process.env.UNI_PLATFORM === 'mp-weixin';
  };
  
  export const isAlipay = () => {
    return process.env.UNI_PLATFORM === 'mp-alipay';
  };
  
  export const getPlatformPrefix = () => {
    return isWeChat() ? 'wx-' : isAlipay() ? 'alipay-' : '';
  };