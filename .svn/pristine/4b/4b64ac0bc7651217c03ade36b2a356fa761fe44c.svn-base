export const getFaceDetectionToolbox = () => {
    const result = `
    <category name="人脸检测" colour="#4C9AFF">
      <block type="face_detect_main"></block>
      <block type="face_import_init"></block>
      <block type="face_define_model_dict"></block>
      <block type="face_define_calc_conf"></block>
      <block type="face_define_detect_func"></block>
      <block type="face_param_image"></block>
      <block type="face_param_group"></block>
      <block type="face_param_model"></block>
      <block type="face_param_min_conf"></block>
      <block type="face_param_neighbors"></block>
      <block type="face_param_scale"></block>
      <block type="face_param_min_size"></block>
      <block type="face_param_saturation"></block>
      <block type="face_run_call_detect"></block>
      <block type="face_call_detect"></block>
    </category>
  `;
    return result;
};

export const getFaceDetectionStartBlocks = () => {
    return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="face_detect_main" x="50" y="50">
        <next>
          <block type="face_import_init">
            <next>
              <block type="face_define_model_dict">
                <next>
                  <block type="face_define_calc_conf">
                    <next>
                      <block type="face_define_detect_func">
                        <next>
                          <block type="face_run_call_detect">
                            <statement name="BODY">
                              <block type="face_param_group">
                                <statement name="BODY">
                                  <block type="face_param_image">
                                    <next>
                                      <block type="face_param_model">
                                        <next>
                                          <block type="face_param_min_conf">
                                            <next>
                                              <block type="face_param_neighbors">
                                                <next>
                                                  <block type="face_param_scale">
                                                    <next>
                                                      <block type="face_param_min_size">
                                                        <next>
                                                          <block type="face_param_saturation"></block>
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
        </next>
      </block>
    </xml>
  `;
};