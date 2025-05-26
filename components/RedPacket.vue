<template>
    <view class="red-packet-item" :class="{ received: item.isReceived }">
        <view class="left-content">
            <image class="packet-img" src="/static/images/received.png" mode="aspectFill"></image>
            <view class="packet-text">
                <text class="amount">{{ item.amount }}元</text>
                <text class="status">{{ item.isReceived ? '已领取' : '红包待领取' }}</text>
            </view>

        </view>
    
            <view class="center-content">
                <text v-if="displayType === 'time'">{{ countdown }}后失效</text>
                <text v-else>{{ expireText }}</text>
            </view>
     
        <view class="right-content">
            <button class="get-btn" :class="{ disabled: item.isReceived }" :disabled="item.isReceived"
                @click="handleGetPacket">
                {{ item.isReceived ? '已领取' : '去领取' }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRedPacketStore } from '@/store/redPacket';
import { parseExpireDisplay } from '@/utils/timeUtils';

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['get']);

// ===== 倒计时相关逻辑开始 =====

// 解析 expireTime
const parsed = parseExpireDisplay(props.item.expireTime);
console.log('parsed', parsed);

const displayType = ref(parsed.type); // 'time' | 'text'
const expireText = ref(parsed.value); // 纯文本内容
const expireDate = ref(parsed.type === 'time' ? parsed.value : null);
const countdown = ref('');

// 格式化剩余时间
const updateCountdown = () => {
    if (displayType.value !== 'time') return;

    const now = new Date();
    const diffMs = expireDate.value - now;
    if (diffMs <= 0) {
        clearInterval(intervalId);
        countdown.value = '00:00:00';
        return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    countdown.value = `${hours}:${minutes}:${seconds}`;
};

let intervalId = null;

onMounted(() => {
    if (displayType.value === 'time') {
        updateCountdown(); // 初始化一次
        intervalId = setInterval(updateCountdown, 1000);
    }
});

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId);
});
// ===== 倒计时相关逻辑结束 =====

// ===== 红包领取逻辑 =====
const redPacketStore = useRedPacketStore();

const handleGetPacket = () => {
    if (!props.item.isReceived) {
        redPacketStore.receiveRedPacket(props.item.id);
        emit('get', props.item);
    }
};
</script>
<style scoped lang="scss">
.red-packet-item {
    background-color: #FFFBFB;
    border-radius: 20upx;
    padding: 12upx 16upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24upx;
}

.left-content {
    display: flex;
    align-items: center;
}

.packet-img {
    width: 48upx;
    height: 48upx;
    border-radius: 12upx;
    margin-right: 12upx;
}

.packet-text {
    display: flex;
    align-items: center;
    .amount {
        color: #FF1B00;
        font-size: 24upx;
        font-weight: 500;
        letter-spacing: 2upx;
    }

    .status {
        color: #000;
        font-size: 24upx;
        font-weight: 500;
        letter-spacing: 2upx;
    }
}

.received .status,
.received .amount {
    color: #ADADAD;
}
.center-content {
    color: #FF1B00;
    font-size: 20upx;
    margin-right: 44upx;
    letter-spacing: 2upx;
    
}
.right-content {
    display: flex;
    align-items: center;
}

.expire-time {
    color: #FF1B00;
    font-size: 20upx;
    margin-right: 44upx;
}

.get-btn {
    background: linear-gradient(to right, #FF9100, #FF1B00);
    color: #FFF;
    padding: 4upx 26upx;
    border-radius: 28upx;
    font-size: 16upx;
    border: none;
    outline: none;
    cursor: pointer;
}

.get-btn.disabled {
    background: #D9D9D9;
}
</style>