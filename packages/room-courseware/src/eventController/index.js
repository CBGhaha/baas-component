import controllers from './controller/index';
import store from '../redux/store';
import commonAction from '../redux/actions/common';

class SocketControllers {
  controllers = controllers;
  acceptSignMap = {};
  sendSignMap = {};
  sendEventHandle = null;
  constructor(sendEventHandle, userInfo) {
    this.setUserInfo(userInfo);
    this.sendEventHandle = sendEventHandle;
    Object.keys(controllers).forEach(item=>{
      const $controller = controllers[item];
      $controller.setHandleSendEvent(sendEventHandle);
      const { acceptAction, sentAction } = $controller;
      if (acceptAction) {
        Object.keys(acceptAction).forEach(sign=>{
          this.acceptSignMap[sign] = [...(this.acceptSignMap[sign] || []), $controller];
        });
      }
      if (sentAction) {
        Object.keys(sentAction).forEach(sign=>{
          this.sendSignMap[sign] = $controller;
        });
      }
    });
  }
  setUserInfo(userInfo) {
    store.dispatch(commonAction('userInfo', userInfo));
  }
  async send(action, ... args) {
    if (this.sendSignMap[action]) {
      return await this.sendSignMap[action].send(action, ... args);
    }
    return false;

  }
  handleEventMsg = (msg) => {
    const { name } = msg;
    const $controllers = this.acceptSignMap[name];
    $controllers && $controllers.forEach((item)=>{
      item.handleEventMsg(msg);
    });
  }
  handleWebSocket(socket) {
    Object.values(controllers).forEach((controller) => {
      controller.mountEvent(socket);
    });
  }
}

export default SocketControllers;