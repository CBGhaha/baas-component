/*
 * Chat类
 */
import { setAllSingleForbidChatStudent } from './index';
import toast from '../../common/components/toast';
import { getTime } from '../../common/utils/index';
import track from '../../common/utils/track';
import chatGlobalData from '../globalData';

class Base {
  avatar= '';content= '';rd= null;removed= false;role= '';roleName='';rts= null;serNum= null;ts= null;type='';userId= ''; username= '';
  controllerInstance = {};
  constructor(chatMsg, controllerInstance) {
    this.controllerInstance = controllerInstance;
    if (typeof chatMsg === 'object') {
      Object.entries(chatMsg).forEach(([key, value])=>{
        this[key] = value;
      });
    }
    if (!this.serNum) this.serNum = `${new Date().getTime()}-${Math.floor(Math.random() * 100000)}_${Math.floor(Math.random() * 100000)}`;
  }
}
class Chat extends Base {
  constructor(chatMsg, controllerInstance) {
    super(chatMsg, controllerInstance);
    this.type = (chatMsg.type || 'CHAT').replace('CHAT_RAPID', 'CHAT');
  }
  onMove(cb) {
    this.moveCb = cb;
  }
  async deleteChat(bool) {
    this.removed = true;
    this.moveCb && this.moveCb();
    if (!bool) {
      await this.controllerInstance.controllers.chatController.send('remove_chat_message', { userId: this.userId, serNum: this.serNum });
    }
    // this.content = '您的消息已被删除';
  }
  async forbidMaster(bool) {
    const res = await this.controllerInstance.controllers.chatController.send(!bool ? 'on_chat' : 'off_chat', { userId: this.userId });
    if (!(res && res.success)) {
      this.controllerInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '禁言失败，请重试' } });
    }
    this.controllerInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: !bool ? 'onChatAck' : 'offChatAck', data: { 'type': 'USER', userId: this.userId } } });
    track.push(this.controllerInstance, { eventId: !bool ? 'ROOM_ON_FORBID' : 'ROOM_OFF_FORBID', eventParam: { userId: this.userId, user_id: this.userId } });
    setAllSingleForbidChatStudent(this.controllerInstance.$store, this.userId, bool);
    this.controllerInstance.chatUtilsInstance.addChatMsg({
      type: 'NOTICE',
      content: `你已对 "${this.username}" ${!bool ? '解除' : ''}禁言`
    });
  }
  // 单独发红包
  async senRedpackage(num) {
    try {
      const res = await this.controllerInstance.controllers.redPackageController.send('award_specific_red_packet', this.userId, num);
      const { success, data } = res;
      if (success) {
        this.controllerInstance.chatUtilsInstance.addChatMsg({
          type: 'RED_PACKET',
          firstUsername: this.username,
          redPacketSubject: 'SPECIFY_USER',
          coinAmount: num,
          seq: data[1],
          ts: data[0]
        });
      }
      track.push(this.controllerInstance, { eventId: 'ROOM_SING_SEND_RED_PACK', eventParam: { username: this.username, num } });
    } catch (err) {
      console.error(err);
    }
  }
  tableUp() {
    track.push(this.controllerInstance, { eventId: 'SHANGTAI', eventParam: { studentId: this.userId, studentName: this.username } });
    this.controllerInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'stuOnTable', data: { id: this.userId, onTable: true } } });

  }
  tableDown() {
    track.push(this.controllerInstance, { eventId: 'XIATAI', eventParam: { studentId: this.userId, studentName: this.username } });
    this.controllerInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'stuOnTable', data: { id: this.userId, onTable: false } } });
  }
  micClose() {
    track.push(this.controllerInstance, { eventId: 'LIANMAI', eventParam: { studentId: this.userId, studentName: this.username } });
    this.controllerInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'stuOnMic', data: { id: this.userId, onMic: false } } });
  }
  micConnect() {
    track.push(this.controllerInstance, { eventId: 'XIAMAI', eventParam: { studentId: this.userId, studentName: this.username } });
    this.controllerInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'stuOnMic', data: { id: this.userId, onMic: true } } });
  }
}
class PRAISE extends Base {
  // 获取表扬详情
  async getDetail() {
    try {
      const res = await this.controllerInstance.controllers.praiseController.send('praise_info', { seq: this.seq });
      const { success, data } = res;
      if (success) {
        this.controllerInstance.controllers.praiseController.emit('getDetail', { ts: this.ts, data });
      }
    } catch (err) {
      console.error(err);
    }

  }
}
class Redpackage extends Base {
  // redPackageStudentList=[];
  // 获取红包详情
  async getDetail() {
    try {
      const res = await this.controllerInstance.controllers.redPackageController.send('red_packet_info', this.seq);
      const { success, data } = res;
      if (success) {
        this.controllerInstance.controllers.redPackageController.emit('getDetail', { ts: this.ts, data });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
class Notice extends Base {

}

export class ChatScreenShot extends Chat {
  constructor(chatMsg, controllerInstance) {
    super(chatMsg, controllerInstance);
  }
  sharePicture = async () =>{
    const { lessonInfo: { lessonId } } = this.controllerInstance.$store.getState();
    track.push(this.controllerInstance, { eventId: 'SHAREICON' });
    const res = await this.controllerInstance.controllers.chatController.send('chat_share_points', { action: 'QUERY_TIME_LIMIT', screenShotURL: this.content, lessonId });
    console.log('chat_share_points-res:', res);
    if (!(res && res.data)) {
      toast('请求错误，请重试');
      return;
    }
    if (res.data.timeStamp === 0) {
      console.log('chat_share_points-res:', 1);
      this.controllerInstance.controllers.chatController.emit('sharePicture', this.content);
    } else {
      console.log('chat_share_points-res:', 2);
      toast(`15min内仅支持转发一次消息，还需等待${getTime(Math.ceil(res.data.timeStamp / 1000))}`);
    }

  }

}
export function creatChatItem(msg, controllerInstance) {
  msg.type = msg.type.replace('CHAT_OPERATION_EMOTICON', 'CHAT_EMOTICON');
  const { type } = msg;
  switch (type) {
    case 'CHAT_SCREENSHOT': return new ChatScreenShot(msg, controllerInstance);
    case 'CHAT_EMOTICON': null;
    case 'CHAT':return new Chat(msg, controllerInstance);
    case 'PRAISE':return new PRAISE(msg, controllerInstance);
    case 'RED_PACKET':return new Redpackage(msg, controllerInstance);
    case 'SHOW_UPDATE_MSG': new Notice(msg, controllerInstance);
    case 'NOTICE':return new Notice(msg, controllerInstance);
    default:return new Chat(msg, controllerInstance);
  }
}

export class ChatUtilsClass {
  controllerInstance;
  constructor(controllerInstance) {
    this.controllerInstance = controllerInstance;
    this.chatGlobalData = { ...chatGlobalData };
    this.creatChatItem = creatChatItem;
  }
  addChatMsg = (chatItem) => {
    const { lessonInfo: { playType }, userInfo: { role }, allAistudentSet: aiStudents } = this.controllerInstance.$store.getState();
    if (+playType === 1 && chatItem.type === 'RED_PACKET') return;
    let { chat } = this.chatGlobalData;
    let addMum = 0;
    let chats = [];
    if (Array.isArray(chatItem)) {
      chats = chatItem;
    } else [
      chats = [chatItem]
    ];
    chat = [... chat, ... chats.map(i=>{
      if (this.chatGlobalData.filter) {
        if (+playType === 1 && role === ZM_USER_TYPE.tutor) {
          if (!aiStudents.has(i.userId)) addMum++;
        // 普通课
        } else {
          if (i.role !== ZM_USER_TYPE.student) addMum++;
        }

      } else {
        addMum++;
      }
      return creatChatItem(i, this.controllerInstance);
    })];
    this.chatGlobalData.newMsgNum = this.chatGlobalData.newMsgNum + addMum;
    this.controllerInstance.controllers.chatController.emit('chatMsgAdd', addMum);
    this.chatGlobalData.chat = chat.slice(-this.chatGlobalData.msgTotalLength);
  }
}