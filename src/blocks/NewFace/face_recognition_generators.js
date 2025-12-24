import * as Blockly from 'blockly/core';
import 'blockly/python';

// ===========================
// 一、人脸识别：主程序与类定义
// ===========================

// 空主程序标记：不输出代码
Blockly.Python['face_recog_main'] = function (block) {
  return '';
};

// 导入库
Blockly.Python['face_recog_import'] = function (block) {
  // 清空旧定义，保证脚本干净
  Blockly.Python.definitions_ = Object.create(null);
  return [
    'import cv2',
    '',
    'import numpy as np',
    '',
    'import os',
    '',
    'import sys',
    ''
  ].join('\n');
};

// 定义FaceSystem类的大积木
Blockly.Python['face_recog_define_class'] = function (block) {
  // 获取BODY里面的所有子积木生成的代码（包括__init__和其他方法）
  let bodyCode = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (bodyCode) {
    const indent = Blockly.Python.INDENT || '    ';
    // 去掉 statementToCode 默认加上的一级缩进
    bodyCode = bodyCode.replace(new RegExp('^' + indent, 'gm'), '');
  }
  
  return [
    '# ==========================================',
    '# 🛠️ [核心系统]',
    '# ==========================================',
    'class FaceSystem:',
    bodyCode,
    ''
  ].join('\n');
};

// 定义 __init__ 方法
Blockly.Python['face_recog_define_init'] = function (block) {
  return [
    '    def __init__(self):',
    '        # 1. 将原先的全局配置移入初始化函数，变成实例变量',
    "        self.det_model_path = 'face_detection_yunet_2023mar.onnx'",
    "        self.reg_model_path = 'face_recognition_sface_2021dec.onnx'",
    "        self.data_dir = 'dataset'",
    '        # 2. 检查模型',
    '        self._check_models()',
    '        # 3. 初始化检测器 (YuNet)',
    '        self.detector = cv2.FaceDetectorYN.create(',
    '            self.det_model_path, "", (320, 320),',
    '            0.9, 0.3, 5000',
    '        )',
    '        # 4. 初始化识别器 (SFace)',
    '        self.recognizer = cv2.FaceRecognizerSF.create(',
    '            self.reg_model_path, ""',
    '        )',
    ''
  ].join('\n');
};

// 定义 _check_models 方法
Blockly.Python['face_recog_define_check_models'] = function (block) {
  return [
    '    def _check_models(self):',
    '        """内部检查：确保模型文件存在"""',
    '        # 使用 self.变量名 访问',
    '        if not os.path.exists(self.det_model_path) or not os.path.exists(self.reg_model_path):',
    '            print("❌ 错误：缺少模型文件！")',
    '            print(f"请确保以下文件在代码同级目录:\\n1. {self.det_model_path}\\n2. {self.reg_model_path}")',
    '            sys.exit(1)',
    ''
  ].join('\n');
};

// 定义 _get_feature 方法
Blockly.Python['face_recog_define_get_feature'] = function (block) {
  return [
    '    def _get_feature(self, img_path):',
    '        """从图片提取特征的内部工具"""',
    '        if not os.path.exists(img_path):',
    '            print(f"❌ 图片不存在: {img_path}")',
    '            return None, None',
    '        img = cv2.imread(img_path)',
    '        if img is None: return None, None',
    '        # 动态调整输入尺寸',
    '        h, w, _ = img.shape',
    '        self.detector.setInputSize((w, h))',
    '        # 检测人脸',
    '        _, faces = self.detector.detect(img)',
    '        if faces is None or len(faces) == 0:',
    '            return None, None',
    '        # 提取最大的一张脸 (faces[0])',
    '        face_align = self.recognizer.alignCrop(img, faces[0])',
    '        feature = self.recognizer.feature(face_align)',
    '        return feature, faces',
    ''
  ].join('\n');
};

// 定义 ensure_registered 方法
Blockly.Python['face_recog_define_ensure_registered'] = function (block) {
  return [
    '    def ensure_registered(self, name, img_path):',
    '        """',
    '        [智能注册逻辑] - 修改：直接接收 name 和 img_path',
    '        """',
    '        npy_path = os.path.join(self.data_dir, f"{name}.npy")  # 拼接保存路径：数据集目录/名字.npy',
    '',
    '        # 1. 检查是否已注册',
    '        if os.path.exists(npy_path):  # 检查特征文件是否存在',
    '            print(f"✅ [状态] 用户 {name} 已注册，准备识别。")  # 打印已注册提示',
    '            return True  # 返回True表示已注册',
    '',
    '        # 2. 未注册，执行注册流程',
    '        print(f"🔄 [状态] 新用户，正在从 {img_path} 提取特征...")  # 打印注册进度提示',
    '        if not os.path.exists(self.data_dir):  # 检查数据集目录是否存在',
    '            os.makedirs(self.data_dir)  # 如果不存在则创建目录',
    '',
    '        feature, _ = self._get_feature(img_path)  # 从图片中提取人脸特征',
    '        if feature is not None:  # 如果成功提取到特征',
    '            np.save(npy_path, feature)  # 保存特征到文件',
    '            print(f"✅ [注册成功] 特征已保存至 {npy_path}")  # 打印成功信息',
    '            return True  # 返回True表示注册成功',
    '        else:  # 如果没有提取到特征',
    '            print(f"❌ [注册失败] 在 {img_path} 中未检测到人脸。")  # 打印失败信息',
    '            return False  # 返回False表示注册失败',
    ''
  ].join('\n');
};

// 定义 recognize 方法
Blockly.Python['face_recog_define_recognize'] = function (block) {
  return [
    '    def recognize(self, check_img_path, target_name, threshold, color_yes, color_no):',
    '        """',
    '        [识别逻辑] - 修改：直接接收所有需要的参数',
    '        """',
    '        print(f"\\n🔍 [识别] 正在分析图片: {check_img_path}")  # 打印识别进度提示',
    '',
    '        # 1. 加载底库',
    '        npy_path = os.path.join(self.data_dir, f"{target_name}.npy")  # 拼接特征文件路径',
    '        if not os.path.exists(npy_path):  # 检查特征文件是否存在',
    '            print("❌ 逻辑错误：没有找到注册数据。")  # 打印错误信息',
    '            return  # 提前返回',
    '        target_feature = np.load(npy_path)  # 加载目标人脸特征',
    '',
    '        # 2. 读取目标图',
    '        img = cv2.imread(check_img_path)  # 读取待识别的图片',
    '        if img is None:  # 检查图片是否成功读取',
    '            print(f"❌ 无法读取目标图片: {check_img_path}")  # 打印错误信息',
    '            return  # 提前返回',
    '',
    '        # 3. 检测',
    '        h, w, _ = img.shape  # 获取图片的高度、宽度和通道数',
    '        self.detector.setInputSize((w, h))  # 设置检测器的输入尺寸',
    '        _, faces = self.detector.detect(img)  # 检测图片中的人脸',
    '',
    '        if faces is None:  # 检查是否检测到人脸',
    '            print("⚠️ 目标图片中未发现人脸。")  # 打印提示信息',
    '            return  # 提前返回',
    '',
    '        print(f"👀 发现 {len(faces)} 张人脸，正在比对...")  # 打印检测到的人脸数量',
    '',
    '        # 4. 遍历比对',
    '        for face in faces:  # 遍历每一张检测到的人脸',
    '            face_align = self.recognizer.alignCrop(img, face)  # 对齐并裁剪人脸',
    '            curr_feature = self.recognizer.feature(face_align)  # 提取当前人脸的特征',
    '',
    '            # 计算相似度',
    '            score = self.recognizer.match(  # 计算相似度分数',
    '                target_feature, curr_feature, cv2.FaceRecognizerSF_FR_COSINE  # 使用余弦相似度',
    '            )',
    '',
    '            # === 判定与颜色选择 ===',
    '            if score >= threshold:  # 如果相似度大于等于阈值',
    '                display_name = target_name  # 显示目标名字',
    '                draw_color = color_yes  # 使用匹配成功的颜色',
    '                status_text = "YES"  # 状态文本为"YES"',
    '            else:  # 如果相似度小于阈值',
    '                display_name = "Unknown"  # 显示"Unknown"',
    '                draw_color = color_no  # 使用匹配失败的颜色',
    '                status_text = "NO"  # 状态文本为"NO"',
    '',
    '            # 绘制矩形',
    '            box = list(map(int, face[:4]))  # 获取人脸框的坐标并转换为整数',
    '            cv2.rectangle(img, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), draw_color, 2)  # 在人脸上绘制矩形框',
    '',
    '            # 绘制文字',
    '            info = f"{display_name} ({score:.2f})"  # 格式化显示信息：名字(相似度)',
    '            cv2.putText(img, info, (box[0], box[1] - 10),  # 在矩形框上方绘制文字',
    '                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, draw_color, 2)  # 字体、大小、颜色、粗细',
    '',
    '            print(f"👉 识别结果: {status_text} | 相似度: {score:.4f} (阈值: {threshold})")  # 打印识别结果',
    '',
    '        cv2.imshow("Result", img)  # 显示识别结果窗口',
    '        cv2.waitKey(0)  # 等待用户按键（0表示无限等待）',
    '        cv2.destroyAllWindows()  # 关闭所有OpenCV创建的窗口',
    ''
  ].join('\n');
};

// 【简易版】一键定义核心类（包含 __init__ / _check_models / _get_feature / ensure_registered / recognize）
Blockly.Python['face_recog_define_core_lite'] = function (block) {
  const parts = [
    Blockly.Python['face_recog_define_init']?.(block) || '',
    Blockly.Python['face_recog_define_check_models']?.(block) || '',
    Blockly.Python['face_recog_define_get_feature']?.(block) || '',
    Blockly.Python['face_recog_define_ensure_registered']?.(block) || '',
    Blockly.Python['face_recog_define_recognize']?.(block) || ''
  ].filter(Boolean);

  return [
    '# ==========================================',
    '# 🛠️ [核心识别系统] (简易版)',
    '# ==========================================',
    'class FaceSystem:',
    parts.join('\n\n'),
    ''
  ].join('\n');
};

// ===========================
// 二、运行入口：if __name__ == "__main__"
// ===========================

// 运行：主入口 + 包裹 BODY（参数设置 + 运行调用）
Blockly.Python['face_recog_run_main'] = function (block) {
  // 获取参数设置的代码（包含 class RunParams 和参数）
  let paramCode = Blockly.Python.statementToCode(block, 'PARAMS_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），这正是我们需要的
  
  // 获取运行调用的代码（应该在if __name__ == "__main__"中，4个空格缩进）
  let runCode = Blockly.Python.statementToCode(block, 'RUN_BODY') || '';
  // statementToCode会自动加一层缩进（4个空格），这正是我们需要的
  // 不需要额外处理

  // 如果没有runCode，使用默认代码
  const indent = Blockly.Python.INDENT || '    ';
  const defaultRunCode = runCode || [
    '# 1. 启动系统',
    'app = FaceSystem()',
    '',
    '# 2. 智能注册 (传入 名字 和 注册图路径)',
    'is_registered = app.ensure_registered(REGISTER_NAME, REGISTER_IMG_PATH)',
    '',
    '# 3. 开始识别 (传入 识别图路径, 目标名字, 阈值, 颜色配置)',
    'if is_registered:  # 如果注册成功',
    '    app.recognize(  # 调用识别方法',
    '        CHECK_IMG_PATH,  # 识别图片路径',
    '        REGISTER_NAME,  # 目标名字',
    '        MATCH_THRESHOLD,  # 相似度阈值',
    '        COLOR_MATCH,  # 匹配成功颜色',
    '        COLOR_UNKNOWN  # 匹配失败颜色',
    '    )'
  ].map(line => indent + line).join('\n');

  return [
    '# ==========================================',
    '# 🚀 [主程序入口]',
    '# ==========================================',
    'if __name__ == "__main__":',
    paramCode || '    # 暂无参数设置',
    '    # ----------------------------------------------',
    '    # 执行流程',
    '    # ----------------------------------------------',
    defaultRunCode,
    ''
  ].join('\n');
};

// ===========================
// 三、参数设置：大钳子 + 子积木
// ===========================

// 参数总包裹：生成全局变量参数设置
Blockly.Python['face_recog_param_group'] = function (block) {
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  // statementToCode会自动在inner的每一行前面加4个空格
  // 但是这里返回的代码会被外层的statementToCode再次添加缩进，所以需要去掉一层
  
  // 如果inner不为空，去掉statementToCode自动添加的缩进（因为外层还会再添加一次）
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    const lines = inner.split('\n');
    inner = lines.map(line => {
      // 去掉每一行的前导缩进（如果存在）
      if (line.startsWith(indent)) {
        return line.slice(indent.length);
      }
      return line;
    }).join('\n');
  }
  
  // 如果没有参数积木，提供默认参数值（不添加缩进，外层会添加）
  const defaultParams = [
    '# ⭐⭐⭐ 参数配置区 (直接修改变量) ⭐⭐⭐',
    'REGISTER_IMG_PATH = "yxy.jpg"   # 注册用的底图',
    'REGISTER_NAME = "yxy"           # 注册的名字',
    '',
    'CHECK_IMG_PATH = "yxy.jpg"      # 要去识别的图片',
    '',
    'MATCH_THRESHOLD = 0.5          # 相似度阈值 (建议0.4-0.6之间)',
    'COLOR_MATCH = (0, 255, 0)       # 匹配成功显示绿色 (B, G, R)',
    'COLOR_UNKNOWN = (0, 0, 255)     # 匹配失败显示红色 (B, G, R)'
  ].join('\n');

  return inner || defaultParams;
};

// 【简易版】基础参数：仅保留 注册图/注册名/识别图/阈值；颜色使用默认值
Blockly.Python['face_recog_param_basic_lite'] = function (block) {
  const registerImg = block.getFieldValue('REGISTER_IMG') || 'yxy.jpg';
  const registerName = block.getFieldValue('REGISTER_NAME') || 'yxy';
  const checkImg = block.getFieldValue('CHECK_IMG') || 'yxy.jpg';
  const threshold = block.getFieldValue('MATCH_THRESHOLD') || 0.5;

  return [
    '# ⭐⭐⭐ 参数配置区 (简易版) ⭐⭐⭐',
    `REGISTER_IMG_PATH = "${registerImg}"   # 注册用的底图`,
    `REGISTER_NAME = "${registerName}"           # 注册的名字`,
    '',
    `CHECK_IMG_PATH = "${checkImg}"      # 要去识别的图片`,
    '',
    `MATCH_THRESHOLD = ${threshold}          # 相似度阈值 (建议0.4-0.6之间)`,
    'COLOR_MATCH = (0, 255, 0)       # 匹配成功显示绿色 (B, G, R)',
    'COLOR_UNKNOWN = (0, 0, 255)     # 匹配失败显示红色 (B, G, R)',
    ''
  ].join('\n');
};

// 子参数：注册图片路径
Blockly.Python['face_recog_param_register_img'] = function (block) {
  const path = block.getFieldValue('REGISTER_IMG') || 'yxy.jpg';
  return `REGISTER_IMG_PATH = "${path}"   # 注册用的底图\n`;
};

// 子参数：注册名字
Blockly.Python['face_recog_param_register_name'] = function (block) {
  const name = block.getFieldValue('REGISTER_NAME') || 'yxy';
  return `REGISTER_NAME = "${name}"           # 注册的名字\n`;
};

// 子参数：识别图片路径
Blockly.Python['face_recog_param_check_img'] = function (block) {
  const path = block.getFieldValue('CHECK_IMG') || 'yxy.jpg';
  return `CHECK_IMG_PATH = "${path}"      # 要去识别的图片\n`;
};

// 子参数：相似度阈值
Blockly.Python['face_recog_param_match_threshold'] = function (block) {
  const threshold = block.getFieldValue('MATCH_THRESHOLD') || 0.5;
  return `MATCH_THRESHOLD = ${threshold}          # 相似度阈值 (建议0.4-0.6之间)\n`;
};

// 子参数：匹配成功颜色
Blockly.Python['face_recog_param_color_match'] = function (block) {
  const r = block.getFieldValue('R_MATCH') || 0;
  const g = block.getFieldValue('G_MATCH') || 255;
  const b = block.getFieldValue('B_MATCH') || 0;
  return `COLOR_MATCH = (${r}, ${g}, ${b})       # 匹配成功显示绿色 (B, G, R)\n`;
};

// 子参数：匹配失败颜色
Blockly.Python['face_recog_param_color_unknown'] = function (block) {
  const r = block.getFieldValue('R_UNKNOWN') || 0;
  const g = block.getFieldValue('G_UNKNOWN') || 0;
  const b = block.getFieldValue('B_UNKNOWN') || 255;
  return `COLOR_UNKNOWN = (${r}, ${g}, ${b})     # 匹配失败显示红色 (B, G, R)\n`;
};

// ===========================
// 四、运行方法调用
// ===========================

// 创建FaceSystem实例
Blockly.Python['face_recog_create_instance'] = function (block) {
  return [
    '# 1. 启动系统',
    'app = FaceSystem()',
    ''
  ].join('\n');
};

// 调用 ensure_registered 方法
Blockly.Python['face_recog_call_ensure_registered'] = function (block) {
  return [
    '# 2. 智能注册 (传入 名字 和 注册图路径)',
    'is_registered = app.ensure_registered(REGISTER_NAME, REGISTER_IMG_PATH)',
    ''
  ].join('\n');
};

// 调用 recognize 方法
Blockly.Python['face_recog_call_recognize'] = function (block) {
  return [
    '# 3. 开始识别 (传入 识别图路径, 目标名字, 阈值, 颜色配置)',
    'if is_registered:  # 如果注册成功',
    '    app.recognize(  # 调用识别方法',
    '        CHECK_IMG_PATH,  # 识别图片路径',
    '        REGISTER_NAME,  # 目标名字',
    '        MATCH_THRESHOLD,  # 相似度阈值',
    '        COLOR_MATCH,  # 匹配成功颜色',
    '        COLOR_UNKNOWN  # 匹配失败颜色',
    '    )',
    ''
  ].join('\n');
};

