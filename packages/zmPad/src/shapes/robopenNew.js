import {
  Shape
} from '../shape';

const MIN_WIDTH = .5;
let me = null;
export class RoboPen extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    this.shape = new Konva.Line(style);
    this.templayer.add(this.shape);
    this.canvas = {};
    me = this;
    this.shape.sceneFunc(this.getSceneFunc);
    //new added


  }
  getSceneFunc(context) {

    me.canvas.ctx = context;
    var points = this.getPoints(),
      length = points.length,
      tension = this.getTension(),
      closed = this.getClosed(),
      bezier = this.getBezier(),
      tp,
      len,
      n;

    if (!length) {
      return;
    }

    //me.begin(points[0],points[1])
    context.beginPath();
    context.moveTo(points[0], points[1]);

    for (n = 2; n < length; n += 2) {
      // context.lineTo(points[n], points[n + 1]);  // konva 默认实现方式
      var cx = (points[n - 2] + points[n]) / 2;
      var cy = (points[n - 1] + points[n + 1]) / 2;
      context.quadraticCurveTo(points[n - 2], points[n - 1], cx, cy);
      context.moveTo(cx, cy);
      n == length - 2 && context.lineTo(points[n], points[n + 1]);
      //me.drawPen(points[n],points[n + 1],me.pressure*me.style.strokeWidth,me.style.stroke,context);
    }
    //context.lineWidth = me.pressure*me.style.strokeWidth*Math.random();
    //context.strokeStyle = me.style.stroke;
    this.strokeWidth(me.pressure * me.style.strokeWidth);
    console.log('heihei', this);
    if (closed) {
      context.closePath();
      context.fillStrokeShape(this);
    } else {
      context.strokeShape(this);
    }

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
  pushPoint(point, time) {
    super.pushPoint(point);

  }
  draw() {
    if (this.showtype !== 'replayData') this.shape.points(this.middlePoints);
    //this.shape.points(this.middlePoints);
    // const me = this;

    // this.shape.sceneFunc(function (context) {
    //   me.canvas.ctx = context;
    //   var points = this.getPoints(),
    //     length = points.length,
    //     tension = this.getTension(),
    //     closed = this.getClosed(),
    //     bezier = this.getBezier(),
    //     tp,
    //     len,
    //     n;

    //   if (!length) {
    //       return;
    //   }
    //   //context.beginPath();
    //   //context.moveTo(points[0], points[1]);

    //   me.begin(points[0],points[1])

    //   for (n = 2; n < length; n += 2) {
    //     // context.lineTo(points[n], points[n + 1]);  // konva 默认实现方式
    //     // var cx = (points[n - 2] + points[n]) / 2;
    //     // var cy = (points[n - 1] + points[n + 1]) / 2;
    //     // context.quadraticCurveTo(points[n - 2], points[n - 1], cx, cy);
    //     // context.moveTo(cx, cy);
    //     // n == length - 2 && context.lineTo(points[n], points[n + 1]);
    //       me.drawPen(points[n],points[n + 1],me.pressure*me.style.strokeWidth,me.style.stroke,context);
    //   }


    //   // if (me.middlePoints.length === 2) {
    //   //   const firstPoi = {
    //   //     x: me.middlePoints[0],
    //   //     y: me.middlePoints[1]
    //   //   }
    //   //   me.begin(firstPoi.x,firstPoi.y)
    //   //   me.canvas.ctx = context;
    //   // }else{
    //   //   const newPoi = {
    //   //     x: me.middlePoints[me.middlePoints.length - 2],
    //   //     y: me.middlePoints[me.middlePoints.length - 1]
    //   //   }
    //   //   me.drawPen(newPoi.x,newPoi.y,me.pressure*me.style.strokeWidth,me.style.stroke,context)
    //   // }
    //     if (closed) {
    //       //ontext.closePath();
    //       me.end()
    //       context.fillStrokeShape(this);
    //     } else {
    //       context.strokeShape(this);
    //     }
    //   })

    this.templayer.batchDraw();

  }
  endDraw(time) {
    const cloneLayer = this.shape.clone();
    cloneLayer.sceneFunc(this.getSceneFunc);
    this.shape.remove();
    this.showlayer.add(cloneLayer);
    if (this.showtype === 'replayData') {
      this.showlayer.batchDraw();
      this.templayer.batchDraw();
    } else {
      this.showlayer.draw();
      this.templayer.draw();
    }
  }


  begin(x, y) {
    var ratio = 1;
    this.canvas.index = 0;
    this.canvas.lastX = x / ratio;
    this.canvas.lastY = y / ratio;
  }

  drawPen(x, y, width, color, ctx) {
    var ratio = 1;
    //var ctx = this.canvas.getContext('2d');
    this.drawBezier(ctx, x / ratio, y / ratio, width, color);
    //this.canvas.requestPaint()

  }

  end() {
    if (this.canvas.index > 0) {
      var ctx = this.canvas.ctx;
      ctx.beginPath();
      ctx.moveTo(this.canvas.lastMidX, this.canvas.lastMidY);
      ctx.lineTo(this.canvas.lastX, this.canvas.lastY);
      ctx.stroke();
    //this.canvas.requestPaint()
    }
  }

  drawBezier(ctx, x, y, width, color) {
    console.log('drawBezier width', width);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();

    //ctx.moveTo(lastX, lastY)
    //ctx.lineTo(area.mouseX, area.mouseY)

    var midX = (x + this.canvas.lastX) / 2;
    var midY = (y + this.canvas.lastY) / 2;

    if (this.canvas.index++ > 0) {
      ctx.moveTo(this.canvas.lastMidX, this.canvas.lastMidY);
      ctx.quadraticCurveTo(this.canvas.lastX, this.canvas.lastY, midX, midY);
    } else {
      ctx.moveTo(this.canvas.lastX, this.canvas.lastY);
      ctx.lineTo(midX, midY);
    }

    this.canvas.lastMidX = midX;
    this.canvas.lastMidY = midY;

    this.canvas.lastX = x;
    this.canvas.lastY = y;

    ctx.stroke();
  }

}
