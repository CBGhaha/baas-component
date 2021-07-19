import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lessonProgress } from '../../../../common/config';
import ZmIcon from '../../../../common/components/zmIcon';
import ScreenShotBtn from '../screenShotBtn/index';
import './index.less';

const targetContentMap = {
  ALL: '所有人',
  TUTOR: '只助教',
  TEACHER: '只主讲'
};

function TeacherInput(props) {
  const [showTarget, setShowTarget] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const inputEl = useRef(null);
  const { lessonInfo, userInfo, allForbidChat, targetList, target, handleAllForbidChat, changeTarget, sendMessage, handlepPrscrn, allForbidChatTutor, chatFilter, handleTeacherForbidStuPic, stuForbidScreenshot, monitorParams } = props;

  // enter发送
  function sendMessageByEnter(e) {
    const codeNum = e.keyCode;
    if (codeNum === 13 && !e.shiftKey) {
      const content = (inputEl.current.value || '').trim();
      if (!content) return;
      inputEl.current.value = null;
      sendMessage({ content: content.replace(/\\n/g, '\\ n'), type: 'CHAT' });
      setDisabled(true);
    }
  }
  // 点击发送
  function sendMessageByClick() {
    const content = (inputEl.current.value || '').trim();
    if (!content) return;
    inputEl.current.value = '';
    sendMessage({ content: content.replace(/\\n/g, '\\ n'), type: 'CHAT' });
    setDisabled(true);
  }
  // 输入框change
  function onChange(e) {
    if (e.target.value) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }
  function handleKeyDown(e) {
    if (e && e.keyCode === 13) {
      e.preventDefault();
    }
  }

  useEffect(() => {
    function hideTarget() {
      setShowTarget(false);
    }
    window.addEventListener('blur', hideTarget);
    return () => {
      window.removeEventListener('blur', hideTarget);
    };
  }, []);

  const { playType, lesson_progress, classType } = lessonInfo;
  const { id, userType } = userInfo;
  const isAi = +playType === 1;
  const inLesson = lesson_progress === lessonProgress.in;
  const isAllforbidChat = allForbidChat || allForbidChatTutor[id];
  // 课程类型：小班课、临时课； 角色：讲师； 显示禁止截图按钮入口
  const isTeacher = userType === 'TEACHER';
  const isForbidImgBtn = classType === 2;
  const { isMonitor } = monitorParams;
  return (
    <div className={'role-chat-inputBox'}>
      { !isMonitor && <div className={'chatTools'}>
        <div>
          {!(isAi && inLesson) && <div className={'forbidChat'}>
            <ZmIcon icon='icon-forbidChat' onClick={()=>handleAllForbidChat(isAllforbidChat)} className={`${'forbidChatIcon'} ${isAllforbidChat ? 'isAllforbidChat' : ''}`} />
            <div className={'pop'}>开启/关闭全员禁言</div>
          </div>}
          {isForbidImgBtn && isTeacher && <div className={'forbidChat'}>
            <ZmIcon icon='icon-forbidImg' onClick={()=>handleTeacherForbidStuPic()} className={`${'forbidChatIcon'} ${!stuForbidScreenshot ? 'isAllforbidChat' : ''}`} />
            <div className={'pop'}>{stuForbidScreenshot ? '禁止学生传图' : '解除禁止传图'}</div>
          </div>}
          <ScreenShotBtn handlepPrscrn={handlepPrscrn}/>
        </div>
        <div>
          {chatFilter}
        </div>
      </div>
      }

      <div className={'inputOut'}>
        <textarea
          ref={inputEl}
          placeholder="发个言..."
          resize="none"
          rows="2"
          className={'chatInput'}
          autoFocus
          maxLength="200"
          onKeyUp={sendMessageByEnter}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={'chatFooter'}>
        <div className={'sendWrap'}>
          { (!isMonitor && !isAi) && <div
            onClick={e => {
              setShowTarget(!showTarget);
              e.nativeEvent.stopImmediatePropagation();
            }}
            className={`${'target'} ${showTarget ? 'showTarget' : ''}`}
          >
            {targetContentMap[target]}
            <ul style={{ display: showTarget ? 'block' : 'none' }} className={'select'}>
              {targetList.map(i => (
                <li key={i.key} className={target === i.key ? 'actived' : ''} onClick={() => changeTarget(i.key)}>
                  {i.intro}
                </li>
              ))}
            </ul>
            <ZmIcon icon="back" className={'arrow'} />
          </div>}
          <button disabled={disabled} className={'sendBtn'} onClick={sendMessageByClick}>
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

TeacherInput.propTypes = {
  allForbidChat: PropTypes.bool,
  targetList: PropTypes.array,
  allForbidChatTutor: PropTypes.object,
  target: PropTypes.string,
  changeTarget: PropTypes.func,
  handleAllForbidChat: PropTypes.func,
  sendMessage: PropTypes.func,
  handlepPrscrn: PropTypes.func,
  chatFilter: PropTypes.any,
  handleTeacherForbidStuPic: PropTypes.func,
  stuForbidScreenshot: PropTypes.bool,
  userInfo: PropTypes.object,
  lessonInfo: PropTypes.object,
  monitorParams: PropTypes.object
};
export default connect(
  ({ userInfo, lessonInfo, monitorParams }) => ({ userInfo, lessonInfo, monitorParams }),
  {})(TeacherInput);