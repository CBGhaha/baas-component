import {
  Shape
} from '../shape';
import {
  SignaturePad
} from 'zmSmoothLine';
const MIN_WIDTH = .5;
export class SmoothPen extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    const canvas = document.createElement('canvas');
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = stage.width();
    canvas.height = stage.height();
    //canvas.getContext("2d").scale(ratio, ratio);
    //console.log('width,height',canvas.width,canvas.height,ratio)
    this.shape = new Konva.Image({
      image: canvas
    });
    //this.shape.scale({x:ratio,y:ratio})
    this.templayer.add(this.shape);
    //new added

    window.sg = this.signaturePad = new SignaturePad(canvas, {
      penColor: this.style.stroke,
      maxWidth: this.style.strokeWidth,
      minWidth: MIN_WIDTH,
      minDistance: 1
    });
    // var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    // canvas.width = canvas.offsetWidth * ratio;
    // canvas.height = canvas.offsetHeight * ratio;
    // canvas.getContext("2d").scale(ratio, ratio);
    // this.signaturePad.clear();

    this.replyData = [];


  }
  startDataTemp(point) {
    return [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth, this.style.stroke],
      this.pressure,
      Date.now()
    ];
  }
  centerDataTemp(point) {
    return [point.x, point.y, this.clientid, this.pressure, Date.now()];
  }
  endDataTemp(point) {
    return [[point.x, point.y, this.clientid, this.pressure, Date.now(), true]];
  }
  pushPoint(point, time) {
    super.pushPoint(point);
    //console.log('pushPoint',time);
    if (!time) {
      this.signaturePad.minWidth = MIN_WIDTH * this.pressure;
      this.signaturePad.maxWidth = this.style.strokeWidth * this.pressure;
      if (this.middlePoints.length === 2) {
        const firstPoi = {
          x: this.middlePoints[0],
          y: this.middlePoints[1]
        };
        this.signaturePad._mouseButtonDown = true;
        this.signaturePad._strokeBegin({
          clientX: firstPoi.x,
          clientY: firstPoi.y
        });
        //console.log('_strokeBegin',firstPoi)
      }
      const newPoi = {
        x: this.middlePoints[this.middlePoints.length - 2],
        y: this.middlePoints[this.middlePoints.length - 1]
      };
      this.signaturePad._strokeUpdate({
        clientX: newPoi.x,
        clientY: newPoi.y
      });
      //console.log('_strokeUpdate',newPoi)
    } else {
      const x = this.middlePoints[this.middlePoints.length - 2];
      const y = this.middlePoints[this.middlePoints.length - 1];
      this.replyData.push({ time, x, y });
    }

    return;
  }
  draw() {

    if (this.showtype !== 'replayData') this.templayer.batchDraw();
  }
  endDraw(time) {
    super.endDraw();
    //console.log('endDraw',time);
    const endPoi = {
      x: this.middlePoints[this.middlePoints.length - 2],
      y: this.middlePoints[this.middlePoints.length - 1]
    };
    if (!time) {
      this.signaturePad._strokeEnd({
        clientX: endPoi.x,
        clientY: endPoi.y
      });
      //console.log('_strokeEnd',endPoi)
      this.signaturePad._mouseButtonDown = false;
    } else {
      this.replyData.push({ time, x: endPoi.x, y: endPoi.y });
      this.signaturePad.fromData([{ color: this.style.stroke, points: this.replyData }]);
      this.replyData = [];
    }


  }

}
