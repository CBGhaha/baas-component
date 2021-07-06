import { LineArrowEdit } from './linearrow-edit';
export class LineArrowDashEdit extends LineArrowEdit {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    this.line.setAttr('dash', [5, 5]);
    this.line.setAttr('lineCap', 'round');
  }
}