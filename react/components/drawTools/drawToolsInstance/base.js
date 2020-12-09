import { zmSketchPad } from 'zmSketchpad';
import store from '../../..//redux/store';

function drawingCb(data) {
  console.log('drawingCb:', data);
}

export default class Base {
  static zmSketchInstance = null;
  timer = null;
  id = null;
  isbush = false;
  lastSendData = [];
  bushTimer = null;
  eventControllersInstance;
  constructor(dom, signalType, dataPipe, eventControllersInstance) {
    this.signalType = signalType;
    this.dataPipe = dataPipe;
    this.handleSendMassage = this.handleSendMassage.bind(this);
    this.eventControllersInstance = eventControllersInstance;
    if (Base.zmSketchInstance) {
      return Base.zmSketchInstance;
    }

    this.init(dom);
  }
  init(dom) {
    const { userInfo } = store.getState();
    if (userInfo.role !== USER_TYPE.student) {
      Base.zmSketchInstance = Object.freeze(zmSketchPad(dom, this.handleSendMassage, null, { disableScaleStage: true, drawingProcessCb: drawingCb }));
    } else {
      Base.zmSketchInstance = Object.freeze(zmSketchPad(dom, () => {}));
    }
    window.addEventListener('resize', this.handleWindowResize);
  }
  // 白板宽高自适应
  handleWindowResize() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Base.zmSketchInstance.canvas.resizeDetail();
    }, 500);
  }

  // 发送白板消息
  handleSendMassage(data) {
    const action = data[3];
    // hack 转译符会造成解析出错 采用｜替换
    if (action === 'text_edit') {
      data[6][1] = data[6][1].replace(/\\/g, '|');
    }
    this.sendData(data);

    if (data.length === 7) {
      this.isbush = action === 'brush';
      if (this.lastSendData.length === 3) {
        this.compensation();
        if (this.bushTimer) clearTimeout(this.bushTimer);
      }
    }
    if (this.isbush) {
      this.lastSendData = data;
      if (this.bushTimer) clearTimeout(this.bushTimer);
      this.bushTimer = setTimeout(()=>{
        this.compensation();
      }, 10000);
    }
  }
  // 丢失结束画笔的补偿机制
  compensation() {
    if (this.lastSendData.length > 0) this.sendData([...this.lastSendData, true]);
    this.lastSendData = [];
  }
  sendData(data) {
    this.dataPipe ? this.dataPipe(data) : this.eventControllersInstance.controllers.whiteBoardController.send(this.signalType, data);
  }
  showLayerById(wbLayerId) {
    this.id = wbLayerId;
    if (this.bushTimer) clearTimeout(this.bushTimer);
    this.lastSendData = [];
    Base.zmSketchInstance.canvas.canvasaction.drawOuterStage();
    Base.zmSketchInstance.canvas.showLayerById(wbLayerId);
  }
  handleScroll(height) {
    Base.zmSketchInstance.canvas.stage.y(-height);
    Base.zmSketchInstance.canvas.stage.draw();
  }
  destroyed() {
    window.removeEventListener('resize', this.handleWindowResize);
    Base.zmSketchInstance = null;
  }
  pushDataToLayer(data, pageId) {
    Base.zmSketchInstance.canvas.pushDataToLayer(data, pageId || this.id);
  }

}