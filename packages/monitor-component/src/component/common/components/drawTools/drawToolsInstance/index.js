import StundentDrawTool from './StundentDrawTool';
import TeacherDrawTool from './TeacherDrawTool';

export default function(dom, type, signalType, eventControllersInstance) {
  if (type === ZM_USER_TYPE.teacher) {
    return new TeacherDrawTool(dom, signalType, eventControllersInstance);
  } else {
    return new StundentDrawTool(dom, signalType, eventControllersInstance);
  }
}