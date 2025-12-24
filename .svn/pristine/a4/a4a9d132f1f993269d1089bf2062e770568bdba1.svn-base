const routes = [{
  path: '/play-game',
  component: () => import('@/container/PlayGame/Index/index.vue'),
  meta: { title: '训练模型玩游戏' },
  children: [
    {
      path: '',
      component: () => import('@/container/PlayGame/Home/index.vue'),
    }, {
      path: 'fly-bird',
      component: () => import('@/container/PlayGame/FlyBird/index.vue'),
      meta: { title: 'Fly Bird' }
    }, {
      path: 'q-learning',
      component: () => import('@/container/PlayGame/Q_Learning/index.vue'),
      meta: { title: 'Q-Learning 演示' }
    },
  ],
}]

export default routes