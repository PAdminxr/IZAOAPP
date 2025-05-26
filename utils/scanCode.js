// utils/scanCode.js
export const scanCode = () => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      wx.scanCode({
        success: (res) => {
          resolve(res.result);
        },
        fail: (err) => {
          reject(err);
        }
      });
      // #endif
      
      // #ifdef MP-ALIPAY
      my.scan({
        success: (res) => {
          resolve(res.code);
        },
        fail: (err) => {
          reject(err);
        }
      });
      // #endif
    });
  };