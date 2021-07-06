import { Shape } from '../shape';
export class Triangle extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.listening = false;
    style.shadowForStrokeEnabled = false;
    style.transformsEnabled = 'position';
    this.shape = new Konva.Shape(style);
    this.templayer.add(this.shape);
    this.shiftPois = null;

  }
  startDataTemp(point) { }
  centerDataTemp(point) { }
  endDataTemp(point) {
    return [[
      this.middlePoints[0] * this.stage.scale().x,
      this.middlePoints[1] * this.stage.scale().x,
      this.clientid,
      this.toolname,
      [
        this.style.strokeWidth,
        this.isFill ? this.style.fill : this.style.stroke,
        // point.x,
        // point.y,
        // 2*this.middlePoints[0]*this.stage.scale().x - point.x ,
        // point.y,
        this.shiftPois[0] * this.stage.scale().x,
        this.shiftPois[1] * this.stage.scale().x,
        (this.shiftPois.length < 4 ? this.shiftPois[0] : this.shiftPois[2]) * this.stage.scale().x,
        (this.shiftPois.length < 4 ? this.shiftPois[1] : this.shiftPois[3]) * this.stage.scale().x,
        this.isShift ? 1 : 0,
        this.isFill ? 1 : 0
      ],
      true
    ]];
  }
  draw() {
    if (this.middlePoints.length > 3) {
      const originpoi = { x: this.middlePoints[0], y: this.middlePoints[1] };
      //const midpoi = {x:this.middlePoints[this.middlePoints.length-4],y:this.middlePoints[this.middlePoints.length-3]}
      const lastpoi = { x: this.middlePoints[this.middlePoints.length - 2], y: this.middlePoints[this.middlePoints.length - 1] };
      const me = this;
      this.shape.sceneFunc(function (context) {
        context.beginPath();
        context.moveTo(originpoi.x, originpoi.y);
        if (me.isShift) {
          const x1 = (lastpoi.y - originpoi.y) / Math.sqrt(3) + originpoi.x;
          const x2 = originpoi.x - (lastpoi.y - originpoi.y) / Math.sqrt(3);
          context.lineTo(x1, lastpoi.y);
          context.lineTo(x2, lastpoi.y);
          me.shiftPois = [x1, lastpoi.y, x2, lastpoi.y];

        } else {
          if (`${me.clientid}`.indexOf('.') > 0) {
            const midpoi = { x: me.middlePoints[me.middlePoints.length - 4], y: me.middlePoints[me.middlePoints.length - 3] };
            context.lineTo(midpoi.x, midpoi.y);
            context.lineTo(lastpoi.x, lastpoi.y);
            me.shiftPois = [midpoi.x, midpoi.y, lastpoi.x, lastpoi.y];

          } else {
            const poi = { x: (2 * originpoi.x) - lastpoi.x, y: lastpoi.y };
            if (poi.y === originpoi.y) {
              poi.y = originpoi.y + 1;
              lastpoi.y = lastpoi.y + 1;
            }
            context.lineTo(lastpoi.x, lastpoi.y);
            context.lineTo(poi.x, poi.y);
            me.shiftPois = [lastpoi.x, lastpoi.y, poi.x, poi.y];

          }


        }


        context.closePath();
        context.fillStrokeShape(this);
      });
      if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }

  }

}