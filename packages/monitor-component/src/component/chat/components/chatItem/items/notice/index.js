import React, { useContext } from 'react';
import PropsTypes from 'prop-types';
import { ControllerInstance } from '../../../../main';
import './index.less';

export default function Notice(props) {
  const eventControllersInstance = useContext(ControllerInstance);
  const { data: { type, content } } = props;
  const isUpdateTips = type === 'SHOW_UPDATE_MSG';
  function handleShowUpadte() {
    if (isUpdateTips) {
      eventControllersInstance.send('QtAction', { action: 'showUpdateTipsinClass' });
    }
  }
  return <div className={'zmchat-notice-box'} style={{ cursor: isUpdateTips ? 'pointer' : 'default' }} onClick={handleShowUpadte}>
    {/* <ZmIcon icon="icon-kehuduanyinliang" className={noticeIcon}/> */}
    <span className={'zmchat-cont'}>{content}</span>
  </div>;
}
Notice.propTypes = {
  data: PropsTypes.object
};