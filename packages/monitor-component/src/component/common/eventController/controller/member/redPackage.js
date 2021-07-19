/*
 * 课件白板答题信令
 */
import SocketController from '../controller';
export const REDPACKAGE_CONTROLLER = 'redPackageController';

// 接受消息action
const acceptAction = {
  give_red_packet(controller, ... res) {
  },
  award_red_packet(controller, res) {
    const { awardUserInfos, seq, subject, supplyLecturerInfo, ts, coinAmount } = res;
    controller.parent.chatUtilsInstance.addChatMsg({
      type: 'RED_PACKET',
      awardUserInfos,
      coinAmount,
      ... supplyLecturerInfo,
      redPacketSubject: subject,
      seq,
      ts
    });

  }
};

// 发送消息action
const sendAction = {
  award_specific_red_packet(controller, res) {

  },
  red_packet_info(controller, res) {

  },
  red_packet_state(controller, res) {

  }

};
const redPackageController = new SocketController(REDPACKAGE_CONTROLLER, acceptAction, sendAction);
export default redPackageController;
