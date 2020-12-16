import { APP_ID } from '../../../../config';
import store from '../../../../redux/store';
import { isAudience } from '../../../../utils/index';
import commonAction from '../../../../redux/actions/common';
export default class Zmgnstance {
  zmlWindow = null;
  handleMessage = null;
  eventControllersInstance = {};
  histroyMessage= [];
  chekckoutDeadline = null;
  constructor(handleMessage, eventControllersInstance) {
    this.eventControllersInstance = eventControllersInstance;
    this.handleMessage = handleMessage;
    this.handlerIframeMsg = this.handlerIframeMsg.bind(this);
    window.addEventListener('message', this.handlerIframeMsg);
  }
  // 发送消息
  postMessage(payload) {
    // 未初始化成功时保存消息到缓存列表
    if (!this.zmlWindow) {
      console.log('课件链路：发送给课件信息-缓存', payload);
      this.histroyMessage.push(payload);
    } else {
      this.zmlWindow.postMessage(payload, '*');
      console.log('课件链路：发送给课件信息', payload);
    }
  }

  // 接受zml iframe发送来的消息
  handlerIframeMsg = async ({ data }) => {
    const { action, data: value } = data;
    console.log('handlerIframeMsg:', data, action, value);
  }

  destroyed() {
    window.removeEventListener('message', this.handlerIframeMsg);

  }
}