import BaseBridge from './baseBridge';


function callbackCreator(exec) {
  return (res)=>{
    console.log('qt发送过来的原始数据：', res);
    const qtCefResponse = JSON.parse(res);
    // if (qtCefResponse.name === 'whiteboard_page' || qtCefResponse.name === 'flexible_blackboard_page') {
    //   const rightStr = qtCefResponse.data.replace(/\n/g, '\\n');
    //   qtCefResponse.data = rightStr;
    // }
    // qtCefResponse.data = JSON.parse(qtCefResponse.data);
    exec(qtCefResponse);
  };
}
export default class QtCefBridge extends BaseBridge {
  constructor() {
    super();
    this.bridgeType = 'qtCef';
    this.isQtCef = true;
  }
  init() {
    return new Promise((resolve) => {
      this.bridge = window.QCefClient;
      resolve(window.QCefClient);
      window.$QtBridge = this;
      this.sendTrackHoistry();
    });
  }
  receiveMessageFromQt(callback) {
    this.bridge.addEventListener('sendMessageToJs', callback);
  }
  sendMessageWithResponse(namespace, action, param) {
    return new Promise((resolve)=>{
      const localParam = {
        method: action,
        param: param,
        callback: callbackCreator(resolve),
        withoutCallback: 0
      };
      this.bridge.invokeMethodWhithCallback(namespace, localParam);
    });
  }
  sendMessageWithoutResponse(namespace, action, param) {
    const localParam = {
      method: action,
      param: param,
      callback: ()=>{},
      withoutCallback: 1
    };
    this.bridge.invokeMethodWhithCallback(namespace, localParam);
  }
}