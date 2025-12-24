import DecisionTreeLayout from '@/container/DecisionTree/index.vue';
import WeatherBrowser from '@/container/DecisionTree/WeatherBrowser.vue';
import TreeDesigner from '@/container/DecisionTree/TreeDesigner.vue';
import BlocklyGui from '@/container/BlocklyGui/index.vue';
import ModelCompare from '@/container/DecisionTree/ModelCompare.vue';

const routes = [
    {
        path: '',
        redirect: 'weather'
    },
    {
        path: 'weather',
        name: 'WeatherBrowser',
        component: WeatherBrowser,
        meta: { title: '天气数据浏览' }
    },
    {
        path: 'h5-tree',
        name: 'TreeDesigner',
        component: TreeDesigner,
        meta: { title: '决策树 H5 工具' }
    },
    {
        path: 'blockly-tree',
        name: 'TreeBlockly',
        component: BlocklyGui,
        meta: { title: '决策树 Blockly' }
    },
    {
        path: 'blockly-perceptron',
        name: 'PerceptronBlockly',
        component: BlocklyGui,
        meta: { title: '感知机 Blockly' }
    },
    {
        path: 'compare',
        name: 'ModelCompare',
        component: ModelCompare,
        meta: { title: '模型对比' }
    },
    {
        path: 'perceptron', // 访问路径: /decision-tree/perceptron
        component: BlocklyGui
    }
];

export default routes;