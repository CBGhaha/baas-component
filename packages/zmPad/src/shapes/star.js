import { Shape } from '../shape';
export class Star extends Shape {
    constructor(stage, style, clientid, toolname,showtype) {
        super(stage, style, clientid, toolname,showtype);
        style.listening = false;
        style.shadowForStrokeEnabled = false;
        style.transformsEnabled = 'position';
        this.shape = new Konva.Star(Object.assign({},{
            numPoints: 5
          },style));
        this.templayer.add(this.shape);

    }
    startDataTemp(point) {
        return [
            point.x,
            point.y,
            this.clientid,
            this.toolname,
            [this.style.strokeWidth, this.isFill?this.style.fill:this.style.stroke, this.isFill?1:0]
        ];
    }
    draw() {
        if(this.middlePoints.length>3){
            const originpoi = {x:this.middlePoints[0],y:this.middlePoints[1]}
            const lastpoi = {x:this.middlePoints[this.middlePoints.length-2],y:this.middlePoints[this.middlePoints.length-1]}
            // const radius = Math.min(Math.abs((lastpoi.x - originpoi.x) / 2), Math.abs((lastpoi.y - originpoi.y) / 2));
            // this.shape.radius(radius);
            // if (originpoi.x < lastpoi.x) {
            //     this.shape.x(originpoi.x + radius);
            //     this.shape.y(originpoi.y + radius);
            // } else {
            //     this.shape.x(originpoi.x - radius);
            //     this.shape.y(originpoi.y - radius);
            // }
            this.shape.x(originpoi.x);
            this.shape.y(originpoi.y);
            const iR = Math.abs(lastpoi.x - originpoi.x);
            this.shape.setInnerRadius(iR);
            this.shape.setOuterRadius(iR * 2.5);
            if (this.showtype !== 'replayData')this.templayer.batchDraw();
        }
        
    }

}