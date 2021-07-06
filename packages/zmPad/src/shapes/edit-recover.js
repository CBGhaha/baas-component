import {
    Shape
} from '../shape';
let timer = null;
export class EditRecover extends Shape {
    constructor(stage, style, clientid, toolname, showtype, data) {
        super(stage, style, clientid, toolname, showtype, data);
        this.data = data;
    }
    redrawData(){
        this.showlayer.removeChildren();
        this.stage.canvasaction.redraw();
        this.endDraw();
    }
    pushPoint(point) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            console.log('redrawdata')
            this.redrawData();
            if (this.showtype === 'replayData')this.showlayer.batchDraw();
        },20)
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
        if (this.showtype !== 'replayData') this.showlayer.batchDraw();
    }
    changeRegular() {

    }

}