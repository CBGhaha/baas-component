import { APP_ID } from '../../../../config';
import store from '../../../../redux/store';
import commonAction from '../../../../redux/actions/common';
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
  constructor(url, handleMessage, eventControllersInstance, coursewareId) {
    this.eventControllersInstance = eventControllersInstance;
    this.zmlUrl = url;
    this.coursewareId = coursewareId;
    this.handleMessage = handleMessage;
    this.mountedTime = new Date().getTime();
    this.histroyMessage = [];
    this.handlerIframeMsg = this.handlerIframeMsg.bind(this);
    this.setZmlUserGroup = this.setZmlUserGroup.bind(this);
    this.heightRatio = 0;
    this.scrollRatio = 0;
    this.timer = null;
    this.isAnswerData = null;
    window.addEventListener('message', this.handlerIframeMsg);
    this.eventControllersInstance.controllers.otherController.on('user_connect', isUpdate => {if (isUpdate && isUpdate.data) {this.setZmlUserGroup();}});
    this.eventControllersInstance.controllers.whiteBoardController.on('zmlMessage', (payload)=>{
      const { action, data: { operation, role: zmlRole, questionId } } = payload;
      const { userInfo: { role } } = store.getState();
      // 处理zml的答题消息
      if (action === 'questionOperation') {
        const isDoAnswer = operation && operation.doAnswer;
        if (role === PLAYER_USER_TYPE.teacher && zmlRole !== 'student') {
          this.sendIsAnsweringToQt(!!isDoAnswer, payload.data);
        } else if (role === PLAYER_USER_TYPE.tutor) {
          payload.data = {};
        }
        // 通知qt学生已经完成作答
        if (role === PLAYER_USER_TYPE.student && zmlRole === 'student') {
          console.log('学生已经答过题了');
          this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'studentZmlQuestionDone', data: { questionId } } });
        }
        store.dispatch(commonAction('isZmlExaming', !!isDoAnswer));
      }

      // 处理zml的内容滚动

      if (action === 'scrollTop' && role !== PLAYER_USER_TYPE.teacher) {
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
      console.log('课件链路：发送给课件信息-缓存', payload);
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
    const zmlIframe = document.getElementsByClassName('zmlIframe')[0];
    zmlIframe.contentWindow.postMessage({
      action: 'initialize',
      status,
      data
    }, '*');
  }
  // 翻页
  setPageNo(num) {
    console.log('课件链路：发送给课件信息-翻页', num);
    // if (this.isAnswerData && this.isAnswerData.state && this.isAnswerData.data[4]) {
    //   console.log('课件链路：发送给课件信息-补偿结束答题', num);
    //   const [action, data] = this.isAnswerData.data[4];
    //   this.postMessage({ action, data });
    // }
    this.postMessage({ action: 'showPage', data: num });
  }
  // 获取课件中所有视频
  getAllVideo() {
    this.postMessage({ action: 'getMediaData' });
  }
  // 设置当前zml用户组
  async setZmlUserGroup(bool) {
    if (bool) await this.eventControllersInstance.send('current_user_connect');
    const { userInfo: { role } } = store.getState();
    if (role !== PLAYER_USER_TYPE.tutor) {
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
    this.isAnswerData = { state, data: state ?
      [0, 0, -1, 'zmlMessage', ['questionOperation', { ...payload, operation: {
        doAnswer: false,
        hasAnswered: true,
        notShowModal: false,
        showAnswer: false,
        tag: 'doAnswer'
      } }]] : null };
    this.timer = setTimeout(()=>{
      this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'zmlIsDoAnswer', data: this.isAnswerData } });
    }, 100);

  }
  // 接受zml iframe发送来的消息
  handlerIframeMsg = async ({ data }) => {
    const { action, kjType, data: value } = data;
    if (!action || kjType === 'zmg') return;
    if (action === 'setHeightRatio') {
      this.heightRatio = value;
      if (this.scrollRatio) {
        this.eventControllersInstance.controllers.whiteBoardController.emit('drawtoolScroll', { scrollRatio: this.scrollRatio, heightRatio: this.heightRatio });
      }
    }
    // 课件准备完毕
    if (action === 'ready') {
      this.setZmlInitialize();
      if (!this.isReady) {
        this.readyTime = new Date().getTime();
        const time = this.readyTime - this.mountedTime;
        this.eventControllersInstance.send('playerTrackEvent', { eventId: 'COURSEWARE_ZML_READY', eventParam: { time } });
        this.eventControllersInstance.send('playerTrackEvent', { eventId: 'ZML_READY', eventParam: { success: true, interval: time, host: this.zmlUrl } });
        this.isReady = true;
      }
      return;
    }

    // zml总页数
    if (action === 'returnPageNumber') {
      this.handleMessage({ action: 'pageNumber', data: value });
      this.eventControllersInstance.send('QtAction', { action: 'zmlCoursePageTotal', data: value });
      this.eventControllersInstance.send('zmlCoursePageTotal', value);
      return;
    }

    // 数据加载完毕
    if (action === 'dataReady') {
      const zmlIframe = document.getElementsByClassName('zmlIframe')[0];
      this.zmlWindow = zmlIframe.contentWindow;
      this.chekckoutDeadline && clearTimeout(this.chekckoutDeadline);
      console.log('课件链路：zml-dataReady', this.histroyMessage);
      // 发送获取所有zml中的视频
      this.getAllVideo();
      this.setZmlUserGroup(true);
      // 发送缓存列表里的消息
      if (this.histroyMessage.length) {
        this.histroyMessage.forEach((item)=>{
          this.postMessage(item);
        });
        this.histroyMessage = [];
      }

      if (!this.isDataReady) {
        const now = new Date().getTime();
        const time = now - this.readyTime;
        this.eventControllersInstance.send('playerTrackEvent', { eventId: 'COURSEWARE_ZML_DATAREADY', eventParam: { time } });
        this.eventControllersInstance.send('playerTrackEvent', { eventId: 'ZML_DATAREADY', eventParam: { success: true, interval: time, host: this.zmlUrl } });
        this.isDataReady = true;
      }
      this.eventControllersInstance.send('zmlLoadSuccess');
      return;
    }

    // 答题相关操作
    if (action === 'questionOperation') {
      const opt = [0, 0, -1, 'zmlMessage', ['questionOperation', value]];
      const { operation: { answer, doAnswer }, questionId, role: zmlRole } = value;
      const { userInfo: { role } } = store.getState();
      // 通知qt选择题答题结束
      if (value.questionTypeName !== '填空题') {
        if (this.isAnswerData && this.isAnswerData.state && !doAnswer) {
          console.log('zml的选择题结束答题了');
          this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'endZmlSingleQuestion', data: { questionId } } });
        }
      }
      // 通知qt学生已经作答
      if (role === PLAYER_USER_TYPE.student && zmlRole === 'student') {
        console.log('学生已经答过题了');
        this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'studentZmlQuestionDone', data: { questionId } } });
      }

      this.sendIsAnsweringToQt(!!doAnswer, value);
      if (answer && answer.length) {
        this.eventControllersInstance.send('playerTrackEvent', { eventId: 'ZML_ANSWER_SUBMIT', ukeEventId: `${questionId}` });
      }
      this.eventControllersInstance.send('whiteboard_data', opt);
      return;
    }

    // zml所有视频
    if (action === 'returnMediaData') {
      let zmlMedia = value;
      // 是否可以使用声网视频播放器的开关
      const res = await this.eventControllersInstance.send('getVideoDisable');
      const videoDisable = res && res.config.items.openVideoPlayer == 'true';
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
      return;
    }

    // 课件的可点击区域
    if (action === 'sendInteractionArea') {

      const areas = (value && value.interactionArea) || [];
      console.log('课件areas：', areas);
      store.dispatch(commonAction('zmlCoverEleList', areas.map(item=> ({ ...item, handleClick: (data)=>{
        this.postMessage({ action: 'mockClick', data });
      } })
      )));
      return;
    }

    // 课件产生滚动
    if (action === 'scrollTop') {
      const opt = [0, 0, -1, 'zmlMessage', ['scrollTop', value]];
      this.eventControllersInstance.send('whiteboard_data', opt);
      this.scrollRatio = value.scrollRatio;
      this.eventControllersInstance.controllers.whiteBoardController.emit('drawtoolScroll', { ...value, heightRatio: this.heightRatio });
      return;
    }
    if (action === 'sendClickAnswerDetail') {
      const opt = [0, 0, -1, 'zmlMessage', ['sendClickAnswerDetail', value]];
      this.eventControllersInstance.send('whiteboard_data', opt);
      this.eventControllersInstance.send('playerTrackEvent', { eventId: 'CLASSROOM_COMPLETION_ANSWER_DETAILS', eventParam: {} });
      return;
    }
    if (action === 'showPageIndex') {
      this.setPageNo(value);
      this.eventControllersInstance.send('QtAction', { action: 'pptSwitchPage', data: { id: this.coursewareId, pageNo: value } });
      this.eventControllersInstance.send('playerTrackEvent', { eventId: 'ZBJ_ZML_DJML', eventParam: { pageNo: value } });
    }
    if (action === 'toggleShowSideBar') {
      this.eventControllersInstance.send('playerTrackEvent', { eventId: value ? 'ZBJ_ZML_ZKML' : 'ZBJ_ZML_SQML', eventParam: {} });
    }
    if (action) {
      const opt = [0, 0, -1, 'zmlMessage', [action, value]];
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