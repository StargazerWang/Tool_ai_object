import * as Blockly from 'blockly/core';
import 'blockly/python';
import { CategoryColors } from '@/global/colors';

const AI_COLOR = CategoryColors.AI || '#5C81A6';

// ===========================
// 一、主程序标志（用于高亮）
// ===========================
Blockly.Blocks['dqn_arch_main'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 结构主程序',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_main'] = function () {
  return '';
};

// ===========================
// 二、导入/初始化模块
// ===========================
Blockly.Blocks['dqn_arch_import_init'] = {
  init: function () {
    this.jsonInit({
      message0: '导入 DQN 结构依赖',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_import_init'] = function () {
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import torch',
    'import torch.nn as nn',
    'import torch.optim as optim',
    'import numpy as np',
    'import random',
    'from collections import deque',
    ''
  ].join('\n');
};

// ===========================
// 三、网络结构模块：NativeDQNNetwork
// ===========================
Blockly.Blocks['dqn_arch_define_network'] = {
  init: function () {
    this.jsonInit({
      message0: '定义原生 DQN 卷积网络 NativeDQNNetwork',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_define_network'] = function () {
  return [
    '# ==========================================',
    '# 1. 原生 DQN 网络结构 (DeepMind 2015 Nature版本)',
    '# ==========================================',
    'class NativeDQNNetwork(nn.Module):',
    '    """',
    '    这是 DeepMind 在 Atari 游戏中使用的经典 CNN 结构。',
    '    结构：3层卷积 (Conv2d) -> 展平 -> 2层全连接 (Linear)',
    '    """',
    '    def __init__(self, input_channels, action_dim):',
    '        super(NativeDQNNetwork, self).__init__()',
    '        # --- 特征提取部分 (卷积层) ---',
    '        self.conv_net = nn.Sequential(',
    '            nn.Conv2d(in_channels=input_channels, out_channels=32, kernel_size=8, stride=4),',
    '            nn.ReLU(),',
    '            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=4, stride=2),',
    '            nn.ReLU(),',
    '            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, stride=1),',
    '            nn.ReLU()',
    '        )',
    '        # --- 决策部分 (全连接层) ---',
    '        self.fc_net = nn.Sequential(',
    '            nn.Flatten(),',
    '            nn.Linear(64 * 7 * 7, 512),',
    '            nn.ReLU(),',
    '            nn.Linear(512, action_dim)',
    '        )',
    '',
    '    def forward(self, x):',
    '        features = self.conv_net(x)',
    '        q_values = self.fc_net(features)',
    '        return q_values',
    ''
  ].join('\n');
};

// ===========================
// 四、Agent 模块：DQNAgent
// ===========================
Blockly.Blocks['dqn_arch_define_agent'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 DQNAgent（结构演示版）',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_define_agent'] = function () {
  return [
    '# ==========================================',
    '# 2. DQN 智能体 (保持原逻辑，适配新网络)',
    '# ==========================================',
    'class DQNAgent:',
    '    def __init__(self, params):',
    '        self.params = params',
    '        self.action_dim = params[\'action_dim\']',
    '        self.policy_net = NativeDQNNetwork(params[\'input_channels\'], params[\'action_dim\'])',
    '        self.target_net = NativeDQNNetwork(params[\'input_channels\'], params[\'action_dim\'])',
    '        self.target_net.load_state_dict(self.policy_net.state_dict())',
    '        self.target_net.eval()',
    '        self.optimizer = optim.Adam(self.policy_net.parameters(), lr=params[\'lr\'])',
    '        self.memory = deque(maxlen=params[\'memory_capacity\'])',
    '',
    '    def choose_action(self, state):',
    '        if random.random() < self.params[\'epsilon\']:',
    '            return random.randint(0, self.action_dim - 1)',
    '        state_tensor = torch.FloatTensor(state).unsqueeze(0)',
    '        with torch.no_grad():',
    '            q_values = self.policy_net(state_tensor)',
    '        return q_values.argmax().item()',
    '',
    '    def store_experience(self, state, action, reward, next_state, done):',
    '        self.memory.append((state, action, reward, next_state, done))',
    '',
    '    def learn(self):',
    '        if len(self.memory) < self.params[\'batch_size\']:',
    '            return',
    '        batch = random.sample(self.memory, self.params[\'batch_size\'])',
    '        states, actions, rewards, next_states, dones = zip(*batch)',
    '        states = torch.FloatTensor(np.array(states))',
    '        actions = torch.LongTensor(actions).unsqueeze(1)',
    '        rewards = torch.FloatTensor(rewards).unsqueeze(1)',
    '        next_states = torch.FloatTensor(np.array(next_states))',
    '        dones = torch.FloatTensor(dones).unsqueeze(1)',
    '        current_q = self.policy_net(states).gather(1, actions)',
    '        with torch.no_grad():',
    '            max_next_q = self.target_net(next_states).max(1)[0].unsqueeze(1)',
    '            target_q = rewards + (self.params[\'gamma\'] * max_next_q * (1 - dones))',
    '        loss = nn.MSELoss()(current_q, target_q)',
    '        self.optimizer.zero_grad()',
    '        loss.backward()',
    '        self.optimizer.step()',
    ''
  ].join('\n');
};

// ===========================
// 五、参数模块：DQN_PARAMS 字典 + 子参数
// ===========================
Blockly.Blocks['dqn_arch_param_config'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 结构演示参数 %1',
      args0: [
        { type: 'input_statement', name: 'BODY' }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_input_channels'] = {
  init: function () {
    this.jsonInit({
      message0: '输入通道 input_channels = %1',
      args0: [{ type: 'field_number', name: 'IN_CH', value: 4, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_action_dim'] = {
  init: function () {
    this.jsonInit({
      message0: '动作数 action_dim = %1',
      args0: [{ type: 'field_number', name: 'ACT_DIM', value: 3, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_lr'] = {
  init: function () {
    this.jsonInit({
      message0: '学习率 lr = %1',
      args0: [{ type: 'field_number', name: 'LR', value: 0.0001, precision: 0.0001 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_gamma'] = {
  init: function () {
    this.jsonInit({
      message0: '折扣因子 gamma = %1',
      args0: [{ type: 'field_number', name: 'GAMMA', value: 0.99, precision: 0.01 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_epsilon'] = {
  init: function () {
    this.jsonInit({
      message0: '探索率 epsilon = %1',
      args0: [{ type: 'field_number', name: 'EPS', value: 0.1, precision: 0.01 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_memory'] = {
  init: function () {
    this.jsonInit({
      message0: '经验池容量 memory_capacity = %1',
      args0: [{ type: 'field_number', name: 'MEM', value: 5000, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Blocks['dqn_arch_param_batch'] = {
  init: function () {
    this.jsonInit({
      message0: '批大小 batch_size = %1',
      args0: [{ type: 'field_number', name: 'BATCH', value: 32, precision: 1 }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 简易版参数：合并为一个积木，减少需要拖拽/编辑的参数块数量
Blockly.Blocks['dqn_arch_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: '简易参数  输入通道 %1  动作数 %2  lr %3  gamma %4  epsilon %5  经验池 %6  batch %7',
      args0: [
        { type: 'field_number', name: 'IN_CH', value: 4, precision: 1 },
        { type: 'field_number', name: 'ACT_DIM', value: 3, precision: 1 },
        { type: 'field_number', name: 'LR', value: 0.0001, precision: 0.0001 },
        { type: 'field_number', name: 'GAMMA', value: 0.99, precision: 0.01 },
        { type: 'field_number', name: 'EPS', value: 0.1, precision: 0.01 },
        { type: 'field_number', name: 'MEM', value: 5000, precision: 1 },
        { type: 'field_number', name: 'BATCH', value: 32, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_param_config'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const indent = Blockly.Python.INDENT || '    ';
  const result = ['    DQN_PARAMS = {  # 原生 DQN 结构演示参数'];

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
    result.push("        'input_channels': 4,  # 输入通道");
    result.push("        'action_dim': 3,  # 动作数");
    result.push("        'lr': 0.0001,  # 学习率");
    result.push("        'gamma': 0.99,  # 折扣因子");
    result.push("        'epsilon': 0.1,  # 探索率");
    result.push("        'memory_capacity': 5000,  # 经验池容量");
    result.push("        'batch_size': 32  # 批大小");
  }

  result.push('    }  # 原生 DQN 参数结束');
  result.push('');
  return result.join('\n');
};

Blockly.Python['dqn_arch_param_input_channels'] = function (block) {
  const v = block.getFieldValue('IN_CH') || 4;
  return `        'input_channels': ${v},  # 输入通道\n`;
};

Blockly.Python['dqn_arch_param_action_dim'] = function (block) {
  const v = block.getFieldValue('ACT_DIM') || 3;
  return `        'action_dim': ${v},  # 动作数\n`;
};

Blockly.Python['dqn_arch_param_lr'] = function (block) {
  const v = block.getFieldValue('LR') || 0.0001;
  return `        'lr': ${v},  # 学习率\n`;
};

Blockly.Python['dqn_arch_param_gamma'] = function (block) {
  const v = block.getFieldValue('GAMMA') || 0.99;
  return `        'gamma': ${v},  # 折扣因子\n`;
};

Blockly.Python['dqn_arch_param_epsilon'] = function (block) {
  const v = block.getFieldValue('EPS') || 0.1;
  return `        'epsilon': ${v},  # 探索率\n`;
};

Blockly.Python['dqn_arch_param_memory'] = function (block) {
  const v = block.getFieldValue('MEM') || 5000;
  return `        'memory_capacity': ${v},  # 经验池容量\n`;
};

Blockly.Python['dqn_arch_param_batch'] = function (block) {
  const v = block.getFieldValue('BATCH') || 32;
  return `        'batch_size': ${v}  # 批大小\n`;
};

Blockly.Python['dqn_arch_param_basic_lite'] = function (block) {
  const inputChannels = Number(block.getFieldValue('IN_CH'));
  const actionDim = Number(block.getFieldValue('ACT_DIM'));
  const lr = Number(block.getFieldValue('LR'));
  const gamma = Number(block.getFieldValue('GAMMA'));
  const epsilon = Number(block.getFieldValue('EPS'));
  const memoryCapacity = Number(block.getFieldValue('MEM'));
  const batchSize = Number(block.getFieldValue('BATCH'));

  const safeInputChannels = Number.isFinite(inputChannels) ? inputChannels : 4;
  const safeActionDim = Number.isFinite(actionDim) ? actionDim : 3;
  const safeLr = Number.isFinite(lr) ? lr : 0.0001;
  const safeGamma = Number.isFinite(gamma) ? gamma : 0.99;
  const safeEpsilon = Number.isFinite(epsilon) ? epsilon : 0.1;
  const safeMemoryCapacity = Number.isFinite(memoryCapacity) ? memoryCapacity : 5000;
  const safeBatchSize = Number.isFinite(batchSize) ? batchSize : 32;

  return [
    '    DQN_PARAMS = {  # 原生 DQN 结构演示参数（简易版）',
    `        'input_channels': ${safeInputChannels},  # 输入通道`,
    `        'action_dim': ${safeActionDim},  # 动作数`,
    `        'lr': ${safeLr},  # 学习率`,
    `        'gamma': ${safeGamma},  # 折扣因子`,
    `        'epsilon': ${safeEpsilon},  # 探索率`,
    `        'memory_capacity': ${safeMemoryCapacity},  # 经验池容量`,
    `        'batch_size': ${safeBatchSize}  # 批大小`,
    '    }',
    ''
  ].join('\n');
};

// ===========================
// 六、运行/演示入口
// ===========================
Blockly.Blocks['dqn_arch_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: '运行 DQN 结构演示 参数 %1',
      args0: [
        { type: 'input_statement', name: 'PARAMS_BODY' }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

Blockly.Python['dqn_arch_run_main'] = function (block) {
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  if (paramCode) {
    const indent = Blockly.Python.INDENT || '    ';
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    paramCode = [
      '    DQN_PARAMS = {',
      "        'input_channels': 4,",
      "        'action_dim': 3,",
      "        'lr': 0.0001,",
      "        'gamma': 0.99,",
      "        'epsilon': 0.1,",
      "        'memory_capacity': 5000,",
      "        'batch_size': 32",
      '    }'
    ].join('\n');
  }

  return [
    '# ==========================================',
    '# 主程序入口',
    '# ==========================================',
    'if __name__ == "__main__":',
    paramCode,
    '    try:',
    '        print("--- 初始化原生 DQN (CNN版) ---")',
    '        agent = DQNAgent(DQN_PARAMS)',
    '        print("✅ 模型结构已加载 (DeepMind Nature 2015 架构)")',
    '        print(agent.policy_net)',
    '        print("-" * 30)',
    '        print("--- 正在生成模拟图像数据 (84x84像素) ---")',
    '        dummy_screen = np.random.rand(4, 84, 84)',
    '        action = agent.choose_action(dummy_screen)',
    '        print(f"👉 面对屏幕图像，智能体选择了动作: {action}")',
    '        agent.store_experience(dummy_screen, action, 1.0, dummy_screen, False)',
    '        print("📥 图像经验已存入")',
    '        print("⚡ 正在填充数据以测试卷积运算...")',
    '        for _ in range(32):',
    '            agent.store_experience(np.random.rand(4, 84, 84), 0, 1.0, np.random.rand(4, 84, 84), False)',
    '        agent.learn()',
    '        print("🧠 卷积神经网络反向传播成功！")',
    '    except Exception as e:',
    '        print(f"出错: {e}")',
    '        import traceback',
    '        traceback.print_exc()',
    ''
  ].join('\n');
};
