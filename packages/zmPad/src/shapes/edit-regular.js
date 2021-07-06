import {
    Shape
} from '../shape';
export class EditRegularShape extends Shape {
    constructor(stage, style, clientid, toolname, showtype, data) {
        super(stage, style, clientid, toolname, showtype, data);
        this.data = data;
    }
    pushPoint(point){
        super.pushPoint(point);
        //this.middlePoints.splice(this.middlePoints.length-2)
        const points = this.middlePoints.splice(this.middlePoints.length-2);
        console.log('this.middlePoints',points)
        const [shapeId, kind,sx,sy] = this.data; 
        const shape = this.showlayer.findOne(`#${shapeId}`)
        if(shape){
            if(kind === 0){//整个图形移动
                shape.x(points[0]);
                shape.y(points[1]);
            }else if(kind === 1){//整个图形缩放
                shape.x(points[0]);
                shape.y(points[1]);
                shape.scaleX(sx);
                shape.scaleY(sy);
            }else if(kind === 2){//图形中某个点改变位置
                shape.me&&shape.me.changeByPoint(shape,points,sx)
            }else if(kind === 3){//文字改变内容
                shape.x(points[0]);
                shape.y(points[1]);
                if(shape.me){
                    shape.me.middlePoints[0] = points[0]
                    shape.me.middlePoints[1] = points[1]
                    shape.me.changeTextVal(shape,sx)
                }
               
            }
        }
        
    }
    
    startDataTemp(point) {
        return null
    }
    centerDataTemp(point) {
        return null;
    }
    endDataTemp(point) {
        return null;
    }
    draw() {

    }
    endDraw() {
        //if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }
    changeRegular(){

    }

}