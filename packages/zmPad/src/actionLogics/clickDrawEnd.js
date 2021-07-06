import {
    DRAWTOOL_POLYGON_EDIT,
    DRAWTOOL_ELLIPSE_EDIT,
    DRAWTOOL_CIRCLE_EDIT,
    DRAWTOOL_LINE_EDIT,
    DRAWTOOL_TEXTTOOL_EDIT,
    DRAWTOOL_LINEDASH_EDIT,
    DRAWTOOL_LINEARROW_EDIT,
    DRAWTOOL_LINEARROWDASH_EDIT,
    DRAWTOOL_COORDSYS_EDIT,
} from "../global";

let lastPoint = null;
const simple_edit_arr = [
    DRAWTOOL_CIRCLE_EDIT,
    DRAWTOOL_ELLIPSE_EDIT,
    DRAWTOOL_LINE_EDIT,
    DRAWTOOL_LINEDASH_EDIT,
    DRAWTOOL_LINEARROW_EDIT,
    DRAWTOOL_LINEARROWDASH_EDIT,
    DRAWTOOL_COORDSYS_EDIT,
]
export function init(e) {
    if (this.isMouseEventFilter()) return;
    const {drawingProcessCb} = this.options
    const poi = this.stage.getPointerPosition();
    if (poi) {
        poi.x = poi.x / this.transformScale;
        poi.y = (poi.y - this.stage.y()) / this.transformScale;
    }
    if (this.shape) {
        if (this.shape.toolname === DRAWTOOL_POLYGON_EDIT) {
            if (this.shape.tempAchor.isEnd) {
                if(this.shape.controlPoints.length<6)return;
                this.isMouseMovePaiting = false;
                //this.stage.off("mousemove touchmove");
                this.shape.endDraw();
                const sd = this.shape.endDataTemp(poi)
                if (sd) {
                    for (var i = 0; i < sd.length; i++) {
                        this.sendMessageToOutSider(sd[i]);
                        this.pushCatchData(sd[i]);
                    }
                }
                this.shape = null;
                if(drawingProcessCb){
                    drawingProcessCb({
                        tool:this.tooltype,
                        step:'end'
                    })
                }

            } else {
                this.shape.pushControlPoint(poi);
                this.shape.draw();
            }
        } else if (simple_edit_arr.includes(this.shape.toolname)) {
            console.log('poi', poi);
            this.shape.pushPoint(poi);
            this.shape.draw();
            if (this.shape.tempAchor.getAttr('status') === 'fixed') {
                console.log('fire move move');
                this.isMouseMovePaiting = true;
                //this.stage.on("mousemove touchmove", this.handleMoveLogic);
            } else if (this.shape.tempAchor.getAttr('status') === 'end') {
                // this.stage.off("mousemove touchmove");
                this.isMouseMovePaiting = false;
                this.shape.endDraw();
                const sd = this.shape.endDataTemp(poi)
                if (sd) {
                    for (var i = 0; i < sd.length; i++) {
                        this.sendMessageToOutSider(sd[i]);
                        this.pushCatchData(sd[i]);
                    }
                }
                this.shape = null;
                if(drawingProcessCb){
                    drawingProcessCb({
                        tool:this.tooltype,
                        step:'end'
                    })
                }
            }

        } else if (this.shape.toolname === DRAWTOOL_TEXTTOOL_EDIT) {
            if (this.shape.textarea && this.shape.textarea.innerText.replace(/ /g, '')) {
                this.shape.text = this.shape.formatTextStr(this.shape.textarea.innerHTML);
                // var stageBox = this.stage.container().getBoundingClientRect();
                // this.shape.shape.x((this.shape.textarea.offsetLeft - stageBox.left)/this.stage.scale().x);
                // this.shape.shape.y((this.shape.textarea.offsetTop - stageBox.top - this.stage.y())/this.stage.scale().x );
                this.shape.shape.text(this.shape.text);
                this.shape.endDraw();
                this.shape.removeTextArea();
                
                lastPoint.x = this.shape.shape.x() * this.stage.scale().x;
                lastPoint.y = this.shape.shape.y() * this.stage.scale().x;
                console.log('xixixixix',this.shape.shape.x(),this.shape.shape.y(),lastPoint)
                const sd = this.shape.endDataTemp(lastPoint)
                if (sd) {
                    for (var i = 0; i < sd.length; i++) {
                        this.sendMessageToOutSider(sd[i]);
                        this.pushCatchData(sd[i]);
                    }
                }
                this.shape.notedit = true;
                this.shape = null;
                if(drawingProcessCb){
                    drawingProcessCb({
                        tool:this.tooltype,
                        step:'end'
                    })
                }
                return;
            }
            console.log('psuhPoint poi', poi);
            this.shape.pushPoint(poi);
            this.shape.shape.x(this.shape.middlePoints[0]);
            this.shape.shape.y(this.shape.middlePoints[1]);
            //this.shape.shape.width(100);
            this.shape.showTextEditInput(this.shape.shape)
            lastPoint = poi;


        }

    }
    this.isMouseUpPaiting = false;
    //this.stage.off("mouseup touchend");
}