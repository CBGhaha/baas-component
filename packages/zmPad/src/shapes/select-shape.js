import { Shape } from '../shape';
export class SelectShape extends Shape {
    constructor(stage, style, clientid, toolname,showtype) {
        super(stage, style, clientid, toolname,showtype);
        //style.draggable = true;
        this.shape = new Konva.Rect(Object.assign({},{
            fill: 'green',
            shadowEnabled: false,
            strokeWidth: 1,
            opacity: .4,
          }));
        this.templayer.add(this.shape);
        //this.startPromiseResolve = null;
        this.startData = null;


    }
    startDataTemp(point) {
        // this.startData = [
        //     point.x,
        //     point.y,
        //     this.clientid,
        //     this.toolname,
        //     [this.style.strokeWidth,this.isFill?1:0, this.isFill?this.style.fill:this.style.stroke, this.isShift?1:0]
        // ];
        return null
    }
    centerDataTemp(point) {
        return null;
     }
    endDataTemp(point){

        const rect = this.shape.getClientRect();
        for(var key in rect){
            rect[key] = rect[key]*this.stage.scaleX()
        }
        // console.log('rect',rect,this.middlePoints[1],this.stage.scaleX())
        rect.y= rect.y + this.stage.y() /// this.stage.scaleX();
        this.showlayer.find('.editshape').forEach((it)=>{
            if(Konva.Util.haveIntersection(it.getClientRect(),rect)){
                if(it.me&&it.me.fireEdit){
                    it.me.fireEdit(it);
                }
            }else{
                if(it.me&&it.me.unfireEdit)it.me.unfireEdit(it);
            }
        })
        //const lastPot = {x:rect.x+rect.width,y:rect.y+rect.height};
        
        this.showlayer.batchDraw();
        const {options} = this.stage.canvasaction;
        if(options&&options.selectShapeCb)options.selectShapeCb()
        //setTimeout(()=>{
            const lastShape = this.stage.getIntersection(this.stage.getPointerPosition(),'.editshape');
            console.log('lastShapess',lastShape)
            if(lastShape){
                this.stage.container().style.cursor = 'move';
            }else{
                this.stage.container().style.cursor = '';
            }
            // if(!lastShape || (lastShape.name() !== 'editshape'&& (!lastShape.parent || lastShape.parent.name() !== 'editshape'))){
            //     this.stage.container().style.cursor = '';
            // }else if(lastShape&& (lastShape.name() === 'editshape' || (lastShape.parent && lastShape.parent.name() !== 'editshape'))){
                
            // }
        // },0)
        
        return null;
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
    endDraw(){
        this.shape.remove();
        this.templayer.draw();
    }

}