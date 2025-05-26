// utils/unit.js

import { isMiniProgram } from './platform';

/**
 * 将 upx/rpx 转换为 px
 * @param value {string} - 如 "16upx", "32rpx", "8px"
 * @returns {string}
 */
export function normalizeUnit(value) {
    if (!value) return '1px';

    const lower = value.toLowerCase();
    if (lower.endsWith('upx') || lower.endsWith('rpx')) {
        const num = parseInt(value);
        if (isMiniProgram()) {
            // 小程序环境支持 uni.upx2px
            return uni.upx2px(num) + 'px';
        } else {
            // H5/App 使用简单换算（1upx = 0.5px）
            return num / 2 + 'px';
        }
    }

    return value;
}