import * as Blockly from 'blockly/core';
import { CategoryColors } from '@/global/colors';

const DT_COLOR = CategoryColors.AI;

// ===========================
// 一、决策树：主程序与函数定义
// ===========================

// 1. 空的主程序标志积木（不生成代码，仅作为起点）
Blockly.Blocks['dt_main'] = {
  init: function () {
    this.jsonInit({
      message0: "决策树主程序",
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "从这里开始搭建整个决策树流程",
      helpUrl: ""
    });
  }
};

// 2. 导入库
Blockly.Blocks['dt_import_init'] = {
  init: function () {
    this.jsonInit({
      message0: "导入库 (pandas / sklearn / os)",
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "导入 pandas、sklearn、os，用于决策树",
      helpUrl: ""
    });
  }
};

// 3. 定义 load_and_preprocess 函数
Blockly.Blocks['dt_define_load_and_preprocess'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 load_and_preprocess 函数",
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "封装数据加载和预处理的完整流程",
      helpUrl: ""
    });
  }
};

// 4. 定义 train_model 函数
Blockly.Blocks['dt_define_train_model'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 train_model 函数",
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "封装模型训练的完整流程",
      helpUrl: ""
    });
  }
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 5. 运行积木：主入口 + 包裹参数和调用
Blockly.Blocks['dt_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: "运行决策树主程序 %1 %2",
      args0: [
        {
          type: "input_statement",
          name: "PARAMS_BODY",
          check: null
        },
        {
          type: "input_statement",
          name: "RUN_BODY",
          check: null
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "在主入口中设置参数并运行决策树",
      helpUrl: ""
    });
  }
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 6. 参数总包裹积木：像"钳子"一样包住所有参数子积木
Blockly.Blocks['dt_param_group'] = {
  init: function () {
    this.jsonInit({
      message0: "参数设置 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "将所有参数子积木放在这里，统一作为本次训练的配置",
      helpUrl: ""
    });
  }
};

// 6.1 子积木：CSV文件路径
Blockly.Blocks['dt_param_csv_file'] = {
  init: function () {
    this.jsonInit({
      message0: "CSV文件路径 %1",
      args0: [
        {
          type: "field_input",
          name: "CSV_FILE",
          text: "student_transport.csv"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置要加载的CSV数据文件路径",
      helpUrl: ""
    });
  }
};

// 6.1.1 子积木：标签列名
Blockly.Blocks['dt_param_target_column'] = {
  init: function () {
    this.jsonInit({
      message0: "标签列名 %1",
      args0: [
        {
          type: "field_input",
          name: "TARGET_COLUMN",
          text: "出行方式"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置作为标签的列名（例如：出行方式）",
      helpUrl: ""
    });
  }
};

// 6.2 子积木：测试集占比
Blockly.Blocks['dt_param_test_size'] = {
  init: function () {
    this.jsonInit({
      message0: "测试集占比 %1",
      args0: [
        {
          type: "field_number",
          name: "TEST_SIZE",
          value: 0.2,
          min: 0.1,
          max: 0.9,
          precision: 0.01
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置测试集占数据集的比例（0.2表示20%）",
      helpUrl: ""
    });
  }
};

// 6.3 子积木：随机种子
Blockly.Blocks['dt_param_random_seed'] = {
  init: function () {
    this.jsonInit({
      message0: "随机种子 %1",
      args0: [
        {
          type: "field_number",
          name: "RANDOM_SEED",
          value: 42,
          min: 0
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置随机种子（用于保证结果可复现）",
      helpUrl: ""
    });
  }
};

// 6.4 子积木：决策树参数组（这是一个子钳状积木）
Blockly.Blocks['dt_param_tree_params'] = {
  init: function () {
    this.jsonInit({
      message0: "决策树模型参数 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置决策树模型的所有参数",
      helpUrl: ""
    });
  }
};

// 6.4.1 决策树参数组：包含所有树参数的子钳状积木
Blockly.Blocks['dt_param_tree_params_group'] = {
  init: function () {
    this.jsonInit({
      message0: "模型参数设置 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "将所有决策树参数放在这里",
      helpUrl: ""
    });
  }
};

// 6.4.2 子积木：划分标准 (criterion)
Blockly.Blocks['dt_param_tree_criterion'] = {
  init: function () {
    this.jsonInit({
      message0: "划分标准 %1",
      args0: [
        {
          type: "field_dropdown",
          name: "CRITERION",
          options: [
            ["基尼系数 (gini)", "gini"],
            ["信息熵 (entropy)", "entropy"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "选择决策树划分标准：gini 或 entropy",
      helpUrl: ""
    });
  }
};

// 6.4.3 子积木：最大深度 (max_depth)
Blockly.Blocks['dt_param_tree_max_depth'] = {
  init: function () {
    this.jsonInit({
      message0: "最大深度 %1",
      args0: [
        {
          type: "field_input",
          name: "MAX_DEPTH",
          text: "None"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置树的最大深度（None表示不限制，或输入数字如3、5）",
      helpUrl: ""
    });
  }
};

// 6.4.4 子积木：内部节点最小样本数 (min_samples_split)
Blockly.Blocks['dt_param_tree_min_samples_split'] = {
  init: function () {
    this.jsonInit({
      message0: "内部节点最小样本数 %1",
      args0: [
        {
          type: "field_number",
          name: "MIN_SAMPLES_SPLIT",
          value: 2,
          min: 2
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置内部节点再划分所需的最小样本数",
      helpUrl: ""
    });
  }
};

// 6.4.5 子积木：叶子节点最小样本数 (min_samples_leaf)
Blockly.Blocks['dt_param_tree_min_samples_leaf'] = {
  init: function () {
    this.jsonInit({
      message0: "叶子节点最小样本数 %1",
      args0: [
        {
          type: "field_number",
          name: "MIN_SAMPLES_LEAF",
          value: 1,
          min: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "设置叶子节点最少样本数",
      helpUrl: ""
    });
  }
};

// 6.4.6 子积木：划分策略 (splitter)
Blockly.Blocks['dt_param_tree_splitter'] = {
  init: function () {
    this.jsonInit({
      message0: "划分策略 %1",
      args0: [
        {
          type: "field_dropdown",
          name: "SPLITTER",
          options: [
            ["最优 (best)", "best"],
            ["随机 (random)", "random"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "选择划分策略：best 或 random",
      helpUrl: ""
    });
  }
};

// ===========================
// 四、运行方法调用
// ===========================

// 7. 调用训练流程
Blockly.Blocks['dt_call_functions'] = {
  init: function () {
    this.jsonInit({
      message0: "调用训练流程",
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "执行数据加载、预处理和模型训练",
      helpUrl: ""
    });
  }
};

// ===========================
// 五、简易版参数（减少需要编辑的参数）
// ===========================

// 简易参数块：仅保留 CSV 文件路径 + 目标列名，其它参数使用默认值
Blockly.Blocks['dt_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "简易参数  CSV文件 %1  目标列 %2",
      args0: [
        {
          type: "field_input",
          name: "CSV_FILE",
          text: "student_transport.csv"
        },
        {
          type: "field_input",
          name: "TARGET_COLUMN",
          text: "出行方式"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DT_COLOR,
      tooltip: "简易版只需要配置 CSV 文件路径和目标列名，其它参数使用默认值",
      helpUrl: ""
    });
  }
};
