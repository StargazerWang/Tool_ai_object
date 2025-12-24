import { createRouter, createWebHashHistory } from 'vue-router';
import { setIcon } from '@/utils/tool';

import TictactoeRoutes from '@/router/tictactoe';
import PlayGameRoutes from '@/router/playGame';
import EnvironmentalRoutes from '@/router/environmental';

import Home from '@/container/Home/index.vue';
import NotFound from '@/container/NotFound.vue';
import DecisionTreeLayout from '@/container/DecisionTree/index.vue';
import faceRoutes from '@/router/NewFace';
import DecisionTreeRoutes from '@/router/DecisionTree';

const routes = [
  // ✅ 访问根路径时重定向到 /xxx
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
  },
  ...TictactoeRoutes,
  ...PlayGameRoutes,
  {
    path: '/blockly-gui',
    component: () => import('@/container/BlocklyGui/index.vue'),
    meta: { title: 'Blockly' },
  },
  ...EnvironmentalRoutes,
  {
    path: '/decision-tree',
    component: DecisionTreeLayout,
    children: DecisionTreeRoutes
  },
  ...faceRoutes,
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  },
]


const router = createRouter({
  history: createWebHashHistory(), // ✅ 使用 HTML5 History 模式
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to?.meta?.title || 'Tool';
  setIcon(to?.meta?.icon || '');
  next()
})

export default router
