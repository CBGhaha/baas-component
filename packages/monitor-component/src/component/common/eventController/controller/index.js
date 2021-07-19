
import whiteBoardController, { WHITEBOARD_CONTROLLER } from './member/whiteBoard';
import paletteController, { PALETTE_CONTROLLER } from './member/palette';
import otherController, { OTHER_CONTROLLER } from './member/other';
import zmgController, { ZMG_CONTROLLER } from './member/zmg';
import chatController, { CHAT_CONTORLLOR } from './member/chat';
import redPackageController, { REDPACKAGE_CONTROLLER } from './member/redPackage';
import praiseController, { PRAISE_CONTROLLER } from './member/praise';
const controllers = {
  [WHITEBOARD_CONTROLLER]: whiteBoardController,
  [PALETTE_CONTROLLER]: paletteController,
  [OTHER_CONTROLLER]: otherController,
  [ZMG_CONTROLLER]: zmgController,
  [CHAT_CONTORLLOR]: chatController,
  [REDPACKAGE_CONTROLLER]: redPackageController,
  [PRAISE_CONTROLLER]: praiseController
};

export default controllers;
