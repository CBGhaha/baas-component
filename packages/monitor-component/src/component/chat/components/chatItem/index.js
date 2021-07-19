import React from 'react';
import PropsTypes from 'prop-types';
import './index.less';
import Chat from './items/chat/index';
import Notice from './items/notice/index';
import Praise from './items/praise/index';
import RedPackage from './items/redPackage/index';
// import ScreenShot from './items/screenShot/index';

const itemsMap = {
  CHAT: Chat,
  CHAT_SCREENSHOT: Chat,
  CHAT_EMOTICON: Chat,
  NOTICE: Notice,
  SHOW_UPDATE_MSG: Notice,
  PRAISE: Praise,
  RED_PACKET: RedPackage
};
export default function ChatItem(props) {
  const { data } = props;
  return <div className={'items-box'}>
    {React.createElement(itemsMap[data.type], { data })}
  </div>;
}
ChatItem.propTypes = {
  data: PropsTypes.object
};