import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import commonAction from '../../../common/redux/actions/common';
import { lessonProgress } from '../../../common/config';
import { tutorOpenAllSingleForbidChatStudent } from '../../utils/index';
import Switch from './switch/index';
import StudentInput from './student/student';
import TeacherInput from './teacher/teacher';
import './index.less';
import track from '../../../common/utils/track';

const allTarget = { key: 'ALL', intro: '允许所有人看到', content: '所有人' };
const tutorTarger = { key: 'TUTOR', intro: '只让助教看到', content: '只助教' };
const teacherTarger = { key: 'TEACHER', intro: '只让主讲看到', content: '只主讲' };

class Input extends PureComponent {
  constructor(props) {
    super(props);
    this.eventControllersInstance = props.eventControllersInstance;
    this.timer = null;
    this.state = {
      target: 'ALL',
      userInfo: props.userInfo,
      role: props.userInfo.role,
      targetList: [props.userInfo.role === ZM_USER_TYPE.teacher ? tutorTarger : teacherTarger, allTarget]
    };
  }

  changeTarget = target => {
    this.setState({ target });
    const eventName = `ROOM_CHAT_JUST_${target}`;
    track.push(this.eventControllersInstance, { eventId: eventName });
  };
  // 主讲操作全体禁言
  handleTeacherAllForbidChat = async () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async ()=>{
      const { allForbidChat, forbidAction, updateDataList, systemForbidChat } = this.props;
      if (systemForbidChat) {
        this.eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '系统自动禁言中' } });return;
      }
      const res = await this.eventControllersInstance.send(!allForbidChat ? 'off_chat' : 'on_chat', { wholeRoom: true });
      if (!(res && res.success)) {
        this.eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '禁言失败，请重试' } });
      }
      this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: allForbidChat ? 'onChatAck' : 'offChatAck', data: { 'type': 'ALL' } } });
      this.eventControllersInstance.chatUtilsInstance.addChatMsg({
        type: 'NOTICE',
        content: `你已${!allForbidChat ? '开启' : '解除'}全员禁言`
      });
      updateDataList();
      forbidAction('allForbidChat', !allForbidChat);
      if (allForbidChat) {
        this.eventControllersInstance.$store.dispatch(commonAction('allForbidChatTutor', {})); // 清空使用全部禁言的班主任
        forbidAction('allSingleForbidChatStudent', {}); // 解禁所有单独禁言的学生
      }
    }, 200);
  };
  // 班主任操作全体禁言
   handleTutorAllForbidChat = async (bool) => {
     if (this.timer) clearTimeout(this.timer);
     this.timer = setTimeout(async ()=>{
       const { allForbidChat, updateDataList, systemForbidChat } = this.props;
       if (systemForbidChat) {
         this.eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '系统自动禁言中' } }); return;
       }
       if (allForbidChat) {
         this.eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '主讲老师开启全员禁言中' } }); return;
       }
       // 禁言/解禁 自己的班级
       const res = await this.eventControllersInstance.send(bool ? 'on_chat' : 'off_chat', { wholeRoom: true });
       if (!(res && res.success)) {
         this.eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '禁言失败，请重试' } });
       }
       this.eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: bool ? 'onChatAck' : 'offChatAck', data: { 'type': 'ALL' } } });
       this.eventControllersInstance.chatUtilsInstance.addChatMsg({
         type: 'NOTICE',
         content: `你已${bool ? '解除' : '开启' }本班全员禁言`
       });
       // 更新allForbidChatTutor map
       const { allForbidChatTutor } = this.eventControllersInstance.$store.getState();
       const { id } = this.props.userInfo;
       try {
         if (bool) {
           delete allForbidChatTutor[id];
         } else {
           allForbidChatTutor[id] = true;
         }
         this.eventControllersInstance.$store.dispatch(commonAction('allForbidChatTutor', { ...allForbidChatTutor }));
       } catch (err) {
         console.error(err);
       }
       updateDataList();
       bool && tutorOpenAllSingleForbidChatStudent(this.eventControllersInstance.$store, id);
     }, 200);
   }

  // 发送消息
  sendMessage = async ({ content, type = 'CHAT' }) => {
    const { target } = this.state;
    try {
      const res = await this.eventControllersInstance.send('chat_message', { content, target, type }, target);
      const { data, success } = res;
      if (success) {
        this.eventControllersInstance.chatUtilsInstance.addChatMsg(data);
        this.props.updateDataList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 截图
  handlepPrscrn = async isHideWin => {
    this.props.scrollToBottom();
    this.eventControllersInstance.send('QtAction', { action: 'chatScreenShot', data: { role: this.state.target, showClassin: isHideWin } });
  };

  // 主讲操作学生禁止传图
  handleTeacherForbidStuPic = async () => {
    if (this.state.role !== ZM_USER_TYPE.teacher) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async ()=>{
      const { stuForbidScreenshot, forbidAction, updateDataList } = this.props;
      await this.eventControllersInstance.send('stu_pic_chat_switch', { stuPicChatSwitchOn: !stuForbidScreenshot });
      updateDataList();
      forbidAction('stuForbidScreenshot', !stuForbidScreenshot);
      // 处理埋点-讲师禁止图片发送开关按钮
      const eventName = stuForbidScreenshot ? 'ZBJ_LTQ_GBFS' : 'ZBJ_LTQ_KQFS';
      track.push(this.eventControllersInstance, { eventId: eventName });
    }, 200);
  };

  render() {
    const { lessonInfo, selfForbidChat, allForbidChat, systemForbidChat, chatFilterTeacher, allForbidChatTutor, setChatFilterTeacher, stuForbidScreenshot, monitorParams } = this.props;
    const { targetList, target, role } = this.state;
    const { playType, lesson_progress } = lessonInfo;
    const { isMonitor } = monitorParams;
    const isAi = +playType === 1;
    const inLesson = lesson_progress === lessonProgress.in;
    const chatFilter = <div className={'chatFilter'}>
      <span>只看老师</span>
      <Switch isOpen={chatFilterTeacher} handleSwitch={setChatFilterTeacher}/>
    </div>;
    return (
      <div className={'chat-inputBox'}>
        {role === ZM_USER_TYPE.student ? (isMonitor ? null :
          <StudentInput
            selfForbidChat={selfForbidChat}
            allForbidChat={allForbidChat}
            systemForbidChat={systemForbidChat}
            sendMessage={this.sendMessage}
            allForbidChatTutor = {allForbidChatTutor}
            handlepPrscrn={this.handlepPrscrn}
            chatFilter={!(isAi && !inLesson && role === ZM_USER_TYPE.tutor) && chatFilter}
            stuForbidScreenshot={stuForbidScreenshot}
          />
        ) : (
          <TeacherInput
            target={target}
            allForbidChat = {allForbidChat}
            allForbidChatTutor = {allForbidChatTutor}
            targetList = {targetList}
            changeTarget = {this.changeTarget}
            handleAllForbidChat={role === ZM_USER_TYPE.teacher ? this.handleTeacherAllForbidChat : this.handleTutorAllForbidChat}
            sendMessage={this.sendMessage}
            handlepPrscrn={this.handlepPrscrn}
            chatFilter={chatFilter}
            handleTeacherForbidStuPic={this.handleTeacherForbidStuPic}
            stuForbidScreenshot={stuForbidScreenshot}
          />
        )}
      </div>
    );
  }
}

Input.propTypes = {
  updateDataList: PropTypes.func,
  chatFilterTeacher: PropTypes.bool,
  setChatFilterTeacher: PropTypes.func,
  allForbidChat: PropTypes.bool,
  selfForbidChat: PropTypes.bool,
  systemForbidChat: PropTypes.bool,
  forbidAction: PropTypes.func,
  scrollToBottom: PropTypes.func,
  allForbidChatTutor: PropTypes.object,
  stuForbidScreenshot: PropTypes.bool,
  eventControllersInstance: PropTypes.any,
  userInfo: PropTypes.object,
  lessonInfo: PropTypes.object,
  monitorParams: PropTypes.object
};

export default connect(
  ({ userInfo, lessonInfo, allForbidChat, selfForbidChat, systemForbidChat, allForbidChatTutor, stuForbidScreenshot, monitorParams }) => ({ userInfo, lessonInfo, allForbidChat, systemForbidChat, selfForbidChat, allForbidChatTutor, stuForbidScreenshot, monitorParams }),
  dispatch => ({
    forbidAction: (...arg) => dispatch(commonAction(...arg))
  })
)(Input);