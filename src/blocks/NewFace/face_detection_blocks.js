import * as Blockly from 'blockly/core';

const FACE_DETECT_COLOR = "#4C9AFF"; // 统一蓝色调

// 1. 空的主程序标志积木（不生成代码，仅作为起点）
Blockly.Blocks['face_detect_main'] = {
    init: function () {
        this.jsonInit({
            message0: "人脸检测主程序",
            nextStatement: null,
            colour: FACE_DETECT_COLOR,
            tooltip: "从这里开始搭建整个人脸检测流程",
            helpUrl: ""
        });
    }
};

// 2. Import + 默认参数
Blockly.Blocks['face_import_init'] = {
    init: function () {
        this.jsonInit({
            message0: "导入库并初始化默认参数",
            previousStatement: null,
            nextStatement: null,
            colour: FACE_DETECT_COLOR,
            tooltip: "导入 cv2 / os，并设置默认参数 (face.png 等)",
            helpUrl: ""
        });
    }
};

// 3. 定义模型字典
Blockly.Blocks['face_define_model_dict'] = {
    init: function () {
        this.jsonInit({
            message0: "定义模型列表 MODEL_DICT",
            previousStatement: null,
            nextStatement: null,
            colour: FACE_DETECT_COLOR,
            tooltip: "定义 face/profile/eye 对应的 Haar 模型文件名",
            helpUrl: ""
        });
    }
};

// 4. 定义置信度计算函数
Blockly.Blocks['face_define_calc_conf'] = {
    init: function () {
        this.jsonInit({
            message0: "定义 calculate_confidence 函数",
            previousStatement: null,
            nextStatement: null,
            colour: FACE_DETECT_COLOR,
            tooltip: "将 Haar 原始分映射为 0-100% 的置信度",
            helpUrl: ""
        });
    }
};

// 5. 定义检测主函数
Blockly.Blocks['face_define_detect_func'] = {
    init: function () {
        this.jsonInit({
            message0: "定义 detect_features_custom 检测函数",
            previousStatement: null,
            nextStatement: null,
            colour: FACE_DETECT_COLOR,
            tooltip: "封装整个人脸检测、过滤和绘制流程",
            helpUrl: ""
        });
    }
};

// 6. 参数总包裹积木：像“钳子”一样包住所有参数子积木
Blockly.Blocks['face_param_group'] = {
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
      colour: FACE_DETECT_COLOR,
      tooltip: "将所有参数子积木放在这里，统一作为本次检测的配置",
      helpUrl: ""
    });
  }
};

// 6.0 【简易版】基础参数（仅保留：图片路径 + 检测类型，其余参数使用默认值）
Blockly.Blocks['face_param_basic_lite'] = {
  init: function () {
    this.jsonInit({
      message0: "【简易版】基础参数 图片路径 %1 检测类型 %2",
      args0: [
        {
          type: "field_input",
          name: "IMAGE_PATH",
          text: "face.png"
        },
        {
          type: "field_dropdown",
          name: "MODEL_TYPE",
          options: [
            ["正脸 (face)", "face"],
            ["侧脸 (profile)", "profile"],
            ["眼睛 (eye)", "eye"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "简易版：只设置图片路径与检测类型；其余检测参数使用默认值",
      helpUrl: ""
    });
  }
};

// 6.1 子积木：检测类型
Blockly.Blocks['face_param_model'] = {
  init: function () {
    this.jsonInit({
      message0: "检测类型 %1",
      args0: [
        {
          type: "field_dropdown",
          name: "MODEL_TYPE",
          options: [
            ["正脸 (face)", "face"],
            ["侧脸 (profile)", "profile"],
            ["眼睛 (eye)", "eye"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "选择要检测的目标类型",
      helpUrl: ""
    });
  }
};

// 6.1.0 子积木：上传图片路径
Blockly.Blocks['face_param_image'] = {
  init: function () {
    this.jsonInit({
      message0: "上传图片路径 %1",
      args0: [
        {
          type: "field_input",
          name: "IMAGE_PATH",
          text: "face.png"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "设置需要上传并使用的图片路径/文件名（示例: face.png）",
      helpUrl: ""
    });
  }
};

// 6.2 子积木：置信度阈值
Blockly.Blocks['face_param_min_conf'] = {
  init: function () {
    this.jsonInit({
      message0: "过滤置信度低于 %1 %% 的结果",
      args0: [
        {
          type: "field_number",
          name: "MIN_CONF",
          value: 20,
          min: 0,
          max: 100,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "只保留高于该置信度的检测框",
      helpUrl: ""
    });
  }
};

// 6.3 子积木：邻居数
Blockly.Blocks['face_param_neighbors'] = {
  init: function () {
    this.jsonInit({
      message0: "检测严谨度 (minNeighbors) = %1",
      args0: [
        {
          type: "field_number",
          name: "NEIGHBORS",
          value: 3,
          min: 1,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "越大越不容易误检，但可能漏掉小目标",
      helpUrl: ""
    });
  }
};

// 6.4 子积木：scaleFactor
Blockly.Blocks['face_param_scale'] = {
  init: function () {
    this.jsonInit({
      message0: "多尺度扫描步长 (scaleFactor) = %1",
      args0: [
        {
          type: "field_number",
          name: "SCALE",
          value: 1.1,
          min: 1.01,
          precision: 0.01
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "越接近 1.0 检测越细致，但运行更慢",
      helpUrl: ""
    });
  }
};

// 6.5 子积木：最小尺寸
Blockly.Blocks['face_param_min_size'] = {
  init: function () {
    this.jsonInit({
      message0: "最小目标尺寸 宽 %1 高 %2",
      args0: [
        {
          type: "field_number",
          name: "MIN_W",
          value: 30,
          min: 1,
          precision: 1
        },
        {
          type: "field_number",
          name: "MIN_H",
          value: 30,
          min: 1,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "只检测大于该尺寸的目标",
      helpUrl: ""
    });
  }
};

// 6.6 子积木：评分基准
Blockly.Blocks['face_param_saturation'] = {
  init: function () {
    this.jsonInit({
      message0: "评分基准 (saturation_score) = %1",
      args0: [
        {
          type: "field_number",
          name: "SATURATION",
          value: 10.0,
          min: 0.1,
          precision: 0.1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "Haar 原始分多少算 100%，越大阈值越严格",
      helpUrl: ""
    });
  }
};

// 7. 运行积木：主入口 + 包裹参数和调用
Blockly.Blocks['face_run_call_detect'] = {
  init: function () {
    this.jsonInit({
      message0: "运行人脸检测主程序 %1",
      args0: [
        {
          type: "input_statement",
          name: "BODY"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "在主入口中先应用参数设置，再调用 detect_features_custom 进行检测",
      helpUrl: ""
    });
  }
};

// 8. 子积木：只负责调用 detect_features_custom(...)
Blockly.Blocks['face_call_detect'] = {
  init: function () {
    this.jsonInit({
      message0: "调用 detect_features_custom 进行检测",
      previousStatement: null,
      nextStatement: null,
      colour: FACE_DETECT_COLOR,
      tooltip: "根据当前参数执行一次检测",
      helpUrl: ""
    });
  }
};
