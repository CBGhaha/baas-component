import React, { useContext, useState } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { ControllerInstance } from '../../../../main';
import './index.less';
import ZmIcon from '../../../../../common/components/zmIcon';
import ScreenShot from '../screenShot/index';
import track from '../../../../../common/utils/track';

const starMap = {
  SIGN_ON_STAR: 'https://web-data.zmlearn.com/image/shWAk13YqCsgAu97Mwe2m8/qdzx.png', //签到
  PRAISE_STAR: 'https://web-data.zmlearn.com/image/tFGuKbMVnAY2hsPNg7NuEn/byzx.png', //表扬
  COIN_STAR: 'https://web-data.zmlearn.com/image/d3MRnYx6nqbKnQ2saXGGio/jbzx.png'//金币
};

const roleNameMap = {
  TEACHER: 'https://web-data.zmlearn.com/image/9h3npjeHzFPHQoudhjff4N/zj.png',
  TUTOR: 'https://web-data.zmlearn.com/image/s7SCW8oMiNJEz4AeS6NgyT/fd.png'
};
function Chat(props) {
  const eventControllersInstance = useContext(ControllerInstance);
  const { redPackageController } = eventControllersInstance.controllers;

  const {
    userInfo, data: { username, content, role, removed, reputations, type, emoticonAlt, userId }
  } = props;
  const [isDelete, setIsDelete] = useState(removed);
  props.data.onMove(()=>{
    setIsDelete(true);
  });
  const isSelf = +userInfo.id === +userId;
  const roleNameImg = roleNameMap[role];
  const canClick = userInfo.role !== ZM_USER_TYPE.student && role === ZM_USER_TYPE.student;

  function isAIstudent(studentId) {
    const aiStudents = eventControllersInstance.$store.getState()['allAistudentSet'];
    if (aiStudents.has(studentId)) {
      return true;
    }
    return false;
  }

  function handleClick(e, type) {
    if (canClick) {
      e.nativeEvent.stopImmediatePropagation();
      e.persist();
      // const aiStudents = store.getState()['allAistudentSet'];
      // if (aiStudents.has(userId)) return ;

      const targetClientRect = e.target.getBoundingClientRect();
      const parent = document.getElementsByClassName('chat-component-box')[0];
      const parentClientRect = parent.getBoundingClientRect();
      redPackageController.emit('clickStudent', {
        data: props.data,
        position: {
          left: +targetClientRect.left - parentClientRect.left,
          top: targetClientRect.top - parentClientRect.top
        },
        type
      });
    }
    let eventName = type === 'delteChat' ? 'ZBJ_LTQ_DELETE' : 'ZBJ_LTQ_STU';
    track.push(eventControllersInstance, { eventId: eventName });
  }
  const deleteIcon = userInfo.role !== ZM_USER_TYPE.student && role === 'STUDENT' && !isAIstudent(userId) ?
    <div className={'zmchat-delWrap'}>
      <ZmIcon className={`${'zmchat-deleteIcon'}`} icon="icon-delete" onClick={(e)=>handleClick(e, 'delteChat')} />
    </div> :
    null;

  return (
    <div className={`${'zmchat-chat-item-box'} ${isSelf ? 'zmchat-boxSelf' : ''}`}>
      <span className={'info'}>
        {reputations && reputations.length > 0 && reputations.map((item, index) => <img className={`${'zmchat-star'} ${item}`} key={index} src={starMap[item]} />)}
        {roleNameImg && <img className={'zmchat-roleName'} src={roleNameImg} />}
        <span onClick={handleClick} className={`${isSelf ? 'zmchat-self' : ''} ${canClick ? 'zmchat-notStudent' : ''} ${'zmchat-userName'} ${canClick ? 'zmchat-cursor' : ''}`}>
          <span title={username}>{username}</span>
          {/* <b>{username}</b> */}
          {/* {isSelf && userInfo.role === ZM_USER_TYPE.student && '(我)'} */}
        </span>
      </span>
      {isDelete ? (
        <span className={`${'zmchat-content'} ${'zmchat-remove'}`}>发言涉嫌违规，已被删除</span>
      ) : (
        <React.Fragment>
          {type === 'CHAT' &&
          <div className={'zmchat-chatcont'}>
            <span className={`${'zmchat-content'} ${isSelf ? 'zmchat-chatIsSelf' : ''}` }>{content.replace(/\\n/g, ' ')}</span>
            { deleteIcon }
          </div>
          }
          {type === 'CHAT_EMOTICON' && (
            <span className={`${'zmchat-content'} ${'zmchat-emotcontent'}`}>
              <div className={`${'zmchat-imgBox'} ${isSelf ? 'zmchat-isSelfImgBox' : ''}`}>
                <img src={content} className={'zmchat-img'} alt={emoticonAlt} />
              </div>
              { deleteIcon }
            </span>
          )}
          {
            type === 'CHAT_SCREENSHOT' && <div className={'shot'}>
              <ScreenShot data={props.data} isSelf={isSelf} />
              <span></span>
              { deleteIcon }
            </div>
          }
        </React.Fragment>
      )}
    </div>
  );
}
Chat.propTypes = {
  data: PropsTypes.object,
  userInfo: PropsTypes.any
};

export default connect(
  ({ userInfo }) => ({ userInfo }),
  () => ({})
)(Chat);