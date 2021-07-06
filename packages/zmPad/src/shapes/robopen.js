import {
  Shape
} from '../shape';

const MIN_WIDTH = .5;
let canvas = null;
let idLastPoi = null;
export class RoboPen extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    // method 1
    // if(!stage.findOne('#robopen')){
    //   if(!canvas){
    //     canvas = document.createElement('canvas');
    //     canvas.width = stage.width();
    //     canvas.height = stage.height();
    //   }else{
    //     canvas.getContext('2d').clearRect(0, 0, 5000, 5000)
    //   }
    //   const canvasImage = new Konva.Image({
    //     image: canvas,
    //     id :'robopen'
    //   });
    //   this.showlayer.add(canvasImage)
    // }
    // this.canvas = canvas;

    /**method 2 */
    this.canvas = document.createElement('canvas');
    //var ratio =  Math.max(window.devicePixelRatio || 1, 1)
    this.canvas.width = stage.width();
    this.canvas.height = stage.height();
    this.shape = new Konva.Image({
      image: this.canvas
    });
    this.canvas.getContext('2d').translate(0.5, 0.5);
    this.templayer.add(this.shape);
    /****method 3 */
    //this.canvas = this.showlayer.getCanvas()._canvas;

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
    if (this.middlePoints.length === 2) {
      const firstPoi = {
        x: this.middlePoints[0],
        y: this.middlePoints[1]
      };
      this.begin(firstPoi.x, firstPoi.y);
    } else {
      const newPoi = {
        x: this.middlePoints[this.middlePoints.length - 2],
        y: this.middlePoints[this.middlePoints.length - 1]
      };
      //console.log('pressure width',this.pressure,this.style.strokeWidth,this.pressure*this.style.strokeWidth)
      this.drawPen(newPoi.x, newPoi.y, this.pressure * this.style.strokeWidth, this.style.stroke);
    }
  }
  draw() {
    //this.showlayer.batchDraw();
    if (this.showtype !== 'replayData') this.templayer.batchDraw();


  }
  endDraw(time) {
    this.end();
    const cloneLayer = this.shape.clone();
    this.shape.remove();
    this.shape.destroy();
    this.canvas = null;
    this.showlayer.add(cloneLayer);
    if (this.showtype === 'replayData') {
      this.showlayer.batchDraw();
    } else {
      cloneLayer.draw();
    }

  }


  begin(x, y) {
    var ratio = 1;
    this.canvas[this.clientid] = {};
    this.canvas[this.clientid].index = 0;
    this.canvas[this.clientid].lastX = x / ratio;
    this.canvas[this.clientid].lastY = y / ratio;
  }

  drawPen(x, y, width, color) {
    var ratio = 1;
    var ctx = this.canvas.getContext('2d');
    this.drawBezier(ctx, x / ratio, y / ratio, width, color);
    //this.canvas.requestPaint()

  }

  end() {
    if (this.canvas[this.clientid].index > 0) {
      var ctx = this.canvas.getContext('2d');
      ctx.beginPath();
      ctx.fillStyle = this.style.stroke;
      ctx.moveTo(this.canvas[this.clientid].lastMidX, this.canvas[this.clientid].lastMidY);
      ctx.lineTo(this.canvas[this.clientid].lastX, this.canvas[this.clientid].lastY);
      ctx.stroke();
      ctx.fill();
    //this.canvas.requestPaint()
    }
  }

  drawBezier(ctx, x, y, width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    //ctx.clearRect(0, 0, 2000, 2000);//它可以消除齿痕！
    ctx.beginPath();

    //ctx.moveTo(lastX, lastY)
    //ctx.lineTo(area.mouseX, area.mouseY)

    var midX = (x + this.canvas[this.clientid].lastX) / 2;
    var midY = (y + this.canvas[this.clientid].lastY) / 2;

    if (this.canvas[this.clientid].index++ > 0) {
      ctx.moveTo(this.canvas[this.clientid].lastMidX, this.canvas[this.clientid].lastMidY);
      ctx.quadraticCurveTo(this.canvas[this.clientid].lastX, this.canvas[this.clientid].lastY, midX, midY);
    } else {
      ctx.moveTo(this.canvas[this.clientid].lastX, this.canvas[this.clientid].lastY);
      ctx.lineTo(midX, midY);
    }

    this.canvas[this.clientid].lastMidX = midX;
    this.canvas[this.clientid].lastMidY = midY;

    this.canvas[this.clientid].lastX = x;
    this.canvas[this.clientid].lastY = y;

    ctx.stroke();


  }

}
