import * as Blockly from 'blockly/core';
import 'blockly/python';

// ===========================
// 一、人脸注册：主程序与类定义
// ===========================

// 空主程序标记：不输出代码
Blockly.Python['face_reg_main'] = function (block) {
  return '';
};

// 导入库
Blockly.Python['face_reg_import'] = function (block) {
  // 清空旧定义，保证脚本干净
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import cv2  # 导入OpenCV库，用于图像处理和人脸检测',
    '',
    'import os  # 导入操作系统接口库，用于文件路径和目录操作',
    '',
    'import sys  # 导入系统接口库，用于程序退出等操作',
    '',
    'import numpy as np  # 导入numpy库，用于数组操作',
    ''
  ].join('\n');
};

// 定义FaceRegisterSystem类的大积木
Blockly.Python['face_reg_define_class'] = function (block) {
  // 获取BODY里面的所有子积木生成的代码（包括__init__和其他方法）
  let bodyCode = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (bodyCode) {
    const indent = Blockly.Python.INDENT || '    ';
    // 去掉 statementToCode 默认加上的一级缩进
    bodyCode = bodyCode.replace(new RegExp('^' + indent, 'gm'), '');
  }
  
  return [
    '# ==========================================',
    '# 🛠️ [核心注册系统]',
    '# ==========================================',
    'class FaceRegisterSystem:',
    bodyCode,
    ''
  ].join('\n');
};

// 定义 __init__ 方法
Blockly.Python['face_reg_define_init'] = function (block) {
  return [
    '    def __init__(self):',
    '        # 1. 定义模型路径',
    "        self.det_model_path = 'face_detection_yunet_2023mar.onnx'  # 人脸检测模型文件路径",
    "        self.reg_model_path = 'face_recognition_sface_2021dec.onnx'  # 人脸识别模型文件路径",
    "        self.output_dir = 'dataset'  # 输出目录，用于保存注册的人脸图片",
    '',
    '        # 2. 检查模型文件',
    '        self._check_models()  # 调用内部方法检查模型文件是否存在',
    '',
    '        # 3. 初始化检测器',
    '        self.detector = cv2.FaceDetectorYN.create(  # 创建YuNet人脸检测器',
    '            self.det_model_path, "", (320, 320),  # 模型路径、空字符串（表示使用默认配置）、输入尺寸',
    '            0.9, 0.3, 5000  # 置信度阈值、NMS阈值、最大检测数量',
    '        )',
    '',
    '        # 4. 初始化识别器',
    '        self.recognizer = cv2.FaceRecognizerSF.create(  # 创建SFace人脸识别器',
    '            self.reg_model_path, ""  # 模型路径、空字符串（表示使用默认配置）',
    '        )',
    '',
    '        # 5. 准备保存目录',
    '        if not os.path.exists(self.output_dir):  # 检查输出目录是否存在',
    '            os.makedirs(self.output_dir)  # 如果不存在则创建目录',
    ''
  ].join('\n');
};

// 定义 _check_models 方法
Blockly.Python['face_reg_define_check_models'] = function (block) {
  return [
    '    def _check_models(self):',
    '        """检查模型文件是否存在"""',
    '        if not os.path.exists(self.det_model_path) or not os.path.exists(self.reg_model_path):  # 检查两个模型文件是否都存在',
    '            print("❌ 错误：缺少模型文件！")  # 打印错误提示',
    '            sys.exit(1)  # 如果模型文件不存在，退出程序',
    ''
  ].join('\n');
};

// 定义 run_registration 方法
Blockly.Python['face_reg_define_run_registration'] = function (block) {
  return [
    '    def run_registration(self, params):',
    '        """执行人脸注册流程"""',
    '        image_path = params.source_image  # 从参数对象中获取源图片路径',
    '        label_name = params.register_name  # 从参数对象中获取注册的名字',
    '',
    '        print(f"🔄 正在处理图片: {image_path} ...")  # 打印处理进度提示',
    '',
    '        # 1. 读取',
    '        if not os.path.exists(image_path):  # 检查图片文件是否存在',
    '            print(f"❌ 错误：找不到图片文件 {image_path}")  # 如果不存在，打印错误信息',
    '            return  # 提前返回，不继续执行',
    '',
    '        img = cv2.imread(image_path)  # 使用OpenCV读取图片文件',
    '        if img is None:  # 检查图片是否成功读取',
    '            print("❌ 错误：无法读取图片")  # 如果读取失败，打印错误信息',
    '            return  # 提前返回',
    '',
    '        # 2. 调整检测尺寸',
    '        h, w, _ = img.shape  # 获取图片的高度、宽度和通道数（忽略通道数）',
    '        self.detector.setInputSize((w, h))  # 设置检测器的输入尺寸为图片的实际尺寸',
    '',
    '        # 3. 检测',
    '        _, faces = self.detector.detect(img)  # 检测图片中的人脸（返回值：状态码、人脸列表）',
    '        if faces is None or len(faces) == 0:  # 检查是否检测到人脸',
    '            print("⚠️ 注册失败：未检测到人脸")  # 如果没有检测到人脸，打印提示',
    '            return  # 提前返回',
    '',
    '        # 4. 取最大人脸',
    '        target_face = max(faces, key=lambda f: f[2] * f[3])  # 从所有检测到的人脸中选择面积最大的（宽度*高度）',
    '',
    '        # 5. 对齐与裁剪 (标准尺寸通常是 112x112)',
    '        face_aligned = self.recognizer.alignCrop(img, target_face)  # 将检测到的人脸对齐并裁剪为标准尺寸',
    '',
    '        # 6. 保存 (保持原汁原味的小尺寸，这对模型识别最准确)',
    '        save_path = os.path.join(self.output_dir, f"{label_name}.jpg")  # 拼接保存路径：输出目录/名字.jpg',
    '        cv2.imwrite(save_path, face_aligned)  # 将对齐后的人脸保存为JPG图片',
    '',
    '        print("-" * 30)  # 打印分隔线',
    '        print(f"✅ 注册成功！")  # 打印成功信息',
    '        print(f"👤 名字: {label_name}")  # 打印注册的名字',
    '        print(f"📂 保存: {save_path}")  # 打印保存路径',
    '        print("-" * 30)  # 打印分隔线',
    '',
    '        # ==========================================',
    '        # 🔍 [新增] 放大预览展示逻辑',
    '        # ==========================================',
    '        # 原始 face_aligned 很小 (112x112)，我们放大 3 倍来看看细节',
    '        display_scale = 3  # 设置放大倍数',
    '        h_small, w_small = face_aligned.shape[:2]  # 获取原始人脸图片的高度和宽度',
    '',
    '        # 使用双线性插值放大图片，使其看起来平滑',
    '        face_preview = cv2.resize(  # 调整图片大小',
    '            face_aligned,  # 源图片',
    '            (w_small * display_scale, h_small * display_scale),  # 目标尺寸（宽*倍数, 高*倍数）',
    '            interpolation=cv2.INTER_LINEAR  # 使用双线性插值方法',
    '        )',
    '',
    '        # 在预览图上加一行小字提示',
    '        cv2.putText(face_preview, "Preview (3x)", (5, 20),  # 在图片上绘制文字（位置、坐标、字体）',
    '                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)  # 字体、大小、颜色(BGR)、粗细',
    '',
    '        cv2.imshow(f"Result: {label_name}", face_preview)  # 显示预览窗口（窗口标题包含名字）',
    '        print("👀 预览窗口已打开，按任意键关闭...")  # 打印提示信息',
    '        cv2.waitKey(0)  # 等待用户按键（0表示无限等待）',
    '        cv2.destroyAllWindows()  # 关闭所有OpenCV创建的窗口',
    ''
  ].join('\n');
};

// 【简易版】一键定义核心类（包含 __init__ / _check_models / run_registration）
Blockly.Python['face_reg_define_core_lite'] = function (block) {
  const parts = [
    Blockly.Python['face_reg_define_init']?.(block) || '',
    Blockly.Python['face_reg_define_check_models']?.(block) || '',
    Blockly.Python['face_reg_define_run_registration']?.(block) || ''
  ].filter(Boolean);

  return [
    '# ==========================================',
    '# 🛠️ [核心注册系统] (简易版)',
    '# ==========================================',
    'class FaceRegisterSystem:',
    parts.join('\n\n'),
    ''
  ].join('\n');
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 运行：主入口 + 包裹 BODY（参数设置 + 运行调用）
Blockly.Python['face_reg_run_main'] = function (block) {
  // 获取参数设置的代码（包含 class RegisterParams 和参数）
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），这正是我们需要的
  
  // 如果用户完全删除了参数设置积木，提供默认的RegisterParams类（带有默认参数值）
  // 确保即使没有参数设置积木，程序也能正常运行
  const indent = Blockly.Python.INDENT || '    ';
  if (!paramCode || !paramCode.trim()) {
    // 生成带有默认值的RegisterParams类
    // 第一层缩进（4个空格）对应 if __name__ == "__main__"
    // 第二层缩进（4个空格）对应 class 内部的属性（总共8个空格）
    paramCode = [
      'class RegisterParams:',
      indent + 'source_image = "yxy.jpg"  # 源图片路径，用于注册的人脸图片',
      indent + 'register_name = "Tom"  # 注册的名字，将用作保存的文件名'
    ].map(line => indent + line).join('\n');
  }
  
  // 获取运行调用的代码（应该在try块内，需要8个空格缩进）
  let runCode = Blockly.Python.statementToCode(block, 'RUN_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），但runCode需要在try块内，需要再加4个空格（总共8个）
  if (runCode) {
    const lines = runCode.split('\n');
    runCode = lines.map(line => {
      if (!line.trim()) return '';
      // 如果行已经有缩进，再加一层（对应try块的缩进）
      return indent + line;
    }).join('\n');
  }
  
  // 如果没有runCode，使用默认代码（已经正确缩进8个空格）
  const defaultRunCode = runCode || '        app = FaceRegisterSystem()  # 创建FaceRegisterSystem实例\n        app.run_registration(RegisterParams)  # 调用run_registration方法进行注册';
  
  return [
    '# ==========================================',
    '# 🚀 [主程序入口]',
    '# ==========================================',
    'if __name__ == "__main__":',
    paramCode,
    '    try:  # 使用try-except捕获可能的异常',
    defaultRunCode,
    '    except Exception as e:  # 捕获所有异常',
    '        print(f"程序运行出错: {e}")  # 打印错误信息',
    ''
  ].join('\n');
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 参数总包裹：输出 class RegisterParams 和内部 BODY 子积木生成的代码
Blockly.Python['face_reg_param_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  // statementToCode会自动在inner的每一行前面加4个空格（对应class的缩进）
  // 但是因为整个face_reg_param_group的返回值还会被外层的statementToCode处理（对应if __name__ == "__main__"的缩进）
  // 所以最终效果：
  // if __name__ == "__main__":
  //     class RegisterParams:
  //         source_image = "yxy.jpg"  (已经有4个空格来自内层statementToCode，再加4个来自外层，总共8个)
  //         ...
  // 注意：如果inner为空，我们需要提供默认参数值，确保程序可以正常运行
  const indent = Blockly.Python.INDENT || '    ';
  const defaultParams = [
    'source_image = "yxy.jpg"  # 源图片路径，用于注册的人脸图片',
    'register_name = "Tom"  # 注册的名字，将用作保存的文件名'
  ].map(line => indent + line).join('\n');

  return [
    'class RegisterParams:',
    inner || defaultParams
  ].join('\n');
};

// 【简易版】基础参数：仅保留 源图片路径 + 注册名字
Blockly.Python['face_reg_param_basic_lite'] = function (block) {
  const path = block.getFieldValue('SOURCE_IMAGE') || 'yxy.jpg';
  const name = block.getFieldValue('REGISTER_NAME') || 'Tom';
  const indent = Blockly.Python.INDENT || '    ';

  return [
    'class RegisterParams:',
    `${indent}source_image = "${path}"  # 源图片路径，用于注册的人脸图片`,
    `${indent}register_name = "${name}"  # 注册的名字，将用作保存的文件名`
  ].join('\n') + '\n';
};

// 子参数：源图片路径
Blockly.Python['face_reg_param_source_image'] = function (block) {
  const path = block.getFieldValue('SOURCE_IMAGE') || 'yxy.jpg';
  return `source_image = "${path}"  # 源图片路径，用于注册的人脸图片\n`;
};

// 子参数：注册名字
Blockly.Python['face_reg_param_register_name'] = function (block) {
  const name = block.getFieldValue('REGISTER_NAME') || 'Tom';
  return `register_name = "${name}"  # 注册的名字，将用作保存的文件名\n`;
};

// ===========================
// 四、运行方法调用
// ===========================

// 创建FaceRegisterSystem实例
Blockly.Python['face_reg_create_instance'] = function (block) {
  return [
    'app = FaceRegisterSystem()  # 创建FaceRegisterSystem实例',
    ''
  ].join('\n');
};

// 调用 run_registration 方法
Blockly.Python['face_reg_call_run_registration'] = function (block) {
  return [
    'app.run_registration(RegisterParams)  # 调用run_registration方法进行注册，传入RegisterParams参数对象',
    ''
  ].join('\n');
};
