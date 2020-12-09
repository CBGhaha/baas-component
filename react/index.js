import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import './module/localStorage';
import './module/sessionStorage';
window.USER_TYPE = {
  student: 'STUDENT',
  teacher: 'TEACHER',
  tutor: 'TUTOR'
};
import EventControllers from './eventController/index';
import store from './redux/store.js';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Player from './player/index';
import './global-styles/index.less';

function renderAPP(element, dom) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <div id="courseware-player" style={{ width: '100%', height: '100%' }}>
          {element}
        </div>
      </Provider>
    </AppContainer>,
    dom,
  );
}

export default class Play {
  eventListeners = {};
  eventControllersInstance;
  dom;
  constructor(dom, role) {
    this.dom = dom;
    this.init(role || 'student');
  }
  init(role) {
    this.eventControllersInstance = new EventControllers((event, data, cb)=>{
      const handles = this.eventListeners[event];
      if (handles && handles.length > 0) {
        handles.forEach($handle=>{
          $handle(data, cb);
        });
      } else {
        console.error('未注册事件处理函数：', event, data);
      }
    }, role);
  }
  triggleEvent(event, data) {
    this.eventControllersInstance.handleEventMsg({ name: event, data });
  }
  on($event, handle) {
    if (!this.eventListeners[$event]) this.eventListeners[$event] = [];
    this.eventListeners[$event].push(handle);
  }
  removeEventListener($event, handle) {
    if (this.eventListeners[$event]) {
      const index = this.eventListeners[$event].findIndex(handle);
      this.eventListeners[$event].splice(index, 1);
    }
  }
  removeAllEventListener($event) {
    if (this.eventListeners[$event]) {
      delete this.eventListeners[$event];
    }
  }
  render() {
    renderAPP(<Player eventControllersInstance={this.eventControllersInstance}/>, this.dom);
  }
  setRole(role) {
    this.init(role);
    this.render();
  }
}
