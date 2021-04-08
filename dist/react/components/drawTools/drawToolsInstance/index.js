import StundentDrawTool from './StundentDrawTool';
import TeacherDrawTool from './TeacherDrawTool';

export default function(dom, type, signalType, eventControllersInstance, cb) {
  if (type === PLAYER_USER_TYPE.teacher) {
    return new TeacherDrawTool(dom, signalType, eventControllersInstance, cb);
  } else {
    return new StundentDrawTool(dom, signalType, eventControllersInstance, cb);
  }
}