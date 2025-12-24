import * as Blockly from 'blockly/core';
import 'blockly/python';

// face_detect_main：空标志，不输出代码
Blockly.Python['face_detect_main'] = function (block) {
    return '';
};

// 导入库 + 默认参数
Blockly.Python['face_import_init'] = function (block) {
    // 清空旧定义，保证每次生成的脚本干净
    Blockly.Python.definitions_ = Object.create(null);
    return [
        'import cv2  # 导入OpenCV库，用于图像处理和 Haar 级联分类器',
        'import os  # 导入操作系统接口库，用于文件路径操作',
        ''
    ].join('\n');
};

// 定义模型字典
Blockly.Python['face_define_model_dict'] = function (block) {
    return [
        '# 模型列表：定义可用的 Haar 级联分类器模型',
        'MODEL_DICT = {  # 创建字典，存储模型类型与对应XML文件名的映射',
        '    "face": "haarcascade_frontalface_default.xml",  # 正脸检测模型',
        '    "profile": "haarcascade_profileface.xml",  # 侧脸检测模型',
        '    "eye": "haarcascade_eye.xml"  # 眼睛检测模型',
        '}  # 字典结束',
        ''
    ].join('\n');
};

// 定义置信度函数
Blockly.Python['face_define_calc_conf'] = function (block) {
    return [
        '# 将 Haar 原始分映射为百分比置信度',
        'def calculate_confidence(raw_score, saturation_score=10.0):  # 定义计算置信度的函数，raw_score为原始分数，saturation_score为饱和分数（默认10.0）',
        '    """  # 函数文档字符串开始',
        '    计算百分比置信度  # 函数功能说明',
        '    :param raw_score: Haar 算法返回的原始权重  # 参数1说明',
        '    :param saturation_score: 设定多少分算作 100%  # 参数2说明',
        '    """  # 函数文档字符串结束',
        '    percent = (raw_score / saturation_score) * 100.0  # 计算百分比：原始分数除以饱和分数再乘以100',
        '    if percent > 100.0:  # 如果百分比超过100%',
        '        percent = 100.0  # 限制最大值为100%',
        '    if percent < 0.0:  # 如果百分比小于0%',
        '        percent = 0.0  # 限制最小值为0%',
        '    return percent  # 返回计算后的置信度百分比',
        ''
    ].join('\n');
};

// 定义检测主函数
Blockly.Python['face_define_detect_func'] = function (block) {
    return [
        'def detect_features_custom(image_path,',
        '                           model_type="face",',
        '                           scale_factor=1.1,',
        '                           min_neighbors=3,',
        '                           min_size=(30, 30),',
        '                           saturation_score=10.0,',
        '                           min_confidence=30):',
        '    # --- 路径与模型加载 ---',
        '    base_path = cv2.data.haarcascades  # 获取OpenCV内置Haar分类器模型的默认路径',
        '    xml_name = MODEL_DICT.get(model_type)  # 从字典中获取对应模型类型的XML文件名',
        '    if not xml_name:  # 如果字典中没有找到对应的模型类型',
        "        print(f'❌ 错误: 不支持的模型类型 {model_type}')  # 打印错误信息",
        '        return  # 提前返回，不继续执行',
        '',
        '    cascade_path = xml_name if os.path.exists(xml_name) else os.path.join(base_path, xml_name)  # 判断XML文件是否存在：存在则直接用，否则拼接默认路径',
        '    detector = cv2.CascadeClassifier(cascade_path)  # 创建Haar级联分类器对象，加载XML模型文件',
        '    if detector.empty():  # 检查分类器是否成功加载（empty()返回True表示加载失败）',
        "        print('❌ 致命错误: 无法加载模型文件，请检查 OpenCV 安装。')  # 打印致命错误信息",
        '        return  # 提前返回',
        '',
        '    # --- 图片读取与预处理 ---',
        '    if not os.path.exists(image_path):  # 检查图片路径是否存在',
        "        print(f'❌ 错误: 找不到图片 {image_path}')  # 打印错误信息",
        '        return  # 提前返回',
        '',
        '    img = cv2.imread(image_path)  # 读取图片文件，返回BGR格式的图像数组',
        '    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 将BGR彩色图像转换为灰度图像（Haar检测需要灰度图）',
        '    gray = cv2.equalizeHist(gray)  # 直方图均衡化，增强图像对比度，提高检测效果',
        '',
        "    print(f'\\n🔍 开始检测 [{model_type}]...')  # 打印检测开始提示信息",
        "    print(f'⚙️  参数: 缩放={scale_factor}, 邻居={min_neighbors}, 最小尺寸={min_size}')  # 打印检测参数信息",
        "    print(f'🎯 阈值: 只显示置信度 > {min_confidence}% 的目标')  # 打印置信度阈值信息",
        '',
        '    # --- 核心检测 ---',
        '    rects, rejectLevels, levelWeights = detector.detectMultiScale3(  # 使用三级检测方法，返回矩形框、拒绝级别和权重分数',
        '        gray,  # 输入灰度图像',
        '        scaleFactor=scale_factor,  # 图像缩放因子（每次检测缩小比例，1.1表示缩小10%）',
        '        minNeighbors=min_neighbors,  # 最小邻居数（矩形框周围需要多少个邻居矩形框才被认为是有效检测）',
        '        minSize=min_size,  # 最小检测尺寸（小于这个尺寸的目标会被忽略）',
        '        flags=cv2.CASCADE_SCALE_IMAGE,  # 标志位：按图像缩放方式检测',
        '        outputRejectLevels=True  # 输出拒绝级别（用于置信度计算）',
        '    )  # 检测函数调用结束',
        '',
        '    if len(rects) == 0:  # 如果检测到的矩形框数量为0',
        "        print('💨 结果: 未检测到任何目标。')  # 打印未检测到目标的信息",
        '        return  # 提前返回',
        '',
        '    # --- 过滤与绘制 ---',
        '    valid_count = 0  # 初始化有效检测计数为0',
        '    for (x, y, w, h), raw_score in zip(rects, levelWeights):  # 遍历每个检测到的矩形框和对应的原始分数',
        '        confidence = calculate_confidence(raw_score, saturation_score)  # 调用函数将原始分数转换为百分比置信度',
        '        r_score_val = raw_score if isinstance(raw_score, float) else raw_score[0]  # 处理原始分数：如果是浮点数直接使用，否则取数组第一个元素',
        '',
        '        if confidence >= min_confidence:  # 如果置信度大于等于最小置信度阈值',
        '            valid_count += 1  # 有效计数加1',
        '            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)  # 在原图上绘制绿色矩形框，标识检测到的人脸',
        '            text = f"{confidence:.1f}%"  # 格式化置信度文本，保留1位小数',
        '            text_color = (0, 255, 0) if confidence > 60 else (0, 255, 255)  # 根据置信度选择文字颜色：大于60%用绿色，否则用黄色',
        '            cv2.putText(img, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, text_color, 2)  # 在矩形框上方绘制置信度文字',
        "            print(f'  ✅ [保留] 坐标:({x},{y}) | 原始分:{r_score_val:.2f} -> 置信度:{confidence:.1f}%')  # 打印保留的检测结果",
        '        else:  # 如果置信度低于阈值',
        "            print(f'  ❌ [剔除] 坐标:({x},{y}) | 原始分:{r_score_val:.2f} -> 置信度:{confidence:.1f}% (低于阈值)')  # 打印剔除的检测结果",
        '',
        "    print(f'\\n🏁 完成: 保留了 {valid_count} 个目标，过滤了 {len(rects) - valid_count} 个噪音。')  # 打印最终统计信息",
        "    cv2.imshow('Result', img)  # 显示处理后的图像窗口（窗口标题为'Result'）",
        '    cv2.waitKey(0)  # 等待键盘按键（0表示无限等待）',
        '    cv2.destroyAllWindows()  # 关闭所有OpenCV创建的窗口',
        ''
    ].join('\n');
};

// 参数总包裹：输出注释 + 内部 BODY 子积木生成的代码
Blockly.Python['face_param_group'] = function (block) {
  // 这里的 statementToCode 会自动在每一行前面加一个缩进
  // 为了避免在 run_call_detect 里再加一层，先把这一级公共缩进去掉
  let inner = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (inner) {
    const indent = Blockly.Python.INDENT || '    ';
    inner = inner.replace(new RegExp('^' + indent, 'gm'), '');
  }
  return '\n# ===== 参数设置 (以下为本次检测的所有配置) =====\n' + inner;
};

// 【简易版】基础参数：仅保留图片路径 + 检测类型，其余参数使用默认值
Blockly.Python['face_param_basic_lite'] = function (block) {
  const imagePath = block.getFieldValue('IMAGE_PATH') || 'face.png';
  const modelType = block.getFieldValue('MODEL_TYPE') || 'face';

  return [
    '# ===== 参数设置（简易版默认） =====',
    `MY_IMAGE = "${imagePath}"  # 设置要检测的图片文件路径`,
    `MY_TYPE = "${modelType}"  # 设置检测类型（face正脸/profile侧脸/eye眼睛）`,
    'MY_MIN_CONFIDENCE = 20  # 最小置信度阈值（百分比），低于此值的检测结果会被过滤',
    'MY_NEIGHBORS = 3  # minNeighbors：越大越严格，误检更少但可能漏检',
    'MY_SCALE = 1.1  # scaleFactor：越接近 1.0 越精细但更慢',
    'MY_MIN_SIZE = (30, 30)  # 最小检测尺寸（宽, 高）',
    'MY_SATURATION = 10.0  # 置信度饱和分数（对应 100%）',
    ''
  ].join('\n');
};

// 子参数：图片路径
Blockly.Python['face_param_image'] = function (block) {
  const path = block.getFieldValue('IMAGE_PATH') || 'face.png';
  return `MY_IMAGE = "${path}"  # 设置要检测的图片文件路径\n`;
};

// 子参数：检测类型
Blockly.Python['face_param_model'] = function (block) {
  const model = block.getFieldValue('MODEL_TYPE') || 'face';
  return `MY_TYPE = "${model}"  # 设置检测类型（face正脸/profile侧脸/eye眼睛）\n`;
};

// 子参数：置信度阈值
Blockly.Python['face_param_min_conf'] = function (block) {
  const minConf = block.getFieldValue('MIN_CONF') || 20;
  return `MY_MIN_CONFIDENCE = ${minConf}  # 设置最小置信度阈值（百分比），低于此值的检测结果会被过滤\n`;
};

// 子参数：邻居数
Blockly.Python['face_param_neighbors'] = function (block) {
  const neighbors = block.getFieldValue('NEIGHBORS') || 3;
  return `MY_NEIGHBORS = ${neighbors}  # 设置最小邻居数（检测框周围需要多少个邻居框才认为是有效检测，值越大越严格）\n`;
};

// 子参数：scaleFactor
Blockly.Python['face_param_scale'] = function (block) {
  const scale = block.getFieldValue('SCALE') || 1.1;
  return `MY_SCALE = ${scale}  # 设置图像缩放因子（每次检测时图像缩小比例，1.1表示缩小10%，值越小检测越精确但速度越慢）\n`;
};

// 子参数：最小尺寸
Blockly.Python['face_param_min_size'] = function (block) {
  const w = block.getFieldValue('MIN_W') || 30;
  const h = block.getFieldValue('MIN_H') || 30;
  return `MY_MIN_SIZE = (${w}, ${h})  # 设置最小检测尺寸（宽度,高度），小于此尺寸的目标会被忽略\n`;
};

// 子参数：评分基准
Blockly.Python['face_param_saturation'] = function (block) {
  const sat = block.getFieldValue('SATURATION') || 10.0;
  return `MY_SATURATION = ${sat}  # 设置置信度饱和分数（用于将原始分数转换为百分比，此值对应100%置信度）\n`;
};

// 运行：主入口 + 包裹 BODY（参数设置 + 调用）
Blockly.Python['face_run_call_detect'] = function (block) {
  // 先获取 BODY 里面所有子积木生成的代码，然后整体缩进到 if 内部
  let bodyCode = Blockly.Python.statementToCode(block, 'BODY') || '';
  if (bodyCode) {
    const indent = Blockly.Python.INDENT || '    ';
    const lines = bodyCode.split('\n');
    // 计算所有非空行的最小前导空白数，用于“对齐去缩进”
    let minLeading = Infinity;
    for (const line of lines) {
      if (!line.trim()) continue;
      const match = line.match(/^(\s*)/);
      const leading = match ? match[1].length : 0;
      if (leading < minLeading) minLeading = leading;
    }
    if (!isFinite(minLeading)) minLeading = 0;
    // 去掉公共前导空白，再统一加上一层 if 下面的缩进
    bodyCode = lines
      .map(line => {
        if (!line.trim()) return '';
        return line.slice(minLeading);
      })
      .map(line => (line ? indent + line : ''))
      .join('\n');
  }

  return [
    'if __name__ == "__main__":  # 判断是否为主程序入口（直接运行此脚本时执行）',
    bodyCode ? bodyCode : '',
    ''
  ].join('\n');
};

// 8. 子积木：调用检测函数（不带缩进，由上层 run 块统一缩进）
Blockly.Python['face_call_detect'] = function (block) {
  return [
    'detect_features_custom(  # 调用自定义人脸检测函数',
    '    image_path=MY_IMAGE,  # 传入图片路径参数',
    '    model_type=MY_TYPE,  # 传入检测类型参数（face/profile/eye）',
    '    scale_factor=MY_SCALE,  # 传入缩放因子参数',
    '    min_neighbors=MY_NEIGHBORS,  # 传入最小邻居数参数',
    '    min_size=MY_MIN_SIZE,  # 传入最小检测尺寸参数',
    '    saturation_score=MY_SATURATION,  # 传入置信度饱和分数参数',
    '    min_confidence=MY_MIN_CONFIDENCE  # 传入最小置信度阈值参数',
    ')  # 函数调用结束',
    ''
  ].join('\n');
};
