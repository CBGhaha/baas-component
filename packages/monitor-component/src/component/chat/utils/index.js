import commonAction from '../../common/redux/actions/common';
import { lessonProgress, lessonStage } from '../../common/config';

export function random(min, max) {
  return min + parseInt(Math.random() * (max - min));
}

export function setAllSingleForbidChatStudent(store, id, isForbid) {
  const forbidMap = { ... store.getState()['allSingleForbidChatStudent'] };
  if (isForbid) {
    forbidMap[id] = true;
  } else {
    delete forbidMap[id];
  }
  store.dispatch(commonAction('allSingleForbidChatStudent', forbidMap));
}

export function tutorOpenAllSingleForbidChatStudent(store, tutorId) {
  const forbidMap = { ... store.getState()['allSingleForbidChatStudent'] };
  const allStudentsMap = { ... store.getState()['studentsMap'] };
  Object.keys(forbidMap).map(userId=>{
    const studentInfo = allStudentsMap[userId];
    if (studentInfo && +studentInfo.tutorId === +tutorId) {
      delete forbidMap[userId];
    }
  });
  store.dispatch(commonAction('allSingleForbidChatStudent', forbidMap));
}

export function getMin(time) {
  const date = new Date(time);
  const hour = date.getHours();
  const min = date.getMinutes();
  const doubel = (num)=> num > 9 ? num : `0${num}`;
  return `${doubel(hour)}:${doubel(min)}`;
}

export function getRedpackageStatus(lessonInfo) {
  const { lesson_progress, lesson_real_stage } = lessonInfo;
  // 主讲未获取课堂
  if (lesson_progress !== lessonProgress.in) {
    return {
      canUse: false,
      errTip: '你还未获取课堂'
    };
  }
  //主讲已经获取课堂
  if (lesson_progress === lessonProgress.in) {
    return lesson_real_stage === lessonStage.notStart ? {
      canUse: false,
      errTip: '你还没有开始上课'
    } : {
      canUse: true
    };
  }
}