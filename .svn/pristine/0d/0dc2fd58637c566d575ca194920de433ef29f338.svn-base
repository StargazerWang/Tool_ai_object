/**
 * 数据埋点上报实现封装
 * @description 提供数据埋点上报的具体实现
 * @author wuliangxing@wps.cn
 */

// TODO：先import数仓sdk

class Tracker {
  constructor() {
    this.config = {
      appId: '',
      env: '',
      deviceType: '',
    };
    this.userInfo = {
      userId: '',
      companyId: '',
      companyName: '',
    };
    this.isInitialized = false;
  }

  /**
   * 初始化埋点配置
   * @param {Object} config - 配置对象
   */
  init() {
    this.config = {
      appId: '1234567890',
      env: 'dev',
      deviceType: 'unknown'
    };
    // TODO: 调用数仓sdk初始化方法

    this.isInitialized = true;
    console.log('[Report] 初始化成功', this.config);
    return true;
  }

  /**
   * 设置用户信息
   * @param {Object} userInfo - 用户信息
   */
  setUserInfo(userInfo) {
    this.userInfo = {
      userId: userInfo.userId || '',
      companyId: userInfo.companyId || '',
      companyName: userInfo.companyName || '',
    };

    console.log('[Report] 用户信息已设置', this.userInfo);
    return true;
  }

  /**
   * 构建基础上报数据
   * @private
   */
  _buildBaseData() {
    return {
      wpsid: this.userInfo.userId,
      companyid: this.userInfo.companyId,
      companyname: this.userInfo.companyName,
      type: this.config.deviceType,
    };
  }

  /**
   * 发送上报数据（Mock实现）
   * @private
   * @param {string} event - 事件类型
   * @param {Object} data - 上报数据
   */
  _send(event, data) {
    // 这里提供 Mock 实现，仅用于开发测试
    console.log('[Report] 上报数据:',  event, data);

    // TODO：添加真实的上报逻辑
    return Promise.resolve({ success: true, data });
  }

  /**
   * 页面访问上报
   * @param {Object} params - 上报参数
   */
  trackPageShow(params) {
    if (!this.isInitialized) {
      console.warn('[Report] 未初始化，请先调用 init() 方法');
      return Promise.reject(new Error('Report not initialized'));
    }

    if (!params || !params.pageName || !params.IdNum || !params.textInfo) {
      console.warn('[Report] 页面访问上报失败：检查是否缺少参数 pageName, IdNum, textInfo');
      return Promise.reject(new Error('Missing required parameter: pageName, IdNum, textInfo'));
    }

    const data = {
      page_name: params.pageName,
      id_num: params.IdNum || '',
      text_info: params.textInfo,
      ...this._buildBaseData(),
    };

    return this._send('page_show', data);
  }

  /**
   * 事件上报
   * @param {Object} params - 上报参数
   */
  trackButtonClick(params) {
    if (!this.isInitialized) {
      console.warn('[Report] 未初始化，请先调用 init() 方法');
      return Promise.reject(new Error('Report not initialized'));
    }

    if (!params || !params.pageName  || !params.IdNum || !params.textInfo || !params.name) {
      console.warn('[Report] 事件上报失败：检查是否缺少参数 pageName, IdNum, textInfo, name');
      return Promise.reject(new Error('Missing required parameter: pageName, IdNum, textInfo, name'));
    }

    const data = {
      page_name: params.pageName,
      name: params.name,
      id_num: params.IdNum,
      text_info: params.textInfo,
      ...this._buildBaseData(),
    };

    return this._send('button_click', data);
  }
}

// 创建单例实例
const tracker = new Tracker();

export default tracker;

