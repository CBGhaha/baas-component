import React, { Fragment, useContext } from 'react';
import { connect } from 'react-redux';
import { ControllerInstance } from '../../../../main';
import commonAction from '../../../../../common/redux/actions/common';
import './index.less';
import PropsTypes from 'prop-types';
import track from '../../../../../common/utils/track';


function ForbidChat(props) {
  const eventControllersInstance = useContext(ControllerInstance);
  const { allForbidChat, allSingleForbidChatStudent, updateDataList, systemForbidChat, instance, allForbidChatTutor, witchShow, userInfo } = props;
  const { role } = userInfo;
  const tutorForbidChat = allForbidChatTutor[instance.tutorId];
  // 处理禁言
  async function handleForbid(bool) {
    let toastContent = '';
    if (tutorForbidChat && role === ZM_USER_TYPE.teacher) toastContent = '班主任已开启该班学生全员禁言';
    if (tutorForbidChat && role === ZM_USER_TYPE.tutor) toastContent = '你已开启本班全员禁言';
    if (allForbidChat && role === ZM_USER_TYPE.teacher) toastContent = '你已开启全员禁言';
    if (allForbidChat && role === ZM_USER_TYPE.tutor) toastContent = '主讲老师已开启全员禁言';
    if (systemForbidChat) toastContent = '系统自动禁言中';

    if (toastContent) {
      eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: toastContent } });
      return;
    }
    await instance.forbidMaster(!bool);
    updateDataList();
    witchShow(false);
    const eventName = bool ? 'ZBJ_LTQ_STU_JCJY' : 'ZBJ_LTQ_STU_JY';
    track.push(eventControllersInstance, { eventId: eventName });
  }

  const hasForbided = allForbidChat || allSingleForbidChatStudent[instance.userId] || tutorForbidChat;

  return (
    <Fragment>
      <span className={'forbidChat-kind'} onClick={()=>{handleForbid(hasForbided);}}>{hasForbided ? '解除禁言' : '禁言' }</span>
    </Fragment>
    // <div className={`${style.flex} ${style.forbid}`}>
    //  <button className={hasForbided ? style.forbided : ''} onClick={()=>{handleForbid(hasForbided);}}>
    //     <span></span>
    //   </button>
    // </div>
  );

}
ForbidChat.propTypes = {
  instance: PropsTypes.object,
  updateDataList: PropsTypes.func,
  allForbidChat: PropsTypes.bool,
  allSingleForbidChatStudent: PropsTypes.object,
  forbidAction: PropsTypes.func,
  allForbidChatTutor: PropsTypes.object,
  studentsMap: PropsTypes.object,
  systemForbidChat: PropsTypes.bool,
  witchShow: PropsTypes.func,
  userInfo: PropsTypes.object
};
export default connect(
  ({ userInfo, allForbidChat, allForbidChatTutor, studentsMap, systemForbidChat, allSingleForbidChatStudent })=>({ userInfo, allForbidChat, studentsMap, systemForbidChat, allForbidChatTutor, allSingleForbidChatStudent }),
  (dispatch)=>({
    forbidAction: (... arg)=>dispatch(commonAction(... arg))
  }))(ForbidChat);
