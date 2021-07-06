/*
 * 其他信令
 */
import SocketController from '../controller';
import store from '../../../redux/store';
import commonAction from '../../../redux/actions/common';

export const OTHER_CONTROLLER = 'otherController';

// 接受消息action
const acceptAction = {
  // 课堂状态改变
  // 换肤
  theme(controller, { theme = 'black ' }) {
    const curruntTheme = zmSessionStorage['app-theme'];
    document.body.classList.remove(curruntTheme);
    document.body.classList.add(`${theme}-theme`);
    zmSessionStorage['app-theme'] = `${theme}-theme`;
  },
  aiReplayVideo(controller, data) {
    return data;
  },
  user_connect(controller, data) {
    if (data && data.role === 'STUDENT') {
      const { studentsMap } = store.getState();
      store.dispatch(commonAction('studentsMap', { ...studentsMap, [data.userId]: data }));
      return { ...data, id: data.userId };
    }
    return false;
  },
  user_disconnect(controller, data) {
    if (data && data.role === 'STUDENT') {
      const { studentsMap } = store.getState();
      try {
        delete studentsMap[data.userId];
      } catch (err) {
        console.log(err);
      }
      store.dispatch(commonAction('studentsMap', { ...studentsMap }));
      return { ...data, id: data.userId };
    }
    return false;
  }
};
// 发送消息action
const sendAction = {
  current_user_connect(controller, res) {
    if (res) {
      const { teacher, tutors, students } = res;
      store.dispatch(commonAction('studentsMap', students));
      return res;
    }
  },
  zmlLoadfail(controller, res) {
    return res;
  },
  zmlCoursePageTotal(controller, res) {
    return res;
  },
  zmlLoadSuccess(controller, res) {
    return res;
  },
  zmgLoadSuccess() {
    return res;
  },
  getVideoDisable(controller, res) {
    return res;
  },
  playerTrackEvent(controller, res) {
    return res;
  },
  QtAction(controller, res) {
    return res;
  }
};

const otherController = new SocketController(OTHER_CONTROLLER, acceptAction, sendAction);
export default otherController;