// 本地文件上传金山文档指定目录的功能模块
// 本文件仅提供方法定义，具体实现在core.impl.js中

import uploadManager from './core.mock';

export function init() {
    return uploadManager.init();
}

/**
 * 上传本地文件
 * @description
 * 支持将本地文件上传到金山文档指定目录，并可通过 options.callback 实时获知上传进度。
 * 
 * 进度回调说明（options.callback，接收 ProgressData 对象，详见下方）：
 * - 回调参数 JSON 格式（会被自动解析为对象）：
 *   {
 *     result: 'ok',        // 结果状态
 *     taskid: string,      // 任务ID
 *     status: string,      // 阶段状态，详见下表
 *     progress: number,    // 当前进度（0-100）
 *     callstatus: string   // 调用状态
 *   }
 * - 状态字段status值及其意义：
 *   ┌─────────────────────────┬───────────────────────┬───────────────┐
 *   │ 状态(status)            │ 说明                  │   进度范围    │
 *   ├─────────────────────────┼───────────────────────┼───────────────┤
 *   │ start                   │ 开始上传               │      0%      │
 *   │ downloading             │ 下载网络文件中（仅限网络文件）│   0~50%   │
 *   │ downloading finished    │ 下载完成               │     50%      │
 *   │ start upload            │ 开始上传               │     50%      │
 *   │ uploading               │ 上传中                 │   50~99%     │
 *   │ upload finished         │ 上传完成               │    100%      │
 *   │ error                   │ 上传失败               │      0       │
 *   └─────────────────────────┴───────────────────────┴───────────────┘
 * 
 * @param {File} file 必选，文件对象
 * @param {string} groupId 必选，集备组ID
 * @param {string} parentId 必选，父目录ID
 * @param {Object} options 可选，上传选项
 * @param {string} [options.filename] 可选：自定义文件名
 * @param {boolean} [options.autoRename=true] 可选：文件重名时自动重命名（加后缀）
 * @param {Function} [options.callback] 可选：进度回调函数，形如 callback(progressData)
 * @returns {Promise<string>} Promise，解析为上传成功后返回的文件ID等信息
 * 
 * @example
 * uploadFile(file, groupId, parentId, {
 *   filename: '自定义名称.docx',
 *   autoRename: true,
 *   callback: (progressData) => {
 *     // 根据 progressData.status/status/progress 做进度条展示
 *     console.log(progressData);
 *   }
 * });
 */
export async function uploadFile(
    file,
    groupId,
    parentId,
    options = { filename: undefined, autoRename: true, callback: null }
) {
    // options.callback 会在上传过程中被多次调用，参考进度状态/status进行UI进度提示
    return await uploadManager.uploadFile(file, groupId, parentId, options);
}

export default {
    init,
    uploadFile,
}