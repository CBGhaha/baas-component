
import whiteBoardController, { WHITEBOARD_CONTROLLER } from './member/whiteBoard';
import paletteController, { PALETTE_CONTROLLER } from './member/palette';
import otherController, { OTHER_CONTROLLER } from './member/other';
import zmgController, { ZMG_CONTROLLER } from './member/zmg';

const controllers = {
  [WHITEBOARD_CONTROLLER]: whiteBoardController,
  [PALETTE_CONTROLLER]: paletteController,
  [OTHER_CONTROLLER]: otherController,
  [ZMG_CONTROLLER]: zmgController
};

export default controllers;
