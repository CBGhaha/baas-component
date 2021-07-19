import React, { useEffect, useState, useRef, useContext } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { ControllerInstance } from '../../../../main';
import ZmIcon from '../../../../../common/components/zmIcon';
import { preloadImageByUrl } from '../../../../../common/utils/index.js';
import './index.less';
import errImg from '../../../../../common/assets/images/loaderror.png';
import shareImg from '../../../../../common/assets/images/share.png';

function calWrapSize(siteImg, { width, height } = {}) {
  if (siteImg) {
    return { width: '140px', height: '140px' };
  }
  let wrapSize = { width: '20px', height: '20px' };
  if (width > height) {
    const percent = height / width;
    wrapSize.height = `${Math.max(Math.min(140, width > 140 ? 140 * percent : height * percent), 20)}px`;
    wrapSize.width = `${Math.max(Math.min(140, width), 20)}px`;
  } else {
    const percent = width / height;
    wrapSize.width = `${Math.max(Math.min(140, 140, height > 140 ? 140 * percent : width * percent), 20)}px`;
    wrapSize.height = `${Math.max(Math.min(140, height), 20)}px`;
  }
  return wrapSize;
}

function screenShot(props) {
  const [loading, setLoading] = useState(false);
  const [errTips, setErrTips] = useState('');
  const $img = useRef(null);
  const eventControllersInstance = useContext(ControllerInstance);
  const { data: { content, type, siteImg, specialContent, imageUrl = errImg, success, verify, sharePicture }, allForbidChat, systemForbidChat, isSelf } = props;
  const { img_size: imgSize } = JSON.parse(specialContent || '{}');
  const wrapSize = calWrapSize(siteImg, imgSize);
  if (!verify && verify !== undefined) {
    wrapSize.width = '100px';
    wrapSize.height = '100px';
  }

  function previewImage() {
    eventControllersInstance.send('QtAction', { action: 'previewImage', data: { imgUrl: content } });
  }

  useEffect(() => {
    if (success === false && imageUrl) {
      if (verify !== false) setErrTips(allForbidChat || systemForbidChat ? '禁言中，暂时不支持发送消息' : '发送失败,');
      setLoading(true);
      preloadImageByUrl(imageUrl)
        .then(() => {
          if (!$img.current) return;
          $img.current.src = imageUrl;
        })
        .catch(e => {
          console.log('>>e', e);
        })
        .finally(() => {
          if (!$img.current) return;
          setLoading(false);
        });
    }
  }, [imageUrl, success]);

  function handleReSendImage() {
    eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'reSendImage', data: props.data } });
  }

  useEffect(() => {
    if (type === 'CHAT_SCREENSHOT' && !siteImg && content) {
      setLoading(true);
      preloadImageByUrl(content)
        .then(() => {
          if (!$img.current) return;
          $img.current.src = content;
        })
        .catch(e => {
          console.log('>>e', e);
        })
        .finally(() => {
          if (!$img.current) return;
          setLoading(false);
        });
    }
  }, [siteImg, content, success]);

  const { userInfo: { role }, lessonInfo: { playType, classType, courseMark, lesson_real_stage } } = props;
  const allowCouresType = +playType === 0 && ((+classType === 2 && +courseMark === 2) || (+classType === 0 && +courseMark === 1));

  return (
    <div className={'shotBox'}>
      {
        role === ZM_USER_TYPE.teacher && lesson_real_stage === 'LESSON_STARTED' && allowCouresType && isSelf && !loading && !siteImg && <span className={'shareIcon'} onClick={sharePicture}><img src={shareImg}/></span>
      }
      {type === 'CHAT_SCREENSHOT' && (
        <div style={wrapSize} className={`${'screenShot'} ${isSelf ? 'screenShotIsSelf' : ''}`}>
          <img ref={$img} style={wrapSize} src={errImg} onClick={previewImage} />
          {(loading || siteImg) && (
            <div className={'siteImg'}>
              <ZmIcon className={'icon'} icon="icon-loading" />
            </div>
          )}
        </div>
      )}
      {errTips && <p className={'errTips'}><ZmIcon className={'wrong'} icon="icon-wrong"/>{errTips}{!(allForbidChat || systemForbidChat) && <span onClick={handleReSendImage}>重新发送</span>}</p>}
    </div>
  );
}
screenShot.propTypes = {
  data: PropsTypes.object,
  allForbidChat: PropsTypes.bool,
  systemForbidChat: PropsTypes.bool,
  isSelf: PropsTypes.bool,
  userInfo: PropsTypes.any,
  lessonInfo: PropsTypes.any
};

export default connect(
  ({ allForbidChat, systemForbidChat, userInfo, lessonInfo }) => ({ allForbidChat, systemForbidChat, userInfo, lessonInfo }),
  () => ({})
)(screenShot);