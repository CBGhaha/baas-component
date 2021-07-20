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