import { Shape } from "../shape";
export class LineArrow extends Shape {
    constructor(stage, style, clientid, toolname,showtype) {
        super(stage, style, clientid, toolname,showtype);
        this.lastPoint = null;
        style.listening = false;
        style.shadowForStrokeEnabled = false;
        style.transformsEnabled = 'position';
        this.shape = new Konva.Arrow(
            Object.assign(
                {},
                {
                    pointerLength: 20,
                    pointerWidth: 10,
                    fill:style.stroke,
                },
                style
            )
        );
        this.templayer.add(this.shape);
    }
    startDataTemp(point) { }
    centerDataTemp(point) { }
    endDataTemp(point) {
        return [[
            this.middlePoints[0]*this.stage.scale().x,
            this.middlePoints[1]*this.stage.scale().x,
            this.clientid,
            this.toolname,
            [
                this.style.strokeWidth,
                this.style.stroke,
                // point.x,
                // point.y,
                this.middlePoints[this.middlePoints.length-2]*this.stage.scale().x,
                this.middlePoints[this.middlePoints.length-1]*this.stage.scale().x,
            ],
            true
        ]];
    }
    pushPoint(point){
        //console.log('this.isShift',this.isShift)
        if (this.middlePoints.length > 3) {
            if (this.isShift) {
                //console.log("1")
                if (Math.abs(point.x/this.stage.scale().x - this.middlePoints[0]) <
                    Math.abs(point.y/this.stage.scale().x - this.middlePoints[1])){
                        super.pushPoint({x:this.middlePoints[0]*this.stage.scale().x,
                            y:point.y})
                    //console.log("2",this.middlePoints)
                }else{
                    super.pushPoint({x:point.x,
                        y:this.middlePoints[1]*this.stage.scale().x})
                        //console.log("3",this.middlePoints)
                }
            }else{
               super.pushPoint(point)
               //console.log("4")
            }
        }else{
            super.pushPoint(point)
        }

    }
    draw() {
        if (this.middlePoints.length > 3) {
            // if (this.isShift) {
            //     if (Math.abs(this.middlePoints[this.middlePoints.length - 2] - this.middlePoints[0]) <
            //         Math.abs(this.middlePoints[this.middlePoints.length - 1] - this.middlePoints[1])) {
            //         this.shape.points([this.middlePoints[0],
            //             this.middlePoints[1],
            //             this.middlePoints[0],
            //             this.middlePoints[this.middlePoints.length - 1],
            //         ]);
            //     } else {
            //         this.shape.points([this.middlePoints[0],
            //             this.middlePoints[1],
            //             this.middlePoints[this.middlePoints.length - 2],
            //             this.middlePoints[1],
            //         ]);
            //     }
            // } else {
                this.shape.points([
                    this.middlePoints[0],
                    this.middlePoints[1],
                    this.middlePoints[this.middlePoints.length - 2],
                    this.middlePoints[this.middlePoints.length - 1]
                ]);
            //}

        }
        if (this.showtype !== 'replayData')this.templayer.batchDraw();
    }
}
