import * as Blockly from 'blockly/core';
import 'blockly/python';
import { CategoryColors } from '@/global/colors';

// 颜色统一：DQN 分类使用 AI 主题色
const AI_COLOR = CategoryColors.AI || '#5C81A6';

// =============== 积木定义 ===============

// 主程序标志：点击后整份代码可高亮（依靠 _main 后缀）
Blockly.Blocks['dqn_main'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 主程序',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 导入/初始化
Blockly.Blocks['dqn_import_init'] = {
  init: function () {
    this.jsonInit({
      message0: '导入 DQN 依赖',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 定义 SmartBlock
Blockly.Blocks['dqn_define_smart_block'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 SmartBlock',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 定义 AutoNet
Blockly.Blocks['dqn_define_auto_net'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 AutoNet',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 定义 DQNAgent
Blockly.Blocks['dqn_define_agent'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 DQNAgent',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 定义简易环境
Blockly.Blocks['dqn_define_env'] = {
  init: function () {
    this.jsonInit({
      message0: '定义 SimpleEnv',
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 参数总包（大积木，内部放各项参数）
Blockly.Blocks['dqn_param_group'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 参数总包 %1',
      args0: [
        {
          type: 'input_statement',
          name: 'BODY'
        }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 参数配置总包（DQN_CONFIG 字典）
Blockly.Blocks['dqn_param_config'] = {
  init: function () {
    this.jsonInit({
      message0: 'DQN 训练参数配置 %1',
      args0: [
        {
          type: 'input_statement',
          name: 'BODY'
        }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：学习率
Blockly.Blocks['dqn_param_lr'] = {
  init: function () {
    this.jsonInit({
      message0: '学习率 lr = %1',
      args0: [
        { type: 'field_number', name: 'LR', value: 0.001, precision: 0.0001 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：折扣因子 gamma
Blockly.Blocks['dqn_param_gamma'] = {
  init: function () {
    this.jsonInit({
      message0: '折扣因子 gamma = %1',
      args0: [
        { type: 'field_number', name: 'GAMMA', value: 0.99, precision: 0.01 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：epsilon
Blockly.Blocks['dqn_param_epsilon'] = {
  init: function () {
    this.jsonInit({
      message0: '探索率 epsilon = %1',
      args0: [
        { type: 'field_number', name: 'EPSILON', value: 0.1, precision: 0.01 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：经验池容量
Blockly.Blocks['dqn_param_memory'] = {
  init: function () {
    this.jsonInit({
      message0: '经验池容量 memory_capacity = %1',
      args0: [
        { type: 'field_number', name: 'MEMORY', value: 2000, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：批大小
Blockly.Blocks['dqn_param_batch'] = {
  init: function () {
    this.jsonInit({
      message0: '批大小 batch_size = %1',
      args0: [
        { type: 'field_number', name: 'BATCH', value: 32, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 子参数：训练轮数
Blockly.Blocks['dqn_param_episodes'] = {
  init: function () {
    this.jsonInit({
      message0: '训练轮数 episodes = %1',
      args0: [
        { type: 'field_number', name: 'EPISODES', value: 500, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 简易版参数：合并为一个积木，减少需要拖拽/编辑的参数块数量
Blockly.Blocks['dqn_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: '简易参数  lr %1  gamma %2  epsilon %3  经验池 %4  batch %5  episodes %6',
      args0: [
        { type: 'field_number', name: 'LR', value: 0.001, precision: 0.0001 },
        { type: 'field_number', name: 'GAMMA', value: 0.99, precision: 0.01 },
        { type: 'field_number', name: 'EPSILON', value: 0.1, precision: 0.01 },
        { type: 'field_number', name: 'MEMORY', value: 2000, precision: 1 },
        { type: 'field_number', name: 'BATCH', value: 32, precision: 1 },
        { type: 'field_number', name: 'EPISODES', value: 500, precision: 1 }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 用户积木列表包裹
Blockly.Blocks['dqn_user_block_list'] = {
  init: function () {
    this.jsonInit({
      message0: '用户积木列表 %1',
      args0: [
        {
          type: 'input_statement',
          name: 'BODY'
        }
      ],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// 通用 SmartBlock 设置
Blockly.Blocks['dqn_user_block_custom'] = {
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

//（不再需要单独的 tanh32 积木，统一使用通用 SmartBlock 设置）

// 主运行块：挂参数和用户积木列表
Blockly.Blocks['dqn_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: '运行 DQN 主流程 参数 %1 积木列表 %2',
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
Blockly.Blocks['dqn_run_main_lite'] = {
  init: function () {
    this.jsonInit({
      message0: '【简易版】运行 DQN 训练流程 参数 %1',
      args0: [{ type: 'input_statement', name: 'PARAMS_BODY' }],
      colour: AI_COLOR,
      nextStatement: null,
      previousStatement: null
    });
  }
};

// =============== Python 代码生成 ===============

Blockly.Python['dqn_main'] = function () {
  return '';
};

Blockly.Python['dqn_import_init'] = function () {
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import torch',
    '',
    'import torch.nn as nn',
    '',
    'import torch.optim as optim',
    '',
    'import numpy as np',
    '',
    'import random',
    '',
    'import copy  # 用于复制积木',
    '',
    'from collections import deque',
    ''
  ].join('\n');
};

Blockly.Python['dqn_define_smart_block'] = function () {
  return [
    '# ==========================================',
    '# 1. 智能积木：SmartBlock (保持不变)',
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
    '        """延迟初始化：等到组装时才确定输入维度"""',
    '        if self.activation_name == \'relu\':',
    '            act = nn.ReLU()',
    '        elif self.activation_name == \'gelu\':',
    '            act = nn.GELU()',
    '        elif self.activation_name == \'tanh\':',
    '            act = nn.Tanh()',
    '        else:',
    '            act = nn.ReLU()',
    '',
    '        self.model = nn.Sequential(',
    '            nn.Linear(in_features, self.out_features),',
    '            act,',
    '        )',
    '',
    '    def forward(self, x):',
    '        if self.model is None: raise RuntimeError("积木未组装")',
    '        return self.model(x)',
    ''
  ].join('\n');
};

Blockly.Python['dqn_define_auto_net'] = function () {
  return [
    '# ==========================================',
    '# 2. 自动组装器：AutoNet (保持不变)',
    '# ==========================================',
    'class AutoNet(nn.Module):',
    '    def __init__(self, input_dim, output_dim, user_blocks):',
    '        super(AutoNet, self).__init__()',
    '        self.layers = nn.ModuleList()',
    '        current_in = input_dim',
    '',
    '        for block in user_blocks:',
    '            block_copy = copy.deepcopy(block)',
    '            block_copy.build(current_in)',
    '            self.layers.append(block_copy)',
    '            current_in = block_copy.out_features',
    '',
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

Blockly.Python['dqn_define_agent'] = function () {
  return [
    '# ==========================================',
    '# 3. DQN 智能体 (集成积木网络)',
    '# ==========================================',
    'class DQNAgent:',
    '    def __init__(self, state_dim, action_dim, user_blocks, config):',
    '        self.state_dim = state_dim',
    '        self.action_dim = action_dim',
    '        self.config = config',
    '        print("🤖 正在根据用户积木构建双脑系统...")',
    '',
    '        self.policy_net = AutoNet(state_dim, action_dim, user_blocks)',
    '        self.target_net = AutoNet(state_dim, action_dim, user_blocks)',
    '        self.target_net.load_state_dict(self.policy_net.state_dict())',
    '        self.target_net.eval()',
    '',
    '        print("✅ 策略网络结构:\\n", self.policy_net)',
    '        print("-" * 30)',
    '',
    '        self.optimizer = optim.Adam(self.policy_net.parameters(), lr=config[\'lr\'])',
    '        self.memory = deque(maxlen=config[\'memory_capacity\'])',
    '        self.loss_fn = nn.MSELoss()',
    '',
    '    def choose_action(self, state):',
    '        if random.random() < self.config[\'epsilon\']:',
    '            return random.randint(0, self.action_dim - 1)',
    '        else:',
    '            state_t = torch.FloatTensor(state).unsqueeze(0)',
    '            with torch.no_grad():',
    '                q_values = self.policy_net(state_t)',
    '            return q_values.argmax().item()',
    '',
    '    def store_experience(self, s, a, r, s_next, done):',
    '        self.memory.append((s, a, r, s_next, done))',
    '',
    '    def learn(self):',
    '        if len(self.memory) < self.config[\'batch_size\']: return',
    '',
    '        batch = random.sample(self.memory, self.config[\'batch_size\'])',
    '        s, a, r, s_next, done = zip(*batch)',
    '        s = torch.FloatTensor(np.array(s))',
    '        a = torch.LongTensor(a).unsqueeze(1)',
    '        r = torch.FloatTensor(r).unsqueeze(1)',
    '        s_next = torch.FloatTensor(np.array(s_next))',
    '        done = torch.FloatTensor(done).unsqueeze(1)',
    '',
    '        curr_q = self.policy_net(s).gather(1, a)',
    '',
    '        with torch.no_grad():',
    '            next_q = self.target_net(s_next).max(1)[0].unsqueeze(1)',
    '            target_q = r + (self.config[\'gamma\'] * next_q * (1 - done))',
    '',
    '        loss = self.loss_fn(curr_q, target_q)',
    '        self.optimizer.zero_grad()',
    '        loss.backward()',
    '        self.optimizer.step()',
    '        return loss.item()',
    ''
  ].join('\n');
};

Blockly.Python['dqn_define_env'] = function () {
  return [
    '# ==========================================',
    '# 4. 简易环境 (模拟器)',
    '# ==========================================',
    'class SimpleEnv:',
    '    """一个模拟环境：输入维度4，动作维度3"""',
    '    def __init__(self):',
    '        self.state_dim = 4',
    '        self.action_dim = 3',
    '',
    '    def reset(self):',
    '        return np.random.rand(4)  # 返回随机状态',
    '',
    '    def step(self, action):',
    '        # 模拟交互：返回 下一状态, 奖励, 是否结束, 信息',
    '        next_state = np.random.rand(4)',
    '        reward = 1.0 if np.random.rand() > 0.5 else -1.0',
    '        done = np.random.rand() > 0.95  # 5%概率结束',
    '        return next_state, reward, done, {}',
    ''
  ].join('\n');
};

Blockly.Python['dqn_param_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    inner = inner.replace(new RegExp('^' + indent, 'gm'), '');
  }
  return inner;
};

Blockly.Python['dqn_param_config'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const indent = Blockly.Python.INDENT || '    ';
  const result = ['    DQN_CONFIG = {  # DQN 训练参数'];

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
    // 没有子参数时使用默认值
    result.push("        'lr': 0.001,  # 学习率");
    result.push("        'gamma': 0.99,  # 折扣因子");
    result.push("        'epsilon': 0.1,  # 探索率");
    result.push("        'memory_capacity': 2000,  # 经验池容量");
    result.push("        'batch_size': 32,  # 批大小");
    result.push("        'episodes': 500  # 训练轮数");
  }

  result.push('    }  # DQN 训练参数结束');
  result.push('');
  return result.join('\n');
};

Blockly.Python['dqn_param_lr'] = function (block) {
  const lr = block.getFieldValue('LR') || 0.001;
  return `        'lr': ${lr},  # 学习率\n`;
};

Blockly.Python['dqn_param_gamma'] = function (block) {
  const gamma = block.getFieldValue('GAMMA') || 0.99;
  return `        'gamma': ${gamma},  # 折扣因子\n`;
};

Blockly.Python['dqn_param_epsilon'] = function (block) {
  const epsilon = block.getFieldValue('EPSILON') || 0.1;
  return `        'epsilon': ${epsilon},  # 探索率\n`;
};

Blockly.Python['dqn_param_memory'] = function (block) {
  const memory = block.getFieldValue('MEMORY') || 2000;
  return `        'memory_capacity': ${memory},  # 经验池容量\n`;
};

Blockly.Python['dqn_param_batch'] = function (block) {
  const batch = block.getFieldValue('BATCH') || 32;
  return `        'batch_size': ${batch},  # 批大小\n`;
};

Blockly.Python['dqn_param_episodes'] = function (block) {
  const episodes = block.getFieldValue('EPISODES') || 500;
  return `        'episodes': ${episodes}  # 训练轮数\n`;
};

Blockly.Python['dqn_param_basic_lite'] = function (block) {
  const lr = Number(block.getFieldValue('LR'));
  const gamma = Number(block.getFieldValue('GAMMA'));
  const epsilon = Number(block.getFieldValue('EPSILON'));
  const memoryCapacity = Number(block.getFieldValue('MEMORY'));
  const batchSize = Number(block.getFieldValue('BATCH'));
  const episodes = Number(block.getFieldValue('EPISODES'));

  const safeLr = Number.isFinite(lr) ? lr : 0.001;
  const safeGamma = Number.isFinite(gamma) ? gamma : 0.99;
  const safeEpsilon = Number.isFinite(epsilon) ? epsilon : 0.1;
  const safeMemoryCapacity = Number.isFinite(memoryCapacity) ? memoryCapacity : 2000;
  const safeBatchSize = Number.isFinite(batchSize) ? batchSize : 32;
  const safeEpisodes = Number.isFinite(episodes) ? episodes : 500;

  return [
    '    DQN_CONFIG = {  # DQN 训练参数（简易版）',
    `        'lr': ${safeLr},  # 学习率`,
    `        'gamma': ${safeGamma},  # 折扣因子`,
    `        'epsilon': ${safeEpsilon},  # 探索率`,
    `        'memory_capacity': ${safeMemoryCapacity},  # 经验池容量`,
    `        'batch_size': ${safeBatchSize},  # 批大小`,
    `        'episodes': ${safeEpisodes}  # 训练轮数`,
    '    }',
    ''
  ].join('\n');
};

Blockly.Python['dqn_user_block_list'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const result = ['    USER_BLOCK_LIST = [  # 用户积木列表'];
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
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
    result.push('        # 第1层：提取特征');
    result.push("        SmartBlock(out_features=128, activation='gelu'),");
    result.push('');
    result.push('        # 第2层：逻辑推理');
    result.push("        SmartBlock(out_features=64, activation='relu'),");
    result.push('');
    result.push('        # 第3层：可拖拽 tanh 积木');
    result.push("        SmartBlock(out_features=32, activation='tanh')");
  }
  result.push('    ]  # 用户积木列表结束');
  result.push('');
  return result.join('\n');
};

Blockly.Python['dqn_user_block_custom'] = function (block) {
  const out = block.getFieldValue('OUT') || 128;
  const act = block.getFieldValue('ACT') || 'gelu';
  return `        SmartBlock(out_features=${out}, activation='${act}'),\n`;
};

Blockly.Python['dqn_run_main'] = function (block) {
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  let userBlockCode = Blockly.Python.statementToCode(block, 'USER_BLOCK_LIST') || '';

  if (paramCode) {
    const indent = Blockly.Python.INDENT || '    ';
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    paramCode = [
      '    DQN_CONFIG = {',
      "        'lr': 0.001,",
      "        'gamma': 0.99,",
      "        'epsilon': 0.1,",
      "        'memory_capacity': 2000,",
      "        'batch_size': 32,",
      "        'episodes': 500",
      '    }'
    ].join('\n');
  }

  if (userBlockCode) {
    const indent = Blockly.Python.INDENT || '    ';
    userBlockCode = userBlockCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    userBlockCode = [
      '    USER_BLOCK_LIST = [  # 用户积木列表',
      "        # 第1层大脑：提取特征",
      "        SmartBlock(out_features=128, activation='gelu'),",
      '',
      "        # 第2层大脑：逻辑推理",
      "        SmartBlock(out_features=64, activation='relu'),",
      '',
      "        # 你甚至可以再加一层...",
      "        SmartBlock(out_features=32, activation='tanh')",
      '    ]  # 用户积木列表结束',
      ''
    ].join('\n');
  }

  return [
    '# ==========================================',
    '# 🚀 主程序入口',
    '# ==========================================',
    'if __name__ == "__main__":  # 判断是否为主程序入口',
    '',
    '    # 1. 环境准备',
    '    env = SimpleEnv()',
    '    STATE_DIM = env.state_dim  # 例如 4',
    '    ACTION_DIM = env.action_dim  # 例如 3',
    '',
    '    # ===============================================',
    '    # ⚙️ [DQN 参数配置区]',
    '    # ===============================================',
    paramCode,
    '',
    '    # ===============================================',
    '    # 🎮 [用户积木区] 自由设计 DQN 的大脑！',
    '    # 你拖进来的积木，会自动变成 PolicyNet 和 TargetNet',
    '    # ===============================================',
    userBlockCode,
    '',
    '    # 2. 初始化智能体 (传入你的积木列表)',
    '    agent = DQNAgent(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST, DQN_CONFIG)',
    '',
    '    print("🚀 开始 DQN 强化学习流程...")',
    '',
    '    # 3. 训练循环',
    '    for episode in range(DQN_CONFIG[\'episodes\']):',
    '        state = env.reset()',
    '        total_reward = 0',
    '        done = False',
    '        while not done:',
    '            # 1. 选动作 (使用你搭建的网络)',
    '            action = agent.choose_action(state)',
    '',
    '            # 2. 交互',
    '            next_state, reward, done, _ = env.step(action)',
    '',
    '            # 3. 存经验',
    '            agent.store_experience(state, action, reward, next_state, done)',
    '',
    '            # 4. 学习 (训练积木网络)',
    '            loss = agent.learn()',
    '',
    '            state = next_state',
    '            total_reward += reward',
    '',
    '        # 偶尔打印一下进度',
    '        if (episode + 1) % 50 == 0:',
    '            print(f"Episode [{episode + 1}/{DQN_CONFIG[\'episodes\']}], Total Reward: {total_reward:.2f}")',
    '',
    '    print("\\n🏆 训练结束！你的积木网络已经学会了玩这个游戏。")',
    '',
    '    # 4. 测试一次',
    '    print("\\n--- 最终测试 ---")',
    '    test_state = env.reset()',
    '    pred_action = agent.choose_action(test_state)',
    '    print(f"输入状态: {test_state}")',
    '    print(f"智能体决策: 动作 {pred_action}")',
    ''
  ].join('\n');
};

Blockly.Python['dqn_run_main_lite'] = function (block) {
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  if (paramCode) {
    const indent = Blockly.Python.INDENT || '    ';
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  } else {
    paramCode = [
      '    DQN_CONFIG = {',
      "        'lr': 0.001,",
      "        'gamma': 0.99,",
      "        'epsilon': 0.1,",
      "        'memory_capacity': 2000,",
      "        'batch_size': 32,",
      "        'episodes': 500",
      '    }'
    ].join('\n');
  }

  const userBlockCode = [
    '    USER_BLOCK_LIST = [  # 用户积木列表（简易版默认）',
    "        SmartBlock(out_features=128, activation='gelu'),",
    "        SmartBlock(out_features=64, activation='relu'),",
    "        SmartBlock(out_features=32, activation='tanh')",
    '    ]',
    ''
  ].join('\n');

  return [
    '# ==========================================',
    '# 🚀 主程序入口（简易版）',
    '# ==========================================',
    'if __name__ == \"__main__\":  # 判断是否为主程序入口（直接运行此脚本时执行）',
    '',
    '    # 1. 环境准备',
    '    env = SimpleEnv()',
    '    STATE_DIM = env.state_dim  # 例如 4',
    '    ACTION_DIM = env.action_dim  # 例如 3',
    '',
    '    # ===============================================',
    '    # ⚙️ [DQN 参数配置区]',
    '    # ===============================================',
    paramCode,
    '',
    '    # ===============================================',
    '    # 🎮 [用户积木区]（简易版使用默认结构）',
    '    # ===============================================',
    userBlockCode,
    '',
    '    # 2. 初始化智能体',
    '    agent = DQNAgent(STATE_DIM, ACTION_DIM, USER_BLOCK_LIST, DQN_CONFIG)',
    '',
    '    print(\"🚀 开始 DQN 强化学习流程...\")',
    '',
    '    # 3. 训练循环',
    '    for episode in range(DQN_CONFIG[\'episodes\']):',
    '        state = env.reset()',
    '        total_reward = 0',
    '        done = False',
    '        while not done:',
    '            action = agent.choose_action(state)',
    '            next_state, reward, done, _ = env.step(action)',
    '            agent.store_experience(state, action, reward, next_state, done)',
    '            loss = agent.learn()',
    '            state = next_state',
    '            total_reward += reward',
    '',
    '        if (episode + 1) % 50 == 0:',
    '            print(f\"Episode [{episode + 1}/{DQN_CONFIG[\'episodes\']}], Total Reward: {total_reward:.2f}\")',
    '',
    '    print(\"\\\\n🏆 训练结束！\")',
    ''
  ].join('\n');
};
