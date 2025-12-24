import { getFaceDetectionToolbox } from './face_detection';
import { getFaceRegistrationToolbox } from './face_registration';
import { getFaceRecognitionToolbox } from './face_recognition';

export default function (data) {
    console.log('[DEBUG new_face.js] 工具箱生成函数被调用, data:', data);
    let toolbox = '';

    if (data) {
        // 1. 人脸检测
        if (data.type === 'face_detect') {
            console.log('[DEBUG new_face.js] 匹配到 face_detect，调用 getFaceDetectionToolbox');
            toolbox = `${getFaceDetectionToolbox()} <sep></sep>`;
            console.log('[DEBUG new_face.js] face_detect 工具箱内容长度:', toolbox.length);
        }
        // 2. 人脸注册
        else if (data.type === 'face_register') {
            console.log('[DEBUG new_face.js] 匹配到 face_register，调用 getFaceRegistrationToolbox');
            toolbox = `${getFaceRegistrationToolbox()} <sep></sep>`;
            console.log('[DEBUG new_face.js] face_register 工具箱内容长度:', toolbox.length);
        }
        // 3. 人脸识别
        else if (data.type === 'face_recognize') {
            console.log('[DEBUG new_face.js] 匹配到 face_recognize，调用 getFaceRecognitionToolbox');
            toolbox = `${getFaceRecognitionToolbox()} <sep></sep>`;
            console.log('[DEBUG new_face.js] face_recognize 工具箱内容长度:', toolbox.length);
        }
        // 4. 兼容全流程
        else if (data.type === 'newface') {
            console.log('[DEBUG new_face.js] 匹配到 newface，生成全流程工具箱');
            toolbox = `
                <category name="人脸检测" colour="#4C9AFF">${getFaceDetectionToolbox()}</category>
                <category name="人脸注册" colour="#FFA500">${getFaceRegistrationToolbox()}</category>
                <category name="人脸识别" colour="#FF4500">${getFaceRecognitionToolbox()}</category>
                <sep></sep>`;
            console.log('[DEBUG new_face.js] newface 工具箱内容长度:', toolbox.length);
        } else {
            console.log('[DEBUG new_face.js] 未匹配到任何类型，data.type:', data.type);
        }
    } else {
        console.log('[DEBUG new_face.js] data 为空，返回空工具箱');
    }
    console.log('[DEBUG new_face.js] 最终返回工具箱（前200字符）:', toolbox.substring(0, 200));
    return toolbox;
};