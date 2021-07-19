import React, { useRef, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { ControllerInstance } from '../../../main';
import track from '../../../../common/utils/track';
import toast from '../../../../common/components/toast';
import { connect } from 'react-redux';
import ScreenShotBtn from '../screenShotBtn/index';
import { getConfig } from '../../../api';
import ForbidScreenShotBtn from '../forbidScreenshotBtn/index';

import './index.less';


const waitingSentImgs = {};
function StudentInput(props) {
  const inputEl = useRef(null);
  const eventControllersInstance = useContext(ControllerInstance);
  const { chatController } = eventControllersInstance.controllers;
  const [openConfig, setOpenConfig] = useState(false);
  const [isEmpty, setIsEmputy] = useState(true);
  const { lessonInfo, selfForbidChat, allForbidChat, systemForbidChat, sendMessage, studentsMap, allForbidChatTutor, handlepPrscrn, chatFilter, stuForbidScreenshot } = props;
  const { id } = props.userInfo;
  const myInfo = studentsMap && studentsMap[id];
  const tutorForbidChat = myInfo && allForbidChatTutor[myInfo.tutorId];
  useEffect(() => {
    getConfig(eventControllersInstance).then(res=>{
      if (res && res.config && res.config.items) {
        setOpenConfig(res.config.items[1004] === 'true');
      }
    });
    chatController.on('chatScreenShotOnForbidchatDone', (data)=>{
      eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: '你已被禁言，暂时不能发送截图' } });
      if (inputEl.current) {
        const { id, imageUrl } = data;
        const img = new Image();
        img.src = imageUrl || 'https://web-data.zmlearn.com/image/rvg2uhX5GgVL4xfLWAjtvp/loading.png';
        img.id = data.id;
        inputEl.current.appendChild(img);
        waitingSentImgs[id] = data;
      }
    });
  }, []);

  // 处理enter发送
  function handleKeyDown(e) {
    if (e && e.keyCode === 13 && !(e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e && e.keyCode === 13 && (e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
    }
  }

  // 处理输入
  function handleInput(e) {
    const realContent = inputEl.current.innerHTML.replace(/<br>/g, '\n').replace(/(<|<\/){1}(\S+?)(>|>\/){1}/g, '');
    if (realContent.replace(/\\n/g, '\\ n').length >= 200) {
      inputEl.current.blur();
      inputEl.current.innerHTML = realContent.substr(0, 199);
      toast('聊天内容不超过200字');
      e.preventDefault();
    }
    setIsEmputy(!inputEl.current.innerHTML);
  }

  // 处理提交
  function handleSubmit() {
    let toastMsg = '';
    if (selfForbidChat) {
      toastMsg = '你已被老师禁言，暂时不能发言';
    }
    if (allForbidChat || systemForbidChat || tutorForbidChat) {
      toastMsg = '全员禁言中，暂时不能发言哦';
    }
    if (toastMsg) {
      eventControllersInstance.send('QtAction', { action: 'toast', data: { msgType: 'Tips', msgPos: 'Center', msgText: toastMsg } }); return;
    }
    const htmlText = inputEl.current.innerHTML;
    // 处理图片
    const unImgHtmlText = htmlText.replace(/<img src=(.+?)>/, (img)=>{
      const imgtextId = img.match(new RegExp('(?<=id=\\")(\\S+)(?=\\")'))[0];
      if (imgtextId) {
        const waitingSendImg = waitingSentImgs[imgtextId];
        if (waitingSendImg) {
          const { imageUrl, width = 100, height = 100 } = waitingSendImg;
          sendMessage({ content: JSON.stringify({ img_url: imageUrl, img_size: { width, height } }), type: 'CHAT_SCREENSHOT' });
        }
      }
      return '';
    });
    // 去除domTxt
    const unDomHtmlText = unImgHtmlText.replace(/<br>/g, '\n').replace(/(<|<\/){1}(\S+?)(>|>\/){1}/g, '');
    if (unDomHtmlText) {
      sendMessage({ content: unDomHtmlText.replace(/\\n/g, '\\ n').replace(/&nbsp;/g, ''), type: 'CHAT' });
    }
    inputEl.current.innerHTML = '';
    setIsEmputy(true);
  }

  function handleSendEmoji() {
    track.push(eventControllersInstance, { eventId: 'BIAOQING' });
    eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'showEmojiPanel', data: { value: true } } });
  }

  const { classType, playType } = lessonInfo;
  const cantChot = openConfig && (classType === 2 && playType !== 1);

  return (
    <div className={'role-chat-inputBox student-chat-inputBox'}>
      <div className={'chatTools'}>
        <div>
          <svg t="1614567490967" onClick={handleSendEmoji} className={'emoji'} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1262" width="128" height="128"><path d="M508.544 66.88A448 448 0 0 0 60.992 514.432a448 448 0 0 0 447.552 447.552 448 448 0 0 0 447.552-447.552 448 448 0 0 0-447.552-447.552z m0 831.104a384 384 0 0 1-383.552-383.552 384 384 0 0 1 383.552-383.552 384 384 0 0 1 383.552 383.552 384 384 0 0 1-383.552 383.552z" p-id="1263"></path><path d="M367.488 404.48m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="1264"></path><path d="M635.52 404.48m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="1265"></path><path d="M669.248 613.056a31.936 31.936 0 0 0-44.16 9.664c-20.8 32.448-67.968 53.44-120.064 53.44-52.096 0-99.2-20.928-120-53.376a32 32 0 1 0-53.888 34.496c32.768 51.136 99.392 82.88 173.888 82.88 74.56 0 141.184-31.744 173.952-82.944a32 32 0 0 0-9.728-44.16z" p-id="1266"></path></svg>
          {/* <img className={emoji} onClick={handleSendEmoji} src={emojiIcon}/> */}
          {cantChot && stuForbidScreenshot && <ScreenShotBtn handlepPrscrn={handlepPrscrn}/>}
          {cantChot && !stuForbidScreenshot && <ForbidScreenShotBtn/>}
        </div>
        <div>
          {chatFilter}
        </div>
      </div>
      <div className={'inputOut'}>
        <div className={'chatInput'}>
          {isEmpty && <span>发个言...</span>}
          <div ref={inputEl} onInput={handleInput} contentEditable="true" onKeyDown={handleKeyDown} onPaste={(e)=>{ e.preventDefault();}}>

          </div>
        </div>
      </div>
      <div className={'chatFooter'}>
        <div className={'sendWrap'}>
          <button disabled={selfForbidChat || allForbidChat || systemForbidChat || tutorForbidChat || isEmpty} className={'sendBtn'} onClick={handleSubmit}>
          发送
          </button>
        </div>
      </div>
    </div>
  );
}

StudentInput.propTypes = {
  allForbidChat: PropTypes.bool,
  selfForbidChat: PropTypes.bool,
  systemForbidChat: PropTypes.bool,
  sendMessage: PropTypes.func,
  studentsMap: PropTypes.object,
  allForbidChatTutor: PropTypes.object,
  handlepPrscrn: PropTypes.func,
  chatFilter: PropTypes.any,
  stuForbidScreenshot: PropTypes.bool,
  userInfo: PropTypes.object,
  lessonInfo: PropTypes.object
};

export default connect(
  ({ studentsMap, userInfo, lessonInfo }) => ({ studentsMap, userInfo, lessonInfo }),
  {})(StudentInput);
