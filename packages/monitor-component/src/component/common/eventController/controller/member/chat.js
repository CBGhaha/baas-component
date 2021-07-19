/**
 * 聊天相关信令
 */
import SocketController from '../controller';
import { setAllSingleForbidChatStudent, tutorOpenAllSingleForbidChatStudent } from '../../../utils/index';
import commonAction from '../../../../common/redux/actions/common';
import verifyImg from '../../../../common/assets/images/verifyError.png';

export const CHAT_CONTORLLOR = 'chatController';

const acceptAction = {
  // 工单中截图状态
  screenShot(controller, params) {
    return params;
  },
  //切换到聊天窗
  chatTabActive(controller, params) {
    return params;
  },
  // 截图中
  chatScreenShot_do(controller, { data }) {
    const { firstName, role, id } = controller.parent.$store.getState().userInfo;
    if (role === ZM_USER_TYPE.student) {
      const { selfForbidChat, allForbidChat, systemForbidChat, studentsMap, allForbidChatTutor } = controller.parent.$store.getState();
      const myInfo = studentsMap && studentsMap[id];
      const tutorForbidChat = myInfo && allForbidChatTutor[myInfo.tutorId];
      if (selfForbidChat || allForbidChat || systemForbidChat || tutorForbidChat) {
        controller.emit('chatScreenShotOnForbidchatDo', data);
        return;
      }
    }
    controller.parent.chatUtilsInstance.addChatMsg({
      type: 'CHAT_SCREENSHOT',
      username: firstName,
      role,
      id: data.id,
      userId: id,
      seq: data.id,
      content: '',
      siteImg: true
    });


    return data;
  },
  // 截图完成
  chatScreenShot_done(controller, { data }) {
  // chatScreenShot_done(controller, res) {
    // let data = { id: res.data.id, username: res.data.username, content: '', success: false, siteImg: false, verify: false }; mock数据
    const { role, id: userId } = controller.parent.$store.getState().userInfo;
    let { id, content, imageUrl, username } = data;
    if (role === ZM_USER_TYPE.student) {
      const { selfForbidChat, allForbidChat, systemForbidChat, studentsMap, allForbidChatTutor } = controller.parent.$store.getState();
      const myInfo = studentsMap && studentsMap[id];
      const tutorForbidChat = myInfo && allForbidChatTutor[myInfo.tutorId];
      if (selfForbidChat || allForbidChat || systemForbidChat || tutorForbidChat) {
        controller.emit('chatScreenShotOnForbidchatDone', data);
        return;
      }
      if (!data.verify && data.verify !== undefined) {
        const { chat } = controller.parent.chatUtilsInstance.chatGlobalData;
        const index = chat.findIndex(item => item.id === id);
        chat[index] = { type: 'CHAT_SCREENSHOT', username, success: false, content: '', userId, siteImg: false, verify: false, imageUrl: verifyImg };
      }
    }
    const { chatGlobalData: { chat }, creatChatItem } = controller.parent.chatUtilsInstance;
    if (content || imageUrl) {
      const index = chat.findIndex(item => item.id === id);
      if (index >= 0) {
        if (content) {
          chat[index] = creatChatItem(data, controller);
        } else {
          chat[index] = creatChatItem({ ...chat[index], ...data, content: imageUrl }, controller);
        }
      }
    }
    return data;
  },
  // 接受聊天信息
  chat_message(controller, msg) {
    msg.type = msg.type.replace('CHAT_OPERATION_EMOTICON', 'CHAT_EMOTICON');
    const { userId, content, type } = msg;
    const { id } = controller.parent.$store.getState().userInfo;
    if (+id === +userId && type !== 'CHAT_EMOTICON') {
      return;
    }
    content && controller.parent.chatUtilsInstance.addChatMsg(msg);
  },
  remove_chat_message(controller, chatInfo) {
    return chatInfo;
  },
  off_chat(controller, res) {
    try {
      const { type, userId, offChatRoleType, offChatClassTutorIds, sourceUserName, isSelf } = res;
      let toastMsg ;let chatTips;
      // 全部禁言
      if (type === 'ALL') {
        if (userInfo.role === ZM_USER_TYPE.student) {
          toastMsg = `${offChatRoleType === ZM_USER_TYPE.teacher ? '主讲老师已开启全员禁言' : '辅导老师已开启本班禁言'}`;
          chatTips = toastMsg;
          controller.parent.$store.dispatch(commonAction('allForbidChat', true));
        } else {
          // 主讲全员禁言
          if (offChatRoleType === ZM_USER_TYPE.teacher) {
            controller.parent.$store.dispatch(commonAction('allForbidChat', true));
            chatTips = toastMsg = '主讲老师已开启全员禁言';
          // 班主任全员禁言
          } else {
            if (!offChatClassTutorIds) return;
            const $map = offChatClassTutorIds.reduce((obj, item)=>{
              obj[item] = true;
              return obj;
            }, {});
            controller.parent.$store.dispatch(commonAction('allForbidChatTutor', $map));
          }
        }
        // 单个禁言
      } else if (type === 'USER') {
        if (userInfo.role === ZM_USER_TYPE.student) {
          if (+userInfo.id === +userId) {
            toastMsg = '你已被禁言，暂时不能发言';
            chatTips = '你已被禁言';
            controller.parent.$store.dispatch(commonAction('selfForbidChat', true));
          }
        } else {
          const { studentsMap } = controller.parent.$store.getState();
          const _student = studentsMap[userId];
          if (_student) {
            chatTips = `${isSelf ? '你' : (offChatRoleType === ZM_USER_TYPE.teacher ? '主讲老师' : `${sourceUserName}`)}已对 "${_student.name}" 禁言`;
          }
          setAllSingleForbidChatStudent(controller.parent.$store, userId, true);
        }
      }
      toastMsg && controller.parent.send('QtAction', { action: 'toast', data: {
        msgType: 'Tips',
        msgPos: 'Center',
        msgText: toastMsg
      } });
      chatTips && controller.parent.chatUtilsInstance.addChatMsg({
        type: 'NOTICE',
        content: chatTips
      });

    } catch (err) {
      console.log(err);
    }
  },
  on_chat(controller, res) {
    try {
      const { type, userId, offChatRoleType, offChatClassTutorIds, sourceUserName, isSelf } = res;
      let toastMsg ;let chatTips;
      // 全员解禁
      if (type === 'ALL') {
        if (userInfo.role === ZM_USER_TYPE.student) {
          toastMsg = offChatRoleType === ZM_USER_TYPE.teacher ? '主讲老师已解除全员禁言，可以正常发言啦' : '辅导老师已解除本班禁言，可以正常发言啦' ;
          chatTips = offChatRoleType === ZM_USER_TYPE.teacher ? '主讲老师已解除全员禁言' : '辅导老师已解除本班禁言';
          controller.parent.$store.dispatch(commonAction('selfForbidChat', false));
          controller.parent.$store.dispatch(commonAction('allForbidChat', false));
          controller.parent.$store.dispatch(commonAction('allForbidChatTutor', {}));
        } else {
          // 主讲解禁
          if (offChatRoleType === ZM_USER_TYPE.teacher) {
            toastMsg = chatTips = '主讲老师已解除全员禁言';
            controller.parent.$store.dispatch(commonAction('allSingleForbidChatStudent', {}));// 清空单独禁言学生
            controller.parent.$store.dispatch(commonAction('allForbidChat', false));
            controller.parent.$store.dispatch(commonAction('allForbidChatTutor', {})); // 清空使用全部禁言的班主任
          // 班主任本班解禁
          } else {
            if (offChatClassTutorIds) {
              const { allForbidChatTutor } = controller.parent.$store.getState();
              Object.keys(allForbidChatTutor).forEach((tutorId)=>{
                if (!offChatClassTutorIds.includes(`${tutorId}`)) {
                  tutorOpenAllSingleForbidChatStudent(controller.parent.$store, tutorId); // 更新单独禁言的学生列表
                }
              });
              // 更新allForbidChatTutor
              const $map = offChatClassTutorIds.reduce((obj, item)=>{
                obj[item] = true;
                return obj;
              }, {});
              controller.parent.$store.dispatch(commonAction('allForbidChatTutor', $map));
            }
          }
        }
        // 单人解禁
      } else if (type === 'USER') {
        if (userInfo.role === ZM_USER_TYPE.student) {
          if (+userInfo.id === +userId) {
            toastMsg = '老师已对你解除禁言，可以正常发言啦';
            chatTips = '老师已对你解除禁言';
            controller.parent.$store.dispatch(commonAction('selfForbidChat', false));
          }
        } else {
          const { studentsMap } = controller.parent.$store.getState();
          const _student = studentsMap[userId];
          if (_student) {
            chatTips = `${isSelf ? '你' : (offChatRoleType === ZM_USER_TYPE.teacher ? '主讲老师' : `${sourceUserName}`)}已对 "${_student.name}" 解除禁言`;
          }
          setAllSingleForbidChatStudent(controller.parent.$store, userId, false);
        }
      }
      toastMsg && controller.parent.send('QtAction', { action: 'toast', data: {
        msgType: 'Tips',
        msgPos: 'Center',
        msgText: toastMsg
      } });
      chatTips && controller.parent.chatUtilsInstance.addChatMsg({
        type: 'NOTICE',
        content: chatTips
      });
    } catch (err) {
      console.log(err);
    }
  },
  update_reputation(controller, res) {
    try {
      const { chat } = controller.parent.chatUtilsInstance.chatGlobalData;
      res.forEach(i => {
        chat.forEach(chatItem => {
          if (chatItem.type === 'CHAT' && +chatItem.userId === +i.userId) {
            const reputations = [...new Set([...(chatItem.reputations || []), ...i.reputations])];
            chatItem.reputations = reputations;
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
    return true;
  },
  RED_PACKET(controller, res) {
    let obj = res;
    if (res.awardUserInfos) {
      obj = { ...res, ...res.awardUserInfos };
    }
    controller.parent.chatUtilsInstance.addChatMsg({ ...obj, reputations: [], type: 'RED_PACKET', ts: +res.ts });
  },
  auto_forbid_chat(controller, res) {
    const { systemForbidChat } = controller.parent.$store.getState();
    if (systemForbidChat) return;
    let toastMsg ;let chatTips;
    controller.parent.$store.dispatch(commonAction('systemForbidChat', true));
    if (userInfo.role === ZM_USER_TYPE.student) {
      chatTips = '系统自动禁言中';
    } else {
      toastMsg = chatTips = '答题中，系统已针对全体学生开启自动禁言';
    }
    toastMsg && controller.parent.send('QtAction', { action: 'toast', data: {
      msgType: 'Tips',
      msgPos: 'Center',
      msgText: toastMsg
    } });
    chatTips && controller.parent.chatUtilsInstance.addChatMsg({
      type: 'NOTICE',
      content: chatTips
    });
  },
  auto_cancel_forbid_chat(controller, res) {
    let toastMsg ;let chatTips;
    controller.parent.$store.dispatch(commonAction('systemForbidChat', false));
    if (userInfo.role === ZM_USER_TYPE.student) {
      chatTips = '系统已解除禁言';
    } else {
      toastMsg = chatTips = '答题结束，系统已解除全体学生禁言';
    }
    toastMsg && controller.parent.send('QtAction', { action: 'toast', data: {
      msgType: 'Tips',
      msgPos: 'Center',
      msgText: toastMsg
    } });
    chatTips && controller.parent.chatUtilsInstance.addChatMsg({
      type: 'NOTICE',
      content: chatTips
    });
  },
  // 上台连麦学生发生变化
  updateStuOnTableAndMic(controller, res) {
    if (res && (res.onTabl || res.onMic)) {
      handleStuOnTableAndMic(controller.parent.$store, res);
    }
  },
  // 开关 是否允许学生发图片
  stu_pic_chat_switch(controller, res) {
    try {
      const { stuPicChatSwitchOn } = res;
      controller.parent.$store.dispatch(commonAction('stuForbidScreenshot', stuPicChatSwitchOn));
    } catch (error) {
      console.log(error);
    }

  }
};

const sendAction = {
  // 获取历史聊天消息
  current_chat_message(controller, res) {
    try {
      const { data, success } = res;
      if (success && data) {
        controller.parent.chatUtilsInstance.addChatMsg(data);
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 发送聊天
  chat_message(controller, ...res) {
    //
  },
  off_chat(controller, res) {
    // controller.parent.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '你已被禁言，暂时不能发送截图' } });

  },
  current_activity(controller, res) {
    if (res && res.success) {
      controller.parent.$store.dispatch(commonAction('currDrillRoom', res.data.currDrillRoom));
      return res.data;
    }
    return false;
  },
  init_connect(controller, res) {
    // 获取当前是否全员禁言
    try {
      const {
        data: { onChat, autoForbidChat, offChatClassTutorIds, stuPicChatSwitchOn }
      } = res;
      if (!stuPicChatSwitchOn) {
        controller.parent.$store.dispatch(commonAction('stuForbidScreenshot', false));
      }
      if (!onChat) {
        controller.parent.$store.dispatch(commonAction('allForbidChat', true));
      }
      if (autoForbidChat) {
        controller.parent.$store.dispatch(commonAction('systemForbidChat', true));
      }
      if (offChatClassTutorIds && offChatClassTutorIds.length) {
        const $map = offChatClassTutorIds.reduce((obj, item)=>{
          obj[item] = true;
          return obj;
        }, {});
        controller.parent.$store.dispatch(commonAction('allForbidChatTutor', $map));
      }

    } catch (err) {
      console.log(err);
    }
  },
  on_chat(controller, res) {
    //
  },
  // 获取历史禁言列表
  off_chat_list(controller, res) {
    try {
      const { data, success } = res;

      if (success && data) {
        const forbidMap = { ...controller.parent.$store.getState()['allSingleForbidChatStudent'] };
        data.forEach(i => {
          forbidMap[i.userId] = true;
          if (+userInfo.id === +i.userId) {
            controller.parent.$store.dispatch(commonAction('selfForbidChat', true));
          }
        });
        controller.parent.$store.dispatch(commonAction('allSingleForbidChatStudent', forbidMap));
      }
    } catch (err) {
      console.log(err);
    }
  },
  remove_chat_message() {},

  stuOnTableAndMic(controller, res) {
    if (res) {
      handleStuOnTableAndMic(controller.parent.$store, res);
    }
  },
  // 开关 是否允许学生发图片
  stu_pic_chat_switch(controller, res) {

  },
  chat_share_points(controller, res) {

  },
  getConfig() {

  }


};

function handleStuOnTableAndMic(store, data) {
  const { onTable, onMic } = data;
  if (onTable && onTable.length) {
    store.dispatch(commonAction('onTableStudents', new Map(
      onTable.map((id)=>[`${id}`, true])
    )));
  } else {
    store.dispatch(commonAction('onTableStudents', new Map()));
  }

  if (onMic && onMic.length) {
    store.dispatch(commonAction('onMicStudents', new Map(
      onMic.map((id)=>[`${id}`, true])
    )));
  } else {
    store.dispatch(commonAction('onMicStudents', new Map()));
  }
}

const chatController = new SocketController(CHAT_CONTORLLOR, acceptAction, sendAction);
export default chatController;
