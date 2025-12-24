import * as Blockly from 'blockly/core';

const FACE_RECOG_COLOR = "#9B59B6"; // 紫色调，区分于检测和注册

// ===========================
// 一、人脸识别：主程序与类定义
// ===========================

// 1. 空的主程序标志积木（不生成代码，仅作为起点）
Blockly.Blocks['face_recog_main'] = {
  init: function () {
    this.jsonInit({
      message0: "人脸识别主程序",
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "从这里开始搭建整个人脸识别流程",
      helpUrl: ""
    });
  }
};

// 2. 导入库
Blockly.Blocks['face_recog_import'] = {
  init: function () {
    this.jsonInit({
      message0: "导入库 (cv2 / numpy / os / sys)",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "导入 cv2、numpy、os、sys，用于人脸识别",
      helpUrl: ""
    });
  }
};

// 3. 定义FaceSystem类的大积木（钳状积木）
Blockly.Blocks['face_recog_define_class'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 FaceSystem 类 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "定义 FaceSystem 类，包含所有方法和类的初始化",
      helpUrl: ""
    });
  }
};

// 3.1 子积木：定义 __init__ 方法
Blockly.Blocks['face_recog_define_init'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 __init__ 初始化方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "初始化检测器和识别器",
      helpUrl: ""
    });
  }
};

// 3.2 子积木：定义 _check_models 方法
Blockly.Blocks['face_recog_define_check_models'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 _check_models 检查模型方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "检查模型文件是否存在",
      helpUrl: ""
    });
  }
};

// 3.3 子积木：定义 _get_feature 方法
Blockly.Blocks['face_recog_define_get_feature'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 _get_feature 提取特征方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "从图片提取人脸特征",
      helpUrl: ""
    });
  }
};

// 3.4 子积木：定义 ensure_registered 方法
Blockly.Blocks['face_recog_define_ensure_registered'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 ensure_registered 智能注册方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "智能注册逻辑，检查是否已注册，未注册则执行注册",
      helpUrl: ""
    });
  }
};

// 3.5 子积木：定义 recognize 方法
Blockly.Blocks['face_recog_define_recognize'] = {
  init: function () {
    this.jsonInit({
      message0: "定义 recognize 识别方法",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "识别逻辑，比对目标图片中的人脸",
      helpUrl: ""
    });
  }
};

// 3.9 【简易版】一键定义核心类（包含 __init__ / _check_models / _get_feature / ensure_registered / recognize）
Blockly.Blocks['face_recog_define_core_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】定义 FaceSystem 核心类（自动包含方法）",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "简易版：一次性生成 FaceSystem 类及其核心方法，减少积木数量",
      helpUrl: ""
    });
  }
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 4. 运行积木：主入口 + 包裹参数和调用
Blockly.Blocks['face_recog_run_main'] = {
  init: function () {
    this.jsonInit({
      message0: "运行人脸识别主程序 %1 %2",
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
      colour: FACE_RECOG_COLOR,
      tooltip: "在主入口中设置参数并运行人脸识别",
      helpUrl: ""
    });
  }
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 5. 参数总包裹积木：像"钳子"一样包住所有参数子积木
Blockly.Blocks['face_recog_param_group'] = {
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
      colour: FACE_RECOG_COLOR,
      tooltip: "将所有参数子积木放在这里，统一作为本次识别的配置",
      helpUrl: ""
    });
  }
};

// 5.0 【简易版】基础参数（仅保留：注册图/注册名/识别图/阈值；颜色使用默认值）
Blockly.Blocks['face_recog_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】基础参数 注册图 %1 注册名 %2 识别图 %3 阈值 %4",
      args0: [
        {
          type: "field_input",
          name: "REGISTER_IMG",
          text: "yxy.jpg"
        },
        {
          type: "field_input",
          name: "REGISTER_NAME",
          text: "yxy"
        },
        {
          type: "field_input",
          name: "CHECK_IMG",
          text: "yxy.jpg"
        },
        {
          type: "field_number",
          name: "MATCH_THRESHOLD",
          value: 0.5,
          min: 0,
          max: 1,
          precision: 0.01
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "简易版：只设置关键参数；颜色使用默认值（匹配绿/未知红）",
      helpUrl: ""
    });
  }
};

// 5.1 子积木：注册图片路径
Blockly.Blocks['face_recog_param_register_img'] = {
  init: function () {
    this.jsonInit({
      message0: "注册用的底图 %1",
      args0: [
        {
          type: "field_input",
          name: "REGISTER_IMG",
          text: "yxy.jpg"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "用于注册的人脸图片路径",
      helpUrl: ""
    });
  }
};

// 5.2 子积木：注册名字
Blockly.Blocks['face_recog_param_register_name'] = {
  init: function () {
    this.jsonInit({
      message0: "注册名字 %1",
      args0: [
        {
          type: "field_input",
          name: "REGISTER_NAME",
          text: "yxy"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "注册的人脸名字",
      helpUrl: ""
    });
  }
};

// 5.3 子积木：识别图片路径
Blockly.Blocks['face_recog_param_check_img'] = {
  init: function () {
    this.jsonInit({
      message0: "要去识别的图片 %1",
      args0: [
        {
          type: "field_input",
          name: "CHECK_IMG",
          text: "yxy.jpg"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "需要识别的人脸图片路径",
      helpUrl: ""
    });
  }
};

// 5.4 子积木：相似度阈值
Blockly.Blocks['face_recog_param_match_threshold'] = {
  init: function () {
    this.jsonInit({
      message0: "相似度阈值 %1",
      args0: [
        {
          type: "field_number",
          name: "MATCH_THRESHOLD",
          value: 0.7,
          min: 0,
          max: 1,
          precision: 0.01
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "相似度阈值，大于这个数才算匹配成功（建议 0.5 ~ 0.7）",
      helpUrl: ""
    });
  }
};

// 5.5 子积木：匹配成功颜色
Blockly.Blocks['face_recog_param_color_match'] = {
  init: function () {
    this.jsonInit({
      message0: "匹配成功颜色 R %1 G %2 B %3",
      args0: [
        {
          type: "field_number",
          name: "R_MATCH",
          value: 0,
          min: 0,
          max: 255,
          precision: 1
        },
        {
          type: "field_number",
          name: "G_MATCH",
          value: 255,
          min: 0,
          max: 255,
          precision: 1
        },
        {
          type: "field_number",
          name: "B_MATCH",
          value: 0,
          min: 0,
          max: 255,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "匹配成功时显示的矩形颜色（RGB格式，默认绿色）",
      helpUrl: ""
    });
  }
};

// 5.6 子积木：匹配失败颜色
Blockly.Blocks['face_recog_param_color_unknown'] = {
  init: function () {
    this.jsonInit({
      message0: "匹配失败颜色 R %1 G %2 B %3",
      args0: [
        {
          type: "field_number",
          name: "R_UNKNOWN",
          value: 0,
          min: 0,
          max: 255,
          precision: 1
        },
        {
          type: "field_number",
          name: "G_UNKNOWN",
          value: 0,
          min: 0,
          max: 255,
          precision: 1
        },
        {
          type: "field_number",
          name: "B_UNKNOWN",
          value: 255,
          min: 0,
          max: 255,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "匹配失败时显示的矩形颜色（RGB格式，默认红色）",
      helpUrl: ""
    });
  }
};

// ===========================
// 四、运行方法调用
// ===========================

// 6. 子积木：创建FaceSystem实例
Blockly.Blocks['face_recog_create_instance'] = {
  init: function () {
    this.jsonInit({
      message0: "创建 FaceSystem 实例",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "创建 FaceSystem 实例",
      helpUrl: ""
    });
  }
};

// 7. 子积木：调用 ensure_registered 方法
Blockly.Blocks['face_recog_call_ensure_registered'] = {
  init: function () {
    this.jsonInit({
      message0: "调用 ensure_registered 进行智能注册",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "检查是否已注册，未注册则执行注册",
      helpUrl: ""
    });
  }
};

// 8. 子积木：调用 recognize 方法
Blockly.Blocks['face_recog_call_recognize'] = {
  init: function () {
    this.jsonInit({
      message0: "调用 recognize 进行识别",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_RECOG_COLOR,
      tooltip: "执行人脸识别",
      helpUrl: ""
    });
  }
};

