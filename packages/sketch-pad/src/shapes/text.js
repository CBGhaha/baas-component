import { Shape } from '../shape';
export class Text extends Shape {
  constructor(stage, style, clientid, toolname, showtype, text) {
    super(stage, style, clientid, toolname);
    this.shape = new Konva.Text({
      fill: style.stroke,
      fontFamily: style.fontFamily || 'microsoft yahei',
      fontSize: style.fontSize || 14
    });
    this.text = text;
    this.templayer.add(this.shape);

  }
  startDataTemp(point) { }
  centerDataTemp(point) { }
  endDataTemp(point) {
    return [[
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [
        this.style.fontSize || 14,
        this.style.stroke
      ],
      true,
      this.text
    ]];
  }
  draw() {
    if (this.middlePoints.length > 0) {
      this.shape.x(this.middlePoints[0]);
      this.shape.y(this.middlePoints[1]);
      this.shape.text(this.text);
      if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }
  }

}