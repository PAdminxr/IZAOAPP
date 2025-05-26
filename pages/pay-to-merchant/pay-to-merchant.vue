<template>
    <view class="container">
        <!-- 1. 商家信息区域 -->
        <view class="store-info">
            <image class="store-img" :src="storeInfo.image" mode="aspectFill"></image>
            <view class="store-text">
                <text class="pay-to">付款给</text>
                <text class="store-name">{{ storeInfo.name }}</text>
            </view>
        </view>



        <!-- 2. 付款金额区域 -->
        <view class="amount-container">
            <text class="amount-label">金额（元）</text>
            <view class="input-wrapper" @click="showKeyboard = true">
                <text class="currency">¥</text>
                <view class="amount-display">
                    <span>{{ paymentAmount }}</span>
                    <span class="cursor"></span>
                </view>
            </view>
            <Divider height="0.5px" color="#EBEBEB" />
            <view class="remark" @click="openRemarkModal">
                {{ remark || '添加备注' }}
            </view>
        </view>



        <!-- 3. 红包区域 -->
        <view class="red-packet-area">

            <RedPacket v-for="packet in availablePackets" :key="packet.id" :item="packet" @get="handleGetPacket" />
            <view class="more-packet" @click="goToMorePackets">
                更多红包 <uni-icons type="arrowright" size="14" color="#767676"></uni-icons>
            </view>
        </view>



        <!-- 4. 查看商户公示信息区域 -->
        <view class="merchant-info">
            <text class="section-title">查看商户公示信息</text>
            <swiper class="swiper-container" :current="swiperIndex" @change="handleSwiperChange">
                <swiper-item v-for="(page, index) in infoPages" :key="index">
                    <view class="info-grid">
                        <view class="info-item" v-for="info in page" :key="info.type" @click="goToInfoDetail(info)">
                            <image class="info-icon" :src="info.icon" mode="aspectFill"></image>

                            <!-- <image class="info-icon" :src="getImagePath(info.icon)" mode="aspectFill"></image> -->
                            <text class="info-name">{{ info.name }}</text>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
            <view class="swiper-dots">
                <view class="dot" v-for="(dot, i) in infoPages.length" :key="i" :class="{ active: swiperIndex === i }">
                </view>
            </view>
        </view>



        <!-- 5. 付款按钮
        <view class="payment-btn" @click="handlePay">
            <text>确认付款 ¥{{ finalAmount }}</text>
        </view> -->

        <!-- 备注弹窗 -->
        <uni-popup ref="remarkPopup" type="bottom">
            <view class="remark-modal">
                <view class="modal-header">
                    <text class="modal-title">添加备注</text>
                    <text class="close-btn" @click="closeRemark">×</text>
                </view>
                <view class="textarea-wrapper">
                    <textarea v-model="tempRemark" placeholder="请输入备注" :maxlength="20"
                        @input="handleRemarkInput"></textarea>
                    <view class="char-count">{{ tempRemark.length }}/20</view>
                </view>
                <button type="primary" @click="confirmRemark">确定</button>
            </view>
        </uni-popup>

        <!-- 红包领取成功弹窗 -->
        <uni-popup ref="successPopup" type="center">
            <view class="success-container">
                <view class="mask"></view>
                <view class="content-box">
                    <text class="success-title">领取成功</text>
                    <image :src="'/static/red-packet-success.png'" class="success-img" mode="aspectFill"></image>
                    <text class="msg">优惠券已发放至您的账户\n可在 “我的-我的优惠券” 中查看</text>
                    <view class="btns">
                        <view class="know-btn" @click="closeSuccess">知道了</view>
                        <view class="check-btn" @click="goToCoupons">去查看</view>
                    </view>
                    <view class="close-icon" @click="closeSuccess">
                        <uni-icons type="close" size="26" color="#fff"></uni-icons>
                    </view>
                </view>
            </view>
        </uni-popup>

        <!-- 键盘组件 -->
        <Keyboard v-if="showKeyboard" :amount="paymentAmount" @input="handleInput" @close="showKeyboard = false" />
    </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRedPacketStore } from '@/store/redPacket';
import { usePaymentStore } from '@/store/payment';
import RedPacket from '@/components/RedPacket.vue';
import Divider from '@/components/Divider.vue';
import Keyboard from '@/components/Keyboard.vue';
import { merchantInfo } from '@/data/merchantInfo';


// 商家信息
const storeInfo = reactive({
    image: '/static/images/pay/store.png',
    name: '江北渔家（古城店）'
});

// 组件引用
const remarkPopup = ref(null);
const successPopup = ref(null);

// 状态
const paymentStore = usePaymentStore();
const redPacketStore = useRedPacketStore();

// 计算属性
const paymentAmount = computed({
    get() {
        return paymentStore.amount;
    },
    set(value) {
        paymentStore.setAmount(value);
    }
});

const remark = computed({
    get() {
        return paymentStore.remark;
    },
    set(value) {
        paymentStore.setRemark(value);
    }
});

const availablePackets = computed(() => {
    return redPacketStore.availablePackets.slice(0, 2);
})


const finalAmount = computed(() => {
    return paymentStore.finalAmount.toFixed(2);
});

// 商户信息分页
const infoPages = ref([]);
const swiperIndex = ref(0);


const showKeyboard = ref(false);
const tempRemark = ref('');

// 生命周期
onMounted(() => {
    // 加载已领取的红包
    redPacketStore.loadReceivedPackets();

    // 初始化商户信息分页
    initInfoPages();

});

// 初始化商户信息分页
const initInfoPages = () => {
    const pages = [];
    const itemsPerPage = 4;

    for (let i = 0; i < merchantInfo.length; i += itemsPerPage) {
        pages.push(merchantInfo.slice(i, i + itemsPerPage));
    }

    infoPages.value = pages;
};




// 处理键盘输入
const handleInput = (value) => {
    paymentAmount.value = value;
};

// 打开备注弹窗
const openRemarkModal = () => {
    tempRemark.value = remark.value || '';
    remarkPopup.value.open();
};

// 确认备注
const confirmRemark = () => {
    remark.value = tempRemark.value;
    remarkPopup.value.close();
};

// 关闭备注弹窗
const closeRemark = () => {
    remarkPopup.value.close();
};

// 处理备注输入
const handleRemarkInput = () => {
    // 可添加输入长度限制等逻辑
};

// 处理红包领取
const handleGetPacket = (packet) => {
    // 显示领取成功弹窗
    successPopup.value.open();
};

// 关闭红包领取成功弹窗
const closeSuccess = () => {
    successPopup.value.close();
};

// 跳转到优惠券页面
const goToCoupons = () => {
    uni.navigateTo({ url: '/pages/coupons' });
};

// 点击更多红包
const goToMorePackets = () => {
    uni.navigateTo({ url: '/pages/more-red-packets' });
};

// 轮播图切换
const handleSwiperChange = (e) => {
    swiperIndex.value = e.detail.current;
};

// 点击商户信息详情
const goToInfoDetail = (info) => {
    uni.navigateTo({ url: `/pages/info/${info.type}` });
};

// 处理付款
const handlePay = async () => {
    if (!paymentAmount.value) {
        uni.showToast({ title: '请输入金额', icon: 'none' });
        return;
    }

    const result = await paymentStore.pay();
    if (result) {
        uni.showToast({ title: '付款成功', icon: 'success' });
        // 延迟跳转
        setTimeout(() => {
            uni.navigateBack();
        }, 1500);
    } else {
        uni.showToast({ title: '付款失败', icon: 'none' });
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 24upx;
    background-color: #F5F5F5;
    min-height: 100vh;
}

/* 1. 商家信息区域 */
.store-info {
    display: flex;
    align-items: center;
    margin-top: 34upx;
}

.store-img {
    width: 100upx;
    height: 100upx;
    border-radius: 20upx;
    margin-right: 24upx;
}

.store-text {
    display: flex;
    flex-direction: column;

    .pay-to {
        font-size: 24upx;
        color: #000;
        margin-bottom: 4upx;
    }

    .store-name {
        font-size: 32upx;
        font-weight: 500;
        color: #000;
    }
}

/* 2. 付款金额区域 */
.amount-container {
    background-color: #FFF;
    border: 4upx solid #FE7B18;
    border-radius: 20upx;
    // height: 230upx;
    padding: 28upx 24upx;
    margin-top: 32upx;
}

.amount-label {
    font-size: 28upx;
    color: #000;
    margin-bottom: 28upx;
    font-weight: 500;
}

.input-wrapper {
    display: flex;
    align-items: center;
    height: 80upx;
    margin-top: 40upx;
}

.currency {
    font-size: 32upx;
    color: #000;
    margin-right: 12upx;
}

.amount-display {
    font-size: 56upx;
    font-weight: 500;
    position: relative;
    flex: 1;
}

.cursor {
    display: inline-block;
    width: 2upx;
    height: 60upx;
    background-color: #333;
    margin-left: 4upx;
    animation: blink 1s linear infinite;
}

.cursor {
    display: inline-block;
    width: 2upx;
    height: 54upx;
    background-color: #333;
    margin-left: 4upx;
    animation: blink-step 1s step-start infinite;
}

@keyframes blink-step {

    0%,
    50% {
        opacity: 1;
    }

    50.0001%,
    100% {
        opacity: 0;
    }
}


.remark {
    font-size: 24upx;
    color: #ADADAD;
    margin-top: 24upx;

}

/* 3. 红包区域 */
.red-packet-area {



    margin-top: 20upx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24upx;
}

.section-title {
    font-size: 28upx;
    font-weight: 500;
    color: #000;
}

.count {
    font-size: 24upx;
    color: #767676;
}

.more-packet {
    text-align: center;
    margin-top: 16upx;
    color: #767676;
    font-size: 24upx;
}

/* 4. 查看商户公示信息区域 */
.merchant-info {
    background-color: #FFF;
    border-radius: 20upx;
    padding: 24upx;
    margin-top: 20upx;
}

.swiper-container {
    height: 160upx;
}

.info-grid {
    display: flex;
    justify-content: space-between;
    padding: 0 10upx;
}

.info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.info-icon {
    width: 80upx;
    height: 80upx;
    border-radius: 20upx;
    margin-bottom: 10upx;
}

.info-name {
    font-size: 24upx;
    color: #000;
}

.swiper-dots {
    display: flex;
    justify-content: center;
    margin-top: 28upx;
}

.dot {
    width: 8upx;
    height: 8upx;
    border-radius: 50%;
    background-color: #E5E5E5;
    margin: 0 10upx;
}

.active {
    width: 24upx;
    height: 8upx;
    border-radius: 6upx;
    background-color: #FEA518;
}

/* 5. 付款按钮 */
.payment-btn {
    position: fixed;
    bottom: 48upx;
    left: 48upx;
    right: 48upx;
    height: 96upx;
    background: linear-gradient(to right, #FF9100, #FF1B00);
    border-radius: 48upx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-size: 32upx;
    font-weight: 500;
    z-index: 100;
}

/* 备注弹窗 */
.remark-modal {
    background-color: #FFF;
    padding: 32upx;
    border-radius: 20upx 20upx 0 0;

    textarea {
        border: none !important;
    }
}

.textarea-wrapper {
    border: 1upx solid #EBEBEB;
    border-radius: 10upx;
    margin-bottom: 24upx;

}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24upx;
}

.modal-title {
    font-size: 32upx;
    font-weight: 500;
    color: #000;
}

.close-btn {
    font-size: 36upx;
    color: #767676;
}

textarea {
    width: 94%;
    height: 160upx;
    border: 1upx solid #E5E5E5;
    border-radius: 10upx;
    padding: 16upx;
    font-size: 24upx;
}

.char-count {
    text-align: right;
    font-size: 24upx;
    color: #ADADAD;
    margin: 12upx 0;
    padding-right: 16upx;
    ;
}

.confirm-btn {
    width: 100%;
    background-color: #FF9100;
    color: #FFF;
    font-size: 32upx;
    height: 96upx;
    line-height: 96upx;
    border-radius: 48upx;
    text-align: center;
}

/* 红包领取成功弹窗 */
.success-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.content-box {
    position: relative;
    background-color: #FFF;
    width: 614upx;
    height: 678upx;
    border-radius: 40upx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.success-title {
    font-size: 40upx;
    color: #FF1B00;
    font-weight: 500;
    margin-top: 40upx;
}

.success-img {
    width: 200upx;
    height: 200upx;
    margin-top: 36upx;
}

.msg {
    font-size: 28upx;
    color: #000;
    text-align: center;
    margin-top: 34upx;
    line-height: 1.5;
}

.btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60upx;
}

.know-btn {
    width: 200upx;
    height: 76upx;
    line-height: 76upx;
    border: 2upx solid #FF1B00;
    border-radius: 38upx;
    text-align: center;
    color: #FF1B00;
    font-size: 28upx;
    margin-right: 28upx;
}

.check-btn {
    width: 200upx;
    height: 76upx;
    line-height: 76upx;
    background: linear-gradient(to right, #FF9100, #FF1B00);
    border-radius: 38upx;
    text-align: center;
    color: #FFF;
    font-size: 28upx;
}

.close-icon {
    position: absolute;
    bottom: -80upx;
    width: 52upx;
    height: 52upx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>