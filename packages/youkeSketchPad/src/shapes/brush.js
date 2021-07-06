import { Shape } from '../shape';
import { sceneFunc } from 'zmKonvaPlugin';
import { SimpleLine } from '../CustomShapes/SimpleLine';
export class Brush extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.listening = false;
    style.shadowForStrokeEnabled = false;
    style.transformsEnabled = 'position';
    style.hitStrokeWidth = 0;
    this.shape = new SimpleLine(style);
    this.shape.lineCap('round');
    this.shape.lineJoin('round');
    //this.shape.bezier(true);
    this.shape.sceneFunc(sceneFunc);
    this.templayer.add(this.shape);
  }
  startDataTemp(point) {
    return [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth, this.style.stroke],
      [],
      [this.uid]
    ];
  }
  // pushPoint(point){
  //     super.pushPoint(point);
  //     return
  // }
  draw() {
    this.shape.points(this.middlePoints);
    if (this.showtype !== 'replayData') this.templayer.batchDraw();
    //console.log('this.uid',this.uid)
  }
}
