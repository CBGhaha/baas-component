import { Shape } from '../shape';
export class Ellipse extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.listening = false;
    style.shadowForStrokeEnabled = false;
    style.transformsEnabled = 'position';
    this.shape = new Konva.Ellipse(style);
    this.templayer.add(this.shape);
    //this.startPromiseResolve = null;
    this.startData = null;

  }
  startDataTemp(point) {
    this.startData = [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth, this.isFill ? 1 : 0, this.isFill ? this.style.fill : this.style.stroke, this.isShift ? 1 : 0]
    ];
    return null;
    // return [
    //     point.x,
    //     point.y,
    //     this.clientid,
    //     this.toolname,
    //     [this.style.strokeWidth, this.isFill?1:0,this.isFill?this.style.fill:this.style.stroke,this.isShift?1:0]
    // ];
  }
  centerDataTemp(point) { }
  endDataTemp(point) {
    if (this.startData) this.startData[4][3] = this.isShift ? 1 : 0;
    //if(this.startPromiseResolve)this.startPromiseResolve(this.startData)
    return [this.startData, [point.x, point.y, this.clientid, true]];
  }
  draw() {
    if (this.middlePoints.length > 3) {
      const originpoi = { x: this.middlePoints[0], y: this.middlePoints[1] };
      const lastpoi = { x: this.middlePoints[this.middlePoints.length - 2], y: this.middlePoints[this.middlePoints.length - 1] };
      if (this.isShift) {
        const radius = Math.min(Math.abs((lastpoi.x - originpoi.x) / 2), Math.abs((lastpoi.y - originpoi.y) / 2));

        if (originpoi.x < lastpoi.x) {
          this.shape.x(originpoi.x + radius);
          this.shape.y(originpoi.y + radius);
        } else {
          this.shape.x(originpoi.x - radius);
          this.shape.y(originpoi.y - radius);
        }
        this.shape.radius({ x: radius, y: radius });
        //console.log('radius',radius,this.shape.x(),this.shape.y());

      } else {
        this.shape.x((originpoi.x + lastpoi.x) / 2);
        this.shape.y((originpoi.y + lastpoi.y) / 2);
        this.shape.radius({
          x: Math.abs(originpoi.x - lastpoi.x) / 2,
          y: Math.max(Math.abs(originpoi.y - lastpoi.y) / 2, 2)
        });
      }

      if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }

  }

}