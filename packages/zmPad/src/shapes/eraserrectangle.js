import { Shape } from '../shape';
export class EraserRectangle extends Shape {
    constructor(stage,style,clientid, toolname,showtype) {
        super(stage, style, clientid, toolname,showtype);
        this.shape = new Konva.Rect(Object.assign({},{
            fill: 'green',
            shadowEnabled: false,
            strokeWidth: 1,
            opacity: .4,
            listening: false,
            shadowForStrokeEnabled: false,
            transformsEnabled : 'position',
            hitStrokeWidth : 0,
          }));
        this.templayer.add(this.shape);

    }
    startDataTemp(point) {
        return [
            point.x,
            point.y,
            this.clientid,
            this.toolname,
            [this.style.strokeWidth||1],
            [],
            [this.uid]
        ];
    }
    draw() {
        if(this.middlePoints.length>3){
            this.shape.x(this.middlePoints[0]);
            this.shape.y(this.middlePoints[1]);
            this.shape.width(this.middlePoints[this.middlePoints.length-2]-this.middlePoints[0]);
            this.shape.height(this.middlePoints[this.middlePoints.length-1]-this.middlePoints[1]);
            if (this.showtype !== 'replayData')this.templayer.batchDraw();
        }
        
    }
    endDraw(){
        this.shape.globalCompositeOperation('destination-out');

        //alert(1);
        this.shape.opacity(1);
        super.endDraw();
    }

}