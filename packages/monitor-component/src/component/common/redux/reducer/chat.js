import common from './common.js';

export const allForbidChat = common('allForbidChat', false);// 主讲全员禁言
export const allSingleForbidChatStudent = common('allSingleForbidChatStudent', {}); // 被单独禁言的学生
export const selfForbidChat = common('selfForbidChat', false); // 自己是否被禁言
export const systemForbidChat = common('systemForbidChat', false); // 系统禁言
export const allForbidChatTutor = common('allForbidChatTutor', {}); // 所有开启 本班全部禁言的班主任
export const allAistudentSet = common('allAistudentSet', new Set());
export const activeTutor = common('activeTutor', {});
export const onTableStudents = common('onTableStudents', new Map()); // 在台上的学生
export const onMicStudents = common('onMicStudents', new Map()); // 在麦上的学生
export const stuForbidScreenshot = common('stuForbidScreenshot', true); //主讲是否禁止学生传图
export const currDrillRoom = common('currDrillRoom', false); // 是否在小组教室
