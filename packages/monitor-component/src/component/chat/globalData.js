/**
 *全局管理的数据
 */


export const allPriseMap = {}; // 所有表扬消息
export const forbidChatUserMap = {}; //禁言用户

const chatGlobalData = {
  chat: new Array(), // 消息池
  forbidChat: forbidChatUserMap,
  newMsgNum: 0, // 未读新消息列表,
  filter: false, // 当前是否过滤消息
  msgTotalLength: 500
};

export default chatGlobalData;