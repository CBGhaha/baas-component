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
      return true;
    }
    return false;
  }
};
// 发送消息action
const sendAction = {
  current_user_connect(controller, res) {
    if (res && res.success && res.data) {
      if (res.data.tutors) {
        const activeTutor = res.data.tutors[0];
        activeTutor && store.dispatch(commonAction('activeTutor', activeTutor));
      }
      if (res.data.studentGroups) {
        const allRobotStudent = new Map();
        res.data.studentGroups.forEach((group) => {
          group.students.forEach((user) => {
            if (user.robot) { allRobotStudent.set(user.userId, user); }
          });
        });
        const studentMap = {};
        res.data.studentGroups.forEach(group=>{
          group.students.forEach(user=>{
            studentMap[user.userId] = user;
          });
        });
        store.dispatch(commonAction('allAistudentSet', allRobotStudent));
        store.dispatch(commonAction('studentsMap', studentMap));
        return studentMap;
      }
    }
  },
  zmlLoadfail(controller, res) {
    return res;
  },
  zmlCoursePageTotal(controller, res) {
    return res;
  }
};

const otherController = new SocketController(OTHER_CONTROLLER, acceptAction, sendAction);
export default otherController;
