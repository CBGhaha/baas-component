// import useRouter from '../hooks/useRouter';
import controllersCreator from './controller/index';

// 消息通信的contorller实例


class SocketControllers {
  controllers = controllersCreator();// 所有子controlerr(按业务模块划分)
  acceptSignMap = {}; // 已注册的接受消息事件的map
  sendSignMap = {}; // 已注册的发送消息事件的map
  sendEventHandle = null; // 处理发送数据的函数
  $store = null; // 当前的store实例
  chatUtilsInstance = {};
  constructor(sendEventHandle, store) {
    this.$store = store;
    this.sendEventHandle = sendEventHandle;
    Object.keys(this.controllers).forEach(item=>{

      const $controller = this.controllers[item];

      $controller.parent = this;
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

  setChatUtilsInstance = (instance) => {
    this.chatUtilsInstance = instance;
  }
  // 向消息来源发送数据 （数据来源可能是socket、qt、web、其他）
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