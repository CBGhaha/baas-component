export default class CommonBridge {
  constructor() {
    this.bridge = null;
    this.bridgeType = '';
  }
  sendTrackHoistry() {
    if (window.jsErrorQuque && window.jsErrorQuque.length) {
      window.jsErrorQuque.forEach(exe => {
        exe();
      });
    }
  }
  sendMessageToQt = (action, data) => {
    if (this.bridge) {
      console.log('bridge sendMessageToQt:', action, data);
      this.bridge.invokeMethod('sendMessageToQt', action, data || '');
    } else {
      console.warn('bridge未注册:', action, data);
    }
  }
  onDragAreaMouseDown = () => {
    this.sendMessageToQt('onDragAreaMouseDown');
  }
  // 登录成功向qt传用户信息
  loginSuccess = (userInfo) => {
    this.sendMessageToQt('loginSuccess', userInfo);
  }
  // 关闭窗口
  close = ()=> {
    this.sendMessageToQt('close');
  }
  // 窗口最小化
  minimize = ()=> {
    this.sendMessageToQt('minimize');
  }
  // 窗口最大化
  maximize = ()=> {
    this.sendMessageToQt('maximize');
  }
  // 进入课堂
  enterClassin = (classInfo) => {
    this.sendMessageToQt('enterClassin', classInfo);
  }
  // 退出登录
  logout =()=> {
    this.sendMessageToQt('logout');
  }
  // 获取zml地址param: ['', '', '', ], callback
  getZmlUrl = (param) => {
    this.sendMessageToQt('getZmlUrl', JSON.stringify(param)); // {name: 'getZmlUrl', data: {}}
  }
  // 护眼模式  status: '1'/'0'
  eyeshield = (status) => {
    this.sendMessageToQt('eyeshield', status);
  }
  // 用默认浏览器打开页面 url: http[s]://www.zhangmenyouke.com
  openUrlWithBrowser = (url) => {
    this.sendMessageToQt('openUrlWithBrowser', JSON.stringify({
      url: url
    }));
  }
  // 打开设备测试
  deviceTest = ()=> {
    this.sendMessageToQt('openSetting', JSON.stringify({
      type: 'deviceTest'
    }));
  }
  // 关于优课
  about = ()=> {
    this.sendMessageToQt('openSetting', JSON.stringify({
      type: 'about'
    }));
  }
  // 打开回放
  openReplay = (param) => {
    this.sendMessageToQt('replay', JSON.stringify(param));
  }
  // 关闭回放
  openReplayClose = () => {
    this.sendMessageToQt('replayClose');
  }
  // 截屏及上传至工单
  screenShot = () => {
    this.sendMessageToQt('screenShot');
  }

  // 聊天截图 param: { role: 'all' | 'tutor' | 'teacher', showClassin : true | false }
  // 发给 所有人， 班主任，讲师
  // 截图 是否隐隐藏 我们应用窗口
  chatScreenShot = (param) => {
    this.sendMessageToQt('chatScreenShot', JSON.stringify(param));
  }
  // 图片查看  param: {url: ''}
  previewImage = (param) => {
    this.sendMessageToQt('previewImage', JSON.stringify(param));
  }
  // 关闭工单聊天窗口 {lessonUid, userId}
  closeWorkChat = (param) => {
    this.sendMessageToQt('closeWorkChat', JSON.stringify(param));
  }
  // 设备zml课件总页数据 param:string
  zmlCoursePageTotal = (param) => {
    this.sendMessageToQt('zmlCoursePageTotal', param);
  }
  // 打开播放器 {mediaId,mediaUrl,mediaName,left,top,width,height,fullScreen,paused,mediaProgress}
  openPlayer = (param) => {
    this.sendMessageToQt('openPlayer', JSON.stringify(param));
  }
  // 关闭播放器
  closePlayer = () => {
    this.sendMessageToQt('closePlayer');
  }
  // 获取当前theme
  getTheme = () => {
    this.sendMessageToQt('getTheme'); // {name: 'getTheme', data: {}}
  }
  // 回放标记
  replayAddMark = (param) => {
    var localParam = param ? JSON.stringify(param) : '';
    this.sendMessageToQt('replayAddMark', localParam);
  }
  // 课中答题结果
  showZmlQuestionResult = () => {
    this.sendMessageToQt('showZmlQuestionResult');
  }
  // ppt 大纲切页 param: { id: 课件id, pageNo: 跳转页数 }
  pptSwitchPage =(param) => {
    this.sendMessageToQt('pptSwitchPage', JSON.stringify(param));
  }
  // 发送事件 {eventId:string, eventParam:map{}}
  track = (param) => {
    this.sendMessageToQt('track', JSON.stringify(param));
  }
  // 发送 toast {msgType:Wrong|Error|Success|Tips, msgPos: Top|Center|Bottom, msgText: test}
  toast = (param) => {
    this.sendMessageToQt('toastMsg', JSON.stringify(param));
  }
  // 确认框 {content, uuid}
  confirm = (param) => {
    this.sendMessageToQt('confirm', JSON.stringify(param));
    // 接收 { name: 'confirm', data: "{ ok: true, uuid: ''}"}
  }
  // 关闭商品橱窗窗口
  closeShopWindow = () => {
    this.sendMessageToQt('closeShopWindow');
  }
  // token失效弹窗
  sigTokenExpired = () => {
    this.sendMessageToQt('sigTokenExpired');
  }
  // 获取当前的课件信息
  getDefaultCourse = () => {
    this.sendMessageToQt('getDefaultCourse');
  }
  // 发送消息给qt的通用方法
  sendCommonMsgToQt = (param) => {
    const { event, data } = param;
    this.sendMessageToQt(event, JSON.stringify(data));
  }
  removeEventListener = (callback) => {
    this.bridge.removeEventListener('sendMessageToJs', callback);
  }
}