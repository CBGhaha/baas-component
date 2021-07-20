/*
 * 其他信令
 */
import SocketController from '../controller';
import commonAction from '../../../../common/redux/actions/common';

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
      const { studentsMap } = controller.parent.$store.getState();
      controller.parent.$store.dispatch(commonAction('studentsMap', { ...studentsMap, [data.userId]: data }));
      return { ...data, id: data.userId };
    }
    return false;
  },
  user_disconnect(controller, data) {
    if (data && data.role === 'STUDENT') {
      const { studentsMap } = controller.parent.$store.getState();
      try {
        delete studentsMap[data.userId];
      } catch (err) {
        console.error(err);
      }
      controller.parent.$store.dispatch(commonAction('studentsMap', { ...studentsMap }));
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
      if (!students) return;
      const allRobotStudent = new Map();
      const forbidMap = { ...controller.parent.$store.getState()['allSingleForbidChatStudent'] };
      Object.values(students).forEach(user=>{
        if (user.robot) { allRobotStudent.set(user.userId, user); }
        if (!user.onChat) forbidMap[user.userId] = true;

      });
      controller.parent.$store.dispatch(commonAction('allAistudentSet', allRobotStudent));
      controller.parent.$store.dispatch(commonAction('studentsMap', students));
      controller.parent.$store.dispatch(commonAction('allSingleForbidChatStudent', forbidMap));
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
  },
  track(controller, res) {
    return res;
  }
};

const otherController = () => new SocketController(OTHER_CONTROLLER, acceptAction, sendAction);
export default otherController;
