/*
 * 表扬点赞相关
 */
import SocketController from '../controller';
export const PRAISE_CONTROLLER = 'praiseController';

// 接受消息action
const acceptAction = {
  praise(controller, res) {
    const { groupPraise, seq, supplyRole, supplyRoleName, ts, serNum, firstUserId, firstUsername, praiseType } = res;
    controller.parent.chatUtilsInstance.addChatMsg({
      firstUserId,
      firstUsername,
      groupPraise,
      praiseType,
      seq,
      supplyRole,
      supplyRoleName,
      ts,
      serNum,
      type: 'PRAISE'
    });
  }
};

// 发送消息action
const sendAction = {
  praise_info(controller, res) {
    //
  }
};
const praiseController = () => new SocketController(PRAISE_CONTROLLER, acceptAction, sendAction);
export default praiseController;
