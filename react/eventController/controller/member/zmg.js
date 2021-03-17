/*
 * 课件白板答题信令
 */
import SocketController from '../controller';
import store from '@/redux/store';
import commonAction from '@/redux/actions/common';


export const ZMG_CONTROLLER = 'zmgController';


// 接受消息action
const acceptAction = {
  zmg_data(controller, { data }) {
    controller.emit('zmgMessage', data);
    if (data.action === 'controllerChange') {
      store.dispatch(commonAction('isZmlExaming', +data.data === -1));
    }
    return data;
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
  },
  zmgLocalhost(controller, data) {
    return data;
  }
};

// 发送消息action
const sendAction = {
  zmg_data() {

  },
  zmgGetHistory() {

  },
  get_zmgLocalhost(controller, data) {
    return data;
  }
};
const zmgController = new SocketController(ZMG_CONTROLLER, acceptAction, sendAction);
export default zmgController;
