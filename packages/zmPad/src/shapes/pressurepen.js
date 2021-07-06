import { Shape } from '../shape';
import { sceneFunc } from 'zmKonvaPlugin';
import { isDragReady } from 'konva';
import { SimpleLine } from '../CustomShapes/SimpleLine';

//anchorpoints：贝塞尔基点
//pointsAmount：生成的点数
let tempLine;
function CreateBezierPoints(anchorpoints, pointsAmount) {
  var points = [];
  for (var i = 0; i < pointsAmount; i++) {
    var point = MultiPointBezier(anchorpoints, i / pointsAmount);
    points.push(point);
  }
  return points;
}

function MultiPointBezier(points, t) {
  var len = points.length;
  var x = 0, y = 0;
  var erxiangshi = function (start, end) {
    var cs = 1, bcs = 1;
    while (end > 0) {
      cs *= start;
      bcs *= end;
      start--;
      end--;
    }
    return (cs / bcs);
  };
  for (var i = 0; i < len; i++) {
    var point = points[i];
    x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
    y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
  }
  return { x: x, y: y };
}

const pressureSceneFunc = function(context) {
  var points = this.getPoints();
  var length = points.length;
  var closed = this.getClosed();

  if (!length) {
    return;
  }

  context.beginPath();
  context.moveTo(points[0], points[1]);
  context.quadraticCurveTo(points[2], points[3], points[4], points[5]);
  // closed e.g. polygons and blobs
  if (closed) {
    context.closePath();
    context.fillStrokeShape(this);
  } else {
    // open e.g. lines and splines
    context.strokeShape(this);
  }
};
export class PressurePen extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    this.style.listening = false;
    this.style.shadowForStrokeEnabled = false;
    this.style.transformsEnabled = 'position';
    this.style.hitStrokeWidth = 0;
    this.style.lineJoin = 'round';
    this.style.lineCap = 'round';
    this.lastPoi = null;
    this.shapeArr = [];

  }
  startDataTemp(point) {
    return [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth, this.style.stroke],
      this.pressure
    ];
  }
  centerDataTemp(point) {
    return [point.x, point.y, this.clientid, this.pressure];
  }
  endDataTemp(point) {
    return [[point.x, point.y, this.clientid, this.pressure, true]];
  }
  pushPoint(point) {
    super.pushPoint(point);
    const time1 = performance.now();
    const len = this.middlePoints.length;
    if (len === 6) {
      const p1 = [this.middlePoints[0], this.middlePoints[1]];
      const p2 = [this.middlePoints[2], this.middlePoints[3]];
      const p3 = [(this.middlePoints[2] + this.middlePoints[4]) / 2, (this.middlePoints[3] + this.middlePoints[5]) / 2];
      this.lastPoi = p3;
      const shape = this.makeLine();
      shape.strokeWidth(this.style.strokeWidth * this.pressure);
      shape.points(p1.concat(p2).concat(p3));
      this.showlayer.add(shape);
      if (this.showtype === 'replayData') {
        //console.log('this is replayData');
      } else {
        shape.draw();
      }
    } else if (len > 6) {
      const p1 = this.lastPoi;
      const lastTwoPois = this.middlePoints.slice(-4);
      const p2 = [lastTwoPois[0], lastTwoPois[1]];
      const p3 = [(lastTwoPois[0] + lastTwoPois[2]) / 2, (lastTwoPois[1] + lastTwoPois[3]) / 2];
      this.lastPoi = p3;
      const shape = this.makeLine();
      shape.strokeWidth(this.style.strokeWidth * this.pressure);
      shape.points(p1.concat(p2).concat(p3));
      this.showlayer.add(shape);
      if (this.showtype === 'replayData') {
        //console.log('this is replayData');
      } else {
        shape.draw();
      }

    } else {

    }

    return;
  }
  makeLine() {
    // if(!tempLine){
    //     tempLine = new Konva.Line();
    //     tempLine.lineJoin('round');
    //     tempLine.lineCap('round');
    //     tempLine.sceneFunc(pressureSceneFunc);
    // }
    const newLine = new SimpleLine(this.style);
    newLine.sceneFunc(pressureSceneFunc);
    return newLine;
  }
  draw() {
    //if (this.showtype !== 'replayData')this.templayer.batchDraw();
  }
  endDraw() {

    // const shape_len = this.shapeArr.length;
    // for(var i=0;i<shape_len;i++){
    //     const c_layer = this.shapeArr[i];
    //     const cloneLayer = c_layer.clone();
    //     cloneLayer.sceneFunc(pressureSceneFunc);
    //     c_layer.remove();
    //     c_layer.destroy();
    //     this.showlayer.add(cloneLayer);
    //     if(this.showtype==='replayData'){

    //     }else{
    //         cloneLayer.draw()
    //     }
    // }
    // this.shapeArr = null;


  }

}
