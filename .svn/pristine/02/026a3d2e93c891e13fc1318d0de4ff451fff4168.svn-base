// DQN 结构模式的预置布局（CNN 架构演示）
export const dqnArchitecturePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_arch_main" x="40" y="40">
    <next>
      <block type="dqn_arch_import_init">
        <next>
          <block type="dqn_arch_define_network">
            <next>
              <block type="dqn_arch_define_agent">
                <next>
                  <block type="dqn_arch_run_main">
                    <statement name="PARAMS_BODY">
                      <block type="dqn_arch_param_config">
                        <statement name="BODY">
                          <block type="dqn_arch_param_input_channels">
                            <next>
                              <block type="dqn_arch_param_action_dim">
                                <next>
                                  <block type="dqn_arch_param_lr">
                                    <next>
                                      <block type="dqn_arch_param_gamma">
                                        <next>
                                          <block type="dqn_arch_param_epsilon">
                                            <next>
                                              <block type="dqn_arch_param_memory">
                                                <next>
                                                  <block type="dqn_arch_param_batch"></block>
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
</xml>
`;

// DQN 训练模式的预置布局（打开后即排好积木）
export const dqnTrainingPresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_main" x="40" y="40">
    <next>
      <block type="dqn_import_init">
        <next>
          <block type="dqn_define_smart_block">
            <next>
              <block type="dqn_define_auto_net">
                <next>
                  <block type="dqn_define_agent">
                    <next>
                      <block type="dqn_define_env">
                        <next>
                          <block type="dqn_run_main">
                            <statement name="PARAMS_BODY">
                              <block type="dqn_param_group">
                                <statement name="BODY">
                                  <block type="dqn_param_config">
                                    <statement name="BODY">
                                      <block type="dqn_param_lr">
                                        <next>
                                          <block type="dqn_param_gamma">
                                            <next>
                                              <block type="dqn_param_epsilon">
                                                <next>
                                                  <block type="dqn_param_memory">
                                                    <next>
                                                      <block type="dqn_param_batch">
                                                        <next>
                                                          <block type="dqn_param_episodes"></block>
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
                                    </statement>
                                  </block>
                                </statement>
                              </block>
                            </statement>
                            <statement name="USER_BLOCK_LIST">
                              <block type="dqn_user_block_list">
                                <statement name="BODY">
                                  <block type="dqn_user_block_custom">
                                    <next>
                                      <block type="dqn_user_block_custom">
                                        <next>
                                          <block type="dqn_user_block_custom"></block>
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
        </next>
      </block>
    </next>
  </block>
</xml>
`;

// DQN 推理模式的预置布局（打开后即排好积木）
export const dqnInferencePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_inf_main" x="40" y="40">
    <next>
      <block type="dqn_inf_import_init">
        <next>
          <block type="dqn_inf_define_smart_block">
            <next>
              <block type="dqn_inf_define_auto_net">
                <next>
                  <block type="dqn_inf_define_predictor">
                    <next>
                      <block type="dqn_inf_define_env">
                        <next>
                          <block type="dqn_inf_run_main">
                            <statement name="PARAMS_BODY">
                              <block type="dqn_inf_param_config">
                                <statement name="BODY">
                                  <block type="dqn_inf_param_model_file">
                                    <next>
                                      <block type="dqn_inf_param_state_dim">
                                        <next>
                                          <block type="dqn_inf_param_action_dim"></block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                              </block>
                            </statement>
                            <statement name="USER_BLOCK_LIST">
                              <block type="dqn_inf_user_block_list">
                                <statement name="BODY">
                                  <block type="dqn_inf_smart_block">
                                    <next>
                                      <block type="dqn_inf_smart_block">
                                        <next>
                                          <block type="dqn_inf_smart_block"></block>
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
        </next>
      </block>
    </next>
  </block>
</xml>
`;

// ===========================
// 简易版预设：减少积木数量与可编辑参数
// ===========================

// DQN 结构（简易版）
export const dqnArchitectureLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_arch_import_init" x="50" y="50">
    <next>
      <block type="dqn_arch_define_network">
        <next>
          <block type="dqn_arch_define_agent">
            <next>
              <block type="dqn_arch_run_main">
                <statement name="PARAMS_BODY">
                  <block type="dqn_arch_param_basic_lite"></block>
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

// DQN 训练（简易版）
export const dqnTrainingLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_import_init" x="50" y="50">
    <next>
      <block type="dqn_define_smart_block">
        <next>
          <block type="dqn_define_auto_net">
            <next>
              <block type="dqn_define_agent">
                <next>
                  <block type="dqn_define_env">
                    <next>
                      <block type="dqn_run_main_lite">
                        <statement name="PARAMS_BODY">
                          <block type="dqn_param_basic_lite"></block>
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
</xml>
`;

// DQN 推理（简易版）
export const dqnInferenceLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="dqn_inf_import_init" x="50" y="50">
    <next>
      <block type="dqn_inf_define_smart_block">
        <next>
          <block type="dqn_inf_define_auto_net">
            <next>
              <block type="dqn_inf_define_predictor">
                <next>
                  <block type="dqn_inf_define_env">
                    <next>
                      <block type="dqn_inf_run_main_lite">
                        <statement name="PARAMS_BODY">
                          <block type="dqn_inf_param_basic_lite"></block>
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
</xml>
`;

