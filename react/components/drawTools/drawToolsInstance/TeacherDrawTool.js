import Base from './base';

export default class TeacherDrawTool extends Base {
  constructor(dom, signalType, dataPipe) {
    super(dom, signalType, dataPipe);
    // delete快捷删除所选
    window.document.addEventListener('keydown', e=>{
      const keyCode = e.keyCode;
      if (keyCode === 46) {
        Base.zmSketchInstance.canvas.canvasaction.deleteSelectData();
      }
    });
  }
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