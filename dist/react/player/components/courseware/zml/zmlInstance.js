import { APP_ID } from '@/config';
// import QtBridge from '@zm-youke/qt-bridge';
import store from '@/redux/store';
import { isAudience } from '@/utils/index';
import { ZML_ORIGIN_LIST } from '@/config';
import commonAction from '@/redux/actions/common';

// import { getVideoDisable } from '../../../api';
export default class ZmInstance {
  zmlUrl='';
  zmlWindow = null;
  handleMessage = null;
  eventControllersInstance = {};
  isReady = false;
  isDataReady = false;
  readyTime = 0;
  mountedTime = 0;
  histroyMessage= [];
  chekckoutDeadline = null;
  constructor(url, handleMessage, eventControllersInstance) {
    this.eventControllersInstance = eventControllersInstance;
    this.zmlUrl = url;
    this.handleMessage = handleMessage;
    this.mountedTime = new Date().getTime();
    this.histroyMessage = [];
    this.handlerIframeMsg = this.handlerIframeMsg.bind(this);
    this.setZmlUserGroup = this.setZmlUserGroup.bind(this);
    this.heightRatio = 0;
    this.scrollRatio = 0;
    this.timer = null;
    window.addEventListener('message', this.handlerIframeMsg);
    this.eventControllersInstance.controllers.otherController.on('user_connect', isUpdate => {if (isUpdate && isUpdate.data) {this.setZmlUserGroup();}});
    this.eventControllersInstance.controllers.whiteBoardController.on('zmlMessage', (payload)=>{
      const { action, data: { operation } } = payload;
      const { userInfo: { role } } = store.getState();
      // 处理zml的答题消息
      if (action === 'questionOperation') {
        const isDoAnswer = operation && operation.doAnswer;
        if (role === USER_TYPE.teacher) {
          this.sendIsAnsweringToQt(!!isDoAnswer, payload.data);
        } else if (role === USER_TYPE.tutor) {
          payload.data = {};
        }
        store.dispatch(commonAction('isZmlExaming', !!isDoAnswer));
      }

      // 处理zml的内容滚动

      if (action === 'scrollTop' && isAudience()) {
        this.scrollRatio = payload.data.scrollRatio;
        if (this.heightRatio) {
          this.eventControllersInstance.controllers.whiteBoardController.emit('drawtoolScroll', { ...payload.data, heightRatio: this.heightRatio });
        }
      }
      this.postMessage(payload);
    });
    this.checkoutZmlLoadSuccess();
  }
  // 发送消息
  postMessage(payload) {
    // 未初始化成功时保存消息到缓存列表
    if (!this.zmlWindow) {
      this.histroyMessage.push(payload);
    } else {
      this.zmlWindow.postMessage(payload, '*');
      console.log('课件链路：发送给课件信息', payload);
    }
  }
  // 初始化
  setZmlInitialize() {
    const { userInfo } = store.getState();
    const { firstName, id } = userInfo;
    const version = zmLocalStorage.setVersion;
    const trackData = {
      appId: APP_ID,
      appVersion: version,
      deviceId: '',
      userId: id,
      // lessonUid: lessonId,
      lessonType: 'regular-lesson',
      classScale: 'CLASS_OPEN',
      courseBuType: 'ZM_UKE',
      coursewareCategory: 3,
      coursewareBuType: 'ZM_UKE',
      sessionId: ''
    };

    const data = {
      // setPagesUrl: JSON.stringify({ url: 'https://image.zmlearn.com/lecture/product/zml/courseware_13519_2.json#13519.3' }),
      setPagesUrl: JSON.stringify({ url: this.zmlUrl }),
      setUserInfo: {
        avatar: '',
        ... userInfo,
        name: firstName,
        sid: id
      },
      setTrackData: trackData
    };
    const status = this.zmlUrl ? 0 : -1;
    this.postMessage({
      action: 'initialize',
      status,
      data
    });
  }
  // 翻页
  setPageNo(num) {
    this.postMessage({ action: 'showPage', data: num });
  }
  // 获取课件中所有视频
  getAllVideo() {
    this.postMessage({ action: 'getMediaData' });
  }
  // 设置当前zml用户组
  async setZmlUserGroup() {
    const { userInfo: { role } } = store.getState();
    if (role !== USER_TYPE.tutor) {
      const { studentsMap } = store.getState();
      if (studentsMap) {
        const students = Object.values(studentsMap).map(user=>({ ... user, sid: user.userId, id: user.userId }));
        this.postMessage({
          action: 'setUsersInfo',
          data: { students }
        });
      }
    }
  }

  // 课件滚动
  handleScroll(data) {
    this.postMessage({ action: 'mockScroll', data });
  }

  sendIsAnsweringToQt(state, payload) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      const data = { state, data: state ?
        [0, 0, -1, 'zmlMessage', ['questionOperation', { ...payload, operation: {
          doAnswer: false,
          hasAnswered: true,
          notShowModal: false,
          showAnswer: false,
          tag: 'doAnswer'
        } }]] : null };
      // console.log('sendIsAnsweringToQt', data);
      // QtBridge.sendCommonMsgToQt({ event: 'zmlIsDoAnswer', data });
    }, 100);

  }
  // 接受zml iframe发送来的消息
  handlerIframeMsg = async ({ data }) => {
    const { action, data: value } = data;
    if (action === 'setHeightRatio') {
      this.heightRatio = value;
      if (this.scrollRatio) {
        this.eventControllersInstance.controllers.whiteBoardController.emit('drawtoolScroll', { scrollRatio: this.scrollRatio, heightRatio: this.heightRatio });
      }
    }
    // 课件准备完毕
    if (action === 'ready') {
      const zmlIframe = document.querySelector('#iframeId');
      this.zmlWindow = zmlIframe.contentWindow;
      this.setZmlInitialize();
      if (!this.isReady) {
        this.isReady = true;
      }
    }

    // zml总页数
    if (action === 'returnPageNumber') {
      this.handleMessage({ action: 'pageNumber', data: value });
      this.eventControllersInstance.send('zmlCoursePageTotal', value);
    }

    // 数据加载完毕
    if (action === 'dataReady') {
      this.chekckoutDeadline && clearTimeout(this.chekckoutDeadline);
      console.log('课件链路：zml-dataReady');
      await this.eventControllersInstance.send('current_user_connect');
      this.setZmlUserGroup();
      // 发送获取所有zml中的视频
      this.getAllVideo();
      // 发送缓存列表里的消息
      if (this.histroyMessage.length) {
        this.histroyMessage.forEach((item)=>{
          this.postMessage(item);
        });
        this.histroyMessage = [];
      }

      if (!this.isDataReady) {
        this.isDataReady = true;
      }
    }

    // 答题相关操作
    if (action === 'questionOperation') {
      const opt = [0, 0, -1, 'zmlMessage', ['questionOperation', value]];
      const { operation: { doAnswer } } = value;
      this.sendIsAnsweringToQt(!!doAnswer, value);
      this.eventControllersInstance.send('whiteboard_data', opt);
    }

    // zml所有视频
    if (action === 'returnMediaData') {
      let zmlMedia = value;
      // 是否可以使用声网视频播放器的开关
      const videoDisable = true;
      if (value && value.length > 0 && !videoDisable) {
        zmlMedia = value.map(item=>{
          if (item && item.length > 0) {
            return item.filter(i=>i.type !== 'video');
          } else {
            return item;
          }
        });
      }
      window.zmlAllVideo = zmlMedia;
      this.eventControllersInstance.controllers.whiteBoardController.emit('zml_all_video', zmlMedia);
    }

    // 课件的可点击区域
    if (action === 'sendInteractionArea') {
      const areas = (value && value.interactionArea) || [];
      store.dispatch(commonAction('zmlCoverEleList', areas.map(item=> ({ ...item, handleClick: (data)=>{
        this.postMessage({ action: 'mockClick', data });
      } })
      )));
    }

    // 课件产生滚动
    if (action === 'scrollTop') {
      const opt = [0, 0, -1, 'zmlMessage', ['scrollTop', value]];
      this.eventControllersInstance.send('whiteboard_data', opt);
      this.scrollRatio = value.scrollRatio;
      this.eventControllersInstance.controllers.whiteBoardController.emit('drawtoolScroll', { ...value, heightRatio: this.heightRatio });
    }
    if (action === 'sendClickAnswerDetail') {
      const opt = [0, 0, -1, 'zmlMessage', ['sendClickAnswerDetail', value]];
      this.eventControllersInstance.send('whiteboard_data', opt);
    }
  }
  checkoutZmlLoadSuccess() {
    // 进行zml课件加载失败的兜底重加载
    this.chekckoutDeadline && clearTimeout(this.chekckoutDeadline);
    this.chekckoutDeadline = setTimeout(()=>{
      console.log('进行zml课件加载失败的兜底重加载');
      this.eventControllersInstance.send('zmlLoadfail');
    }, 90 * 1000);
  }

  destroyed() {
    window.removeEventListener('message', this.handlerIframeMsg);
    this.chekckoutDeadline && clearTimeout(this.chekckoutDeadline);
  }
}