import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropsTypes from 'prop-types';
import ClickStudentFrame from './components/clickStudentFrame/index';
import RedPackAndPriseDetail from './components/redPackAndPriseDetail';
import SharePicture from './components/sharePicture';
import Input from './components/input/index';
import UnReadMsgMum from './components/unReadMsgNum/index';
import ChatItem from './components/chatItem/index';
import './index.less';
import { random } from './utils/index';
import track from '../common/utils/track';

class Chat extends PureComponent {
  timer = null;
  virtuoso = null;
  unReadMsg = 0;
  unReadMsgRef = null;
  // eventControllersInstance = null
  constructor(props) {
    super(props);
    this.eventControllersInstance = props.eventControllersInstance ;
    this.updateDataList = this.updateDataList.bind(this);
    this.setChatFilterTeacher = this.setChatFilterTeacher.bind(this);
    this.requestChat = this.requestChat.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      dataList: [],
      atBottom: true,
      chatFilterTeacher: false,
      role: props.userInfo.role
    };
  }
  componentDidMount() {
    const { $versionConfig } = window;
    const { controllers: { chatController }, chatUtilsInstance: { chatGlobalData } } = this.eventControllersInstance;
    this.eventControllersInstance.send('current_user_connect');
    this.eventControllersInstance.send('init_connect'); // 获取课堂状态
    this.eventControllersInstance.send('current_activity');
    this.eventControllersInstance.send('current_chat_message'); // h获取历史聊天消息
    this.eventControllersInstance.send('off_chat_list'); // 获取历史禁言列表
    if ($versionConfig && $versionConfig.upTableAndMic) this.eventControllersInstance.send('stuOnTableAndMic'); // 获取当前上台上麦学生列表
    chatController.on('update_reputation', () => this.updateDataList(true));
    chatController.on('chatScreenShot_done', () => this.updateDataList(true));
    chatController.on('chatTabActive', () => this.scrollToBottom(200, true));
    chatController.on('chatMsgAdd', count => {
      // 监听聊天消息增减
      this.unReadMsg += count;
      this.unReadMsgRef.changeUnreadNum(this.unReadMsg);
    });
    // 监听老师（其他老师删除学生消息）
    chatController.on('remove_chat_message', async chatInfo => {

      // debugger;
      try {
        const { userInfo } = this.props;
        const {
          data: { serNum, userId }
        } = chatInfo;
        if (userInfo.role === ZM_USER_TYPE.student && +userInfo.id !== +userId) {
          const index = chatGlobalData.chat.findIndex(i => i.serNum === serNum);
          if (index > -1) {
            chatGlobalData.chat.splice(index, 1);
            this.updateDataList(true);
          }
        } else {
          const chatInstance = chatGlobalData.chat.find(i => i.serNum === serNum);
          if (chatInstance && !chatInstance.removed) {
            chatInstance.deleteChat(true);
          }
        }

      } catch (err) {
        console.error(err);
      }
    });
    // 开始消息轮询
    this.requestChat();
  }
  scrollToBottom(time = 200, autoBottom = false) {
    this.timer = setTimeout(() => {
      const { atBottom } = this.state;
      if (atBottom || autoBottom) {
        const $dom = this.virtuoso;
        $dom.scrollTop = 1000 * 100000;
      }
      this.timer = null;
    }, time);
  }
  componentDidUpdate(prevProps, prevState) {
    const { dataList, atBottom } = this.state;
    // 当前在底部=>自动再次定位到底部
    if (prevState.dataList !== dataList) {
      if (atBottom) {
        this.scrollToBottom();
      }
    }
  }

  // 监听用户手动滚动
  handleScroll() {
    const { chatUtilsInstance: { chatGlobalData } } = this.eventControllersInstance;
    const $dom = this.virtuoso;
    const { scrollTop, offsetHeight, scrollHeight } = $dom ;
    const dis = scrollHeight - (scrollTop + offsetHeight);
    this.setState({
      atBottom: parseInt(Math.abs(dis)) <= (this.state.dataList.length === chatGlobalData.msgTotalLength ? 300 : 100)
    });
  }
  updateDataList(bool) {
    const { chatUtilsInstance: { chatGlobalData } } = this.eventControllersInstance;
    const { atBottom } = this.state;
    let dataList = [];
    if (atBottom || bool) {
      // eslint-disable-next-line react/prop-types
      const { lessonInfo: { playType }, userInfo: { role } } = this.props;

      // AI课班主任筛选非机器人
      if (+playType === 1 && role === ZM_USER_TYPE.tutor) {
        const { allAistudentSet } = this.props;
        dataList = [...(chatGlobalData.filter ? chatGlobalData.chat.filter(msg => !allAistudentSet.has(msg.userId)) : chatGlobalData.chat)];
      // 直播课
      } else {
        dataList = [...(chatGlobalData.filter ? chatGlobalData.chat.filter(msg => msg.role !== 'STUDENT') : chatGlobalData.chat)];
      }
      this.unReadMsg = 0;
      this.unReadMsgRef.changeUnreadNum(0);
      this.setState({
        dataList
      });
    }
  }
  setChatFilterTeacher(bool) {
    this.eventControllersInstance.chatUtilsInstance.chatGlobalData.filter = bool;
    this.setState({
      chatFilterTeacher: bool
    });
    this.updateDataList(true);
    const { atBottom } = this.state;
    if (atBottom) {
      this.scrollToBottom(200, true);
    }
    track.push(this.eventControllersInstance, { eventId: 'ROOM_STUDENT_CHAT_JUST_TEACHER', eventParam: { chatFilterTeacher: bool } });
  }
  // 定时递归加载数据
  requestChat() {
    // 性能优化-存在未读消息才加载数据
    if (this.unReadMsg > 0) {
      this.updateDataList();
    }
    setTimeout(() => {
      this.requestChat();
    }, random(300, 500));
  }
  componentWillUnmount() {
    const { chatController } = this.eventControllersInstance.controllers;
    chatController.removeAllListeners('chatMsgAdd');
    chatController.removeAllListeners('remove_chat_message');
    chatController.removeAllListeners('update_reputation');
    chatController.removeAllListeners('chatTabActive');
    chatController.removeAllListeners('chatScreenShot_done');
  }

  render() {
    const { atBottom, dataList, chatFilterTeacher, role } = this.state;
    const msgTotal = dataList.length;
    const { canChat } = this.props.monitorParams;
    return (
      <div className={`${'chat-component-box'} ${role === ZM_USER_TYPE.student ? 'chat-component-theme' : ''} ${msgTotal > 0 ? '' : 'isEmpty'}`}>
        <UnReadMsgMum ref={i => (this.unReadMsgRef = i)} userInfo={this.props.userInfo} show={!atBottom} scrollToBottom={() => this.scrollToBottom(200, true)} />
        <div className={'chatBox'}>
          <div id="scroll-box" ref={e => (this.virtuoso = e)} onScroll={this.handleScroll} className={`${'chat'} scroll-box`}>
            {
              msgTotal > 0 ? (dataList.map((item, index)=> <div key={item.serNum || item.ts} className={`${'chatItem'} ${msgTotal > 10 && index + 1 === msgTotal ? 'isLast' : ''}` }><ChatItem data={item} /></div>)) :
                <div className={'empty'}>
                  <img src="https://web-data.zmlearn.com/image/nc91kggr4uVyvSBG3VBpKw/no-data-img.png"/>
                  <p className={'noDataText'}>当前没有消息</p>
                </div>
            }
          </div>
        </div>
        <RedPackAndPriseDetail />
        <SharePicture/>
        <ClickStudentFrame
          updateDataList={() => {
            this.updateDataList(true);
          }}
        />
        {canChat && <Input
          updateDataList={this.updateDataList}
          chatFilterTeacher={chatFilterTeacher}
          setChatFilterTeacher={this.setChatFilterTeacher}
          scrollToBottom={() => this.scrollToBottom(200, true)}
          eventControllersInstance={this.props.eventControllersInstance}
        />}
      </div>
    );
  }
}
Chat.propTypes = {
  eventControllersInstance: PropsTypes.any,
  allAistudentSet: PropsTypes.any,
  userInfo: PropsTypes.any,
  monitorParams: PropsTypes.any
};


export default connect(
  ({ allAistudentSet, lessonInfo, userInfo, monitorParams }) => ({ allAistudentSet, lessonInfo, userInfo, monitorParams }),
  () => ({})
)(Chat);