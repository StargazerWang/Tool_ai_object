import * as Blockly from 'blockly/core';
import { CategoryColors } from '@/global/colors';

const PT_COLOR = CategoryColors.AI;

// ===========================
// 一、感知机（神经网络）：主程序与类/函数定义
// ===========================

// 1. 空的主程序标志积木（不生成代码，仅作为起点）
Blockly.Blocks['pt_main'] = {
  init: function () {
    this.jsonInit({
      message0: "感知机主程序",
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "从这里开始搭建整个神经网络流程",
      helpUrl: ""
    });
  }
};

// 2. 导入库
Blockly.Blocks['pt_import_init'] = {
  init: function () {
    this.jsonInit({
      message0: "导入库 (pandas / sklearn / torch)",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "导入 pandas、sklearn、torch 等库，用于神经网络",
      helpUrl: ""
    });
  }
};

// 3. 定义 SmartBlock 类
Blockly.Blocks['pt_define_smart_block'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 SmartBlock 类",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "定义智能积木类，用于构建神经网络层",
      helpUrl: ""
    });
  }
};

// 4. 定义 AutoNet 类
Blockly.Blocks['pt_define_auto_net'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 AutoNet 类",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "定义自动组装器类，用于自动组装用户搭建的网络",
      helpUrl: ""
    });
  }
};

// 5. 定义 train_engine 函数
Blockly.Blocks['pt_define_train_engine'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 train_engine 函数",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "定义通用训练引擎函数，负责模型的训练、优化和评估",
      helpUrl: ""
    });
  }
};

// 6. 定义 load_data 函数
Blockly.Blocks['pt_define_load_data'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 load_data 函数",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "定义数据加载函数，用于加载和预处理CSV数据",
      helpUrl: ""
    });
  }
};

// 6.1 【简易版】核心定义（合并 SmartBlock / AutoNet / train_engine / load_data）
Blockly.Blocks['pt_define_core_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】定义核心组件（SmartBlock / AutoNet / train_engine / load_data）",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "简易版：一次性生成感知机训练所需的核心类与函数定义（减少积木数量）",
      helpUrl: ""
    });
  }
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 7. 运行积木：主入口 + 包裹参数、用户积木列表和运行代码
Blockly.Blocks['pt_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: "运行感知机主程序 %1 %2 %3",
      args0: [
        {
          type: "input_statement",
          name: "PARAMS_BODY",
          check: null
        },
        {
          type: "input_statement",
          name: "USER_BLOCK_LIST",
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
      colour: PT_COLOR,
      tooltip: "在主入口中设置参数、配置用户积木列表并运行神经网络",
      helpUrl: ""
    });
  }
};

// 7.1 【简易版】运行入口（隐藏“用户积木列表”插槽，默认使用内置网络结构）
Blockly.Blocks['pt_run_main_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】运行感知机主程序 %1 %2",
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
      colour: PT_COLOR,
      tooltip: "简易版：仅需设置基础参数即可运行；网络结构使用默认值",
      helpUrl: ""
    });
  }
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 8.0 【简易版】基础参数：仅保留 CSV 路径 + 标签列名（其余训练参数默认）
Blockly.Blocks['pt_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】基础参数 CSV文件 %1 标签列名 %2",
      args0: [
        {
          type: "field_input",
          name: "CSV_FILE",
          text: "student_transport.csv"
        },
        {
          type: "field_input",
          name: "TARGET_COL",
          text: "出行方式"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "简易版：只设置CSV路径与标签列名；训练超参数使用默认值",
      helpUrl: ""
    });
  }
};

// 8. 参数总包裹积木：像"钳子"一样包住所有参数子积木
Blockly.Blocks['pt_param_group'] = {
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
      colour: PT_COLOR,
      tooltip: "将所有参数子积木放在这里，统一作为本次训练的配置",
      helpUrl: ""
    });
  }
};

// 8.1 子积木：CSV文件路径
Blockly.Blocks['pt_param_csv_file'] = {
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
      colour: PT_COLOR,
      tooltip: "设置要加载的CSV数据文件路径",
      helpUrl: ""
    });
  }
};

// 8.2 子积木：标签列名
Blockly.Blocks['pt_param_target_column'] = {
  init: function () {
    this.jsonInit({
      message0: "标签列名 %1",
      args0: [
        {
          type: "field_input",
          name: "TARGET_COL",
          text: "出行方式"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "设置作为标签的列名（例如：出行方式）",
      helpUrl: ""
    });
  }
};

// 8.3 子积木：训练配置总包裹（大钳子）
Blockly.Blocks['pt_param_train_config'] = {
  init: function () {
    this.jsonInit({
      message0: "训练配置 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "在这里配置训练的超参数",
      helpUrl: ""
    });
  }
};

// 8.3.1 子参数：测试集比例
Blockly.Blocks['pt_param_test_split'] = {
  init: function () {
    this.jsonInit({
      message0: "测试集比例 %1",
      args0: [
        {
          type: "field_number",
          name: "TEST_SPLIT",
          value: 0.2,
          min: 0.1,
          max: 0.9,
          precision: 0.01
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "设置测试集占数据集的比例（0.2表示20%）",
      helpUrl: ""
    });
  }
};

// 8.3.2 子参数：随机种子
Blockly.Blocks['pt_param_seed'] = {
  init: function () {
    this.jsonInit({
      message0: "随机种子 %1",
      args0: [
        {
          type: "field_number",
          name: "SEED",
          value: 42
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "设置随机种子（保证每次划分一致）",
      helpUrl: ""
    });
  }
};

// 8.3.3 子参数：训练轮数
Blockly.Blocks['pt_param_epochs'] = {
  init: function () {
    this.jsonInit({
      message0: "训练轮数 %1",
      args0: [
        {
          type: "field_number",
          name: "EPOCHS",
          value: 1000,
          min: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "设置训练的轮数（epochs）",
      helpUrl: ""
    });
  }
};

// 8.3.4 子参数：学习率
Blockly.Blocks['pt_param_lr'] = {
  init: function () {
    this.jsonInit({
      message0: "学习率 %1",
      args0: [
        {
          type: "field_number",
          name: "LR",
          value: 0.01,
          min: 0,
          precision: 0.001
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "设置学习率（learning rate）",
      helpUrl: ""
    });
  }
};

// ===========================
// 四、用户积木列表：可以嵌套多个 SmartBlock
// ===========================

// 9. 用户积木列表总包裹（大钳子）
Blockly.Blocks['pt_user_block_list'] = {
  init: function () {
    this.jsonInit({
      message0: "用户积木列表 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "在这里拖动多个 SmartBlock 积木来搭建你的神经网络",
      helpUrl: ""
    });
  }
};

// 10. SmartBlock 积木（可重复使用）
Blockly.Blocks['pt_smart_block'] = {
  init: function () {
    this.jsonInit({
      message0: "SmartBlock 输出特征数 %1 激活函数 %2 Dropout %3",
      args0: [
        {
          type: "field_number",
          name: "OUT_FEATURES",
          value: 256,
          min: 1
        },
        {
          type: "field_dropdown",
          name: "ACTIVATION",
          options: [
            ['gelu', 'gelu'],
            ['relu', 'relu'],
            ['tanh', 'tanh']
          ]
        },
        {
          type: "field_number",
          name: "DROPOUT",
          value: 0.3,
          min: 0,
          max: 1,
          precision: 0.1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "定义一个神经网络层（SmartBlock），可以添加多个来构建网络",
      helpUrl: ""
    });
  }
};

// ===========================
// 五、运行方法调用（调用封装好的函数）
// ===========================

// 11. 运行调用：执行训练流程
Blockly.Blocks['pt_call_functions'] = {
  init: function () {
    this.jsonInit({
      message0: "调用神经网络训练流程",
      previousStatement: null,
      nextStatement: null,
      colour: PT_COLOR,
      tooltip: "在这里实际调用前面定义好的函数，执行完整流程",
      helpUrl: ""
    });
  }
};
