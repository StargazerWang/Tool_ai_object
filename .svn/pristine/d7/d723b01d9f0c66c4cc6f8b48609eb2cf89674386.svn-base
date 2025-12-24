import * as Blockly from 'blockly/core';
import 'blockly/python';

// ===========================
// 辅助函数：获取积木在同类型积木中的序号
// ===========================

/**
 * 获取当前积木在同类型积木中的顺序（从1开始）
 * 越上层的积木数字越小（越先执行）
 * @param {Blockly.Block} block - 当前积木
 * @param {string} blockType - 积木类型（可选，默认使用block.type）
 * @returns {number} 序号（从1开始）
 */
function getBlockOrder(block, blockType = null) {
  if (!block) return 1;
  
  const targetType = blockType || block.type;
  const workspace = block.workspace;
  if (!workspace) return 1;
  
  // 找到所有顶层积木（没有 previousStatement 的积木）
  const topBlocks = [];
  const allBlocks = workspace.getAllBlocks(false);
  
  for (const b of allBlocks) {
    // 检查是否是顶层积木（没有 previousStatement 连接，或者 previousStatement 没有连接到其他积木）
    if (!b.previousConnection || !b.previousConnection.targetBlock()) {
      topBlocks.push(b);
    }
  }
  
  // 按照Y坐标排序顶层积木，确保从上到下的顺序（数字小的在上面）
  topBlocks.sort((a, b) => {
    const yA = a.getRelativeToSurfaceXY().y;
    const yB = b.getRelativeToSurfaceXY().y;
    if (yA !== yB) return yA - yB;
    // 如果Y坐标相同，按X坐标排序
    return a.getRelativeToSurfaceXY().x - b.getRelativeToSurfaceXY().x;
  });
  
  // 从每个顶层积木开始，按 next 链遍历，统计同类型积木的出现顺序
  const orderMap = new Map(); // 存储每个积木的ID和其序号
  let currentOrder = 1;
  
  // 遍历函数：递归遍历积木链
  function traverseChain(block, visited = new Set()) {
    if (!block || visited.has(block.id)) return;
    visited.add(block.id);
    
    // 如果是目标类型的积木，记录其序号
    if (block.type === targetType) {
      orderMap.set(block.id, currentOrder++);
    }
    
    // 继续遍历 next 连接的积木
    if (block.nextConnection) {
      const nextBlock = block.nextConnection.targetBlock();
      if (nextBlock) {
        traverseChain(nextBlock, visited);
      }
    }
    
    // 如果有语句输入（如 BODY, PARAMS_BODY, RUN_BODY, USER_BLOCK_LIST），也要遍历其中的积木
    // 尝试使用 getInputTargetBlock 方法获取语句输入中的积木
    if (typeof block.getInputTargetBlock === 'function') {
      // 常见的语句输入名称
      const commonStatementInputs = ['BODY', 'PARAMS_BODY', 'RUN_BODY', 'USER_BLOCK_LIST', 'DO', 'STATEMENT'];
      for (const inputName of commonStatementInputs) {
        try {
          const statementBlock = block.getInputTargetBlock(inputName);
          if (statementBlock) {
            traverseChain(statementBlock, visited);
          }
        } catch (e) {
          // 如果输入不存在，忽略错误
        }
      }
    }
    
    // 也尝试遍历 inputList（备用方法）
    if (block.inputList) {
      for (const input of block.inputList) {
        if (input.connection) {
          const statementBlock = input.connection.targetBlock();
          if (statementBlock && !visited.has(statementBlock.id)) {
            traverseChain(statementBlock, visited);
          }
        }
      }
    }
  }
  
  // 从每个顶层积木开始遍历（按排序后的顺序）
  for (const topBlock of topBlocks) {
    traverseChain(topBlock);
  }
  
  // 返回当前积木的序号，如果没有找到则返回1
  return orderMap.get(block.id) || 1;
}

/**
 * 生成带序号的变量名
 * @param {Blockly.Block} block - 当前积木
 * @param {string} baseName - 基础变量名（如 "block"）
 * @param {string} blockType - 积木类型（可选）
 * @returns {string} 带序号的变量名（如 "block1", "block2"）
 */
function generateVariableName(block, baseName, blockType = null) {
  const order = getBlockOrder(block, blockType);
  return `${baseName}${order}`;
}

// ===========================
// 一、感知机（神经网络）：主程序与类/函数定义
// ===========================

// 空主程序标记：不输出代码，仅作为起点
Blockly.Python['pt_main'] = function (block) {
  return '';
};

// 导入库
Blockly.Python['pt_import_init'] = function (block) {
  // 清空旧定义，保证脚本干净（仅对当前生成有效）
  Blockly.Python.definitions_ = Object.create(null);

  return [
    'import pandas as pd  # 导入pandas库，用于数据处理',
    '',
    'import numpy as np  # 导入numpy库，用于数值计算',
    '',
    'import os  # 导入操作系统接口库，用于文件路径等操作',
    '',
    'import torch  # 导入PyTorch库，用于深度学习',
    '',
    'import torch.nn as nn  # 导入PyTorch神经网络模块',
    '',
    'import torch.optim as optim  # 导入PyTorch优化器模块',
    '',
    'from sklearn.model_selection import train_test_split  # 导入数据集划分函数',
    '',
    'from sklearn.metrics import accuracy_score  # 导入准确率评估函数',
    '',
    'from sklearn.preprocessing import LabelEncoder, StandardScaler  # 导入标签编码器和标准化工具',
    ''
  ].join('\n');
};

// 定义 SmartBlock 类
Blockly.Python['pt_define_smart_block'] = function (block) {
  return [
    '# ==========================================',
    '# 1. 智能积木：SmartBlock (保持不变)',
    '# ==========================================',
    'class SmartBlock(nn.Module):  # 定义智能积木类，继承自nn.Module',
    '    def __init__(self, out_features, activation=\'gelu\', dropout=0.3):  # 初始化函数，设置输出特征数、激活函数和dropout率',
    '        super(SmartBlock, self).__init__()  # 调用父类初始化函数',
    '        self.out_features = out_features  # 保存输出特征数',
    '        self.activation_name = activation.lower()  # 保存激活函数名称（转为小写）',
    '        self.dropout_rate = dropout  # 保存dropout率',
    '        self.model = None  # 初始化模型为None',
    '',
    '',
    '    def build(self, in_features):  # 定义构建函数，根据输入特征数构建网络层',
    '        if self.activation_name == \'relu\':  # 如果激活函数是relu',
    '            act = nn.ReLU()  # 创建ReLU激活函数',
    '        elif self.activation_name == \'gelu\':  # 如果激活函数是gelu',
    '            act = nn.GELU()  # 创建GELU激活函数',
    '        elif self.activation_name == \'tanh\':  # 如果激活函数是tanh',
    '            act = nn.Tanh()  # 创建Tanh激活函数',
    '        else:  # 如果激活函数不匹配，使用默认值',
    '            act = nn.ReLU()  # 默认使用ReLU激活函数',
    '',
    '',
    '        self.model = nn.Sequential(  # 创建顺序模型',
    '            nn.Linear(in_features, self.out_features),  # 线性层：输入特征数 -> 输出特征数',
    '            nn.BatchNorm1d(self.out_features),  # 批量归一化层',
    '            act,  # 激活函数',
    '            nn.Dropout(self.dropout_rate)  # Dropout层，防止过拟合',
    '        )',
    '',
    '',
    '    def forward(self, x):  # 定义前向传播函数',
    '        if self.model is None: raise RuntimeError("积木未组装")  # 如果模型未构建，抛出错误',
    '        return self.model(x)  # 返回模型输出',
    ''
  ].join('\n');
};

// 定义 AutoNet 类
Blockly.Python['pt_define_auto_net'] = function (block) {
  return [
    '# ==========================================',
    '# 2. 自动组装器：AutoNet (保持不变)',
    '# ==========================================',
    'class AutoNet(nn.Module):  # 定义自动组装器类，继承自nn.Module',
    '    def __init__(self, input_dim, output_dim, user_blocks):  # 初始化函数，设置输入维度、输出维度和用户积木列表',
    '        super(AutoNet, self).__init__()  # 调用父类初始化函数',
    '        self.layers = nn.ModuleList()  # 创建模块列表，用于存储用户积木',
    '        current_in = input_dim  # 当前输入维度初始化为input_dim',
    '',
    '',
    '        for block in user_blocks:  # 遍历用户积木列表',
    '            block.build(current_in)  # 激活积木，构建网络层',
    '            self.layers.append(block)  # 将积木添加到layers列表',
    '            current_in = block.out_features  # 更新当前输入维度为当前积木的输出特征数',
    '',
    '',
    '        self.final_layer = nn.Linear(current_in, output_dim)  # 创建最终输出层',
    '',
    '',
    '    def forward(self, x):  # 定义前向传播函数',
    '        for layer in self.layers:  # 遍历所有层',
    '            x = layer(x)  # 通过每一层',
    '        x = self.final_layer(x)  # 通过最终输出层',
    '        return x  # 返回最终输出',
    ''
  ].join('\n');
};

// 定义 train_engine 函数
Blockly.Python['pt_define_train_engine'] = function (block) {
  return [
    '# ==========================================',
    '# 3. 通用训练引擎 (这里处理训练参数)',
    '# ==========================================',
    'def train_engine(model, X_train, y_train, X_test, y_test, config):  # 定义训练引擎函数',
    '    """  # 函数文档字符串开始',
    '    负责模型的训练、优化和评估  # 函数功能说明',
    '    """  # 函数文档字符串结束',
    '    # 定义损失函数和优化器',
    '    criterion = nn.CrossEntropyLoss()  # 创建交叉熵损失函数',
    '    optimizer = optim.AdamW(model.parameters(), lr=config[\'lr\'], weight_decay=1e-2)  # 创建AdamW优化器',
    '    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode=\'min\', factor=0.5, patience=10)  # 创建学习率调度器',
    '',
    '',
    '    print(f"🚀 开始训练 (Epochs: {config[\'epochs\']}, LR: {config[\'lr\']})...")  # 打印训练开始信息',
    '',
    '',
    '    model.train()  # 开启训练模式',
    '    for epoch in range(config[\'epochs\']):  # 遍历每个训练轮次',
    '        optimizer.zero_grad()  # 清零梯度',
    '',
    '',
    '        # 前向传播',
    '        outputs = model(X_train)  # 前向传播，获取模型输出',
    '        loss = criterion(outputs, y_train)  # 计算损失',
    '',
    '',
    '        # 反向传播',
    '        loss.backward()  # 反向传播，计算梯度',
    '        optimizer.step()  # 更新参数',
    '',
    '',
    '        # 学习率调整',
    '        scheduler.step(loss)  # 根据损失调整学习率',
    '',
    '',
    '        if (epoch + 1) % 100 == 0:  # 每100个轮次打印一次',
    '            print(f"Epoch [{epoch + 1}/{config[\'epochs\']}], Loss: {loss.item():.4f}")  # 打印训练进度和损失',
    '',
    '',
    '    # 评估阶段',
    '    print("\\n✅ 训练完成，正在评估...")  # 打印评估开始信息',
    '    model.eval()  # 开启评估模式',
    '    with torch.no_grad():  # 禁用梯度计算',
    '        test_outputs = model(X_test)  # 对测试集进行预测',
    '        _, predicted = torch.max(test_outputs.data, 1)  # 获取预测结果',
    '',
    '',
    '    acc = accuracy_score(y_test, predicted)  # 计算准确率',
    '    return acc, predicted  # 返回准确率和预测结果',
    ''
  ].join('\n');
};

// 定义 load_data 函数
Blockly.Python['pt_define_load_data'] = function (block) {
  return [
    '# ==========================================',
    '# 工具函数',
    '# ==========================================',
    'def load_data(filename, target_col):  # 定义数据加载函数',
    '    if not os.path.exists(filename): raise FileNotFoundError(f"找不到 {filename}")  # 检查文件是否存在',
    '    df = pd.read_csv(filename)  # 读取CSV文件',
    '    le = LabelEncoder()  # 创建标签编码器',
    '    for col in df.columns:  # 遍历所有列',
    '        if df[col].dtype == \'object\' and col != target_col:  # 如果是字符串类型且不是目标列',
    '            df[col] = le.fit_transform(df[col])  # 使用标签编码器转换',
    '    target_le = LabelEncoder()  # 创建目标列标签编码器',
    '    df[target_col] = target_le.fit_transform(df[target_col])  # 转换目标列',
    '    return df.drop(columns=[target_col]).values, df[target_col].values, target_le  # 返回特征矩阵、标签向量和编码器',
    ''
  ].join('\n');
};

// 【简易版】核心定义：合并 SmartBlock / AutoNet / train_engine / load_data
Blockly.Python['pt_define_core_lite'] = function (block) {
  const pieces = [
    Blockly.Python['pt_define_smart_block']?.(block) || '',
    Blockly.Python['pt_define_auto_net']?.(block) || '',
    Blockly.Python['pt_define_train_engine']?.(block) || '',
    Blockly.Python['pt_define_load_data']?.(block) || ''
  ].filter(Boolean);

  return pieces.join('\n\n');
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 运行：主入口 + 包裹参数、用户积木列表和运行代码
Blockly.Python['pt_run_main'] = function (block) {
  // 获取参数设置的代码
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  // 获取用户积木列表的代码
  let userBlockCode = Blockly.Python.statementToCode(block, 'USER_BLOCK_LIST') || '';
  
  // 去掉statementToCode自动添加的缩进
  if (paramCode) {
    const indent = Blockly.Python.INDENT || '    ';
    paramCode = paramCode.replace(new RegExp('^' + indent, 'gm'), '');
  }
  if (userBlockCode) {
    const indent = Blockly.Python.INDENT || '    ';
    userBlockCode = userBlockCode.replace(new RegExp('^' + indent, 'gm'), '');
  }
  
  // 检查是否有参数配置
  const hasParams = paramCode.trim().length > 0;
  const hasTrainConfig = paramCode.includes('TRAIN_CONFIG');
  
  // 如果没有参数配置，提供默认值
  if (!hasParams) {
    paramCode = [
      '    CSV_FILE = \'student_transport.csv\'  # CSV文件路径',
      '    TARGET_COL = \'出行方式\'  # 目标列名',
      '',
      '    # ===============================================',
      '    # ⚙️ [训练参数配置区] (你要找的参数在这里！)',
      '    # ===============================================',
      '    TRAIN_CONFIG = {  # 训练配置字典',
      '        \'test_split\': 0.2,  # 测试集比例 (20%)',
      '        \'seed\': 42,  # 随机种子',
      '        \'epochs\': 1000,  # 训练轮数',
      '        \'lr\': 0.01  # 学习率',
      '    }'
    ].join('\n');
  } else if (!hasTrainConfig) {
    // 如果有参数但没有训练配置，添加默认训练配置
    paramCode += '\n' + [
      '',
      '    # ===============================================',
      '    # ⚙️ [训练参数配置区] (你要找的参数在这里！)',
      '    # ===============================================',
      '    TRAIN_CONFIG = {  # 训练配置字典',
      '        \'test_split\': 0.2,  # 测试集比例 (20%)',
      '        \'seed\': 42,  # 随机种子',
      '        \'epochs\': 1000,  # 训练轮数',
      '        \'lr\': 0.01  # 学习率',
      '    }'
    ].join('\n');
  }
  
  // 如果用户积木列表代码不为空，直接使用；否则使用默认值
  // pt_user_block_list 已经生成完整的 USER_BLOCK_LIST = [...] 代码
  if (!userBlockCode || userBlockCode.trim().length === 0) {
    userBlockCode = [
      '        USER_BLOCK_LIST = [  # 用户积木列表',
      '            # 第一层：大一点，用 GELU',
      '            SmartBlock(out_features=256, activation=\'gelu\', dropout=0.2),',
      '',
      '            # 第二层：中等，用 ReLU',
      '            SmartBlock(out_features=128, activation=\'relu\', dropout=0.3),',
      '',
      '            # 第三层：小一点，用 Tanh',
      '            SmartBlock(out_features=64, activation=\'tanh\', dropout=0.1)',
      '        ]  # 用户积木列表结束'
    ].join('\n');
  }

  return [
    '# ==========================================',
    '# 🚀 主程序入口',
    '# ==========================================',
    'if __name__ == "__main__":  # 判断是否为主程序入口',
    '',
    '    # 1. 文件配置',
    paramCode,
    '',
    '    try:  # 使用try-except捕获异常',
    '        # 1. 加载数据',
    '        X_raw, y_raw, encoder = load_data(CSV_FILE, TARGET_COL)  # 调用数据加载函数',
    '',
    '        # 2. 数据标准化 (转Tensor)',
    '        scaler = StandardScaler()  # 创建标准化器',
    '        X_tensor = torch.tensor(scaler.fit_transform(X_raw), dtype=torch.float32)  # 标准化并转为Tensor',
    '        y_tensor = torch.tensor(y_raw, dtype=torch.long)  # 标签转为Tensor',
    '',
    '        # 3. 数据集划分 (train_test_split 回来了！)',
    '        X_train, X_test, y_train, y_test = train_test_split(  # 划分数据集',
    '            X_tensor, y_tensor,  # 特征和标签',
    '            test_size=TRAIN_CONFIG[\'test_split\'],  # 测试集比例',
    '            random_state=TRAIN_CONFIG[\'seed\']  # 随机种子',
    '        )',
    '',
    '        print(f"数据准备完毕: 训练集 {len(X_train)} 条, 测试集 {len(X_test)} 条")  # 打印数据集信息',
    '',
    '        # ===============================================',
    '        # 🎮 [用户积木区] 自由搭建你的网络',
    '        # ===============================================',
    userBlockCode,
    '',
    '        # 4. 系统自动组装',
    '        input_dim = X_train.shape[1]  # 获取输入维度',
    '        output_dim = len(torch.unique(y_tensor))  # 获取输出维度（类别数）',
    '',
    '        model = AutoNet(input_dim, output_dim, USER_BLOCK_LIST)  # 创建自动组装网络',
    '        print("\\n🧱 网络组装完成:\\n", model)  # 打印网络结构',
    '',
    '        # 5. 开始训练 (调用引擎)',
    '        acc, y_pred = train_engine(model, X_train, y_train, X_test, y_test, TRAIN_CONFIG)  # 调用训练引擎',
    '',
    '        # 6. 结果展示',
    '        print("-" * 30)  # 打印分隔线',
    '        print(f"🏆 最终准确率: {acc * 100:.2f}%")  # 打印准确率',
    '        print("-" * 30)  # 打印分隔线',
    '',
    '        # 还原标签看一眼',
    '        y_real_text = encoder.inverse_transform(y_test.numpy())  # 还原真实标签',
    '        y_pred_text = encoder.inverse_transform(y_pred.numpy())  # 还原预测标签',
    '        results = pd.DataFrame({\'实际\': y_real_text, \'预测\': y_pred_text})  # 创建结果DataFrame',
    '        results[\'判断\'] = results.apply(lambda x: \'√\' if x[\'实际\'] == x[\'预测\'] else \'×\', axis=1)  # 添加判断列',
    '        print(results.head(10))  # 打印前10条结果',
    '',
    '    except Exception as e:  # 捕获所有异常',
    '        print("❌ 运行出错:", e)  # 打印错误信息',
    '        import traceback  # 导入traceback',
    '        traceback.print_exc()  # 打印详细错误堆栈',
    ''
  ].join('\n');
};

// 【简易版】运行入口：复用 pt_run_main 的生成逻辑（默认使用内置网络结构）
Blockly.Python['pt_run_main_lite'] = function (block) {
  return Blockly.Python['pt_run_main'](block);
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 参数总包裹：输出注释 + 内部 BODY 子积木生成的代码
Blockly.Python['pt_param_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    // 去掉 statementToCode 默认加上的一级缩进
    inner = inner.replace(new RegExp('^' + indent, 'gm'), '');
  }
  // 检查是否包含训练配置，如果不包含则添加注释
  if (!inner.includes('TRAIN_CONFIG')) {
    inner += '\n    # ===============================================\n';
    inner += '    # ⚙️ [训练参数配置区] (你要找的参数在这里！)\n';
    inner += '    # ===============================================';
  }
  return inner;
};

// 【简易版】基础参数：仅保留 CSV 路径 + 标签列名（其余训练参数默认）
Blockly.Python['pt_param_basic_lite'] = function (block) {
  const file = block.getFieldValue('CSV_FILE') || 'student_transport.csv';
  const col = block.getFieldValue('TARGET_COL') || '出行方式';

  return [
    `    CSV_FILE = '${file}'  # CSV文件路径`,
    `    TARGET_COL = '${col}'  # 标签列名`,
    '',
    '    # ===============================================',
    '    # ⚙️ [训练参数配置区] (简易版默认值)',
    '    # ===============================================',
    '    TRAIN_CONFIG = {  # 训练配置字典',
    '        \'test_split\': 0.2,  # 测试集比例 (20%)',
    '        \'seed\': 42,  # 随机种子',
    '        \'epochs\': 1000,  # 训练轮数',
    '        \'lr\': 0.01  # 学习率',
    '    }'
  ].join('\n') + '\n';
};

// 子参数：CSV文件路径
Blockly.Python['pt_param_csv_file'] = function (block) {
  const file = block.getFieldValue('CSV_FILE') || 'student_transport.csv';
  return `    CSV_FILE = '${file}'  # CSV文件路径\n`;
};

// 子参数：标签列名
Blockly.Python['pt_param_target_column'] = function (block) {
  const col = block.getFieldValue('TARGET_COL') || '出行方式';
  return `    TARGET_COL = '${col}'  # 标签列名\n`;
};

// 训练配置总包裹
Blockly.Python['pt_param_train_config'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const indent = Blockly.Python.INDENT || '    ';
  
  const result = ['    TRAIN_CONFIG = {  # 训练配置字典'];
  if (inner) {
    // 去掉statementToCode自动添加的缩进
    const lines = inner.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        if (line.startsWith(indent)) {
          // 去掉一层缩进后，再加上一层缩进（因为要在字典内部）
          result.push('        ' + line.slice(indent.length).trim());
        } else {
          result.push('        ' + line.trim());
        }
      }
    }
  } else {
    // 如果没有子参数，使用默认值
    result.push('        \'test_split\': 0.2,  # 测试集比例 (20%)');
    result.push('        \'seed\': 42,  # 随机种子');
    result.push('        \'epochs\': 1000,  # 训练轮数');
    result.push('        \'lr\': 0.01  # 学习率');
  }
  result.push('    }  # 训练配置字典结束');
  
  return result.join('\n');
};

// 子参数：测试集比例
Blockly.Python['pt_param_test_split'] = function (block) {
  const testSplit = block.getFieldValue('TEST_SPLIT') || 0.2;
  return `        'test_split': ${testSplit},  # 测试集比例 (20%)\n`;
};

// 子参数：随机种子
Blockly.Python['pt_param_seed'] = function (block) {
  const seed = block.getFieldValue('SEED') || 42;
  return `        'seed': ${seed},  # 随机种子\n`;
};

// 子参数：训练轮数
Blockly.Python['pt_param_epochs'] = function (block) {
  const epochs = block.getFieldValue('EPOCHS') || 1000;
  return `        'epochs': ${epochs},  # 训练轮数\n`;
};

// 子参数：学习率
Blockly.Python['pt_param_lr'] = function (block) {
  const lr = block.getFieldValue('LR') || 0.01;
  return `        'lr': ${lr}  # 学习率\n`;
};

// ===========================
// 四、用户积木列表：可以嵌套多个 SmartBlock
// ===========================

// 用户积木列表总包裹
Blockly.Python['pt_user_block_list'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  const result = ['        USER_BLOCK_LIST = [  # 用户积木列表'];
  
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    // 去掉statementToCode自动添加的缩进
    const lines = inner.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        if (line.startsWith(indent)) {
          // 去掉一层缩进后，再加上两层缩进（因为要在列表内部）
          result.push('            ' + line.slice(indent.length).trim());
        } else {
          result.push('            ' + line.trim());
        }
      }
    }
  } else {
    // 如果没有积木，使用默认值
    result.push('            # 第一层：大一点，用 GELU');
    result.push('            SmartBlock(out_features=256, activation=\'gelu\', dropout=0.2),');
    result.push('');
    result.push('            # 第二层：中等，用 ReLU');
    result.push('            SmartBlock(out_features=128, activation=\'relu\', dropout=0.3),');
    result.push('');
    result.push('            # 第三层：小一点，用 Tanh');
    result.push('            SmartBlock(out_features=64, activation=\'tanh\', dropout=0.1)');
  }
  result.push('        ]  # 用户积木列表结束');
  
  return result.join('\n');
};

// SmartBlock 积木
Blockly.Python['pt_smart_block'] = function (block) {
  const outFeatures = block.getFieldValue('OUT_FEATURES') || 256;
  const activation = block.getFieldValue('ACTIVATION') || 'gelu';
  const dropout = block.getFieldValue('DROPOUT') || 0.3;
  
  // 使用自动生成的变量名，如果有多 instance，会生成 block1, block2, block3 等
  // 但在列表中，我们直接返回 SmartBlock 实例，不需要变量名
  return `            SmartBlock(out_features=${outFeatures}, activation='${activation}', dropout=${dropout}),\n`;
};

// ===========================
// 五、运行方法调用
// ===========================

// 调用训练流程（这个积木现在不需要生成代码，因为运行代码已经集成在pt_run_main中）
Blockly.Python['pt_call_functions'] = function (block) {
  return ''; // 不生成代码，因为运行逻辑已经在pt_run_main中
};
