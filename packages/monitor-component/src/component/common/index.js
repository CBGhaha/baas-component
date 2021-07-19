import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import './iconfont.js';
import './module/localStorage';
import './module/sessionStorage';
import commonAction from './redux/actions/common';
import EventControllers from './eventController/index';
import { storeCreator } from './redux/store.js';
import ReactDOM from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import './global-styles/index.less';

window.ZM_USER_TYPE = {
  student: 'STUDENT',
  teacher: 'TEACHER',
  tutor: 'TUTOR'
};

/*
* 组件库的基类
*/
export default class ZmRoomComponent {
  eventListeners = {}; // 外部组件消息的管理器
  eventControllersInstance; // 组件内的消息分发controller实例
  dom; // 组件绑定的dom
  store; // 组件私有store
  element; // 组件Component
  constructor(dom, userInfo, lessonInfo, monitorParams) {
    this.dom = dom;
    if (userInfo.role) userInfo.role = userInfo.role.toUpperCase();
    this.store = storeCreator();
    this.store.dispatch(commonAction('userInfo', userInfo));
    this.store.dispatch(commonAction('lessonInfo', lessonInfo));
    if (monitorParams) this.store.dispatch(commonAction('monitorParams', monitorParams));
    this.init();
  }
  init() {
    // 实力化组件实例的 eventControllersInstance
    this.eventControllersInstance = new EventControllers((event, data, cb)=>{
      const handles = this.eventListeners[event];
      if (handles && handles.length > 0) {
        handles.forEach($handle=>{
          $handle(data, cb);
        });
      } else {
        console.warn('未注册事件处理函数：', event, data);
      }
    }, this.store);
  }
  // 向组件发送事件的方法
  triggleEvent(event, data) {
    this.eventControllersInstance.handleEventMsg({ name: event, data });
  }
  // 注册监听组件消息回调的方法
  on($event, handle) {
    if (!this.eventListeners[$event]) this.eventListeners[$event] = [];
    this.eventListeners[$event].push(handle);
  }
  // 取消消息监听
  removeEventListener($event, handle) {
    if (this.eventListeners[$event]) {
      const index = this.eventListeners[$event].findIndex(handle);
      this.eventListeners[$event].splice(index, 1);
    }
  }
  // 取消指定消息的所有监听
  removeAllEventListener($event) {
    if (this.eventListeners[$event]) {
      delete this.eventListeners[$event];
    }
  }
  // 开始渲染组件
  render(cb) {
    renderAPP(
      this.element,
      this.dom,
      this.store,
      cb
    );
  }
}

function renderAPP(element, dom, store, cb) {
  ReactDOM.render(
    // <AppContainer>
    <Provider store={store}>
      {element}
    </Provider>,
    // </AppContainer>,
    dom,
    ()=>{cb && cb();}
  );
}