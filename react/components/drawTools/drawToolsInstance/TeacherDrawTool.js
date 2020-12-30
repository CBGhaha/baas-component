import Base from './base';

export default class TeacherDrawTool extends Base {
  setToolKind(kind, isNumMark) {
    Base.zmSketchInstance.canvas.canvasaction.setToolKind(kind, isNumMark);
  }
  setLocalStyle(localStyle) {
    Base.zmSketchInstance.canvas.canvasaction.setLocalStyle(localStyle);
  }
  setIsFill(bool) {
    Base.zmSketchInstance.canvas.canvasaction.isFill = bool;
  }
  deleteSelectData() {
    Base.zmSketchInstance.canvas.canvasaction.deleteSelectData();
    this.setToolKind('eraserrectangle');
  }
  deletePageData() {
    Base.zmSketchInstance.canvas.canvasaction.deletePageData();
    this.setToolKind('eraserrectangle');
  }
}