import React, { useEffect, useState, useRef, Fragment, useContext } from 'react';
import PropsTypes from 'prop-types';
import './index.less';
// import Redpackage from './components/redPackage/index';
import { ControllerInstance } from '../../main';
import ForbidChat from './components/forbidChat/index';
// import DeleteChat from './components/deleteChat/index';
import ConnectMic from './components/connectMic/index';
import Shangtai from './components/shangtai/index';
import { connect } from 'react-redux';
import Modal from '../../../common/components/modal/index';
import { lessonProgress } from '../../../common/config';
import track from '../../../common/utils/track';


function ClickStudentFrame(props) {
  const eventControllersInstance = useContext(ControllerInstance);
  const { redPackageController } = eventControllersInstance.controllers;

  const { userInfo: { role }, lessonInfo, studentsMap, updateDataList, currDrillRoom, monitorParams: { isMonitor, forbidChat, delChat } } = props;
  const isTeacher = role === ZM_USER_TYPE.teacher;
  const isTutor = role === ZM_USER_TYPE.tutor;
  const [show, witchShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [chatInfo, setChatInfo] = useState({});
  const [position, setPosition] = useState({});
  const [prevPosition, setPrevPosition] = useState({});
  const [isTipArrowDown, setIsTipArrowDown] = useState(false);
  const self = useRef(null);
  const { $versionConfig } = window;
  const { lesson_progress } = lessonInfo;

  useEffect(()=>{
    redPackageController.on('clickStudent', async({ data, position, type })=>{
      if (type === 'delteChat') {
        setChatInfo(data);
        setShowDel(true);
        return;
      }
      // 设置定位
      setPrevPosition(position);
      setIsTipArrowDown(false);
      let newTop = position.top;
      if (position.top < 50) {
        newTop = position.top + 70;
        setIsTipArrowDown(true);
      }

      const colPosition = { top: newTop - 50, left: position.left };
      setPosition({ ... colPosition });
      setChatInfo(data);
      witchShow(true);
    });
    function hide() {
      witchShow(false);
    }
    window.addEventListener('blur', hide);
    document.addEventListener('click', hide);
    return ()=>{
      window.removeEventListener('blur', hide);
      document.removeEventListener('click', hide);
    };
  }, []);

  function praiseStart(studentId) {
    eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'userPraise', data: { id: studentId } } });
    witchShow(false);
    track.push(eventControllersInstance, { eventId: 'ZBJ_LTQ_STU_DZ' });
  }

  function redPack(chatInfo, prevPosition) {
    const { userId, username } = chatInfo;
    const { top } = prevPosition;
    const winWidth = document.documentElement.clientWidth;
    const params = {
      id: userId,
      userName: username,
      posX: (+winWidth - 244) / 2,
      posY: +top + 10
    };
    'sendCommonMsgToQt';
    eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'userSendRedPacket', data: params } });
    witchShow(false);
    track.push(eventControllersInstance, { eventId: 'ZBJ_LTQ_STU_FHB' });
  }

  function isOnline(studentId) {
    return studentsMap && studentsMap[studentId] && studentsMap[studentId].online;
  }

  function isAIstudent(studentId) {
    const aiStudents = eventControllersInstance.$store.getState()['allAistudentSet'];
    if (aiStudents.has(studentId)) {
      return true;
    }
    return false;
  }

  // 删除某条消息
  async function deleteChat(chatInfo) {
    if (!chatInfo.isDeleted) {
      await chatInfo.deleteChat();
      updateDataList();
      setShowDel(false);
    }
  }

  function handleCancel() {
    setShowDel(false);
  }

  const isHoldPower = (isTeacher && lesson_progress === lessonProgress.in) || (isTutor && lesson_progress !== lessonProgress.in);
  return <Fragment>
    <div ref={self} style={{ display: show ? 'block' : 'none', ... position }} onClick={e=>e.nativeEvent.stopImmediatePropagation()} className={`${'clickStudentFrame-box'} ${isTipArrowDown ? 'arrowDown' : ''}`}>
      { show ? <div className={'handleGroup'}>
        {isOnline(chatInfo.userId) && !isAIstudent(chatInfo.userId) ?
          <Fragment>
            {(!isMonitor && !currDrillRoom) && <Fragment>
              { isHoldPower ? <span onClick={()=>praiseStart(chatInfo.userId)}>点赞</span> : null }
              { isHoldPower && $versionConfig && $versionConfig.upTableAndMic && <ConnectMic instance={chatInfo}/> }
              { isHoldPower && $versionConfig && $versionConfig.upTableAndMic && <Shangtai instance={chatInfo}/> }
              { isTeacher && (lesson_progress === lessonProgress.in) && <span onClick={()=>redPack(chatInfo, prevPosition)}>红包</span>}
            </Fragment>}
            {forbidChat && <ForbidChat instance={chatInfo} updateDataList={updateDataList} witchShow={witchShow} />}
          </Fragment> : null}
        { isAIstudent(chatInfo.userId) ? <span className={'leaveLine'}>非当前课学生</span> : null }
        { !isOnline(chatInfo.userId) && !isAIstudent(chatInfo.userId) ?
          <Fragment>
            <span className={'leaveLine'}>学生已离线</span>
            {forbidChat && <ForbidChat instance={chatInfo} updateDataList={updateDataList} witchShow={witchShow} />}
          </Fragment> :
          null }
      </div> : ''}
      {/* <DeleteChat instance={chatInfo} updateDataList={updateDataList} hideFrame={()=>witchShow(false)}/> */}
    </div>
    {delChat && <Modal className={'modal'} show={showDel} conform={{ txt: '好的', cb: ()=>deleteChat(chatInfo) }} cancel={{ txt: '取消', cb: handleCancel }} title="确定要删除该条消息吗？" onClose={()=>{(false);}}/>}
  </Fragment>;
}

ClickStudentFrame.propTypes = {
  data: PropsTypes.object,
  studentsMap: PropsTypes.object,
  updateDataList: PropsTypes.func,
  lessonInfo: PropsTypes.any,
  userInfo: PropsTypes.any,
  currDrillRoom: PropsTypes.any,
  monitorParams: PropsTypes.any
};

export default connect(
  ({ studentsMap, lessonInfo, userInfo, currDrillRoom, monitorParams })=>({ studentsMap, lessonInfo, userInfo, currDrillRoom, monitorParams }),
  (dispatch)=>({
    forbidAction: (... arg)=>dispatch(commonAction(... arg))
  }))(ClickStudentFrame);
