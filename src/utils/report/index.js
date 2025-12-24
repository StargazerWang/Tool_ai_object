/**
 * 数据埋点上报模块
 * @description 提供统一的数据埋点上报接口
 * @author wuliangxing@wps.cn
 */

import tracker from './core';

/**
 * 初始化埋点配置
 * @description 初始化埋点上报模块，无需传入参数，内部会自动配置默认值
 * @returns {boolean} 初始化是否成功
 */
export function init() {
  return tracker.init();
}

/**
 * 页面访问上报
 * @param {Object} params - 上报参数
 * @param {string} params.pageName - 页面名称（必填）
 * @param {string} params.IdNum - 页面ID编号（必填）
 * @param {string} params.textInfo - 页面文本信息（必填）
 * @returns {Promise} 返回上报结果的 Promise
 */
export function pageShow(params) {
  return tracker.trackPageShow(params);
}

/**
 * 按钮点击事件上报
 * @param {Object} params - 上报参数
 * @param {string} params.pageName - 页面名称（必填）
 * @param {string} params.name - 按钮名称（必填）
 * @param {string} params.IdNum - 按钮ID编号（必填）
 * @param {string} params.textInfo - 按钮文本信息（必填）
 * @returns {Promise} 返回上报结果的 Promise
 */
export function buttonClick(params) {
  return tracker.trackButtonClick(params);
}

/**
 * 设置用户信息
 * @param {Object} userInfo - 用户信息
 * @param {string} userInfo.userId - 用户WPS账号ID（可选）
 * @param {string} userInfo.companyId - 公司ID（可选）
 * @param {string} userInfo.companyName - 公司名称（可选）
 * @returns {boolean} 设置是否成功
 */
export function setUserInfo(userInfo) {
  return tracker.setUserInfo(userInfo);
}

// 默认导出所有方法
export default {
  init,
  pageShow,
  buttonClick,
  setUserInfo
};

