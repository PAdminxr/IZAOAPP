// utils/timeUtils.js

/**
 * 解析 expireTime 字段，返回显示值（倒计时或原文字）
 * @param {string} str - expireTime 原始字符串
 * @returns {{ type: 'time' | 'text', value: string }}
 */
export function parseExpireDisplay(str) {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
    const match = str.match(timeRegex);
  
    if (match) {
      // 是时间格式，返回未来时间戳用于倒计时
      const now = new Date();
      const [_, hh, mm, ss] = match;
      const durationMs = +hh * 3600000 + +mm * 60000 + +ss * 1000;
      const expireDate = new Date(now.getTime() + durationMs);
      return {
        type: 'time',
        value: expireDate
      };
    } else {
      // 是纯文字，直接返回原始文本
      return {
        type: 'text',
        value: str
      };
    }
  }