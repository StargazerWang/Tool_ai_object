// 预置的 Blockly 布局：用于页面加载时直接展示完整示例
// 仅包含决策树与感知机教学用的基础流程

export const decisionTreePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dt_main" x="50" y="50">
    <next>
      <block type="dt_import_init">
        <next>
          <block type="dt_define_load_and_preprocess">
            <next>
              <block type="dt_define_train_model">
                <next>
                  <block type="dt_run_main">
                    <statement name="PARAMS_BODY">
                      <block type="dt_param_group">
                        <statement name="BODY">
                          <block type="dt_param_csv_file">
                            <next>
                              <block type="dt_param_target_column">
                                <next>
                                  <block type="dt_param_test_size">
                                    <next>
                                      <block type="dt_param_random_seed">
                                        <next>
                                          <block type="dt_param_tree_params">
                                            <statement name="BODY">
                                              <block type="dt_param_tree_params_group">
                                                <statement name="BODY">
                                                  <block type="dt_param_tree_criterion">
                                                    <next>
                                                      <block type="dt_param_tree_max_depth">
                                                        <next>
                                                          <block type="dt_param_tree_min_samples_split">
                                                            <next>
                                                              <block type="dt_param_tree_min_samples_leaf">
                                                                <next>
                                                                  <block type="dt_param_tree_splitter"></block>
                                                                </next>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </next>
                                                      </block>
                                                    </next>
                                                  </block>
                                                </statement>
                                              </block>
                                            </statement>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </statement>
                    <statement name="RUN_BODY">
                      <block type="dt_call_functions"></block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;

// 简易版预设：减少积木数量与可编辑参数（仅保留 CSV 路径 + 目标列名）
export const decisionTreeLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dt_import_init" x="50" y="50">
    <next>
      <block type="dt_define_load_and_preprocess">
        <next>
          <block type="dt_define_train_model">
            <next>
              <block type="dt_run_main">
                <statement name="PARAMS_BODY">
                  <block type="dt_param_basic_lite"></block>
                </statement>
                <statement name="RUN_BODY">
                  <block type="dt_call_functions"></block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;

export const perceptronPresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pt_main" x="40" y="40">
    <next>
      <block type="pt_import_init">
        <next>
          <block type="pt_define_smart_block">
            <next>
              <block type="pt_define_auto_net">
                <next>
                  <block type="pt_define_train_engine">
                    <next>
                      <block type="pt_define_load_data">
                        <next>
                          <block type="pt_run_main">
                            <statement name="PARAMS_BODY">
                              <block type="pt_param_group">
                                <statement name="BODY">
                                  <block type="pt_param_csv_file">
                                    <next>
                                      <block type="pt_param_target_column">
                                        <next>
                                          <block type="pt_param_train_config">
                                            <statement name="BODY">
                                              <block type="pt_param_test_split">
                                                <next>
                                                  <block type="pt_param_seed">
                                                    <next>
                                                      <block type="pt_param_epochs">
                                                        <next>
                                                          <block type="pt_param_lr"></block>
                                                        </next>
                                                      </block>
                                                    </next>
                                                  </block>
                                                </next>
                                              </block>
                                            </statement>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                              </block>
                            </statement>
                            <statement name="USER_BLOCK_LIST">
                              <block type="pt_user_block_list">
                                <statement name="BODY">
                                  <block type="pt_smart_block">
                                    <next>
                                      <block type="pt_smart_block">
                                        <next>
                                          <block type="pt_smart_block"></block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                              </block>
                            </statement>
                            <statement name="RUN_BODY">
                              <block type="pt_call_functions"></block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;

// 简易版预设：减少积木数量与可编辑参数（仅保留 CSV 路径 + 目标列名）
export const perceptronLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pt_import_init" x="50" y="50">
    <next>
      <block type="pt_define_core_lite">
        <next>
          <block type="pt_run_main_lite">
            <statement name="PARAMS_BODY">
              <block type="pt_param_basic_lite"></block>
            </statement>
            <statement name="RUN_BODY">
              <block type="pt_call_functions"></block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;
