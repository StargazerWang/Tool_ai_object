import * as Blockly from 'blockly/core';

const FACE_REG_COLOR = "#FFA500"; // 橙色调，区分于检测和识别

// ===========================
// 一、人脸注册：主程序与类定义
// ===========================

// 1. 空的主程序标志积木（不生成代码，仅作为起点）
Blockly.Blocks['face_reg_main'] = {
  init: function () {
    this.jsonInit({
      message0: "人脸注册主程序",
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "从这里开始搭建整个人脸注册流程",
      helpUrl: ""
    });
  }
};

// 2. 导入库
Blockly.Blocks['face_reg_import'] = {
  init: function () {
    this.jsonInit({
      message0: "导入库 (cv2 / os / sys / numpy)",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "导入 cv2、os、sys、numpy，用于人脸注册",
      helpUrl: ""
    });
  }
};

// 3. 定义FaceRegisterSystem类的大积木（钳状积木）
Blockly.Blocks['face_reg_define_class'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 FaceRegisterSystem 类 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "定义 FaceRegisterSystem 类，包含所有方法和类的初始化",
      helpUrl: ""
    });
  }
};

// 3.1 子积木：定义 __init__ 方法
Blockly.Blocks['face_reg_define_init'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 __init__ 初始化方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "初始化检测器、识别器和输出目录",
      helpUrl: ""
    });
  }
};

// 3.2 子积木：定义 _check_models 方法
Blockly.Blocks['face_reg_define_check_models'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 _check_models 检查模型方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "检查模型文件是否存在",
      helpUrl: ""
    });
  }
};

// 3.3 子积木：定义 run_registration 方法
Blockly.Blocks['face_reg_define_run_registration'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 run_registration 注册方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "执行人脸注册流程：检测、对齐、保存和预览",
      helpUrl: ""
    });
  }
};

// 3.9 【简易版】一键定义核心类（包含 __init__ / _check_models / run_registration）
Blockly.Blocks['face_reg_define_core_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】定义 FaceRegisterSystem 核心类（自动包含方法）",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "简易版：一次性生成 FaceRegisterSystem 类及其核心方法，减少积木数量",
      helpUrl: ""
    });
  }
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 4. 运行积木：主入口 + 包裹参数和调用
Blockly.Blocks['face_reg_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: "运行人脸注册主程序 %1 %2",
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
      colour: FACE_REG_COLOR,
      tooltip: "在主入口中设置参数并运行人脸注册",
      helpUrl: ""
    });
  }
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 5. 参数总包裹积木：像"钳子"一样包住所有参数子积木
Blockly.Blocks['face_reg_param_group'] = {
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
      colour: FACE_REG_COLOR,
      tooltip: "将所有参数子积木放在这里，统一作为本次注册的配置",
      helpUrl: ""
    });
  }
};

// 5.0 【简易版】基础参数（仅保留：源图片路径 + 注册名字）
Blockly.Blocks['face_reg_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】基础参数 源图片 %1 注册名字 %2",
      args0: [
        {
          type: "field_input",
          name: "SOURCE_IMAGE",
          text: "yxy.jpg"
        },
        {
          type: "field_input",
          name: "REGISTER_NAME",
          text: "Tom"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "简易版：只设置源图片与注册名字；其余配置使用默认值",
      helpUrl: ""
    });
  }
};

// 5.1 子积木：源图片路径
Blockly.Blocks['face_reg_param_source_image'] = {
  init: function () {
    this.jsonInit({
      message0: "源图片路径 %1",
      args0: [
        {
          type: "field_input",
          name: "SOURCE_IMAGE",
          text: "yxy.jpg"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "用于注册的人脸图片路径",
      helpUrl: ""
    });
  }
};

// 5.2 子积木：注册名字
Blockly.Blocks['face_reg_param_register_name'] = {
  init: function () {
    this.jsonInit({
      message0: "注册名字 %1",
      args0: [
        {
          type: "field_input",
          name: "REGISTER_NAME",
          text: "Tom"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "注册的人脸名字，将用作保存的文件名",
      helpUrl: ""
    });
  }
};

// ===========================
// 四、运行方法调用
// ===========================

// 6. 子积木：创建FaceRegisterSystem实例
Blockly.Blocks['face_reg_create_instance'] = {
  init: function () {
    this.jsonInit({
      message0: "创建 FaceRegisterSystem 实例",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "创建 FaceRegisterSystem 实例",
      helpUrl: ""
    });
  }
};

// 7. 子积木：调用 run_registration 方法
Blockly.Blocks['face_reg_call_run_registration'] = {
  init: function () {
    this.jsonInit({
      message0: "调用 run_registration 进行注册",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_REG_COLOR,
      tooltip: "执行人脸注册操作",
      helpUrl: ""
    });
  }
};
