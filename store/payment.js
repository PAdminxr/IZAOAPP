import { defineStore } from 'pinia';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    amount: '',
    remark: '',
    selectedRedPacketId: null
  }),
  
  getters: {
    finalAmount: (state) => {
      if (!state.amount) return 0;
      const amount = parseFloat(state.amount);
      if (isNaN(amount)) return 0;
      
      // 如果有选中的红包，计算减免后的金额
      if (state.selectedRedPacketId) {
        // 这里需要从红包store获取红包金额
        // 简化处理，实际应通过store间调用
        return Math.max(0, amount - 5); // 假设红包减免5元
      }
      
      return amount;
    }
  },
  
  actions: {
    setAmount(amount) {
      this.amount = amount;
    },
    
    setRemark(remark) {
      this.remark = remark;
    },
    
    selectRedPacket(id) {
      this.selectedRedPacketId = id;
    },
    
    async pay() {
      try {
        // 调用支付API
        const result = await uni.requestPayment({
          provider: 'wxpay', // 或 'alipay'
          timeStamp: '',
          nonceStr: '',
          package: '',
          signType: 'MD5',
          paySign: '',
          success: (res) => {
            console.log('支付成功', res);
            return true;
          },
          fail: (err) => {
            console.error('支付失败', err);
            return false;
          }
        });
        
        if (result) {
          // 保存订单
          this.saveOrder();
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('支付异常', error);
        return false;
      }
    },
    
    saveOrder() {
      // 保存订单到本地存储或发送到服务器
      const order = {
        id: Date.now().toString(),
        amount: this.finalAmount,
        remark: this.remark,
        redPacketId: this.selectedRedPacketId,
        timestamp: new Date().toISOString(),
        status: 'paid'
      };
      
      // 保存到本地
      const orders = uni.getStorageSync('orders') || [];
      orders.unshift(order);
      uni.setStorageSync('orders', orders);
    }
  }
});