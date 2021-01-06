/*
 * 课件白板答题信令
 */
import store from '../../../redux/store';
import commonAction from '../../../redux/actions/common';
import SocketController from '../controller';
export const WHITEBOARD_CONTROLLER = 'whiteBoardController';


// 接受消息action
const acceptAction = {
  //  监听课件 答题交互
  whiteboard_data(controller, { data }) {
    const action = data[3] || '';
    if (action && action === '!switch-slide') { // 翻页操作
      const pageNo = data[4][0];
      // 设置课件页码
      controller.emit('setPage', pageNo);
    }
    if (action && action === '!load-slides') {
      const id = data[4][0];
      controller.emit('changeCouerseId', id);
    }
    if (data[2] > -1) { // 画板操作
      controller.emit('drawTool', {
        action: 'pushDataToLayer',
        payload: [data]
      });
    }
    if (action && action === 'zmlMessage') {
      const [$action, payload] = data[4];
      controller.emit('zmlMessage', {
        action: $action,
        data: payload
      });
    }
    return data;
  },
  zmg_data(controller, { data }) {
    controller.emit('zmgMessage', data);
    if (data.action === 'controllerChange') {
      store.dispatch(commonAction('isZmlExaming', +data.data === -1));
    }
    return data;
  },
  closeZMLExam() {
    return true;
  },
  respondHistory(controller, data) {
    // console.log('respondHistory-sss',data);
    if (data && data) {
      const { packets } = data.data;
      let isAnswering = false;
      packets.forEach(i=>{
        if (i.action === 'controllerChange') {
          isAnswering = +i.data === -1;
        }
      });
      store.dispatch(commonAction('isZmlExaming', isAnswering));
    }
    return data;
  }
};

// 发送消息action
const sendAction = {
  getCoursewareList() {

  },
  current_whiteboard_data(controller, res) {
    return res;
  },
  whiteboard_data() {

  },
  draw_tools_data() {

  },
  zmg_data() {

  },
  zmgGetHistory() {

  },
  whiteboard_page(controller, ... res) {
    store.dispatch(commonAction('isZmlExaming', false));
    try {
      // const { data } = res[0];
      const dataList = [];
      let actionMap = {};
      res[0].forEach(msg => {
        if (msg.data[2] > -1) {
          dataList.push(msg.data);
        } else {
          const [action, payload] = msg.data[4];
          if (msg.data[3] === 'zmlMessage') {
            if (!actionMap[action]) actionMap[action] = [];
            if (action === 'questionOperation') {
              actionMap[action].push(payload);
            } else {
              actionMap[action] = [payload];
            }

          }
        }
      });
      return { drawToolDatas: dataList, zmlMessageDatas: actionMap };
      // controller.emit('drawTool', {
      //   action: 'pushDataToLayer',
      //   payload: dataList
      // });
      // for (let key in actionMap) {
      //   controller.emit('zmlMessage', {
      //     action: key,
      //     data: actionMap[key]
      //   });
      // }
    } catch (err) {
      console.log(err);
    }
  },
  zmlIsDoAnswer(self, res) {
    return res;
  }
};
const whiteBoardController = new SocketController(WHITEBOARD_CONTROLLER, acceptAction, sendAction);
export default whiteBoardController;
