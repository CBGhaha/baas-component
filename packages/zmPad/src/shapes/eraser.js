import {
  Shape
} from '../shape';
import { SimpleLine } from '../CustomShapes/SimpleLine';
export class Eraser extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.stroke = 'white';
    style.lineJoin = 'round';
    style.lineCap = 'round';
    style.listening = false;
    style.shadowForStrokeEnabled = false;
    style.transformsEnabled = 'position';
    style.hitStrokeWidth = 0;
    this.shape = new SimpleLine(style);
    this.shape.globalCompositeOperation('destination-out');
    this.cloneShape = this.shape.clone();
    this.showlayer.add(this.cloneShape);
    //this.showtype = showtype;

  }
  startDataTemp(point) {
    return [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth],
      [],
      [this.uid]
    ];
  }
  draw() {
    this.cloneShape.points(this.middlePoints);
    if (this.showtype !== 'replayData') this.cloneShape.draw();
  }
  endDraw() {
    //super.endDraw();
  }

}