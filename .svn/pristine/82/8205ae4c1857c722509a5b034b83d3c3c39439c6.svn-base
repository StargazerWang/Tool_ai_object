/**
 * 账号相关接口模块
 * @description 提供统一的账号管理接口，封装账号登录、用户信息获取、账号变更监听等功能
 * @author wuliangxing@wps.cn
 */

import accountManager from './core.mock';

/**
 * 调用登录页
 * @description 触发用户登录流程，打开登录页面
 * @returns {void}
 */
export function login() {
  return accountManager.login();
}

/**
 * 调用退登接口
 * @description @plus/multi-account 未提供，需单独实现
 * @returns {void}
 */
export function logout() {
  return accountManager.logout();
}

/**
 * 获取用户信息
 * @description 获取当前登录用户的信息。如果获取失败（如未登录或请求异常），会返回默认的未登录用户信息对象。
 * @param {boolean} [forceRefresh=false] - 是否强制刷新，忽略缓存直接请求最新数据
 * @returns {Promise<Object>} 返回用户信息的 Promise
 * @returns {Promise<number>} returns.userId - 用户ID，未登录时为0
 * @returns {Promise<string>} returns.nickName - 用户昵称
 * @returns {Promise<string>} returns.avatarUrl - 头像地址
 * @returns {Promise<string>} returns.companyLogo - 企业LOGO图片地址
 * @returns {Promise<number>} returns.companyId - 企业ID，个人账号企业ID为0
 * @returns {Promise<string>} returns.companyName - 企业名称
 * @returns {Promise<boolean>} returns.isCompanyAccount - 是否为新的企业账号
 * @example
 * import { getUserInfo } from '@/utils/account';
 * 
 * // 获取用户信息
 * const userInfo = await getUserInfo();
 * console.log('用户ID:', userInfo.userId);
 * console.log('用户昵称:', userInfo.nickName);
 * 
 */
export function getUserInfo(forceRefresh = false) {
  return accountManager.getUserInfo(forceRefresh);
}

/**
 * 账号变更事件监听
 * @description 监听账号切换事件，当用户切换账号时触发回调。当账号变更时会自动更新内部用户信息并触发回调。
 * @param {Function} callback - 账号变更时的回调函数，参数为新用户信息对象
 * @param {Object} callback.userInfo - 新的用户信息对象
 * @returns {void}
 * @example
 * import { onAccountChange } from '@/utils/account';
 * 
 * // 在组件挂载时注册监听
 * onAccountChange((userInfo) => {
 *   console.log('账号已切换，新用户信息:', userInfo);
 *   // 更新页面显示的用户信息
 *   updateUserDisplay(userInfo);
 * });
 */
export function onAccountChange(callback) {
  return accountManager.onAccountChange(callback);
}

/**
 * 模拟账号变更
 * @description 模拟账号变更，仅用于开发测试，不调用真实的account库
 * @param {Object} userInfo - 用户信息对象
 * @returns {void}
 */
export function mockAccountChange(userInfo) {
  return accountManager.mockAccountChange(userInfo);
}

// 默认导出所有方法
export default {
  getUserInfo,
  login,
  logout,
  onAccountChange,
  mockAccountChange
};
