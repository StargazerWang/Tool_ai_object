
const routes = [{
  path: '/environmental',
  component: () => import('@/container/Environmental/Index/index.vue'),
  meta: { title: '智能环境播报助手' },
  children: [
    {
      path: '',
      component: () => import('@/container/Environmental/Home.vue'),
    }, {
      path: 'image-rec',
      component: () => import('@/container/Environmental/ImageRec/index.vue'),
    }, {
      path: 'analyze',
      component: () => import('@/container/Environmental/FlowchartAnalyze.vue'),
    }, {
      path: 'build',
      component: () => import('@/container/Environmental/FlowchartBuild.vue'),
    },
  ]
}]

export default routes