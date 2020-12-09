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
    this.sendEventHandle = sendEventHandle;
  }

  // 处理qt发送来的消息
  async handleEventMsg(msg) {
    const { name, data } = msg;
    const action = this.acceptAction[name];
    if (action) {
      console.log('%c player- receive:', 'color:#00FFFF', name, data);
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
    console.log('%c player-request:', 'color:#FFD700', event, arg);
    return new Promise((resolve) => {
      this.sendEventHandle(event, arg, (res)=>{
        console.log('%c player-response:', 'color:#8A2BE2', event, res);
        resolve(res);
      });
    });
  }
}