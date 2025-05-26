import { defineStore } from 'pinia';
import { redPacketList } from '@/data/redPackets';

export const useRedPacketStore = defineStore('redPacket', {
  state: () => ({
    redPackets: redPacketList
  }),
  
  getters: {
    availablePackets: (state) => state.redPackets.filter(packet => !packet.isReceived),
    receivedPackets: (state) => state.redPackets.filter(packet => packet.isReceived)
  },
  
  actions: {
    receiveRedPacket(id) {
      const packet = this.redPackets.find(packet => packet.id === id);
      if (packet) {
        packet.isReceived = true;
        // 存储到本地存储
        uni.setStorageSync('received_red_packets', this.receivedPackets);
      }
    },
    
    loadReceivedPackets() {
      const received = uni.getStorageSync('received_red_packets') || [];
      received.forEach(receivedPacket => {
        const packet = this.redPackets.find(p => p.id === receivedPacket.id);
        if (packet) {
          packet.isReceived = true;
        }
      });
    }
  }
});