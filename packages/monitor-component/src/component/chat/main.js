import React from 'react';
import { ChatUtilsClass } from './utils/addChatItem';
import ChatComponent from './index';
import ZmRoomComponent from '../common/index';
export const ControllerInstance = React.createContext();

export default class ZmChat extends ZmRoomComponent {
  constructor(dom, userInfo, lessonInfo, monitorParams) {
    super(dom, userInfo, lessonInfo, monitorParams);
    // 为eventControllersInstance 绑定聊天数据和工具类的实例
    this.eventControllersInstance.chatUtilsInstance = new ChatUtilsClass(this.eventControllersInstance);
    const element = <ControllerInstance.Provider value={this.eventControllersInstance}>
      <ChatComponent eventControllersInstance={this.eventControllersInstance}/>
    </ControllerInstance.Provider>;
    this.element = element;
  }
}
