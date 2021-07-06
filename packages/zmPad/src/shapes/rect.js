import { Shape } from '../shape';
export class Rect extends Shape {
    constructor(stage, style, clientid, toolname,showtype) {
        super(stage, style, clientid, toolname,showtype);
        style.listening = false;
        style.shadowForStrokeEnabled = false;
        style.transformsEnabled = 'position';
        this.shape = new Konva.Rect(style);
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
            [this.style.strokeWidth,this.isFill?1:0, this.isFill?this.style.fill:this.style.stroke, this.isShift?1:0]
        ];
        return null;

    }
    centerDataTemp(point) { }
    endDataTemp(point){
        if(this.startData)this.startData[4][3] = this.isShift?1:0
        let y =  point.y;
        if(this.isShift){
          y = point.x - this.startData[0] + this.startData[1]
        }

        return [
            this.startData,
            [point.x,y,this.clientid,true]
        ];     
    }
    draw() {
        if(this.middlePoints.length>3){
                this.shape.x(this.middlePoints[0]);
                this.shape.y(this.middlePoints[1]);
            if(this.isShift){
                this.shape.width(this.middlePoints[this.middlePoints.length-2]-this.middlePoints[0])
                this.shape.height(this.middlePoints[this.middlePoints.length-2]-this.middlePoints[0])

            }else{
                
                this.shape.width(this.middlePoints[this.middlePoints.length-2]-this.middlePoints[0]);
                this.shape.height(this.middlePoints[this.middlePoints.length-1]-this.middlePoints[1]);
            }
            
            if (this.showtype !== 'replayData')this.templayer.batchDraw();
        }
        
    }

}
