
import React from 'react';
import Player from './index';
import ZmRoomComponent from '../common/index';
export default class ZmCoursePlayer extends ZmRoomComponent {
  constructor(dom, userInfo, lessonInfo, monitorParams) {
    super(dom, userInfo, lessonInfo, monitorParams);
    const element = <div id="courseware-player" style={{ width: '100%', height: '100%' }}>
      <Player eventControllersInstance={this.eventControllersInstance}/>
    </div>;
    this.element = element;
  }
}

// function renderAPP(element, dom, store, cb) {
//   ReactDOM.render(
//     <AppContainer>
//       <Provider store={store}>
//         <div id="courseware-player" style={{ width: '100%', height: '100%' }}>
//           {element}
//         </div>
//       </Provider>
//     </AppContainer>,
//     dom,
//     ()=>{cb && cb();}
//   );
// }

// export default class Play {
//   eventListeners = {};
//   eventControllersInstance;
//   dom;
//   constructor(dom, userInfo, lessonInfo) {
//     this.dom = dom;
//     if (typeof userInfo === 'string' || !userInfo) {
//       this.init({ role: (userInfo || 'student').toUpperCase() });
//     } else {
//       if (userInfo.role) userInfo.role = userInfo.role.toUpperCase();
//       this.init(userInfo, lessonInfo);
//     }
//   }
//   init(userInfo, lessonInfo) {
//     this.store = storeCreator();
//     this.store.dispatch(commonAction('userInfo', userInfo));
//     this.store.dispatch(commonAction('lessonInfo', lessonInfo));
//     this.eventControllersInstance = new EventControllers((event, data, cb)=>{
//       const handles = this.eventListeners[event];
//       if (handles && handles.length > 0) {
//         handles.forEach($handle=>{
//           $handle(data, cb);
//         });
//       } else {
//         console.warn('未注册事件处理函数：', event, data);
//       }
//     }, this.store);
//   }
//   triggleEvent(event, data) {
//     this.eventControllersInstance.handleEventMsg({ name: event, data });
//   }
//   on($event, handle) {
//     if (!this.eventListeners[$event]) this.eventListeners[$event] = [];
//     this.eventListeners[$event].push(handle);
//   }
//   removeEventListener($event, handle) {
//     if (this.eventListeners[$event]) {
//       const index = this.eventListeners[$event].findIndex(handle);
//       this.eventListeners[$event].splice(index, 1);
//     }
//   }
//   removeAllEventListener($event) {
//     if (this.eventListeners[$event]) {
//       delete this.eventListeners[$event];
//     }
//   }
//   render(cb) {
//     renderAPP(<Player eventControllersInstance={this.eventControllersInstance}/>, this.dom, this.store, cb);
//   }
// }
