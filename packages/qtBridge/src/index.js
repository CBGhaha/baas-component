/**
 * Qt cef 与 js 通信
 * // js发消息 qt接收
 * QCefClient.invokeMethod("channel", "arg1", "arg2");
 * // qt发消息 js接收
 * QCefClient.addEventListener("channelName", (event) => {});
 * // 受限 qwebengineview 目前难以实现回调，固后面的 采用 信号，曹的方式
 */
import BaseBridge from './libs/baseBridge';
import QtCefBridge from './libs/qtCefBridge';
import QtWebEngineBridge from './libs/qtWebEngineBridge';

var userAgent = (function () {
  return window.navigator.userAgent;
})();
var isQtWebEngine = (function () {
  return userAgent.includes('QtWebEngine');
})();
var isQtCef = (function () {
  return userAgent.includes('QCefView');
})();

let bridgeInstance = new BaseBridge();
if (isQtWebEngine) bridgeInstance = new QtWebEngineBridge();
if (isQtCef) bridgeInstance = new QtCefBridge();
export default bridgeInstance;

// function Bridge() {
//   this.bridge = null;
// }

// Bridge.prototype.ready = function (callback) {
//   this.init().then(res => {
//     callback(res);
//   });
// }

// Bridge.prototype.init = function () {
//   if (!window.QCefClient || !window.QWebChannel) {
//     console.warn("please open with DesktopApplication")
//   }
//   var that = this;
//   return new Promise(function (resolve, reject) {
//     if (isQtWebEngine) {
//       new QWebChannel(qt.webChannelTransport, function(channel) {
//         window.bridge = that.bridge = channel.objects.QBridge;
//         resolve(channel);
//       });
//     } else if (isQtCef) {
//       that.bridge = window.QCefClient;
//       resolve(window.QCefClient);
//     } else {
//       reject({
//         error: 'error client',
//         message: "非客户端的浏览器"
//       });
//     }
//   });
// }
// Bridge.prototype.isQtWebEngine = isQtWebEngine;
// Bridge.prototype.isQtCef = isQtCef;
// Bridge.prototype.userAgent = userAgent;
// Bridge.prototype.hasQCefClient = function () {
//   return !!window.QCefClient;
// }
// // js send message to qt
// Bridge.prototype.sendMessageToQt = function (action, data) {
//   console.log('bridge sendMessageToQt:', action, data);
//   this.bridge && this.bridge.invokeMethod('sendMessageToQt', action, data || '');
// }
// // js send message to qt with callback
// // 课堂内 namespace: 'classin_socket'
// // 课堂外 namespace: 'zmutil'
// Bridge.prototype.sendMessageToQtWithCallback = function (namespace, action, param, callback, uuid) {
//   var localParam = {
//     method: action,
//     param: param,
//   };
//   if (this.isQtWebEngine) {
//     if (uuid) {
//       localParam.uuid = uuid;
//     }
//     localParam = JSON.stringify(localParam);
//   } else if (this.isQtCef) {
//     localParam.callback = callback;
//   }
//   this.bridge.invokeMethodWhithCallback(namespace, localParam);
// };
// // qt send message to js
// Bridge.prototype.sendMessageToJs = function (callback) {
//   // { name: 'event name type', [prop]: any}
//   this.bridge.addEventListener('sendMessageToJs', callback)
// }
// // js接收qt发来的消息
// Bridge.prototype.receiveMessageFromQt = function (callback) {
//   // { name: 'event name type', [prop]: any}
//   this.bridge.addEventListener('sendMessageToJs', callback)
// }
// Bridge.prototype.removeEventListener = function (callback) {
//   //QCefClient.removeEventListener("colorChange", onColorChanged);
//   this.bridge.removeEventListener('sendMessageToJs', callback);
// }
// // 移动窗口
// Bridge.prototype.onDragAreaMouseDown = function () {
//   this.sendMessageToQt('onDragAreaMouseDown');
// }
// // 登录成功向qt传用户信息
// Bridge.prototype.loginSuccess = function (userInfo) {
//   this.sendMessageToQt('loginSuccess', userInfo);
// }
// // 关闭窗口
// Bridge.prototype.close = function () {
//   this.sendMessageToQt('close');
// }
// // 窗口最小化
// Bridge.prototype.minimize = function () {
//   this.sendMessageToQt('minimize');
// }
// // 窗口最大化
// Bridge.prototype.maximize = function () {
//   this.sendMessageToQt('maximize');
// }
// // 进入课堂
// Bridge.prototype.enterClassin = function (classInfo) {
//   this.sendMessageToQt('enterClassin', classInfo);
// }
// // 退出登录
// Bridge.prototype.logout = function () {
//   this.sendMessageToQt('logout');
// }
// // 获取zml地址param: ['', '', '', ], callback
// Bridge.prototype.getZmlUrl = function (param, callback) {
//   this.sendMessageToQt('getZmlUrl', JSON.stringify(param)); // {name: 'getZmlUrl', data: {}}
// }
// // 护眼模式  status: '1'/'0'
// Bridge.prototype.eyeshield = function (status) {
//   this.sendMessageToQt('eyeshield', status);
// }
// // 用默认浏览器打开页面 url: http[s]://www.zhangmenyouke.com
// Bridge.prototype.openUrlWithBrowser = function (url) {
//   this.sendMessageToQt('openUrlWithBrowser', JSON.stringify({
//     url: url
//   }));
// }
// // 打开设备测试
// Bridge.prototype.deviceTest = function () {
//   this.sendMessageToQt('openSetting', JSON.stringify({
//     type: 'deviceTest'
//   }));
// }
// // 关于优课
// Bridge.prototype.about = function () {
//   this.sendMessageToQt('openSetting', JSON.stringify({
//     type: 'about'
//   }));
// }
// // 打开回放
// Bridge.prototype.openReplay = function (param) {
//   this.sendMessageToQt('replay', JSON.stringify(param));
// }
// // 关闭回放
// Bridge.prototype.openReplayClose = function () {
//   this.sendMessageToQt('replayClose');
// }
// // 截屏及上传至工单
// Bridge.prototype.screenShot = function () {
//   this.sendMessageToQt('screenShot');
// }

// // 聊天截图 param: { role: 'all' | 'tutor' | 'teacher', showClassin : true | false }
// // 发给 所有人， 班主任，讲师
// // 截图 是否隐隐藏 我们应用窗口
// Bridge.prototype.chatScreenShot = function (param) {
//   this.sendMessageToQt('chatScreenShot', JSON.stringify(param));
// }
// // 图片查看  param: {url: ''}
// Bridge.prototype.previewImage = function (param) {
//   this.sendMessageToQt('previewImage', JSON.stringify(param));
// }
// // 关闭工单聊天窗口 {lessonUid, userId}
// Bridge.prototype.closeWorkChat = function (param) {
//   this.sendMessageToQt('closeWorkChat', JSON.stringify(param));
// }
// // 设备zml课件总页数据 param:string
// Bridge.prototype.zmlCoursePageTotal = function (param) {
//   this.sendMessageToQt('zmlCoursePageTotal', param);
// }
// // 打开播放器 {mediaId,mediaUrl,mediaName,left,top,width,height,fullScreen,paused,mediaProgress}
// Bridge.prototype.openPlayer = function (param) {
//   this.sendMessageToQt('openPlayer', JSON.stringify(param));
// }
// // 关闭播放器
// Bridge.prototype.closePlayer = function () {
//   this.sendMessageToQt('closePlayer');
// }
// // 获取当前theme
// Bridge.prototype.getTheme = function () {
//   this.sendMessageToQt('getTheme'); // {name: 'getTheme', data: {}}
// }
// // 回放标记
// Bridge.prototype.replayAddMark = function (param) {
//   var localParam = param ? JSON.stringify(param) : '';
//   this.sendMessageToQt('replayAddMark', localParam);
// }
// // 课中答题结果
// Bridge.prototype.showZmlQuestionResult = function () {
//   this.sendMessageToQt('showZmlQuestionResult');
// }
// // ppt 大纲切页 param: { id: 课件id, pageNo: 跳转页数 }
// Bridge.prototype.pptSwitchPage = function (param) {
//   this.sendMessageToQt('pptSwitchPage', JSON.stringify(param));
// }
// // 发送事件 {eventId:string, eventParam:map{}}
// Bridge.prototype.track = function (param) {
//   this.sendMessageToQt('track', JSON.stringify(param));
// }
// // 发送 toast {msgType:Wrong|Error|Success|Tips, msgPos: Top|Center|Bottom, msgText: test}
// Bridge.prototype.toast = function (param) {
//   this.sendMessageToQt('toastMsg', JSON.stringify(param));
// }
// // 确认框 {content, uuid}
// Bridge.prototype.confirm = function (param) {
//   this.sendMessageToQt('confirm', JSON.stringify(param));
//   // 接收 { name: 'confirm', data: "{ ok: true, uuid: ''}"}
// }
// // 关闭商品橱窗窗口
// Bridge.prototype.closeShopWindow = function () {
//   this.sendMessageToQt('closeShopWindow');
// }
// // token失效弹窗
// Bridge.prototype.sigTokenExpired = function (param) {
//   this.sendMessageToQt('sigTokenExpired');
// }
// // 获取当前的课件信息
// Bridge.prototype.getDefaultCourse = function (param) {
//   this.sendMessageToQt('getDefaultCourse');
// }
// // 发送消息给qt的通用方法
// Bridge.prototype.sendCommonMsgToQt= function (param) {
//   const { event, data } = param;
//   this.sendMessageToQt(event, JSON.stringify(data));
// }
