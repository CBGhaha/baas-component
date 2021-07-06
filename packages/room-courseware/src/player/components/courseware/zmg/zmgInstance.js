import store from '../../../../redux/store';
function userTransfrom(user) {
  const { id, name, avatar, userId, role } = user;
  return {
    userId: `${id || userId}`,
    role: role.toLowerCase(),
    avatar,
    name,
    mobile: `${id || userId}`
  };
}
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
    this.eventControllersInstance.controllers.zmgController.on('zmgMessage', (payload)=>{
      this.postMessage(payload);
    });
    this.eventControllersInstance.controllers.zmgController.on('respondHistory', (payload)=>{
      this.postMessage(payload.data);
    });
    this.eventControllersInstance.controllers.otherController.on('user_connect', isUpdate => {
      if (isUpdate && isUpdate.data) {
        this.setAddUsersInfo(isUpdate.data);
      }
    });
    this.eventControllersInstance.controllers.otherController.on('user_disconnect', isUpdate => {
      if (isUpdate && isUpdate.data) {
        this.setDelUsersInfo(isUpdate.data);
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
    if (action && kjType === 'zmg') {
      if (action === 'gameReady') {
        this.eventControllersInstance.send('zmgLoadSuccess');
        const zmlIframe = document.querySelector('.zmgIframe');
        this.zmlWindow = zmlIframe.contentWindow;
        this.setUserInfo();
        this.setUsersInfo();
        // this.setLessonInfo();
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
      data: { students: [userTransfrom(user)] }
    });
  }
  setDelUsersInfo(user) {
    console.log('setDelUsersInfo', user);
    this.postMessage({
      action: 'setDelUsersInfo',
      data: { students: [userTransfrom(user)] }
    });
  }
  setUserInfo() {
    const { userInfo } = store.getState();
    this.postMessage({
      action: 'setUserInfo',
      data: userTransfrom(userInfo)
    });
  }

  setLessonInfo() {
    const { userInfo: { lessonId, lessonName } } = store.getState();
    // const { lessonId, lessonName } = window.lessonInfo;
    this.postMessage({
      action: 'setLessonInfo',
      data: { lessonId, courseName: lessonName }
    });
  }
  // 设置当前zmg用户
  async setUsersInfo() {
    const users = await this.eventControllersInstance.send('current_user_connect');
    const { students, teacher, tutors } = users;
    const onlineStudents = Object.values(students).filter(user=>user.online);
    const allUser = (onlineStudents.concat([...tutors, teacher])).map(userTransfrom);
    this.postMessage({
      action: 'setAddUsersInfo',
      data: { students: allUser }
    });
    this.postMessage({
      action: 'setUsersInfo',
      data: { students: allUser }
    });
    this.postMessage({
      action: 'setSpliteUsersInfo',
      data: { students: Object.values(students).map(userTransfrom) }
    });
    // this.postMessage({
    //   action: 'setWatcherUserInfo',
    //   data: allUser.find(user=>user.role === 'tutor')
    // });

  }

  destroyed() {
    window.removeEventListener('message', this.handlerIframeMsg);

  }
}