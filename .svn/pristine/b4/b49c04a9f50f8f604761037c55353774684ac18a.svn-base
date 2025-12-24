import {CategoryColors} from '@/global/colors';

function getArchitectureToolbox() {
  const toolbox = `
  <category name="DQN结构" colour="${CategoryColors.AI || '#5C81A6'}">
    <block type="dqn_arch_main"></block>
    <block type="dqn_arch_import_init"></block>
    <block type="dqn_arch_define_network"></block>
    <block type="dqn_arch_define_agent"></block>
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
    <block type="dqn_arch_run_main"></block>
  </category>
  <sep></sep>`;
  return toolbox;
}

function getTrainingToolbox() {
  const toolbox = `
  <category name="DQN" colour="${CategoryColors.AI || '#5C81A6'}">
    <block type="dqn_main"></block>
    <block type="dqn_import_init"></block>
    <block type="dqn_define_smart_block"></block>
    <block type="dqn_define_auto_net"></block>
    <block type="dqn_define_agent"></block>
    <block type="dqn_define_env"></block>
    <block type="dqn_run_main">
      <statement name="PARAMS_BODY">
        <block type="dqn_param_group">
          <statement name="BODY">
            <block type="dqn_param_config"></block>
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

    <sep></sep>
    <label text="参数设置"></label>
    <block type="dqn_param_group"></block>
    <block type="dqn_param_config"></block>
    <block type="dqn_param_lr"></block>
    <block type="dqn_param_gamma"></block>
    <block type="dqn_param_epsilon"></block>
    <block type="dqn_param_memory"></block>
    <block type="dqn_param_batch"></block>
    <block type="dqn_param_episodes"></block>

    <sep></sep>
    <label text="用户积木列表"></label>
    <block type="dqn_user_block_list"></block>
    <block type="dqn_user_block_custom"></block>
  </category>
  <sep></sep>`;
  return toolbox;
}

function getInferenceToolbox() {
  let toolbox = `
  <category name="DQN推理" colour="${CategoryColors.AI || '#5C81A6'}">
    <block type="dqn_inf_main"></block>
    <block type="dqn_inf_import_init"></block>
    <block type="dqn_inf_define_smart_block"></block>
    <block type="dqn_inf_define_auto_net"></block>
    <block type="dqn_inf_define_predictor"></block>
    <block type="dqn_inf_define_env"></block>

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

    <sep></sep>
    <label text="参数设置"></label>
    <block type="dqn_inf_param_config"></block>
    <block type="dqn_inf_param_model_file"></block>
    <block type="dqn_inf_param_state_dim"></block>
    <block type="dqn_inf_param_action_dim"></block>

    <sep></sep>
    <label text="用户积木列表"></label>
    <block type="dqn_inf_user_block_list"></block>
    <block type="dqn_inf_smart_block"></block>
  </category>
  <sep></sep>`;
  return toolbox;
}

export default function (data) {
  let toolbox = '';
  if (!data || !data.dqn) return toolbox;
  else if (data.dqn === '1') toolbox = getArchitectureToolbox();
  else if (data.dqn === '2') toolbox = getTrainingToolbox();
  else if (data.dqn === '3') toolbox = getInferenceToolbox();
  return toolbox;
};