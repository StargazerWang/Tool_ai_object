
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// 存储 driver 实例
let currentDriver = null;

// 默认配置
const defaultConfig = {
  animate: true,
  allowClose: false,
  overlayOpacity: 0.5,
  overlayColor: '#000',
  disableActiveInteraction: true,
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  progressText: '{{current}} / {{total}}',
  doneBtnText: '完成',
  closeBtnText: '跳过',
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  onPopoverRender: (popover, { config, state, driver }) => {
    let dom = document.querySelector('.driver-customize-close-btn');
    dom.onclick = ()=> {
      config?.doneCb&&config.doneCb();
      driver?.destroy();
    }
  },
  onDestroyStarted: (element, step, { config, state, driver }) => {
    // console.log(element, step, config, state, driver);
    config?.doneCb&&config.doneCb();
    driver?.destroy();
    currentDriver = null;
  },
  onDestroyed: () => {
    currentDriver = null;
  }
}

export default function(steps, config={}, step=0) {
  // 关闭现有的 driver
  closeDriver();
  steps = steps.map(item => {
    item.popover.title += `<button class="driver-customize-close-btn">+</button>`
    return item
  })
  currentDriver = driver({
    ...defaultConfig,
    ...config,
    steps
  });

  // 确保监听器只设置一次
  if (!window._driverListenerSetup) {
    setupPageChangeListener();
    window._driverListenerSetup = true;
  }

  currentDriver.drive(step);
}

// 监听页面切换的函数
function setupPageChangeListener() {
  // 监听 Vue Router 路由变化（如果是 Vue 项目）
  if (window.$router) {
    window.$router.afterEach(() => {
      closeDriver();
    });
  }

  // 监听页面可见性变化（切换标签页或最小化）
  /* document.addEventListener('visibilitychange', () => {
    if (document.hidden) closeDriver();
  }); */

  // 监听浏览器前进后退
  window.addEventListener('popstate', closeDriver);

  // 监听页面卸载（刷新或关闭）
  window.addEventListener('beforeunload', closeDriver);

  // 监听可能的路由跳转事件
  window.addEventListener('hashchange', closeDriver);
}

// 关闭 driver 的函数
function closeDriver() {
  if (!currentDriver) return;
  currentDriver.destroy();
  currentDriver = null;
  console.log('Driver.js 已关闭（页面切换）');
}