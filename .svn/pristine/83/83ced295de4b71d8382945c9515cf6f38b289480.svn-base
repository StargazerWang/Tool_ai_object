<script setup>
/**
 * ============================================================================
 * BlocklyDiv 组件 - 合并适配版
 * ============================================================================
 * 样式源：新项目 (Theme, Grid, UI Interaction)
 * 逻辑源：原项目 (Face Recognition, Decision Tree, Perceptron Logic)
 * ============================================================================
 */

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
// 使用原项目的核心引入方式，确保逻辑生成器能挂载
import * as Blockly from 'blockly/core';
// 引入新项目的样式文件
import './blockly.css';
import '@/blocks';
import getToolbox from '@/global/toolbox';
import mainToolBox from '@/global/toolbox/main';
import { CategoryColors } from '@/global/colors';
import lang from '@/container/BlocklyGui/lang';
import store from '@/store';
import { buildUrl } from '@/utils/api';

// ========== 【逻辑源：原项目依赖】 ==========
import { createBlockClickListener } from '@/blocks/Highlight';
import { loadFaceBlocks } from '@/blocks';
import { decisionTreePresetXml, decisionTreeLitePresetXml, perceptronPresetXml, perceptronLitePresetXml } from '@/blocks/decision_tree/presetXml.js';
import { faceDetectionLitePresetXml, faceRegistrationLitePresetXml, faceRecognitionLitePresetXml } from '@/blocks/NewFace/presetXml.js';
import { dqnArchitecturePresetXml, dqnTrainingPresetXml, dqnInferencePresetXml, dqnArchitectureLitePresetXml, dqnTrainingLitePresetXml, dqnInferenceLitePresetXml } from '@/blocks/play_game/dqn_presetXml.js';
import { getFaceDetectionStartBlocks } from '@/global/toolbox/face_detection';
import { getFaceRegistrationStartBlocks } from '@/global/toolbox/face_registration';
import { getFaceRecognitionStartBlocks } from '@/global/toolbox/face_recognition';

// --- 引入所有 Face 相关的积木定义和生成器 ---
import '@/blocks/NewFace/face_detection_blocks';
import '@/blocks/NewFace/face_detection_generators';
import '@/blocks/NewFace/face_registration_blocks';
import '@/blocks/NewFace/face_registration_generators';
import '@/blocks/NewFace/face_recognition_blocks';
import '@/blocks/NewFace/face_recognition_generators';
// ----------------------------------------------------

const blocklyDiv = ref(null)
let observer = null;
let workspace = null;
let goCreate = ref(false);
const route = useRoute();


store.setLanguagePack(lang.LanguagePack);
store.setCategoryColors(CategoryColors);

const LITE_TOOLBOX_XML = `
<xml>
  <category name="简易版（待实现）" colour="#909399"></category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const DECISION_TREE_LITE_TOOLBOX_XML = `
<xml>
  <category name="决策树（简易版）" colour="${CategoryColors.AI}">
    <block type="dt_import_init"></block>
    <block type="dt_define_load_and_preprocess"></block>
    <block type="dt_define_train_model"></block>
    <block type="dt_run_main"></block>
    <block type="dt_param_basic_lite"></block>
    <block type="dt_call_functions"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const PERCEPTRON_LITE_TOOLBOX_XML = `
<xml>
  <category name="感知机（简易版）" colour="${CategoryColors.AI}">
    <block type="pt_import_init"></block>
    <block type="pt_define_core_lite"></block>
    <block type="pt_run_main_lite"></block>
    <block type="pt_param_basic_lite"></block>
    <block type="pt_call_functions"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const FACE_DETECTION_LITE_TOOLBOX_XML = `
<xml>
  <category name="人脸检测（简易版）" colour="#4C9AFF">
    <block type="face_import_init"></block>
    <block type="face_define_model_dict"></block>
    <block type="face_define_calc_conf"></block>
    <block type="face_define_detect_func"></block>
    <block type="face_run_call_detect"></block>
    <block type="face_param_basic_lite"></block>
    <block type="face_call_detect"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const FACE_REGISTRATION_LITE_TOOLBOX_XML = `
<xml>
  <category name="人脸注册（简易版）" colour="#FFA500">
    <block type="face_reg_import"></block>
    <block type="face_reg_define_core_lite"></block>
    <block type="face_reg_run_main"></block>
    <block type="face_reg_param_basic_lite"></block>
    <block type="face_reg_create_instance"></block>
    <block type="face_reg_call_run_registration"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const FACE_RECOGNITION_LITE_TOOLBOX_XML = `
<xml>
  <category name="人脸识别（简易版）" colour="#9B59B6">
    <block type="face_recog_import"></block>
    <block type="face_recog_define_core_lite"></block>
    <block type="face_recog_run_main"></block>
    <block type="face_recog_param_basic_lite"></block>
    <block type="face_recog_create_instance"></block>
    <block type="face_recog_call_ensure_registered"></block>
    <block type="face_recog_call_recognize"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const DQN_ARCHITECTURE_LITE_TOOLBOX_XML = `
<xml>
  <category name="DQN结构（简易版）" colour="${CategoryColors.AI}">
    <block type="dqn_arch_import_init"></block>
    <block type="dqn_arch_define_network"></block>
    <block type="dqn_arch_define_agent"></block>
    <block type="dqn_arch_run_main"></block>
    <block type="dqn_arch_param_basic_lite"></block>
    <block type="dqn_arch_param_config"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const DQN_TRAINING_LITE_TOOLBOX_XML = `
<xml>
  <category name="DQN训练（简易版）" colour="${CategoryColors.AI}">
    <block type="dqn_import_init"></block>
    <block type="dqn_define_smart_block"></block>
    <block type="dqn_define_auto_net"></block>
    <block type="dqn_define_agent"></block>
    <block type="dqn_define_env"></block>
    <block type="dqn_run_main_lite"></block>
    <block type="dqn_param_basic_lite"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

const DQN_INFERENCE_LITE_TOOLBOX_XML = `
<xml>
  <category name="DQN推理（简易版）" colour="${CategoryColors.AI}">
    <block type="dqn_inf_import_init"></block>
    <block type="dqn_inf_define_smart_block"></block>
    <block type="dqn_inf_define_auto_net"></block>
    <block type="dqn_inf_define_predictor"></block>
    <block type="dqn_inf_define_env"></block>
    <block type="dqn_inf_run_main_lite"></block>
    <block type="dqn_inf_param_basic_lite"></block>
  </category>
  <sep></sep>
  ${mainToolBox}
</xml>`;

function getEdition(query) {
  return query?.edition === 'lite' ? 'lite' : 'pro';
}

function getToolboxByEdition(query) {
  if (getEdition(query) !== 'lite') return getToolbox(query);
  if (query?.dt) return DECISION_TREE_LITE_TOOLBOX_XML;
  if (query?.pt) return PERCEPTRON_LITE_TOOLBOX_XML;
  if (query?.dqn === '1') return DQN_ARCHITECTURE_LITE_TOOLBOX_XML;
  if (query?.dqn === '2') return DQN_TRAINING_LITE_TOOLBOX_XML;
  if (query?.dqn === '3') return DQN_INFERENCE_LITE_TOOLBOX_XML;
  if (query?.type === 'face_detect') return FACE_DETECTION_LITE_TOOLBOX_XML;
  if (query?.type === 'face_register') return FACE_REGISTRATION_LITE_TOOLBOX_XML;
  if (query?.type === 'face_recognize') return FACE_RECOGNITION_LITE_TOOLBOX_XML;
  return LITE_TOOLBOX_XML;
}

const workspaceXmlCacheBySignature = new Map();
function getWorkspaceCacheEntry(signature) {
  if (!workspaceXmlCacheBySignature.has(signature)) {
    workspaceXmlCacheBySignature.set(signature, { pro: '', lite: '' });
  }
  return workspaceXmlCacheBySignature.get(signature);
}

function snapshotWorkspaceXmlText() {
  if (!workspace) return '';
  try {
    const xmlDom = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(xmlDom);
  } catch (e) {
    console.error('[BlocklyDiv] snapshotWorkspaceXmlText failed', e);
    return '';
  }
}

function clearWorkspaceAndSyncStore() {
  if (!workspace) return;
  workspace.clear();
  try {
    workspace.scrollCenter?.();
    Blockly.svgResize(workspace);
  } catch (_) {
    // ignore
  }
  store.setXmlCode('');
  store.setPyCode('');
}

function restoreWorkspaceFromXmlText(xmlText) {
  if (!workspace) return;
  if (!xmlText) {
    clearWorkspaceAndSyncStore();
    return;
  }
  store.loadXMLCode({ xmlCode: xmlText, notClear: false });
}

function getQuerySignatureWithoutEdition(query) {
  const normalized = {};
  if (!query) return JSON.stringify(normalized);
  for (const key of Object.keys(query).sort()) {
    if (key === 'edition') continue;
    normalized[key] = query[key];
  }
  return JSON.stringify(normalized);
}

onMounted(() => {
  init();
  observer = new ResizeObserver(() => {
    console.log("blocklyDiv resized!");
    if (workspace) Blockly.svgResize(workspace);
  });
  observer.observe(blocklyDiv.value);
})

onBeforeUnmount(() => {
  observer?.disconnect();
});

async function init() {
  console.log("初始化 Blockly (Merge Version), 类型:", route.query.type);

  // ========== 【样式源：使用新项目的配置 options】 ==========
  const options = {
    media: './media/', // 资源路径保留新项目
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    // Toolbox 初始结构保留新项目样式，后续会动态更新
    toolbox: '<xml><category name="System" colour="#CC0000"></category></xml>',
    zoom: {
      controls: true,
      // wheel: true, // 新项目注释了 wheel，这里保持一致
      startScale: 1,
      scaleSpeed: 1.2,
      minScale: 0.8,
      maxScale: 1.8
    },
    // Theme 完全使用新项目的配色方案
    theme: {
      blockStyles: {
        colour_blocks: {colourPrimary: "20"},
        hat_blocks: {colourPrimary: "330", hat: "cap"},
        list_blocks: {colourPrimary: "#035703"},
        logic_blocks: {colourPrimary: "#D435D4"},
        loop_blocks: {colourPrimary: "#5454BF"},
        math_blocks: {colourPrimary: "#039A9A"},
        procedure_blocks: {colourPrimary: "#EF5D5D"},
        text_blocks: {colourPrimary: "#257DB1"},
        variable_blocks: {colourPrimary: "#6969FF"},
        variable_dynamic_blocks: {colourPrimary: "#6969FF"}
      },
      startHats: 1
    }
  };

  // 注入 Workspace
  workspace = Blockly.inject(blocklyDiv.value, options);

  // 应用配置
  workspace.options.maxTrashcanContents = 10;
  workspace.options.oneBasedIndex = false;

  // ========== 【逻辑源：事件监听与功能】 ==========
  workspace.addChangeListener(updateFunction);

  // 保留原项目的高亮逻辑
  workspace.addChangeListener(createBlockClickListener(
      workspace,
      ({blockCode, workspaceCode, startLine, endLine}) => {
        store.setSelectedCodes({blockCode, workspaceCode, startLine, endLine});
      },
      (error) => {
        console.error(error);
      }
  ));

  workspace.clear();
  workspace.variableList = workspace.variableList || [];
  store.setWorkspace(workspace);

  // 应用 UI 交互修正（使用新项目的 editBlock）
  editBlock();

  // ========== 【逻辑源：路由监听与动态加载】 ==========
  watch(() => route.query, async (newQuery, oldQuery) => {
    if (!workspace) return;

    const newSig = getQuerySignatureWithoutEdition(newQuery);
    const oldSig = getQuerySignatureWithoutEdition(oldQuery);
    const newEdition = getEdition(newQuery);
    const oldEdition = getEdition(oldQuery);

    // 仅切换“简易版/复杂版”时：Toolbox 与工作区内容都需要按 edition 区分
    if (newSig === oldSig) {
      const entry = getWorkspaceCacheEntry(newSig);

      // 先保存当前 edition 的工作区
      entry[oldEdition] = snapshotWorkspaceXmlText();

      // 切换 Toolbox
      workspace.updateToolbox(getToolboxByEdition(newQuery));

      // 简易版默认加载简易模板；复杂版尽量恢复上次内容
      const nextXml = entry[newEdition] || '';
      if (nextXml) {
        restoreWorkspaceFromXmlText(nextXml);
      } else if (newEdition === 'pro') {
        clearWorkspaceAndSyncStore();
        loadPresetIfNeeded(newQuery);
        loadFacePresetIfNeeded(newQuery);
      } else {
        if (newQuery?.dt) {
          store.loadXMLCode({ xmlCode: decisionTreeLitePresetXml, notClear: false });
        } else if (newQuery?.pt) {
          store.loadXMLCode({ xmlCode: perceptronLitePresetXml, notClear: false });
        } else if (newQuery?.dqn === '1') {
          store.loadXMLCode({ xmlCode: dqnArchitectureLitePresetXml, notClear: false });
        } else if (newQuery?.dqn === '2') {
          store.loadXMLCode({ xmlCode: dqnTrainingLitePresetXml, notClear: false });
        } else if (newQuery?.dqn === '3') {
          store.loadXMLCode({ xmlCode: dqnInferenceLitePresetXml, notClear: false });
        } else if (newQuery?.type === 'face_detect') {
          store.loadXMLCode({ xmlCode: faceDetectionLitePresetXml, notClear: false });
        } else if (newQuery?.type === 'face_register') {
          store.loadXMLCode({ xmlCode: faceRegistrationLitePresetXml, notClear: false });
        } else if (newQuery?.type === 'face_recognize') {
          store.loadXMLCode({ xmlCode: faceRecognitionLitePresetXml, notClear: false });
        } else {
          clearWorkspaceAndSyncStore();
        }
      }

      store.setICON();
      return;
    }

    // 人脸模块：确保相关积木已加载
    if (['newface', 'face_detect', 'face_register', 'face_recognize'].includes(newQuery?.type)) {
      try {
        if (getEdition(newQuery) !== 'lite') {
          await loadFaceBlocks();
        }
      } catch (e) {
        console.error('[人脸识别] 加载人脸识别积木失败', e);
      }
    }

    workspace.updateToolbox(getToolboxByEdition(newQuery));
    if (getEdition(newQuery) === 'lite') {
      if (newQuery?.dt) {
        store.loadXMLCode({ xmlCode: decisionTreeLitePresetXml, notClear: false });
      } else if (newQuery?.pt) {
        store.loadXMLCode({ xmlCode: perceptronLitePresetXml, notClear: false });
      } else if (newQuery?.dqn === '1') {
        store.loadXMLCode({ xmlCode: dqnArchitectureLitePresetXml, notClear: false });
      } else if (newQuery?.dqn === '2') {
        store.loadXMLCode({ xmlCode: dqnTrainingLitePresetXml, notClear: false });
      } else if (newQuery?.dqn === '3') {
        store.loadXMLCode({ xmlCode: dqnInferenceLitePresetXml, notClear: false });
      } else if (newQuery?.type === 'face_detect') {
        store.loadXMLCode({ xmlCode: faceDetectionLitePresetXml, notClear: false });
      } else if (newQuery?.type === 'face_register') {
        store.loadXMLCode({ xmlCode: faceRegistrationLitePresetXml, notClear: false });
      } else if (newQuery?.type === 'face_recognize') {
        store.loadXMLCode({ xmlCode: faceRecognitionLitePresetXml, notClear: false });
      } else {
        clearWorkspaceAndSyncStore();
      }
      store.setICON();
      return;
    }

    workspace.clear();

    // 加载预设
    loadPresetIfNeeded(newQuery);
    loadFacePresetIfNeeded(newQuery);
    store.setICON();
  }, {immediate: false});

  // 初始加载逻辑
  if (['newface', 'face_detect', 'face_register', 'face_recognize'].includes(route.query?.type)) {
    try {
      if (getEdition(route.query) !== 'lite') {
        await loadFaceBlocks();
      }
    } catch (e) {
      console.error('[人脸识别] 加载人脸识别积木失败', e);
    }
  }

  // 更新 Toolbox 和 Icon
  console.log(route.query);
  workspace.updateToolbox(getToolboxByEdition(route.query));
  store.setICON();

  // 简易版：当前仅占位，保持工作区空白
  if (getEdition(route.query) === 'lite') {
    if (route.query?.dt) {
      store.loadXMLCode({ xmlCode: decisionTreeLitePresetXml, notClear: false });
    } else if (route.query?.pt) {
      store.loadXMLCode({ xmlCode: perceptronLitePresetXml, notClear: false });
    } else if (route.query?.dqn === '1') {
      store.loadXMLCode({ xmlCode: dqnArchitectureLitePresetXml, notClear: false });
    } else if (route.query?.dqn === '2') {
      store.loadXMLCode({ xmlCode: dqnTrainingLitePresetXml, notClear: false });
    } else if (route.query?.dqn === '3') {
      store.loadXMLCode({ xmlCode: dqnInferenceLitePresetXml, notClear: false });
    } else if (route.query?.type === 'face_detect') {
      store.loadXMLCode({ xmlCode: faceDetectionLitePresetXml, notClear: false });
    } else if (route.query?.type === 'face_register') {
      store.loadXMLCode({ xmlCode: faceRegistrationLitePresetXml, notClear: false });
    } else if (route.query?.type === 'face_recognize') {
      store.loadXMLCode({ xmlCode: faceRecognitionLitePresetXml, notClear: false });
    } else {
      clearWorkspaceAndSyncStore();
    }
    return;
  }

  // 加载各类预设
  loadPresetIfNeeded(route.query);
  loadFacePresetIfNeeded(route.query);

  // 加载示例（如果有）
  if (getEdition(route.query) !== 'lite' && Object.keys(route.query).length > 0 && route.query.example) {
    setTimeout(() => {
      loadExample(route.query);
    }, 100);
  } else if (Object.keys(route.query).length > 0) {
    // 兼容新项目的逻辑：如果有 query 但不是 example，可能也需要稍微延迟处理
    // 这里不做额外操作，依赖上面的 preset 加载
  }
}

// ========== 【逻辑源：辅助功能函数】 ==========

/**
 * 加载决策树/感知机预设
 */
function loadPresetIfNeeded(query) {
  if (!workspace) return;
  if (getEdition(query) === 'lite') return;
  if (query?.example) return;
  if (workspace.getAllBlocks(false).length > 0) return;

  if (query?.dt) {
    store.loadXMLCode({xmlCode: decisionTreePresetXml});
  } else if (query?.pt) {
    store.loadXMLCode({xmlCode: perceptronPresetXml});
  } else if (query?.dqn === '1') { // DQN 结构模式默认排好积木
    store.loadXMLCode({xmlCode: dqnArchitecturePresetXml});
  } else if (query?.dqn === '2') { // DQN 训练模式默认排好积木
    store.loadXMLCode({xmlCode: dqnTrainingPresetXml});
  } else if (query?.dqn === '3') { // DQN 推理模式默认排好积木
    store.loadXMLCode({xmlCode: dqnInferencePresetXml});
  }
}

/**
 * 加载人脸识别预设
 */
function loadFacePresetIfNeeded(query) {
  if (!workspace) return;
  if (getEdition(query) === 'lite') return;
  if (query?.example) return;
  if (workspace.getAllBlocks(false).length > 0) return;

  const type = query?.type;
  let xmlCode = '';

  if (type === 'face_detect') xmlCode = getFaceDetectionStartBlocks();
  else if (type === 'face_register') xmlCode = getFaceRegistrationStartBlocks();
  else if (type === 'face_recognize') xmlCode = getFaceRecognitionStartBlocks();

  if (!xmlCode) return;
  store.loadXMLCode({xmlCode});
}

/**
 * 加载云端示例代码
 */
async function loadExample(data) {
  const name = data?.example;
  if (!name) return;
  const res = await axios.get(buildUrl(`/examples/${name}.mxml`));
  
  if (!res?.data) {
    alert('加载失败！');
    return;
  }
  store.loadXMLCode({xmlCode: res.data || ''});
}

/**
 * 更新代码到 Store 和 LocalStorage
 */
function updateFunction(event) {
  if (!goCreate.value) return;
  try {
    var code = Blockly.Python.workspaceToCode(workspace);
    localStorage.code = code;
    store.setPyCode(code);

    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    var blockxml = Blockly.Xml.domToPrettyText(xmlDom);
    localStorage.xml = blockxml;
    store.setXmlCode(blockxml);
  } catch (e) {
    // 忽略拖拽过程中的报错
  }
}

// ========== 【样式源：UI 交互重写】 ==========
// 使用新文件的 editBlock 以适配新布局/装饰
function editBlock() {
  Blockly.Toolbox.prototype.handleAfterTreeSelected_ = function (a, b) {
    if (b && b.children_ && b.children_.length > 0) {
      store.setBlocklyIcon(b.children_);
    }

    b && b.blocks && b.blocks.length ? (this.flyout_.show(b.blocks),
    this.lastCategory_ != b && this.flyout_.scrollToStart(),
    this.workspace_.keyboardAccessibilityMode && Blockly.navigation.setState(Blockly.navigation.STATE_TOOLBOX)) : (this.flyout_.hide(),
    !this.workspace_.keyboardAccessibilityMode || b instanceof Blockly.Toolbox.TreeSeparator || Blockly.navigation.setState(Blockly.navigation.STATE_WS));
    a != b && a != this && (a = new Blockly.Events.Ui(null, "category", a && a.content, b && b.content),
        a.workspaceId = this.workspace_.id,
        Blockly.Events.fire(a));
    b && (this.lastCategory_ = b)
  }

  // 在块拖动过程中更新光标
  Blockly.BlockDragger.prototype.updateCursorDuringBlockDrag_ = function (event) {
    goCreate.value = false;
    this.wouldDeleteBlock_ = this.draggedConnectionManager_.wouldDeleteBlock();
    var trashcan = this.workspace_.trashcan;
    if (this.wouldDeleteBlock_) {
      this.draggingBlock_.setDeleteStyle(true);
      // 兼容两种不同的垃圾桶 API 调用方式，优先新项目逻辑
      if (this.deleteArea_ == Blockly.DELETE_AREA_TRASH && trashcan) {
        // 尝试直接调用 setOpen (新项目方式)，如果报错则尝试 setLidOpen (旧 API)
        if (typeof trashcan.setOpen === 'function') {
          trashcan.setOpen(true);
        } else if (typeof trashcan.setLidOpen === 'function') {
          trashcan.setLidOpen(true);
        }
      }
    } else {
      this.draggingBlock_.setDeleteStyle(false);
      if (trashcan) {
        if (typeof trashcan.setOpen === 'function') {
          trashcan.setOpen(false);
        } else if (typeof trashcan.setLidOpen === 'function') {
          trashcan.setLidOpen(false);
        }
      }
    }
  };

  // 解封（松开）
  Blockly.Tooltip.unblock = function () {
    goCreate.value = true;
    Blockly.Tooltip.blocked_ = false;
  };

  // 重写设置 blocklyFlyout 位置的方法 (新项目核心样式逻辑)
  // 注意：这里依赖 DOM 结构 .injectionDiv 和 .blocklyToolboxDiv
  Blockly.Flyout.prototype.positionAt_ = function (a, b, c, d) {
    if (this.svgGroup_ === document.querySelector('.injectionDiv').childNodes[6]) {
      c = document.querySelector('.blocklyToolboxDiv').offsetWidth;
    }
    this.svgGroup_.setAttribute("width", a);
    this.svgGroup_.setAttribute("height", b);

    // 兼容代码：检查 utils 是否存在，防止版本差异报错
    if (Blockly.utils && Blockly.utils.dom && Blockly.utils.dom.setCssTransform) {
      "svg" == this.svgGroup_.tagName ? Blockly.utils.dom.setCssTransform(this.svgGroup_, "translate(" + c + "px," + d + "px)") : this.svgGroup_.setAttribute("transform", "translate(" + c + "," + d + ")");
    } else if (Blockly.utils && Blockly.utils.setCssTransform) {
      "svg" == this.svgGroup_.tagName ? Blockly.utils.setCssTransform(this.svgGroup_, "translate(" + c + "px," + d + "px)") : this.svgGroup_.setAttribute("transform", "translate(" + c + "," + d + ")");
    } else {
      // 降级处理
      this.svgGroup_.setAttribute("transform", "translate(" + c + "," + d + ")");
    }

    this.scrollbar_ && (this.scrollbar_.setOrigin(c, d),
        this.scrollbar_.resize(),
        this.scrollbar_.setPosition_(this.scrollbar_.position_.x, this.scrollbar_.position_.y))
  }
}
</script>

<template>
  <div ref="blocklyDiv" class="blockly-div"></div>
</template>

<style scoped>
.blockly-div {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
