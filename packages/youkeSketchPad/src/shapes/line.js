import {
  Shape
} from '../shape';
export class Line extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.lineJoin = 'round',
    style.listening = false;
    style.transformsEnabled = 'position';
    style.shadowForStrokeEnabled = false;
    this.shape = new Konva.Line(style);
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
      [this.style.strokeWidth, this.style.stroke, this.isShift ? 1 : 0]
    ];
    return null;

    // return [
    //     point.x,
    //     point.y,
    //     this.clientid,
    //     this.toolname,
    //     [this.style.strokeWidth, this.style.stroke, this.isShift?1:0]
    // ];
  }
  centerDataTemp(point) { }
  endDataTemp(point) {
    if (this.startData) {
      this.startData[4][2] = this.isShift ? 1 : 0;
    }
    //if(this.startPromiseResolve)this.startPromiseResolve(this.startData)
    return [this.startData, [this.isShift ? this.shape.points()[this.shape.points().length - 2] * this.stage.scale().x : point.x,
      this.isShift ? this.shape.points()[this.shape.points().length - 1] * this.stage.scale().x : point.y,
      this.clientid, true]];
  }
  draw() {
    if (this.middlePoints.length > 3) {
      if (this.isShift) {
        if (Math.abs(this.middlePoints[this.middlePoints.length - 2] - this.middlePoints[0]) <
                    Math.abs(this.middlePoints[this.middlePoints.length - 1] - this.middlePoints[1])) {
          this.shape.points([this.middlePoints[0],
            this.middlePoints[1],
            this.middlePoints[0],
            this.middlePoints[this.middlePoints.length - 1]
          ]);
        } else {
          this.shape.points([this.middlePoints[0],
            this.middlePoints[1],
            this.middlePoints[this.middlePoints.length - 2],
            this.middlePoints[1]
          ]);
        }


      } else {
        this.shape.points([this.middlePoints[0],
          this.middlePoints[1],
          this.middlePoints[this.middlePoints.length - 2],
          this.middlePoints[this.middlePoints.length - 1]
        ]);
      }

    }

    if (this.showtype !== 'replayData') this.templayer.batchDraw();
  }

}