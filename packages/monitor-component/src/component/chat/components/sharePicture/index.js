import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import PropsTypes from 'prop-types';
import { ControllerInstance } from '../../main';
import toast from '../../../common/components/toast/index';
import track from '../../../common/utils/track';
import Panel from '../panel/index';
import './index.less';

function Detail(props) {
  const eventControllersInstance = useContext(ControllerInstance);
  const { chatController } = eventControllersInstance.controllers;
  const [show, setShow] = useState(false);
  const [shareImgUrl, setShareImgUrl] = useState('');
  const { courseTitle, lessonNum, lessonId } = props.lessonInfo;

  function handleMessage(res) {
    setShow(true);
    setShareImgUrl(res);
  }

  useEffect(() => {
    chatController.on('sharePicture', res => {
      handleMessage(res);
    });
    return ()=>{
      chatController.removeListener('sharePicture', handleMessage);
    };
  }, []);

  async function handleSubmit() {
    track.push(eventControllersInstance, { eventId: 'SHARECONFIRM' });
    const res = await chatController.send('chat_share_points', { action: 'CALL_SHARE', screenShotURL: shareImgUrl, lessonId });
    if (res && res.data && res.data.shareSucecss) {
      setShow(false);
      setShareImgUrl('');
      toast('分享成功');
    } else {
      toast('分享成功失败，请重试');
    }
  }

  const { firstName } = props.userInfo;
  return (
    <Panel
      show= {show}
      header= {'分享至微信'}
      setShow={setShow}
    >
      <React.Fragment>
        <div className={'sharePicture-content'}>
          <div>
          各位同学～<br/>
            {courseTitle}第{lessonNum}讲的核心重点来了～<br/>
            {firstName}老师提醒你记得重点记忆哦～
          </div>
          <img src={shareImgUrl}/>
        </div>
        <button className={'sharePicture-btn'} onClick={handleSubmit}>立即发送</button>
      </React.Fragment>

    </Panel>
  );
}

Detail.propTypes = {
  lessonInfo: PropsTypes.object,
  userInfo: PropsTypes.object
};

export default connect(
  ({ lessonInfo, userInfo }) => ({ lessonInfo, userInfo }),
  () => ({})
)(Detail);