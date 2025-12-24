import mainToolBox from './main';
import dqnToolbox from './dqn';
import envBcstToolbox from './env_bcst';
import decisionTreeToolbox from './decision_tree'; // 之前加的决策树
import perceptronToolbox from './perceptron';      // <--- [新增] 引入感知机
import newFaceToolbox from './new_face';
export default function (data) {
  //console.log('[DEBUG toolbox/index.js] 工具箱聚合函数被调用, data:', data);
  // 注意：这里必须用模板字符串直接调用函数
  //const newFaceResult = newFaceToolbox(data);
 // console.log('[DEBUG toolbox/index.js] newFaceToolbox 返回结果（前200字符）:', newFaceResult?.substring(0, 200));

  const toolbox = `
  <xml>
    ${dqnToolbox(data)}
    ${envBcstToolbox(data)}
    ${newFaceToolbox(data)}
    ${decisionTreeToolbox(data)}
    ${perceptronToolbox(data)}  ${mainToolBox}
  </xml>`;

  console.log('[DEBUG toolbox/index.js] 最终工具箱 XML 长度:', toolbox.length);
  console.log('[DEBUG toolbox/index.js] 最终工具箱 XML（前500字符）:', toolbox.substring(0, 500));
  return toolbox;
};