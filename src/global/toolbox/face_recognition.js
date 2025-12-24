import '@/blocks/NewFace/face_recognition_blocks';
import '@/blocks/NewFace/face_recognition_generators';

// 1. 左侧工具箱菜单
export const getFaceRecognitionToolbox = () => {
    console.log('[DEBUG face_recognition.js] getFaceRecognitionToolbox 被调用');
    const result = `
    <category name="人脸识别" colour="#9B59B6">
        <block type="face_recog_main"></block>
        <block type="face_recog_import"></block>
        <block type="face_recog_define_class"></block>
        <block type="face_recog_define_init"></block>
        <block type="face_recog_define_check_models"></block>
        <block type="face_recog_define_get_feature"></block>
        <block type="face_recog_define_ensure_registered"></block>
        <block type="face_recog_define_recognize"></block>
        <block type="face_recog_run_main"></block>
        <block type="face_recog_param_group"></block>
        <block type="face_recog_param_register_img"></block>
        <block type="face_recog_param_register_name"></block>
        <block type="face_recog_param_check_img"></block>
        <block type="face_recog_param_match_threshold"></block>
        <block type="face_recog_param_color_match"></block>
        <block type="face_recog_param_color_unknown"></block>
        <block type="face_recog_create_instance"></block>
        <block type="face_recog_call_ensure_registered"></block>
        <block type="face_recog_call_recognize"></block>
    </category>
    `;
    console.log('[DEBUG face_recognition.js] getFaceRecognitionToolbox 返回结果长度:', result.length);
    return result;
};

// 2. 默认初始积木：主程序 + 导入 + 类定义 + 运行入口
export const getFaceRecognitionStartBlocks = () => {
    return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="face_recog_main" x="50" y="50">
        <next>
          <block type="face_recog_import">
            <next>
              <block type="face_recog_define_class">
                <statement name="BODY">
                  <block type="face_recog_define_init">
                    <next>
                      <block type="face_recog_define_check_models">
                        <next>
                          <block type="face_recog_define_get_feature">
                            <next>
                              <block type="face_recog_define_ensure_registered">
                                <next>
                                  <block type="face_recog_define_recognize"></block>
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
                  <block type="face_recog_run_main">
                    <statement name="PARAMS_BODY">
                      <block type="face_recog_param_group">
                        <statement name="BODY">
                          <block type="face_recog_param_register_img">
                            <next>
                              <block type="face_recog_param_register_name">
                                <next>
                                  <block type="face_recog_param_check_img">
                                    <next>
                                      <block type="face_recog_param_match_threshold">
                                        <next>
                                          <block type="face_recog_param_color_match">
                                            <next>
                                              <block type="face_recog_param_color_unknown"></block>
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
        </next>
      </block>
    </xml>
    `;
};

