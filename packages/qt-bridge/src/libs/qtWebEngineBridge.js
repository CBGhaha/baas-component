import BaseBridge from './baseBridge';
const NEED_REPLACE_CHAR_NAME = ['whiteboard_page', 'flexible_blackboard_page', 'doorexam_question_detail#1.15.0', 'doorexam_question_detail', 'doorexam_get_student_answer'];

export default class QtWebEngineBridge extends BaseBridge {
  constructor() {
    super();
    this.bridgeType = 'qtWebEngine';
    this.messageUuidMap = new Map();
    this.isQtWebEngine = true;
  }
  init() {
    return new Promise((resolve) => {
      new QWebChannel(qt.webChannelTransport, (channel) => {
        window.bridge = this.bridge = channel.objects.QBridge;
        window.$QtBridge = this;

        this.bridge.classin_socket.connect((res) => {
          const qtWebEnginResponse = JSON.parse(res);
          if (NEED_REPLACE_CHAR_NAME.includes(qtWebEnginResponse.name)) {
            const rightStr = qtWebEnginResponse.data.replace(/\n/g, '\\n');
            qtWebEnginResponse.data = rightStr;
          }
          qtWebEnginResponse.data = JSON.parse(qtWebEnginResponse.data);
          if (qtWebEnginResponse && this.messageUuidMap.has(qtWebEnginResponse.uuid)) {
            const resultExec = this.messageUuidMap.get(qtWebEnginResponse.uuid);
            resultExec(qtWebEnginResponse.data);
            this.messageUuidMap.delete(qtWebEnginResponse.uuid);
          }
        });
        resolve(channel);
        this.sendTrackHoistry();
      });
    });
  }
  receiveMessageFromQt(callback) {
    window.sendMessageToJs = callback;
  }
  sendMessageWithResponse(namespace, action, param) {
    return new Promise((resolve)=>{
      const $uuid = generateUUID();
      const localParam = {
        method: action,
        param: param,
        uuid: $uuid,
        withoutCallback: 0
      };
      this.messageUuidMap.set($uuid, (result)=>{resolve(result);});
      const params = JSON.stringify(localParam);
      this.bridge.invokeMethodWhithCallback(namespace, params);
    });
  }
  sendMessageWithoutResponse(namespace, action, param) {
    const $uuid = generateUUID();
    const localParam = {
      method: action,
      param: param,
      uuid: $uuid,
      withoutCallback: 1
    };
    const params = JSON.stringify(localParam);
    this.bridge.invokeMethodWhithCallback(namespace, params);
  }
}

export function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}