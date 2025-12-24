import { CategoryColors } from '@/global/colors';

function getPerceptronToolbox() {
    const toolbox = `
  <category name="感知机" colour="${CategoryColors.AI || '#5C81A6'}">
    <block type="pt_main"></block>
    <block type="pt_import_init"></block>
    <block type="pt_define_smart_block"></block>
    <block type="pt_define_auto_net"></block>
    <block type="pt_define_train_engine"></block>
    <block type="pt_define_load_data"></block>
    <block type="pt_run_main"></block>

    <sep></sep>
    <label text="参数设置"></label>
    <block type="pt_param_group"></block>
    <block type="pt_param_csv_file"></block>
    <block type="pt_param_target_column"></block>
    <block type="pt_param_train_config"></block>
    <block type="pt_param_test_split"></block>
    <block type="pt_param_seed"></block>
    <block type="pt_param_epochs"></block>
    <block type="pt_param_lr"></block>

    <sep></sep>
    <label text="用户积木列表"></label>
    <block type="pt_user_block_list"></block>
    <block type="pt_smart_block"></block>

    <sep></sep>
    <label text="运行"></label>
    <block type="pt_call_functions"></block>
  </category>
  <sep></sep>`;
    return toolbox;
}

export default function (data) {
    let toolbox = '';
    // 关键：只有 URL 参数带 ?pt=1 时才显示这个工具箱
    if (data && data.pt) {
        toolbox = getPerceptronToolbox();
    }
    return toolbox;
};
