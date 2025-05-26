// utils/platform.js

export const isWeChat = () => process.env.UNI_PLATFORM === 'mp-weixin';
export const isAlipay = () => process.env.UNI_PLATFORM === 'mp-alipay';
export const isH5 = () => process.env.UNI_PLATFORM === 'h5';
export const isApp = () => process.env.UNI_PLATFORM === 'app-plus';

export const isMiniProgram = () =>
    ['mp-weixin', 'mp-alipay', 'mp-qq', 'mp-toutiao'].includes(process.env.UNI_PLATFORM);

export const getPlatformPrefix = () =>
    isWeChat() ? 'wx-' : isAlipay() ? 'alipay-' : '';