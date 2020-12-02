
import whiteBoardController, { WHITEBOARD_CONTROLLER } from './member/whiteBoard';
import paletteController, { PALETTE_CONTROLLER } from './member/palette';
import otherController, { OTHER_CONTROLLER } from './member/other';

const controllers = {
  [WHITEBOARD_CONTROLLER]: whiteBoardController,
  [PALETTE_CONTROLLER]: paletteController,
  [OTHER_CONTROLLER]: otherController
};

export default controllers;
