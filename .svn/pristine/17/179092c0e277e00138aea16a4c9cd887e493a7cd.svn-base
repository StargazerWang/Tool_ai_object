
/**
 * 获取基础 URL（自动处理部署时的 baseUrl）
 * @returns {string} 基础 URL
 */
export function getBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

/**
 * 构建完整的 URL 路径（自动处理 baseUrl）
 * @param {string} path - 相对路径或绝对路径（以 / 开头会被处理为相对路径）
 * @returns {string} 完整的 URL
 * 
 * @example
 * // 相对路径
 * buildUrl('valid_games.json') // => '/valid_games.json' 或 './valid_games.json'（取决于 baseUrl）
 * 
 * // 绝对路径（以 / 开头）
 * buildUrl('/valid_games.json') // => '/valid_games.json' 或 './valid_games.json'
 * 
 * // 外部 URL 保持不变
 * buildUrl('https://example.com/api') // => 'https://example.com/api'
 */
export function buildUrl(path) {
  if (!path) return getBaseUrl();
  
  // 如果是完整的 URL（http:// 或 https:// 或 data:），直接返回
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  const baseUrl = getBaseUrl();
  
  // 如果路径以 / 开头，去掉开头的 /
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  
  // 拼接 baseUrl 和路径
  return `${baseUrl}${path}`;
}

let hardData = [], normalData = [], easyData = [];
(async function () {
  const res = await fetch(buildUrl('/valid_games.json'));
  hardData = await res.json();
  normalData = hardData.slice(0, 25516);
  easyData = hardData.slice(0, 2550);
  // console.log(allData)
})()


export function queryData({page=1, size=10, level='easy'}) {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = level ==='hard' ? hardData : level ==='normal' ? normalData : easyData;
      let arr = data.slice((page - 1) * size, ((page - 1) * size) + size);
      resolve({ result: arr, count: data.length })
    }, 1000)
  })
}

export function downloadData({page=1, size=10, level='easy'}) {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = level ==='hard' ? hardData : level ==='normal' ? normalData : easyData;
      let arr = data.slice((page - 1) * size, ((page - 1) * size) + size);
      resolve({ result: arr, count: data.length })
    }, 100)
  })
}