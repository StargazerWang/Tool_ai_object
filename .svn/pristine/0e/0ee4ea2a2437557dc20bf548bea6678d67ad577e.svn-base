import '@/blocks/decision_tree/dt_blocks';
import '@/blocks/decision_tree/dt_generators';
import { CategoryColors } from '@/global/colors';

function getDecisionTreeToolbox() {
    const result = `
  <category name="决策树" colour="${CategoryColors.AI}">
    <block type="dt_main"></block>
    <block type="dt_import_init"></block>
    <block type="dt_define_load_and_preprocess"></block>
    <block type="dt_define_train_model"></block>
    <block type="dt_run_main"></block>
    <block type="dt_param_group"></block>
    <block type="dt_param_csv_file"></block>
    <block type="dt_param_target_column"></block>
    <block type="dt_param_test_size"></block>
    <block type="dt_param_random_seed"></block>
    <block type="dt_param_tree_params"></block>
    <block type="dt_param_tree_params_group"></block>
    <block type="dt_param_tree_criterion"></block>
    <block type="dt_param_tree_max_depth"></block>
    <block type="dt_param_tree_min_samples_split"></block>
    <block type="dt_param_tree_min_samples_leaf"></block>
    <block type="dt_param_tree_splitter"></block>
    <block type="dt_call_functions"></block>
  </category>
  <sep></sep>`;
    return result;
}

export default function (data) {
    let toolbox = '';
    // 只有当 URL 参数包含 dt 时才显示
    if (data && data.dt) {
        toolbox = getDecisionTreeToolbox();
    }
    return toolbox;
};
