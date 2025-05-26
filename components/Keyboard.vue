<template>
    <view class="keyboard">
        <view class="keyboard-row">
            <view class="key" @click="handleKey('1')">1</view>
            <view class="key" @click="handleKey('2')">2</view>
            <view class="key" @click="handleKey('3')">3</view>
            <view class="key delete" @click="handleKey('delete')">
                <uni-icons type="delete" size="28" color="#333"></uni-icons>
            </view>
        </view>
        <view class="keyboard-row">
            <view class="key" @click="handleKey('4')">4</view>
            <view class="key" @click="handleKey('5')">5</view>
            <view class="key" @click="handleKey('6')">6</view>
            <view class="key delete" @click="handleKey('delete')">
                <uni-icons type="delete" size="28" color="#333"></uni-icons>
            </view>
        </view>
        <view class="keyboard-row">
            <view class="key" @click="handleKey('7')">7</view>
            <view class="key" @click="handleKey('8')">8</view>
            <view class="key" @click="handleKey('9')">9</view>
            <view class="key close" @click="closeKeyboard">
                <uni-icons type="close" size="28" color="#333"></uni-icons>
            </view>
        </view>
        <view class="keyboard-row">
            <view class="key zero" @click="handleKey('0')">0</view>
            <view class="key" @click="handleKey('.')">.</view>
            <view class="key pay" @click="handlePay">
                <text>付款</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue';
import { usePaymentStore } from '@/store/payment';

const props = defineProps({
    amount: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['input', 'close', 'pay']);

const paymentStore = usePaymentStore();

// 输入金额
const handleKey = (key) => {
    let newAmount = props.amount;

    if (key === 'delete') {
        newAmount = newAmount.slice(0, -1);
    } else if (key === '.') {
        if (!newAmount.includes('.')) {
            newAmount += key;
        }
    } else {
        // 限制最大长度
        if (newAmount.length >= 13) return;

        // 处理整数部分不能以0开头
        if (newAmount === '0' && key !== '.') {
            newAmount = key;
        } else {
            newAmount += key;
        }
    }

    // 限制两位小数
    if (newAmount.includes('.')) {
        const [intPart, decPart] = newAmount.split('.');
        newAmount = `${intPart}.${decPart?.slice(0, 2) || ''}`;
    }

    emit('input', newAmount);
};

// 关闭键盘
const closeKeyboard = () => {
    emit('close');
};

// 付款
const handlePay = () => {
    emit('pay');
};
</script>

<style scoped>
.keyboard {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFF;
    z-index: 200;
}

.keyboard-row {
    display: flex;
    border-bottom: 1upx solid #E5E5E5;
}

.key {
    flex: 1;
    height: 120upx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40upx;
    color: #000;
    border-right: 1upx solid #E5E5E5;
}

.key:last-child {
    border-right: none;
}

.delete,
.close {
    font-size: 32upx;
}

.pay {
    background: linear-gradient(to right, #FF9100, #FF1B00);
    color: #FFF;
    font-weight: 500;
}

.zero {
    border-bottom: none;
}
</style>