// utils/tracker.js
export const trackEvent = (eventName, params = {}) => {
    if (isWeChat()) {
      // 微信埋点
      wx.uma.trackEvent(eventName, params);
    } else if (isAlipay()) {
      // 支付宝埋点
      my.uma.trackEvent(eventName, params);
    } else {
      // 其他平台埋点
      console.log('Track event:', eventName, params);
    }
  };