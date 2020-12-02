import StundentDrawTool from './StundentDrawTool';
import TeacherDrawTool from './TeacherDrawTool';

export default function(dom, type, signalType, dataPipe, eventControllersInstance) {
  if (type === USER_TYPE.teacher) {
    return new TeacherDrawTool(dom, signalType, dataPipe, eventControllersInstance);
  } else {
    return new StundentDrawTool(dom, signalType, dataPipe, eventControllersInstance);
  }
}