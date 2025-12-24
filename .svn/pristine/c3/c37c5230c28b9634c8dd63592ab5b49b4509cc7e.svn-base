// 预置的 Blockly 布局：用于“简易版”页面加载时直接展示最小可运行示例

export const faceDetectionLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="face_import_init" x="50" y="50">
    <next>
      <block type="face_define_model_dict">
        <next>
          <block type="face_define_calc_conf">
            <next>
              <block type="face_define_detect_func">
                <next>
                  <block type="face_run_call_detect">
                    <statement name="BODY">
                      <block type="face_param_basic_lite">
                        <next>
                          <block type="face_call_detect"></block>
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
    </next>
  </block>
</xml>
`;

export const faceRegistrationLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="face_reg_import" x="50" y="50">
    <next>
      <block type="face_reg_define_core_lite">
        <next>
          <block type="face_reg_run_main">
            <statement name="PARAMS_BODY">
              <block type="face_reg_param_basic_lite"></block>
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
</xml>
`;

export const faceRecognitionLitePresetXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="face_recog_import" x="50" y="50">
    <next>
      <block type="face_recog_define_core_lite">
        <next>
          <block type="face_recog_run_main">
            <statement name="PARAMS_BODY">
              <block type="face_recog_param_basic_lite"></block>
            </statement>
            <statement name="RUN_BODY">
              <block type="face_recog_create_instance">
                <next>
                  <block type="face_recog_call_ensure_registered">
                    <next>
                      <block type="face_recog_call_recognize"></block>
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
</xml>
`;

