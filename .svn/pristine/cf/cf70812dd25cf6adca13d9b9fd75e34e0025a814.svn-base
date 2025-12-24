import * as Blockly from 'blockly/core';
import 'blockly/python';

// ===========================
// 一、决策树：主程序与函数定义
// ===========================

// 空主程序标记：不输出代码
Blockly.Python['dt_main'] = function (block) {
  return '';
};

// 导入库
Blockly.Python['dt_import_init'] = function (block) {
  // 清空旧定义，保证脚本干净
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import pandas as pd  # 导入pandas库，用于数据处理',
    '',
    'import numpy as np  # 导入numpy用于数学计算',
    '',
    'from sklearn import tree  # 导入sklearn的决策树分类器',
    '',
    'from sklearn.model_selection import train_test_split  # 导入数据集划分函数',
    '',
    'from sklearn.metrics import accuracy_score  # 导入准确率评估函数',
    '',
    'from sklearn.preprocessing import LabelEncoder  # 导入标签编码器',
    '',
    'import os  # 导入操作系统接口库',
    ''
  ].join('\n');
};

// 定义 load_and_preprocess 函数
Blockly.Python['dt_define_load_and_preprocess'] = function (block) {
  return [
    'def load_and_preprocess(file_path, target_col):  # 定义数据加载和预处理函数，增加标签列参数',
    '    """  # 函数文档字符串开始',
    '    加载数据并对非数值列进行编码，同时返回标签列的编码器以便后续还原  # 函数功能说明',
    '    """  # 函数文档字符串结束',
    '    if not os.path.exists(file_path):  # 检查文件是否存在',
    '        raise FileNotFoundError(f"错误：找不到文件 \'{file_path}\'")  # 如果文件不存在，抛出异常',
    '',
    '    df = pd.read_csv(file_path)  # 使用pandas读取CSV文件',
    '',
    '    # 检查标签列是否存在',
    '    if target_col not in df.columns:  # 如果指定的标签列不在数据集中',
    '        raise ValueError(f"错误：数据集中找不到你指定的标签列 \'{target_col}\'")',
    '',
    '    # 存储编码器，用于后续将数字还原为文本（反向解码）',
    '    label_encoders = {}  # 字典：列名 -> 对应的标签编码器',
    '',
    '    # 自动进行 LabelEncoding',
    '    for column in df.columns:  # 遍历数据框的每一列',
    '        if df[column].dtype == \'object\':  # 如果列的数据类型是对象（通常是字符串）',
    '            le = LabelEncoder()  # 为每一列创建一个新的标签编码器对象',
    '            df[column] = le.fit_transform(df[column])  # 对非数值列进行标签编码，将字符串转换为数值',
    '            label_encoders[column] = le  # 保存该列对应的编码器',
    '',
    '    # 特别提取标签列的编码器（如果标签列是数值型，可能没有编码器，这里做个处理）',
    '    target_le = label_encoders.get(target_col, None)  # 获取标签列对应的编码器（可能为None）',
    '',
    '    return df, target_le  # 返回处理后的数据框和标签列编码器',
    ''
  ].join('\n');
};

// 定义 train_model 函数
Blockly.Python['dt_define_train_model'] = function (block) {
  return [
    'def train_model(df, target_col, test_size, seed, tree_params):  # 定义训练模型函数，接收数据框、标签列名、测试集比例、随机种子和树参数',
    '    """  # 函数文档字符串开始',
    '    核心训练逻辑：支持指定标签列，并返回详细预测结果  # 函数功能说明',
    '    :param tree_params: 包含决策树参数的字典  # 参数说明',
    '    """  # 函数文档字符串结束',
    '    # === 根据参数指定特征 X 和 标签 y ===',
    '    y = df[target_col]  # y 是用户指定的标签列',
    '    X = df.drop(columns=[target_col])  # X 是除了标签列以外的所有列',
    '',
    '    # 划分数据集',
    '    X_train, X_test, y_train, y_test = train_test_split(  # 使用train_test_split划分训练集和测试集',
    '        X, y, test_size=test_size, random_state=seed  # 传入特征、标签、测试集比例和随机种子',
    '    )',
    '',
    '    print(f"数据划分完成 -> 训练集: {len(X_train)}, 测试集: {len(X_test)}")  # 打印数据划分信息',
    '',
    '    # 初始化模型（将字典中的参数解包传入）',
    '    clf = tree.DecisionTreeClassifier(random_state=seed, **tree_params)  # 创建决策树分类器，传入随机种子和解包的参数',
    '    clf.fit(X_train, y_train)  # 使用训练数据训练模型',
    '    print(f"模型训练完成。使用参数: {tree_params}")  # 打印训练完成信息和使用的参数',
    '',
    '    # === 获取预测结果和置信度 ===',
    '    y_pred = clf.predict(X_test)  # 获取预测类别',
    '    y_proba = clf.predict_proba(X_test)  # 获取每个样本属于各个类别的概率',
    '    confidence_scores = np.max(y_proba, axis=1)  # 每一行最大的概率值作为“置信度”',
    '',
    '    # 计算整体准确率',
    '    acc = accuracy_score(y_test, y_pred)  # 计算预测准确率',
    '    return acc, y_test, y_pred, confidence_scores  # 返回准确率、真实标签、预测标签和置信度',
    ''
  ].join('\n');
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 运行：主入口 + 包裹 BODY（参数设置 + 运行调用）
Blockly.Python['dt_run_main'] = function (block) {
  // 获取参数设置的代码
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），这正是我们需要的
  
  // 获取运行调用的代码（应该在if __name__ == "__main__"中，4个空格缩进）
  let runCode = Blockly.Python.statementToCode(block, 'RUN_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），这正是我们需要的

  return [
    '# ==========================================',
    '# 主程序入口 (调试参数都在这里修改)',
    '# ==========================================',
    'if __name__ == "__main__":  # 判断是否为主程序入口（直接运行此脚本时执行）',
    paramCode || '    # 暂无参数设置',
    '    # ----------------------------------------------',
    '    # 执行流程',
    '    # ----------------------------------------------',
    runCode || '    # 暂无运行代码',
    ''
  ].join('\n');
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 参数总包裹：输出注释 + 内部 BODY 子积木生成的代码
Blockly.Python['dt_param_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    // 去掉 statementToCode 默认加上的一级缩进
    inner = inner.replace(new RegExp('^' + indent, 'gm'), '');
  }
  return '\n    # ===== 参数设置 (以下为本次训练的所有配置) =====\n' + inner;
};

// 子参数：CSV文件路径
Blockly.Python['dt_param_csv_file'] = function (block) {
  const file = block.getFieldValue('CSV_FILE') || 'student_transport.csv';
  return `    CSV_FILE = '${file}'  # 设置CSV数据文件路径\n`;
};

// 子参数：标签列名
Blockly.Python['dt_param_target_column'] = function (block) {
  const col = block.getFieldValue('TARGET_COLUMN') || '出行方式';
  return `    TARGET_COLUMN = '${col}'  # 设置标签列列名（例如 '出行方式'）\n`;
};

// 子参数：测试集占比
Blockly.Python['dt_param_test_size'] = function (block) {
  const testSize = block.getFieldValue('TEST_SIZE') || 0.2;
  return `    TEST_SPLIT_SIZE = ${testSize}  # 设置测试集占比（0.2表示20%的数据用于测试）\n`;
};

// 子参数：随机种子
Blockly.Python['dt_param_random_seed'] = function (block) {
  const seed = block.getFieldValue('RANDOM_SEED') || 42;
  return `    RANDOM_SEED = ${seed}  # 设置随机种子（用于保证每次运行结果的一致性）\n`;
};

// 简易参数（简易版）：只暴露 CSV 文件路径 + 目标列名，其它参数使用默认值
Blockly.Python['dt_param_basic_lite'] = function (block) {
  const file = block.getFieldValue('CSV_FILE') || 'student_transport.csv';
  const col = block.getFieldValue('TARGET_COLUMN') || '出行方式';
  return [
    `    CSV_FILE = '${file}'  # 设置CSV数据文件路径`,
    `    TARGET_COLUMN = '${col}'  # 设置标签列列名（例如 '出行方式'）`,
    `    TEST_SPLIT_SIZE = 0.2  # 测试集占比（简易版使用默认值）`,
    `    RANDOM_SEED = 42  # 随机种子（简易版使用默认值）`,
    `    TREE_PARAMS = {}  # 决策树参数（简易版使用默认值）`,
    ''
  ].join('\n');
};

// 子参数：决策树参数组（这是一个子钳状积木）
Blockly.Python['dt_param_tree_params'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  // statementToCode会自动加一层缩进（4个空格）
  // 子积木生成的代码已经包含了8个空格的缩进（在字典内部）
  // 所以这里不需要额外处理缩进，直接使用即可
  
  const result = [
    '    # 2. 决策树模型参数配置 (在这里调试模型!)',
    '    # 你可以修改这些值来看看准确率如何变化',
    '    TREE_PARAMS = {  # 创建决策树参数字典'
  ];
  
  if (inner) {
    // 如果inner不为空，去掉每行开头的4个空格（statementToCode自动加的）
    // 因为子积木已经包含了正确的8个空格缩进
    const indent = Blockly.Python.INDENT || '    ';
    const lines = inner.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim()) {
        // 去掉statementToCode自动加的4个空格，保留子积木的8个空格缩进
        if (line.startsWith(indent)) {
          result.push(line.slice(indent.length));
        } else {
          result.push(line);
        }
      } else if (i < lines.length - 1) {
        // 保留中间的空行，但去掉最后多余的空行
        result.push('');
      }
    }
  } else {
    result.push('        # 使用默认参数');
  }
  
  // 确保最后一行（字典结束）被包含
  result.push('    }  # 字典结束');
  result.push(''); // 最后添加一个空行
  
  return result.join('\n');
};

// 决策树参数组积木：包含所有树参数的子钳状积木（用于组织参数，不生成额外代码）
Blockly.Python['dt_param_tree_params_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  // 直接返回内容，因为子积木已经包含了正确的缩进（8个空格）
  return inner;
};

// 子参数：划分标准 (criterion)
Blockly.Python['dt_param_tree_criterion'] = function (block) {
  const criterion = block.getFieldValue('CRITERION') || 'gini';
  return `        'criterion': '${criterion}',  # 划分标准: 'gini' (基尼系数) 或 'entropy' (信息熵)\n`;
};

// 子参数：最大深度 (max_depth)
Blockly.Python['dt_param_tree_max_depth'] = function (block) {
  const maxDepth = block.getFieldValue('MAX_DEPTH') || 'None';
  if (maxDepth === '' || maxDepth.toLowerCase() === 'none') {
    return `        'max_depth': None,  # 树的最大深度: None表示不限制，填整数(如 3, 5)可防止过拟合\n`;
  }
  const depthValue = parseInt(maxDepth);
  if (isNaN(depthValue)) {
    return `        'max_depth': None,  # 树的最大深度: None表示不限制，填整数(如 3, 5)可防止过拟合\n`;
  }
  return `        'max_depth': ${depthValue},  # 树的最大深度: ${depthValue}层\n`;
};

// 子参数：内部节点最小样本数 (min_samples_split)
Blockly.Python['dt_param_tree_min_samples_split'] = function (block) {
  const minSamplesSplit = block.getFieldValue('MIN_SAMPLES_SPLIT') || 2;
  return `        'min_samples_split': ${minSamplesSplit},  # 内部节点再划分所需最小样本数 (默认2，调大可防止过拟合)\n`;
};

// 子参数：叶子节点最小样本数 (min_samples_leaf)
Blockly.Python['dt_param_tree_min_samples_leaf'] = function (block) {
  const minSamplesLeaf = block.getFieldValue('MIN_SAMPLES_LEAF') || 1;
  return `        'min_samples_leaf': ${minSamplesLeaf},  # 叶子节点最少样本数 (默认1，调大可平滑模型)\n`;
};

// 子参数：划分策略 (splitter)
Blockly.Python['dt_param_tree_splitter'] = function (block) {
  const splitter = block.getFieldValue('SPLITTER') || 'best';
  return `        'splitter': '${splitter}'  # 划分策略: 'best' (最优) 或 'random' (随机)\n`;
};

// ===========================
// 四、运行方法调用
// ===========================

// 调用训练流程
Blockly.Python['dt_call_functions'] = function (block) {
  return [
    '    # 参数默认值（如果未在上方参数区设置）',
    '    if "CSV_FILE" not in globals():',
    '        CSV_FILE = "student_transport.csv"  # 默认CSV文件路径',
    '    if "TARGET_COLUMN" not in globals():',
    '        TARGET_COLUMN = "出行方式"  # 默认标签列名',
    '    if "TEST_SPLIT_SIZE" not in globals():',
    '        TEST_SPLIT_SIZE = 0.2  # 默认测试集占比',
    '    if "RANDOM_SEED" not in globals():',
    '        RANDOM_SEED = 42  # 默认随机种子',
    '    if "TREE_PARAMS" not in globals():',
    '        TREE_PARAMS = {}  # 默认决策树参数（使用 sklearn 默认）',
    '',
    '    try:  # 使用try-except捕获异常',
    '        # 1. 加载数据 (传入标签列名)',
    '        df, target_encoder = load_and_preprocess(CSV_FILE, TARGET_COLUMN)  # 调用数据加载和预处理函数',
    '',
    '        # 2. 训练并获取详细结果',
    '        final_acc, y_test_real, y_test_pred, confidences = train_model(',
    '            df, TARGET_COLUMN, TEST_SPLIT_SIZE, RANDOM_SEED, TREE_PARAMS',
    '        )  # 调用训练函数，传入所有参数',
    '',
    '        print("-" * 50)  # 打印分隔线',
    '        print(f"模型整体准确率: {final_acc:.2f}")  # 打印最终准确率（保留2位小数）',
    '        print("-" * 50)  # 打印分隔线',
    '',
    '        # 3. 格式化输出详细结果',
    '        print(f"{\'实际标签\':<15} | {\'预测结果\':<15} | {\'置信度\':<10} | {\'判断\'}")',
    '        print("-" * 60)',
    '',
    '        # 将 pandas Series 转换为列表以便遍历',
    '        y_real_list = y_test_real.tolist()',
    '        y_pred_list = y_test_pred.tolist()',
    '',
    '        # 如果有编码器，尝试将数字还原回文本 (例如 0 -> \"Bus\")',
    '        if target_encoder:',
    '            real_labels = target_encoder.inverse_transform(y_real_list)',
    '            pred_labels = target_encoder.inverse_transform(y_pred_list)',
    '        else:',
    '            real_labels = y_real_list',
    '            pred_labels = y_pred_list',
    '',
    '        # 遍历每一条测试数据输出',
    '        for real, pred, conf in zip(real_labels, pred_labels, confidences):',
    '            is_correct = \"√\" if real == pred else \"×\"',
    '            print(f\"{str(real):<15} | {str(pred):<15} | {conf:.2f}       | {is_correct}\")',
    '',
    '    except Exception as e:  # 捕获所有异常',
    '        print(f"程序发生错误: {e}")  # 打印错误信息',
    '        import traceback  # 导入traceback以打印详细错误栈',
    '        traceback.print_exc()  # 打印详细的错误栈，方便调试',
    ''
  ].join('\n');
};

