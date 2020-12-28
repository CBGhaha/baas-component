import store from '../../../../redux/store';
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
    this.eventControllersInstance.controllers.whiteBoardController.on('zmgMessage', (payload)=>{
      this.postMessage(payload);
    });
    this.eventControllersInstance.controllers.whiteBoardController.on('respondHistory', (payload)=>{
      this.postMessage(payload.data);
    });
    this.eventControllersInstance.controllers.otherController.on('user_connect', isUpdate => {
      if (isUpdate && isUpdate.data) {
        this.setAddUsersInfo(isUpdate.data);
      }
    });
  }
  // 发送消息
  postMessage(payload) {
    // 未初始化成功时保存消息到缓存列表
    if (!this.zmlWindow) {
      console.log('zmg链路：发送给课件信息-缓存', payload);
      this.histroyMessage.push(payload);
    } else {
      this.zmlWindow.postMessage(payload, '*');
      console.log('zmg链路：发送给课件信息', payload);
    }
  }

  // 接受zml iframe发送来的消息
  handlerIframeMsg = async ({ data }) => {
    const { action, kjType, data: value } = data;
    if (action && kjType && kjType !== 'zml') {
      console.log('zmg消息:', action, data);
      if (action === 'gameReady') {
        this.eventControllersInstance.send('zmgLoadSuccess');
        const zmlIframe = document.querySelector('.zmgIframe');
        this.zmlWindow = zmlIframe.contentWindow;
        this.setUserInfo();
        this.setUsersInfo();
        if (this.histroyMessage.length) {
          this.histroyMessage.forEach((item)=>{
            this.postMessage(item);
          });
          this.histroyMessage = [];
        }
      } else if (action === 'getHistory') {
        this.eventControllersInstance.send('zmgGetHistory', data);
      } else {
        this.eventControllersInstance.send('zmg_data', data);
      }
    }
  }
  setSpliteUsersInfo() {

  }
  setAddUsersInfo(user) {
    this.postMessage({
      action: 'setAddUsersInfo',
      data: { students: [{ ...user, role: user.role.toLowerCase(), mobile: `${user.id}`, userId: `${user.id}` }] }
    });
  }

  setUserInfo() {
    const { userInfo } = store.getState();
    this.postMessage({
      action: 'setUserInfo',
      data: { ...userInfo, role: userInfo.role.toLowerCase(), mobile: `${userInfo.id}`, userId: `${userInfo.id}` }
    });
  }

  // 设置当前zmg用户
  async setUsersInfo() {
    const users = await this.eventControllersInstance.send('current_user_connect');
    const { students, teacher, tutors } = users;
    const allUser = (Object.values(students).concat([...tutors, teacher])).map(user=>({ ... user, role: user.role.toLowerCase(), mobile: user.userId, id: user.userId }));
    this.postMessage({
      action: 'setAddUsersInfo',
      data: { students: allUser }
    });
    this.postMessage({
      action: 'setSpliteUsersInfo',
      data: { students: allUser.filter(user=>user.role === 'student') }
    });
  }

  destroyed() {
    window.removeEventListener('message', this.handlerIframeMsg);

  }
}