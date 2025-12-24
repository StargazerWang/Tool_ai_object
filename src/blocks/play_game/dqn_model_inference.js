import * as Blockly from 'blockly/core';
import 'blockly/python';
import { CategoryColors } from '@/global/colors';

const AI_COLOR = CategoryColors.AI || '#5C81A6';

// 主程序标志（用于高亮整份推理代码）
Blockly.Blocks['dqn_inf_main'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 推理主程序',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_main'] = function () {
  return '';
};

// 导入/初始化
Blockly.Blocks['dqn_inf_import_init'] = {
  init: function () {
    this.jsonInit({
      message0: '导入 DQN 推理依赖',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_import_init'] = function () {
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import torch',
    'import torch.nn as nn',
    'import numpy as np',
    'import os',
    'import copy',
    '',
  ].join('\n');
};

// SmartBlock 定义（与训练完全一致，去掉 dropout 和 bn）
Blockly.Blocks['dqn_inf_define_smart_block'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 SmartBlock (推理版，与训练一致)',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_define_smart_block'] = function () {
  return [
    '# ==========================================',
    '# 1. 基础积木定义 (必须与训练代码完全一致！)',
    '# ==========================================',
    'class SmartBlock(nn.Module):',
    '    def __init__(self, out_features, activation=\'gelu\', dropout=0.3):',
    '        super(SmartBlock, self).__init__()',
    '        self.out_features = out_features',
    '        self.activation_name = activation.lower()',
    '        self.dropout_rate = dropout',
    '        self.model = None',
    '',
    '    def build(self, in_features):',
    '        if self.activation_name == \'relu\':',
        '            act = nn.ReLU()',
    '        elif self.activation_name == \'gelu\':',
    '            act = nn.GELU()',
    '        elif self.activation_name == \'tanh\':',
    '            act = nn.Tanh()',
    '        else:',
    '            act = nn.ReLU()',
    '        self.model = nn.Sequential(',
    '            nn.Linear(in_features, self.out_features),',
    '            act',
    '        )',
    '',
    '    def forward(self, x):',
    '        if self.model is None: raise RuntimeError("积木未组装")',
    '        return self.model(x)',
    ''
  ].join('\n');
};

// AutoNet 定义
Blockly.Blocks['dqn_inf_define_auto_net'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 AutoNet (推理版)',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_define_auto_net'] = function () {
  return [
    'class AutoNet(nn.Module):',
    '    def __init__(self, input_dim, output_dim, user_blocks):',
    '        super(AutoNet, self).__init__()',
    '        self.layers = nn.ModuleList()',
    '        current_in = input_dim',
    '        for block in user_blocks:',
    '            block_copy = copy.deepcopy(block)',
    '            block_copy.build(current_in)',
    '            self.layers.append(block_copy)',
    '            current_in = block_copy.out_features',
    '        self.final_layer = nn.Linear(current_in, output_dim)',
    '',
    '    def forward(self, x):',
    '        for layer in self.layers:',
    '            x = layer(x)',
    '        x = self.final_layer(x)',
    '        return x',
    ''
  ].join('\n');
};

// DQNPredictor 定义
Blockly.Blocks['dqn_inf_define_predictor'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 DQNPredictor (推理智能体)',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_define_predictor'] = function () {
  return [
    '# ==========================================',
    '# 2. 推理专用智能体：DQNPredictor',
    '# ==========================================',
    'class DQNPredictor:',
    '    def __init__(self, state_dim, action_dim, user_blocks, model_path):',
    '        print(f"📂 正在加载模型权重: {model_path} ...")',
    '        self.net = AutoNet(state_dim, action_dim, user_blocks)',
    '        if os.path.exists(model_path):',
    '            self.net.load_state_dict(torch.load(model_path))',
    '            print("✅ 模型加载成功！")',
    '        else:',
    '            print("⚠️ 警告：找不到模型文件，将使用随机初始化的模型进行演示。")',
    '        self.net.eval()',
    '',
    '    def predict(self, state):',
    '        state_tensor = torch.FloatTensor(state).unsqueeze(0)',
    '        with torch.no_grad():',
    '            q_values = self.net(state_tensor)',
    '        action = q_values.argmax().item()',
    '        confidence = q_values.max().item()',
    '        return action, confidence',
    ''
  ].join('\n');
};

// 简易环境
Blockly.Blocks['dqn_inf_define_env'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 SimpleEnv (推理演示环境)',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_define_env'] = function () {
  return [
    '# ==========================================',
    '# 3. 模拟环境 (和训练时保持一致)',
    '# ==========================================',
    'class SimpleEnv:',
    '    def reset(self): return np.random.rand(4)',
    '',
    '    def step(self, action):',
    '        next_state = np.random.rand(4)',
    '        reward = 1.0 if np.random.rand() > 0.5 else -1.0',
    '        done = np.random.rand() > 0.9',
    '        return next_state, reward, done',
    ''
  ].join('\n');
};

// 参数总包：MODEL_FILE, STATE_DIM, ACTION_DIM
Blockly.Blocks['dqn_inf_param_config'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 推理参数 %1',
      args0: [{ type: 'input_statement', name: 'BODY' }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_inf_param_model_file'] = {
  init: function () {
    this.jsonInit({
      message0: '模型文件名 MODEL_FILE = %1',
      args0: [{ type: 'field_input', name: 'MODEL', text: 'dqn_model.pth' }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_inf_param_state_dim'] = {
  init: function () {
    this.jsonInit({
      message0: '状态维度 STATE_DIM = %1',
      args0: [{ type: 'field_number', name: 'STATE', value: 4, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_inf_param_action_dim'] = {
  init: function () {
    this.jsonInit({
      message0: '动作维度 ACTION_DIM = %1',
      args0: [{ type: 'field_number', name: 'ACT', value: 3, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 简易版参数：合并为一个积木，减少需要拖拽/编辑的参数块数量
Blockly.Blocks['dqn_inf_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: '简易参数  模型文件 %1  STATE_DIM %2  ACTION_DIM %3',
      args0: [
        { type: 'field_input', name: 'MODEL', text: 'dqn_model.pth' },
        { type: 'field_number', name: 'STATE', value: 4, precision: 1 },
        { type: 'field_number', name: 'ACT', value: 3, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_param_config'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const indent = Blockly.Python.INDENT || '    ';
  if (inner) {
    inner = inner.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    inner = [
      "    MODEL_FILE = 'dqn_model.pth'",
      '    STATE_DIM = 4',
      '    ACTION_DIM = 3',
    ].join('\n');
  }
  return inner + '\n';
};

Blockly.Python['dqn_inf_param_model_file'] = function (block) {
  const name = block.getFieldValue('MODEL') || 'dqn_model.pth';
  return `    MODEL_FILE = '${name}'\n`;
};

Blockly.Python['dqn_inf_param_state_dim'] = function (block) {
  const v = block.getFieldValue('STATE') || 4;
  return `    STATE_DIM = ${v}\n`;
};

Blockly.Python['dqn_inf_param_action_dim'] = function (block) {
  const v = block.getFieldValue('ACT') || 3;
  return `    ACTION_DIM = ${v}\n`;
};

Blockly.Python['dqn_inf_param_basic_lite'] = function (block) {
  const modelFile = block.getFieldValue('MODEL') || 'dqn_model.pth';
  const stateDim = Number(block.getFieldValue('STATE'));
  const actionDim = Number(block.getFieldValue('ACT'));

  const safeStateDim = Number.isFinite(stateDim) ? stateDim : 4;
  const safeActionDim = Number.isFinite(actionDim) ? actionDim : 3;

  return [
    `    MODEL_FILE = '${modelFile}'`,
    `    STATE_DIM = ${safeStateDim}`,
    `    ACTION_DIM = ${safeActionDim}`,
    ''
  ].join('\n');
};

// 用户积木列表（与训练时一致）
Blockly.Blocks['dqn_inf_user_block_list'] = {
  init: function () {
    this.jsonInit({
      message0: '用户积木列表 (推理用) %1',
      args0: [{ type: 'input_statement', name: 'BODY' }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_inf_smart_block'] = {
  init: function () {
    this.jsonInit({
      message0: 'SmartBlock 输出维度 %1 激活 %2',
      args0: [
        { type: 'field_number', name: 'OUT', value: 128, precision: 1 },
        {
          type: 'field_dropdown',
          name: 'ACT',
          options: [
            ['gelu', 'gelu'],
            ['relu', 'relu'],
            ['tanh', 'tanh']
          ]
        }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_user_block_list'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const result = ['    USER_BLOCK_LIST = ['];
  const indent = Blockly.Python.INDENT || '    ';
  if (inner) {
    const lines = inner.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.startsWith(indent)) {
        result.push('        ' + line.slice(indent.length).trim());
      } else {
        result.push('        ' + line.trim());
      }
    }
  } else {
    result.push("        SmartBlock(out_features=128, activation='gelu'),");
    result.push("        SmartBlock(out_features=64, activation='relu'),");
    result.push("        SmartBlock(out_features=32, activation='tanh')");
  }
  result.push('    ]');
  result.push('');
  return result.join('\n');
};

Blockly.Python['dqn_inf_smart_block'] = function (block) {
  const out = block.getFieldValue('OUT') || 128;
  const act = block.getFieldValue('ACT') || 'gelu';
  return `        SmartBlock(out_features=${out}, activation='${act}'),\n`;
};

// 推理主流程
Blockly.Blocks['dqn_inf_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: '运行 DQN 推理流程 参数 %1 积木列表 %2',
      args0: [
        { type: 'input_statement', name: 'PARAMS_BODY' },
        { type: 'input_statement', name: 'USER_BLOCK_LIST' }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 【简易版】运行入口：隐藏“积木列表”插槽，默认使用内置网络结构
Blockly.Blocks['dqn_inf_run_main_lite'] = {
  init: function () {
    this.jsonInit({
      message0: '【简易版】运行 DQN 推理流程 参数 %1',
      args0: [{ type: 'input_statement', name: 'PARAMS_BODY' }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_inf_run_main'] = function (block) {
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  let userBlockCode = Blockly.Python.statementToCode(block, 'USER_BLOCK_LIST') || '';

  const indent = Blockly.Python.INDENT || '    ';

  if (paramCode) {
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    paramCode = [
      "    MODEL_FILE = 'dqn_model.pth'",
      '    STATE_DIM = 4',
      '    ACTION_DIM = 3'
    ].join('\n');
  }

  if (userBlockCode) {
    userBlockCode = userBlockCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    userBlockCode = [
      '    USER_BLOCK_LIST = [',
      "        SmartBlock(out_features=128, activation='gelu'),",
      "        SmartBlock(out_features=64, activation='relu'),",
      "        SmartBlock(out_features=32, activation='tanh')",
      '    ]',
      ''
    ].join('\n');
  }

  return [
    '# ==========================================',
    '# 🚀 主程序入口（推理）',
    '# ==========================================',
    'if __name__ == "__main__":',
    '',
    '    # 1. 配置信息 (必须与训练时一致)',
    paramCode,
    '',
    '    # 2. 用户积木区（结构必须与训练时一致）',
    userBlockCode,
    '',
    '    # --- 为了演示方便，如果本地没有模型文件，先模拟保存一个 ---',
    '    if not os.path.exists(MODEL_FILE):',
    '        print("💡 提示：本地没有找到模型文件，我先模拟生成一个 dummy 模型...")',
    '        temp_net = AutoNet(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST)',
    '        torch.save(temp_net.state_dict(), MODEL_FILE)',
    '',
    '    predictor = DQNPredictor(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST, MODEL_FILE)',
    '    env = SimpleEnv()',
    '    print("\\n🚀 开始推理测试 (Let\'s Play!)...")',
    '',
    '    for i in range(3):',
    '        print(f"\\n--- 第 {i + 1} 局游戏 ---")',
    '        state = env.reset()',
    '        done = False',
    '        step_count = 0',
    '        total_score = 0',
    '        while not done:',
    '            action, q_val = predictor.predict(state)',
    '            next_state, reward, done = env.step(action)',
    '            state = next_state',
    '            total_score += reward',
    '            step_count += 1',
    '            if step_count > 20: break',
    '        print(f"🎮 游戏结束! 总得分: {total_score:.2f} | 坚持步数: {step_count}")',
    ''
  ].join('\n');
};

Blockly.Python['dqn_inf_run_main_lite'] = function (block) {
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  const indent = Blockly.Python.INDENT || '    ';

  if (paramCode) {
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    paramCode = [
      "    MODEL_FILE = 'dqn_model.pth'",
      '    STATE_DIM = 4',
      '    ACTION_DIM = 3'
    ].join('\n');
  }

  const userBlockCode = [
    '    USER_BLOCK_LIST = [',
    "        SmartBlock(out_features=128, activation='gelu'),",
    "        SmartBlock(out_features=64, activation='relu'),",
    "        SmartBlock(out_features=32, activation='tanh')",
    '    ]',
    ''
  ].join('\n');

  return [
    '# ==========================================',
    '# 🚀 主程序入口（推理-简易版）',
    '# ==========================================',
    'if __name__ == \"__main__\":',
    '',
    '    # 1. 配置信息（必须与训练时一致）',
    paramCode,
    '',
    '    # 2. 用户积木区（简易版使用默认结构）',
    userBlockCode,
    '',
    '    # --- 为了演示方便，如果本地没有模型文件，先模拟保存一个 ---',
    '    if not os.path.exists(MODEL_FILE):',
    '        print(\"💡 提示：本地没有找到模型文件，我先模拟生成一个 dummy 模型...\")',
    '        temp_net = AutoNet(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST)',
    '        torch.save(temp_net.state_dict(), MODEL_FILE)',
    '',
    '    predictor = DQNPredictor(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST, MODEL_FILE)',
    '    env = SimpleEnv()',
    '    print(\"\\\\n🚀 开始推理测试 (Let\'s Play!)...\")',
    '',
    '    for i in range(3):',
    '        print(f\"\\\\n--- 第 {i + 1} 局游戏 ---\")',
    '        state = env.reset()',
    '        done = False',
    '        step_count = 0',
    '        total_score = 0',
    '        while not done:',
    '            action, q_val = predictor.predict(state)',
    '            next_state, reward, done = env.step(action)',
    '            state = next_state',
    '            total_score += reward',
    '            step_count += 1',
    '',
    '        print(f\"本局结束：总分={total_score:.2f}, 步数={step_count}\")',
    ''
  ].join('\n');
};
