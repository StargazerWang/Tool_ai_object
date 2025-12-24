/**
 * 文件上传实现封装（Mock版本）
 * @description 提供文件上传的 Mock 实现，仅用于开发测试，不调用真实的 @ks-saas-edu/upload2kdocs
 * @author wuliangxing@wps.cn
 */

/**
 * 上传管理器类（Mock版本）
 * @class UploadManager
 * @description 封装文件上传相关的操作，包括初始化、上传文件等功能。Mock 实现仅返回模拟数据。
 */
class UploadManager {
  /**
   * 延时配置常量（单位：毫秒）
   * @static
   * @type {Object}
   */
  static DELAY_CONFIG = {
    START: 300,              // start 状态延时
    START_UPLOAD: 1000,       // start upload 状态延时
    UPLOADING_STEP: 1000,     // uploading 状态每步延时
    FINISHED: 1000            // upload finished 状态延时
  };

  /**
   * 上传进度配置常量
   * @static
   * @type {Object}
   */
  static PROGRESS_CONFIG = {
    UPLOAD_STEPS: 10         // uploading 状态分步数
  };

  /**
   * 构造函数
   * @description 初始化上传管理器
   */
  constructor() {
    this.isInitialized = false;
    this.cacheName = '';
  }

  /**
   * 延迟函数
   * @private
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 生成任务ID
   * @private
   * @returns {string} 任务ID
   */
  _generateTaskId() {
    return `mock-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 触发进度回调
   * @private
   * @param {Function} callback - 回调函数
   * @param {Object} progressData - 进度数据
   */
  _triggerCallback(callback, progressData) {
    if (callback && typeof callback === 'function') {
      try {
        callback(progressData);
      } catch (error) {
        console.warn('[Upload Mock] 回调函数执行失败', error);
      }
    }
  }

  /**
   * 初始化上传管理器
   * @description Mock 实现：模拟初始化上传模块，设置缓存名称
   * @param {string} [cacheName='wps-edu-upload-cache'] - 缓存名称，用于存储上传任务的缓存数据
   * @param {Object} [options] - 初始化选项
   * @returns {boolean} 初始化是否成功
   */
  init(cacheName = 'wps-edu-upload-cache', options = {}) {
    try {
      this.cacheName = cacheName;
      this.isInitialized = true;
      console.log('[Upload Mock] 初始化成功', { cacheName, options });
      return true;
    } catch (error) {
      console.error('[Upload Mock] 初始化失败', error);
      return false;
    }
  }

  /**
   * 上传本地文件（Mock实现）
   * @description 模拟文件上传流程，通过延时控制各个状态的进度回调。
   * 对于本地文件上传，状态流程为：start -> start upload -> uploading -> upload finished
   * 
   * @param {File} file - 必选，文件对象
   * @param {string} groupId - 必选，组ID
   * @param {string} parentId - 必选，父ID
   * @param {Object} [options] - 可选，上传选项
   * @param {string} [options.filename] - 可选：自定义文件名
   * @param {boolean} [options.autoRename=true] - 可选：文件重名时自动重命名（加后缀）
   * @param {Function} [options.callback] - 可选：进度回调函数，形如 callback(progressData)
   * @returns {Promise<Object>} Promise，解析为上传结果对象
   * @returns {Promise<boolean>} returns.success - 是否上传成功
   * @returns {Promise<string>} returns.taskId - 任务ID
   */
  async uploadFile(file, groupId, parentId, options = {}) {
    if (!this.isInitialized) {
      throw new Error('[Upload Mock] 未初始化，请先调用 init() 方法');
    }

    if (!file) {
      throw new Error('[Upload Mock] file 参数不能为空');
    }

    if (!groupId || !parentId) {
      throw new Error('[Upload Mock] groupId 和 parentId 不能为空');
    }

    const taskId = this._generateTaskId();
    const filename = options.filename || file.name || '未命名文件';
    const callback = options.callback;

    console.log('[Upload Mock] 开始上传文件', {
      file: file.name || file,
      filename,
      groupId,
      parentId,
      taskId,
      fileSize: file.size || 'unknown'
    });

    try {
      // 状态1: start (0%)
      this._triggerCallback(callback, {
        result: 'ok',
        taskid: taskId,
        status: 'start',
        progress: 0,
        callstatus: 'ok'
      });
      await this._delay(UploadManager.DELAY_CONFIG.START);

      // 状态2: start upload (50%)
      this._triggerCallback(callback, {
        result: 'ok',
        taskid: taskId,
        status: 'start upload',
        progress: 50,
        callstatus: 'ok'
      });
      await this._delay(UploadManager.DELAY_CONFIG.START_UPLOAD);

      // 状态3: uploading (50~99%)
      // 模拟上传进度，从50%逐步增加到99%
      const uploadSteps = UploadManager.PROGRESS_CONFIG.UPLOAD_STEPS;
      const progressStep = 49 / uploadSteps; // 每步增加约4.9%

      for (let i = 1; i <= uploadSteps; i++) {
        const progress = Math.min(50 + progressStep * i, 99);
        this._triggerCallback(callback, {
          result: 'ok',
          taskid: taskId,
          status: 'uploading',
          progress: Math.round(progress),
          callstatus: 'ok'
        });
        // 每步延迟，模拟上传过程
        await this._delay(UploadManager.DELAY_CONFIG.UPLOADING_STEP);
      }

      // 状态4: upload finished (100%)
      this._triggerCallback(callback, {
        result: 'ok',
        taskid: taskId,
        status: 'upload finished',
        progress: 100,
        callstatus: 'ok'
      });
      await this._delay(UploadManager.DELAY_CONFIG.FINISHED);

      const result = {
        success: true,
        taskId: taskId
      };

      console.log('[Upload Mock] 上传成功', result);
      return result;
    } catch (error) {
      console.error('[Upload Mock] 上传失败', error);
      
      // 触发错误状态回调
      this._triggerCallback(callback, {
        result: 'error',
        taskid: taskId,
        status: 'error',
        progress: 0,
        callstatus: 'error'
      });

      throw error;
    }
  }
}

// 创建单例实例
const uploadManager = new UploadManager();

export default uploadManager;

