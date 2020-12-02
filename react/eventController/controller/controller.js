import EventEmitter from 'eventemitter3';

export default class Controller extends EventEmitter {
  controllerName = '';
  acceptAction = {};
  sentAction = {};
  socket = null;
  constructor(controllerName, acceptAction, sentAction) {
    super();
    this.controllerName = controllerName;
    this.acceptAction = acceptAction || {};
    this.sentAction = sentAction || {};
    this.send = this.send.bind(this);
  }

  // 挂载接受socket消息事件
  mountEvent(socket) {
    this.socket = socket;
    Object.keys(this.acceptAction).forEach((event) => {
      const action = this.acceptAction[event];
      socket.on(event, async(... data) => {
        const playload = action ? await action(this, ... data) : data;
        this.emit(event, { data: playload });
      });
    });
  }

  setHandleSendEvent = (sendEventHandle)=>{
    console.log('setHandleSendEvent', sendEventHandle);
    this.sendEventHandle = sendEventHandle;
  }

  // 处理qt发送来的消息
  async handleEventMsg(msg) {
    const { name, data } = msg;
    const action = this.acceptAction[name];
    if (action) {
      console.log('%c socket- receive:', 'color:#FF8C00', name, data);
      const playload = await action(this, data);
      this.emit(name, { data: playload });
    }
  }

  // 发送
  async send(event, ... args) {
    const res = await this.emitSocket(event, ... args);
    const action = this.sentAction[event];
    let $actionRes ;
    // 发送后的数据结果处理
    if (action) {
      $actionRes = await action(this, res);
    }
    return $actionRes !== undefined ? $actionRes : res;
  }

  // promise化
  emitSocket(event, ... arg) {
    console.log('%c socket- request:', 'color:green', event, arg);
    return new Promise((resolve) => {
      this.sendEventHandle(event, arg, (res)=>{
        console.log('%c socket-response:', 'color:blue', event, res);
        resolve(res);
      });
    });
  }
}