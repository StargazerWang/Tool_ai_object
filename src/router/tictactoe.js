const routes = [{
  path: '/tictactoe',
  component: () => import('@/container/Tictactoe/Index/index.vue'),
  meta: {
    icon: () => import('@/container/Tictactoe/images/title-icon.png'),
    title: '井字棋'
  },
  children: [
    {
      path: '',
      component: () => import('@/container/Tictactoe/Home/index.vue'),
    }, {
      path: 'play',
      component: () => import('@/container/Tictactoe/Play/index.vue'),
      meta: { title: '井字棋-下棋规则与数字化' }
    }, {
      path: 'score',
      component: () => import('@/container/Tictactoe/Score/index.vue'),
      meta: { title: '井字棋-教会机器“想棋”' }
    }, {
      path: 'ai',
      component: () => import('@/container/Tictactoe/AI/index.vue'),
      meta: { title: '井字棋-机器学习与人机博弈' }
    },
  ]
}]

export default routes