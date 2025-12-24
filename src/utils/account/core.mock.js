/**
 * 账号管理实现封装（Mock版本）
 * @description 提供账号管理的 Mock 实现，仅用于开发测试，不调用真实的account库
 * @author wuliangxing@wps.cn
 */

/**
 * 账号管理类（Mock版本）
 * @class AccountManager
 * @description 封装账号相关的操作，包括登录、获取用户信息、监听账号变更等。Mock 实现仅返回模拟数据。
 */
class AccountManager {
  /**
   * 构造函数
   * @description 初始化账号管理器，设置默认用户信息
   */
  constructor() {
    this.userInfo = this._initUserInfo();
    this._isMockLogin = false; // 仅用于开发过程中 Mock 登录状态，正式环境不会使用
    this._accountChangeCallback = null; // 仅用于开发过程中临时存储账号变更回调函数
  }

  /**
   * 调用登录页
   * @description Mock 实现：模拟触发用户登录流程，设置登录状态为 true
   * @returns {void}
   */
  login() {
    // Mock 实现：模拟登录成功
    console.log("[Account] 调用登录页（Mock）");
    
    // 使用confirm模拟登录弹窗
    this._isMockLogin = confirm('点击‘确认’登录，点击‘取消’不登录');
  }

  logout() {
    // Mock 实现：模拟注销成功
    console.log("[Account] 调用注销页（Mock）");
    this._isMockLogin = false;
  }

  /**
   * 初始化用户信息
   * @description 返回未登录状态的默认用户信息对象
   * @private
   * @returns {Object} 默认用户信息对象
   * @returns {number} returns.userId - 用户ID，未登录时为0
   * @returns {string} returns.nickName - 用户昵称，未登录时为空字符串
   * @returns {string} returns.avatarUrl - 头像地址，未登录时为空字符串
   * @returns {string} returns.companyLogo - 企业LOGO图片地址，未登录时为空字符串
   * @returns {number} returns.companyId - 企业ID，个人账号企业ID为0
   * @returns {string} returns.companyName - 企业名称，未登录时为空字符串
   * @returns {boolean} returns.isCompanyAccount - 是否为新的企业账号
   */
  _initUserInfo() {
    return {
      userId: 0,
      nickName: "",
      avatarUrl: "",
      companyLogo: "",
      companyId: 0,
      companyName: "",
      isCompanyAccount: false,
    };
  }

  /**
   * 获取用户信息
   * @description 获取当前登录用户的信息。调用 @plus/multi-account 的获取用户信息方法。
   * 如果获取失败（如未登录或请求异常），会返回默认的未登录用户信息对象。
   * @returns {Promise<Object>} 返回用户信息的 Promise
   * @returns {Promise<number>} returns.userId - 用户ID，未登录时为0
   * @returns {Promise<string>} returns.nickName - 用户昵称
   * @returns {Promise<string>} returns.avatarUrl - 头像地址
   * @returns {Promise<string>} returns.companyLogo - 企业LOGO图片地址
   * @returns {Promise<number>} returns.companyId - 企业ID，个人账号企业ID为0
   * @returns {Promise<string>} returns.companyName - 企业名称
   * @returns {Promise<boolean>} returns.isCompanyAccount - 是否为新的企业账号
   */
  async getUserInfo() {
    if (this._isMockLogin) {
      this.userInfo = {
        userId: 123456789,
        nickName: "测试用户",
        avatarUrl: "https://img.qwps.cn/1384381232?imageMogr2/thumbnail/180x180!&1665457890641338788",
        companyLogo: "https://volcengine-kdocs-cache.wpscdn.cn/kdocs/img/logo.5c78b00f.svg",
        companyId: 1001,
        companyName: "金山办公教育",
        isCompanyAccount: true,
      };
    } else {
      this.userInfo = this._initUserInfo();
    }
    return this.userInfo;
  }

  /**
   * 账号变更事件监听
   * @description 监听账号切换事件，当用户切换账号时触发回调。
   * 调用 @plus/multi-account 的事件监听方法，当账号变更时会自动更新内部用户信息并触发回调。
   * @param {Function} callback - 账号变更时的回调函数，参数为新用户信息对象
   * @param {Object} callback.userInfo - 新的用户信息对象
   */
  onAccountChange(callback) {
    if (typeof callback !== "function") {
      console.warn("[Account] onAccountChange 需要传入一个回调函数");
      return;
    }

    // Mock 实现：存储回调函数，可以通过手动触发来测试
    this._accountChangeCallback = callback;
  }

  /**
   * 模拟账号变更
   * @description 模拟账号变更，仅用于开发测试，不调用真实的account库
   * @param {Object} userInfo - 用户信息对象
   * @returns {void}
   */
  mockAccountChange(userInfo) {
    if (this._accountChangeCallback) {
      this._accountChangeCallback(userInfo);
    }
  }
}

// 创建单例实例
const accountManager = new AccountManager();

export default accountManager;

