import {makeShapeInstance} from "./shapefactory";
import {
    DRAWTOOL_TEXTTOOL,
    DRAWTOOL_TRIANGLE,
    DRAWTOOL_LINEARROW,
    DRAWTOOL_SELCTE_SHAPE,
    DRAWTOOL_POLYGON_EDIT,
    DRAWTOOL_RECT_EDIT,
    DRAWTOOL_CIRCLE_EDIT,
    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
    DRAWTOOL_EDIT_SHAPE_DELETE,
    DRAWTOOL_ELLIPSE_EDIT,
    DRAWTOOL_LINE_EDIT,
    DRAWTOOL_TEXTTOOL_EDIT,
    DRAWTOOL_LINEDASH_EDIT,
    DRAWTOOL_LINEARROW_EDIT,
    DRAWTOOL_LINEARROWDASH_EDIT,
    DRAWTOOL_COORDSYS_EDIT,
    DRAWTOOL_EDIT_PAGE_DELETE,
    DRAWTOOL_PENCIL, DRAWTOOL_ERASER, DRAWTOOL_EDIT_RECOVER, RECOVER_NUM,
    DRAWTOOL_SIMPLE_TRIANGLE_EDIT
} from "./global";
import { makeUUID, getActionItemUid, isMobile, isTouchDevice } from "./util";
import { init as clickDrawEnd } from './actionLogics/clickDrawEnd'
const EDIT_SHAPES = [DRAWTOOL_RECT_EDIT,DRAWTOOL_CIRCLE_EDIT,DRAWTOOL_POLYGON_EDIT,DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE]
export class CanvasAction {
    constructor(stage, cacheDataInstance, options={}) {
        this.stage = stage;
        this.msgport = null;
        this.dataCallBack = null;
        this.tooltype = "brush";
        this.initEvent = this.initEvent.bind(this);
        this.shape = null;
        this.scaletoserver = null;
        // this.layerCachData = null;
        // this.currentLayerId = null;
        this.cacheDataInstance = cacheDataInstance;
        this.sendMessageToOutSider = this.sendMessageToOutSider.bind(this);
        this.isShift = false;
        this.isFill = false;
        this.isTempAchor = true;
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.localStyle = {
            stroke: "#EF4C4F",
            strokeWidth: 2
        };
        this.localClientId = 0;
        this.pushCatchData = this.pushCatchData.bind(this);
        this.dataToServer = this.dataToServer.bind(this);
        this.isMouseEventFilter = this.isMouseEventFilter.bind(this);
        this.isMouseClickedDraw = this.isMouseClickedDraw.bind(this);
        this.mouseClickedDrawLogic = this.mouseClickedDrawLogic.bind(this);
        this.handleDownLogic = this.handleDownLogic.bind(this);
        this.handleDbClick = this.handleDbClick.bind(this);
        this.handleMoveLogic = this.handleMoveLogic.bind(this);
        this.handleStopLogic = this.handleStopLogic.bind(this);
        this.mouseClickedDrawStopLogic = this.mouseClickedDrawStopLogic.bind(this);
        this.outerStage = this.outerStage.bind(this);
        this.drawOuterStage = this.drawOuterStage.bind(this);
        this.deleteTempShape = this.deleteTempShape.bind(this);
        this.deletePageData = this.deletePageData.bind(this)
        this.recoverData = this.recoverData.bind(this)
        this.deleteSelectData = this.deleteSelectData.bind(this);
        this.calcRecoverNum = this.calcRecoverNum.bind(this);
        this.options = options;
        this.transformScale = 1;
        this.clickedDrawTools = [
            DRAWTOOL_POLYGON_EDIT,
            DRAWTOOL_ELLIPSE_EDIT,
            DRAWTOOL_CIRCLE_EDIT,
            DRAWTOOL_LINE_EDIT,
            DRAWTOOL_TEXTTOOL_EDIT,
            DRAWTOOL_LINEDASH_EDIT,
            DRAWTOOL_LINEARROW_EDIT,
            DRAWTOOL_LINEARROWDASH_EDIT,
            DRAWTOOL_COORDSYS_EDIT,
        ];
        this.mousemovetime = performance.now();
        this.mousedowntime = performance.now();
        this.recoverLeftNums = {}
        this.disableRecover = true;
        this.isMouseUpPaiting = false;
        this.isMouseMovePaiting = false;
        this.filterTimer = options.filterTimer||16;
        this.isMobileDevice = isMobile();
        this.isTouchDevice = isTouchDevice();

    }

    handleDbClick(e){
        console.log('handleDbClick')
    }

    handleDownLogic(e) {
        //this.focusTextArea()
        // if(this.tooltype === DRAWTOOL_TEXTTOOL_EDIT && this.isMobileDevice && (performance.now() - this.mousedowntime)<200){
        //     return;
        // }
        // this.mousedowntime = performance.now();
        const pressure =  e.evt&&(e.evt.data||(e.evt.targetTouches&&e.evt.targetTouches[0]&&e.evt.targetTouches[0].force));
        if (this.isMouseEventFilter()) return;
        else if(this.isMouseClickedDraw()){
            this.mouseClickedDrawLogic(e);
            return;
        }
        if(e&&e.evt&&e.evt.button == 2&&this.options&&this.options.rightMouseDownCb){
            this.options.rightMouseDownCb()
        }
        const ShapeClass = makeShapeInstance(this.tooltype);
        if (this.shape && this.shape.shape) {
            this.shape.shape.remove();
        }
        this.localClientId = this.localClientId + 1;
        const style = Object.assign({}, this.localStyle)
        if (this.isFill) {
            //delete style['stroke'];
        } else {
            delete style['fill'];
        }
        this.shape = new ShapeClass(
            this.stage,
            style,
            this.localClientId,
            this.tooltype
        );
        this.shape.isShift = this.isShift;
        this.shape.isFill = this.isFill;
        this.shape.uid = makeUUID();
        if(pressure)this.shape.pressure = pressure;
        const poi = this.stage.getPointerPosition();
        if(!poi)return;
        poi.x = poi.x/this.transformScale;
        poi.y = (poi.y-this.stage.y()) / this.transformScale;
        const sd = this.shape.startDataTemp(poi);
        if (sd) {
            this.sendMessageToOutSider(sd);
            this.pushCatchData(sd);

        }
        this.shape.pushPoint(poi);
        this.isMouseUpPaiting = true;
        this.isMouseMovePaiting = true;
        // this.stage.on("mousemove touchmove", this.handleMoveLogic);

        // this.stage.on("mouseup touchend", this.handleStopLogic);
        // contentTouchstart, contentTouchmove, contentTouchend,

    }

    focusTextArea(){
        console.log('this.shape &&this.shape.textarea 1212')
        if(this.isMobileDevice && this.tooltype === DRAWTOOL_TEXTTOOL_EDIT && this.shape &&this.shape.textarea){
            this.shape.textarea.focus();
            console.log('this.shape &&this.shape.textarea 3434')
            // window.t1 = this.shape.textarea;
        }
    }

    handleMoveLogic(e) {
        if(!this.isMouseMovePaiting)return;
        if((performance.now() - this.mousemovetime)<this.filterTimer)return;
        else this.mousemovetime = performance.now();
        //console.log('handleMoveLogic',this.filterTimer)
        // var a = new Date();
        // console.log('mouse move data',a.getMinutes()+':'+a.getSeconds()+':' + a.getMilliseconds())
        const pressure = e.evt&&(e.evt.data||(e.evt.targetTouches&&e.evt.targetTouches[0]&&e.evt.targetTouches[0].force));
        if(pressure)this.shape.pressure = pressure;
        this.shape.isShift = this.isShift;
        const poi = this.stage.getPointerPosition();
        if(!poi)return;
        poi.x = poi.x/this.transformScale;
        poi.y = (poi.y-this.stage.y()) / this.transformScale;
        this.shape.pushPoint(poi);
        this.shape.draw();
        const sd = this.shape.centerDataTemp(poi);
        if (sd) {
            this.sendMessageToOutSider(sd);
            this.pushCatchData(sd);
        }

    }
    mouseClickedDrawStopLogic(e){
        clickDrawEnd.bind(this)(e);
    }

    handleStopLogic(e) {
        //this.focusTextArea()
        const pressure =  e.evt&&(e.evt.data||(e.evt.targetTouches&&e.evt.targetTouches[0]&&e.evt.targetTouches[0].force));
        if (this.isMouseEventFilter()) return;
        if(!this.isMouseUpPaiting)return;
        if(this.isMouseClickedDraw()){
            this.mouseClickedDrawStopLogic(e)
            return;
        }
        if(e&&e.evt&&e.evt.button == 2&&this.options&&this.options.rightMouseUpCb){
            this.options.rightMouseUpCb()
        }
        //console.log('this.stage.getPointerPosition()',this.stage.getPointerPosition())
        const poi = this.stage.getPointerPosition();
        if(poi){
            poi.x = poi.x/this.transformScale;
            poi.y = (poi.y-this.stage.y()) / this.transformScale;
        }
        this.shape.isShift = this.isShift;
        if (this.shape) {
            if(pressure)this.shape.pressure = pressure;
            if(poi)this.shape.pushPoint(poi);
            this.shape.draw();
            this.shape.endDraw();
            //console.log('handleStopLogic',poi,this.shape);
            const sd = poi?this.shape.endDataTemp(poi):this.shape.endDataTemp({
                x:this.shape.middlePoints[this.shape.middlePoints.length-2] * this.stage.scale().x,
                y:this.shape.middlePoints[this.shape.middlePoints.length-1] * this.stage.scale().x});
            if (sd) {
                    for(var i=0;i<sd.length;i++){
                        this.sendMessageToOutSider(sd[i]);
                        this.pushCatchData(sd[i]);
                    }
            }
            this.shape = null
        }
        this.isMouseUpPaiting = false;
        this.isMouseMovePaiting = false;
        //this.stage.off("mousemove touchmove");
        //this.stage.off("contentTouchmove.proto");

        //this.stage.off("mouseup touchend");
        //this.stage.off("contentTouchend.proto");

    }

    keyDownEvent() {
        window.addEventListener("keydown", this.keyDown);
    }

    keyUpEvent() {
        window.addEventListener("keyup", this.keyUp);
    }

    setLocalStyle(style) {
        this.localStyle = style;
    }

    keyDown(e) {
        if (e.keyCode === 16) {
            this.isShift = true;
        }else if(e.keyCode === 46){
            //this.deleteSelectData();
        }else if(e.keyCode === 27){

            this.removePolyGonTemp();
        }else if(e.keyCode === 90 && e.ctrlKey){
            console.log('ctrl z')
            if(!this.disableRecover){
                this.recoverData();
            }
            
        }
    }

    removePolyGonTemp(){
        if(this.shape && this.isMouseClickedDraw() ){ //&& this.shape.toolname === DRAWTOOL_POLYGON_EDIT
            this.deleteTempShape();
        }
    }


    keyUp(e) {
        if (e.keyCode === 16) {
            this.isShift = false;
        }
    }

    removeEvent() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
    }

    pushCatchData(data) {
        //console.log('pushCatchData', this.cacheDataInstance.currentLayerId,data);
        if (!this.cacheDataInstance.layerCachData || !this.cacheDataInstance.layerCachData[this.cacheDataInstance.currentLayerId]) {
            this.cacheDataInstance.layerCachData[this.cacheDataInstance.currentLayerId] = [];
        }

        this.cacheDataInstance.layerCachData[this.cacheDataInstance.currentLayerId].push(this.dataToServer(data));
        
        this.calcRecoverNum(data)
        
    }
    calcRecoverNum(data){
        try {
            const [x,y,id,name] = data;
            if(name && typeof name === 'string'){
                let cR = this.recoverLeftNums[this.cacheDataInstance.currentLayerId];
                if(cR===undefined)cR=[];
                if(name !== DRAWTOOL_EDIT_RECOVER){
                    cR.push(data)
                }else{
                    cR.splice(-1)
                }
                this.recoverLeftNums[this.cacheDataInstance.currentLayerId] = cR.slice(-RECOVER_NUM)
            }
            
            
        } catch (error) {
            
        }
    }

    drawTextAction(x, y, text) {
        const ShapeClass = makeShapeInstance(this.tooltype);
        if (this.shape && this.shape.shape) {
            this.shape.shape.remove();
        }
        this.localClientId = this.localClientId + 1;


        this.shape = new ShapeClass(
            this.stage,
            this.localStyle,
            this.localClientId,
            this.tooltype,
            '',
            text
        );
        this.shape.uid = makeUUID();
        this.shape.pushPoint({x, y});
        const sd = this.shape.endDataTemp({x, y});

        if (sd) {
            for(var i=0;i<sd.length;i++){
                this.sendMessageToOutSider(sd[i]);
                this.pushCatchData(sd[i]);
            }
        }

        this.shape.draw();
        this.shape.endDraw();


    }

    isMouseEventFilter() {
        return this.tooltype === DRAWTOOL_TEXTTOOL  ||this.tooltype.indexOf('nodraw')>0
    }
    isMouseClickedDraw(toolname) {
        return this.clickedDrawTools.includes(toolname||this.tooltype);
    }
    mouseClickedDrawLogic(e){
        const {drawingProcessCb} = this.options;

        if(!this.shape){
            this.localClientId = this.localClientId + 1;
            const ShapeClass = makeShapeInstance(this.tooltype);
            const style = Object.assign({}, this.localStyle)
            this.shape = new ShapeClass(
                this.stage,
                style,
                this.localClientId,
                this.tooltype
            );
            if (this.isFill) {
                //delete style['stroke'];
            } else {
                delete style['fill'];
            }
            this.shape.isFill = this.isFill;
            this.shape.uid = makeUUID();
            this.shape.isTempAchor = this.isTempAchor;
            if(this.tooltype=== DRAWTOOL_POLYGON_EDIT){
                // this.stage.on("mousemove touchmove", this.handleMoveLogic);
                this.isMouseMovePaiting = true;
            }

            if(drawingProcessCb){
                drawingProcessCb({
                    tool:this.tooltype,
                    step:'first'
                })
            }

        }else{
            if(drawingProcessCb){
                drawingProcessCb({
                    tool:this.tooltype,
                    step:'middle'
                })
            }
            if(e&&e.evt&&e.evt.button == 2){
                this.removePolyGonTemp()
                this.options.rightMouseDownCb&&this.options.rightMouseDownCb({kind:'rightClearClickedDraw'})
            }
        }
        this.isMouseUpPaiting = true;
        //this.stage.on("mouseup touchend", this.mouseClickedDrawStopLogic);
    }
    setSelectMode(){
        this.tooltype = DRAWTOOL_SELCTE_SHAPE;
    }
    isSelectMode(){
        return this.tooltype === DRAWTOOL_SELCTE_SHAPE;
    }
    outerStage(){
        this.stage.fire('mouseup');
    }
    drawOuterStage(){
        this.stage.fire('mouseup');
        // if([DRAWTOOL_PENCIL,DRAWTOOL_ERASER].includes(this.tooltype)){
        //     this.stage.fire('mouseup');
        // }
        if(this.tooltype === DRAWTOOL_SELCTE_SHAPE){
            this.stage.stopDrag();
        }
    }
    closeDraw(){
        this.outerStage();
    }

    initEvent() {
        this.keyDownEvent();
        this.keyUpEvent();
        if(this.isMobileDevice){
            this.stage.on("touchstart", this.handleDownLogic);
        }else{
            this.stage.on("mousedown", this.handleDownLogic);
        }
        if(this.isTouchDevice){
            this.stage.off("touchstart");
            this.stage.on("touchstart", this.handleDownLogic);
        }
        //this.stage.on(this.isMobileDevice?"touchstart":"mousedown", this.handleDownLogic);
        
        //this.stage.on("mousedown touchstart", this.handleDownLogic);

        this.stage.on("contentMouseout.proto",this.drawOuterStage);

        this.stage.on('dblclick dbltap',this.handleDbClick)

        this.stage.on("mousemove touchmove", this.handleMoveLogic);

        this.stage.on("mouseup touchend", this.handleStopLogic);

    }

    setToolKind(name,isTempAchor=true) {
        if(name !== DRAWTOOL_SELCTE_SHAPE){
            this.removeSelectShape();
            this.stage.showlayer.hitGraphEnabled(false);
        }else{
            this.stage.showlayer.hitGraphEnabled(true);
        }
        //if(name!==this.tooltype){
            this.deleteTempShape();
        //}
        this.tooltype = name;
        this.isTempAchor = isTempAchor;
        if(this.shape&&this.shape.shape)this.shape.destroy();
        this.shape = null;
    }
    deleteTempShape(){
        if (this.shape && this.shape.shape) {
            const len =  this.shape.shape.find&&this.shape.shape.find('.editpoi').length
            if(len)this.stage.changeCharLabel(1 - len);
            this.shape.destroy();
            this.shape = null;
            this.stage.templayer.batchDraw();
        }
        // this.stage.off("mousemove touchmove");
        // this.stage.off("mouseup touchend");
        this.isMouseUpPaiting = false;
        this.isMouseMovePaiting = false;
        this.stage.container().style.cursor = '';
        this.isShift = false;

    }

    removeSelectShape(){
        try{
            this.stage.showlayer.find('.editshape').forEach((it)=>{
                if(it.me&&it.me.unfireEdit)it.me.unfireEdit(it);
            })
            this.stage.showlayer.batchDraw();
            if (this.options && this.options.selectShapeCb) this.options.selectShapeCb()
            
        }catch(e){

        }
        
    }
    getSelectData(){
        const editShapes = this.stage.showlayer.find('.editshape');
        return editShapes.filter((it)=>it.me.isSelected)
    }
    hasSelectedData(){
        const editShapes = this.stage.showlayer.find('.editshape');
        let result = false;
        for(var i=0;i<editShapes.length;i++){
            if(editShapes[i].me.isSelected){
                result = true;
                break;
            }
        }
        return result;
    }
    deletePageData(){
        this.deleteTempShape();
        const ShapeClass = makeShapeInstance(DRAWTOOL_EDIT_PAGE_DELETE);
        if (this.shape && this.shape.shape) {
            this.shape.shape.remove();
        }
        this.localClientId = this.localClientId + 1;
        this.shape = new ShapeClass(
            this.stage,
            {},
            this.localClientId,
            DRAWTOOL_EDIT_PAGE_DELETE,
            null
        );
        this.shape.uid = makeUUID();
        const poi = {x:0,y:0};
        this.localClientId++;
        const sd =  [
            poi.x,
            poi.y,
            this.localClientId,
            DRAWTOOL_EDIT_PAGE_DELETE,
            [],
            [],
            [this.shape.uid],
            true
        ]
        this.sendMessageToOutSider(sd);
        this.pushCatchData(sd);
        this.shape.pushPoint(poi);
        this.shape = null;
    }
    recoverData(){
        const cacheDataInstance = this.cacheDataInstance
        let data = cacheDataInstance.layerCachData[cacheDataInstance.currentLayerId];
        if(!data) data = [];
        const len = data.length;
        const currentCounter = this.recoverLeftNums[cacheDataInstance.currentLayerId];
        if(currentCounter&&currentCounter.length>0){
                const lastItem = currentCounter[currentCounter.length-1];
                const [a,b,c,name] = lastItem;
                const ShapeClass = makeShapeInstance(DRAWTOOL_EDIT_RECOVER);
                if (this.shape && this.shape.shape) {
                    this.shape.shape.remove();
                }
                this.localClientId = this.localClientId + 1;
                this.shape = new ShapeClass(
                    this.stage,
                    {},
                    this.localClientId,
                    DRAWTOOL_EDIT_RECOVER,
                    null
                );
                const poi = {x:0,y:0};
                this.localClientId++;
                const sd =  [
                    poi.x,
                    poi.y,
                    this.localClientId,
                    DRAWTOOL_EDIT_RECOVER,
                    [],
                    [],
                    [getActionItemUid(lastItem)],
                    true
                ]
                this.sendMessageToOutSider(sd);
                this.pushCatchData(sd);
                this.shape.pushPoint(poi);
                this.shape = null;
                const {recoverProcess} = this.options;
                if(recoverProcess){
                    recoverProcess()
                }
        }

    }
    deleteSelectData(){
        const editShapes = this.stage.showlayer.find('.editshape');
        this.deleteTempShape();
        this.shape = null;
        if(editShapes.length===0){
            return;
        }
        const deleteUids = [];
        editShapes.forEach((it)=>{
            if(it.me.isSelected){
                deleteUids.push(it.id())
            }

        })
        if(deleteUids.length === 0) return;
        const ShapeClass = makeShapeInstance(DRAWTOOL_EDIT_SHAPE_DELETE);
        if (this.shape && this.shape.shape) {
            this.shape.shape.remove();
        }
        this.localClientId = this.localClientId + 1;
        this.shape = new ShapeClass(
            this.stage,
            {},
            this.localClientId,
            this.tooltype,
            null,
            deleteUids,
        );
        this.shape.uid = makeUUID();
        const poi = {x:0,y:0};
        this.localClientId++;
        const sd =  [
            poi.x,
            poi.y,
            this.localClientId,
            DRAWTOOL_EDIT_SHAPE_DELETE,
            [],
            [this.shape.uid],
            deleteUids,
            true
        ]
        this.sendMessageToOutSider(sd);
        this.pushCatchData(sd);
        this.shape.pushPoint(poi);
        if (this.options && this.options.selectShapeCb) this.options.selectShapeCb()
        this.deleteTempShape();
        this.shape = null;
    }

    dataToServer(data) {
        const [x, y, ...others] = data;
        const xs = x / this.scaletoserver;
        const ys = y / this.scaletoserver;
        if (others[1] === DRAWTOOL_TRIANGLE || others[1] === DRAWTOOL_SIMPLE_TRIANGLE_EDIT) {
            const [id, tname, tdata, ...ot] = others;
            const x1 = tdata[2] / this.scaletoserver;
            const y1 = tdata[3] / this.scaletoserver;
            const x2 = tdata[4] / this.scaletoserver;
            const y2 = tdata[5] / this.scaletoserver;
            return [xs, ys, id, tname, [tdata[0], tdata[1], x1, y1, x2, y2,tdata[6],tdata[7]], ...ot];
        } else if(others[1] === DRAWTOOL_LINEARROW){
            const [id, tname, tdata, ...ot] = others;
            const x1 = tdata[2] / this.scaletoserver;
            const y1 = tdata[3] / this.scaletoserver;
            return [xs, ys, id, tname, [tdata[0], tdata[1], x1, y1], ...ot];
        } else {
            return [xs, ys, ...others]
        }


    }

    sendMessageToOutSider(data) {
        if (this.dataCallBack) {
            this.dataCallBack(this.dataToServer(data));
        }
        //console.log('sendMessageToOutSider', data, this.scaletoserver);
        // const {
        //     x,
        //     y
        // } = data;
        // if(this.dataCallBack)this.dataCallBack({data:{
        //     x: x / this.scaletoserver,
        //     y: y / this.scaletoserver
        // }})
        // this.msgport.postMessage({
        //     data: {
        //         x: x / this.scaletoserver,
        //         y: y / this.scaletoserver
        //     }
        // });
    }

}
