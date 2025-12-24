import '@/blocks/NewFace/face_registration_blocks';
import '@/blocks/NewFace/face_registration_generators';

// 1. 左侧工具箱菜单
export const getFaceRegistrationToolbox = () => {
    console.log('[DEBUG face_registration.js] getFaceRegistrationToolbox 被调用');
    const result = `
    <category name="人脸注册" colour="#FFA500">
        <block type="face_reg_main"></block>
        <block type="face_reg_import"></block>
        <block type="face_reg_define_class"></block>
        <block type="face_reg_define_init"></block>
        <block type="face_reg_define_check_models"></block>
        <block type="face_reg_define_run_registration"></block>
        <block type="face_reg_run_main"></block>
        <block type="face_reg_param_group"></block>
        <block type="face_reg_param_source_image"></block>
        <block type="face_reg_param_register_name"></block>
        <block type="face_reg_create_instance"></block>
        <block type="face_reg_call_run_registration"></block>
    </category>
    `;
    console.log('[DEBUG face_registration.js] getFaceRegistrationToolbox 返回结果长度:', result.length);
    return result;
};

// 2. 默认初始积木：主程序 + 导入 + 类定义 + 运行入口
export const getFaceRegistrationStartBlocks = () => {
    return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="face_reg_main" x="50" y="50">
        <next>
          <block type="face_reg_import">
            <next>
              <block type="face_reg_define_class">
                <statement name="BODY">
                  <block type="face_reg_define_init">
                    <next>
                      <block type="face_reg_define_check_models">
                        <next>
                          <block type="face_reg_define_run_registration"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="face_reg_run_main">
                    <statement name="PARAMS_BODY">
                      <block type="face_reg_param_group">
                        <statement name="BODY">
                          <block type="face_reg_param_source_image">
                            <next>
                              <block type="face_reg_param_register_name"></block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </statement>
                    <statement name="RUN_BODY">
                      <block type="face_reg_create_instance">
                        <next>
                          <block type="face_reg_call_run_registration"></block>
                        </next>
                      </block>
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
};
