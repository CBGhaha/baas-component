
import {
    Shape
} from '../shape';
import {
    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE
} from '../global';
import {
    html
} from 'redom';
import {makeTransformer, zmMovedDom, makeUUID, iosVersion} from "../util";
export class TextEdit extends Shape {
    constructor(stage, style, clientid, toolname, showtype, text) {
        super(stage, style, clientid, toolname);
        const {options} = this.stage.canvasaction;
        this.shape = new Konva.Text({
            fill: style.stroke,
            fontFamily: style.fontFamily || (options&&options.defaultFontFamily) || 'microsoft yahei',
            fontSize: style.fontSize || 14,
            name: 'editshape'
        });
        this.text = text;
        this.templayer.add(this.shape);
        this.tr = makeTransformer();
        this.tr.on('mousedown touchstart', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                evt.cancelBubble = true;
            }
        })
        //this.textarea = document.createElement('div');
        //this.textarea.contentEditable = true;

    }
    pushPoint(point){
        this.middlePoints[0] = (point.x/this.stage.scale().x);
        this.middlePoints[1] = (point.y/this.stage.scale().x);
    }
    startDataTemp(point) {}
    centerDataTemp(point) {}
    endDataTemp(point) {
        return [
            [
                point.x,
                point.y,
                this.clientid,
                this.toolname,
                [
                    this.style.fontSize || 14,
                    this.style.stroke,
                ],
                [],
                [this.uid, this.text]
            ]
        ];
    }
    draw() {
        if (this.middlePoints.length > 0) {
            this.shape.x(this.middlePoints[0]);
            this.shape.y(this.middlePoints[1]);
            this.shape.text(this.text);
            if (this.showtype !== 'replayData') this.templayer.batchDraw();
        }
    }
    moveFunc(cloneLayer){
        console.log('moveFuncmoveFunc')
        this.stage.canvasaction.localClientId++;
            const x = cloneLayer.x();
            const y = cloneLayer.y();
            const sd = [
                x * this.stage.scale().x,
                y * this.stage.scale().x,
                this.stage.canvasaction.localClientId,
                DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
                [],
                [makeUUID()],
                [cloneLayer.id(), 0],
                true
            ]
            this.stage.canvasaction.sendMessageToOutSider(sd);
            this.stage.canvasaction.pushCatchData(sd);
    }
    endDraw() {
        const cloneLayer = this.shape.clone();
        this.shape.remove();
        this.shape.destroy();
        this.showlayer.add(cloneLayer);
        cloneLayer.me = this;
        cloneLayer.id(this.uid);
        if (this.showtype === 'replayData') {

        } else {
            cloneLayer.draw();
        }

        cloneLayer.on('click', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                let temp = this.isSelected;
                this.stage.canvasaction.removeSelectShape();
                this.isSelected = temp;
                if (this.isSelected) {
                    this.unfireEdit(cloneLayer);
                } else {
                    console.log('fireEdit');
                    this.fireEdit(cloneLayer);
                }
                const {options} = this.stage.canvasaction;
                if(options&&options.selectShapeCb)options.selectShapeCb()

            }
            evt.cancelBubble = true;
        })
        cloneLayer.on('mousedown touchstart', (evt) => {
            console.log('mousedown', this.stage.canvasaction.isSelectMode())
            if (this.stage.canvasaction.isSelectMode()) {
                evt.cancelBubble = true;
            }
        })
        cloneLayer.on('dragmove', () => {
            console.log('dragmove');
        });
        cloneLayer.on('dragend', () => {
            console.log('dragend');
            if(this.isSelected){
                this.moveFunc(cloneLayer)
            }
            
        });

        cloneLayer.on('transform', () => {
            console.log('transform');
        });
        cloneLayer.on('transformend', () => {
            console.log('transform end');
            this.stage.canvasaction.localClientId++;
            const x = cloneLayer.x();
            const y = cloneLayer.y();
            const sx = cloneLayer.scaleX();
            const sy = cloneLayer.scaleY();
            const sd = [
                x * this.stage.scale().x,
                y * this.stage.scale().x,
                this.stage.canvasaction.localClientId,
                DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
                [],
                [makeUUID()],
                [cloneLayer.id(), 1, sx, sy],
                true
            ]
            this.stage.canvasaction.sendMessageToOutSider(sd);
            this.stage.canvasaction.pushCatchData(sd);

        });

        cloneLayer.on('dblclick', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                //this.unfireEdit(cloneLayer);
                this.tr.remove();
                cloneLayer.hide();
                cloneLayer.setAttr('isEdit', true);
                this.notedit = false;
                this.showTextEditInput(cloneLayer);
            }
            evt.cancelBubble = true;
        })

    }
    resizeTextAreaOld(sp){
        var textPosition = sp.absolutePosition();
        var stageBox = this.stage.container().getBoundingClientRect();
        var areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y
        };
        this.textarea.style.top = areaPosition.y + 'px';
        this.textarea.style.left = areaPosition.x + 'px';
        this.textarea.style.fontSize = sp.fontSize() * sp.scaleY() * this.stage.scaleY() + 'px';
    }
    resizeTextArea(sp){
        var textPosition = sp.absolutePosition();
        //var stageBox = this.stage.container().getBoundingClientRect();
        var areaPosition = {
            x: textPosition.x,
            y: textPosition.y 
        };
        this.textarea.style.top = areaPosition.y + 'px';
        this.textarea.style.left = areaPosition.x + 'px';
        this.textarea.style.fontSize = sp.fontSize() * sp.scaleY() * this.stage.scaleY() + 'px';
    }
    showTextEditInput(cloneLayer){
        const textPosition = cloneLayer.absolutePosition();
        const  fonteSizeVal = cloneLayer.fontSize() * cloneLayer.scaleY() * this.stage.scaleY();
        this.textarea = this.stage.canvasaction.editText.el;
        this.stage.canvasaction.editText.shape = cloneLayer;
        //console.log('showTextEditInput',this.textarea)
        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y
        };
        

        this.textarea.style.display = 'block';
        this.textarea.style.top = areaPosition.y + 'px';
        this.textarea.style.left = areaPosition.x + 'px';
        this.textarea.innerText = cloneLayer.text();
        this.textarea.style.fontSize = fonteSizeVal + 'px';
        const {options} = this.stage.canvasaction;
        let lineColor = cloneLayer.fill();
        if(options&&options.textLineColor){
            lineColor = options.textLineColor
        }
        this.textarea.style.outline = `1px solid ${lineColor}`;

        const iosVer = iosVersion()
        if(iosVer && iosVer<9){
            this.textarea.style.border = `1px solid ${lineColor}`;
        }

        this.textarea.style.lineHeight = cloneLayer.lineHeight();
        this.textarea.style.fontFamily = cloneLayer.fontFamily();
        //this.textarea.style.transformOrigin = 'left top';
        this.textarea.style.textAlign = cloneLayer.align();
        this.textarea.style.color = cloneLayer.fill();
        this.textarea.style.minHeight = `${fonteSizeVal+5}px`;
        this.textarea.focus();
        if(options&&options.textEditfocusCb)options.textEditfocusCb()


    }
    showTextEditInputOld(cloneLayer) {
        var textPosition = cloneLayer.absolutePosition();
        console.log('textPosition',textPosition)
        var stageBox = this.stage.container().getBoundingClientRect();
        var areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y
        };
        if(this.textarea)this.textarea.remove();
        this.textarea = document.createElement('div');
        this.textarea.contentEditable = true;
        document.body.appendChild(this.textarea);
        this.textarea.innerText = cloneLayer.text();
        this.textarea.style.position = 'absolute';
        this.textarea.style.zIndex = '1';
        this.textarea.style.display = 'block';
        this.textarea.style.top = areaPosition.y + 'px';
        this.textarea.style.left = areaPosition.x + 'px';
        this.textarea.style.minWidth = '100px';
        // this.textarea.style.width = cloneLayer.width()*cloneLayer.scaleX() - cloneLayer.padding() * 2 + 'px';
        // this.textarea.style.height = cloneLayer.height()*cloneLayer.scaleY() - cloneLayer.padding() * 2 + 5 + 'px';
        const  fonteSizeVal = cloneLayer.fontSize() * cloneLayer.scaleY() * this.stage.scaleY();
        //console.log('cloneLayer.fontSize()',cloneLayer.fontSize(),cloneLayer.scaleY(),this.stage.scaleY())
        this.textarea.style.fontSize = fonteSizeVal + 'px';
        this.textarea.style.border = `none`;
        this.textarea.style.padding = '0px';
        this.textarea.style.margin = '0px';
        this.textarea.style.overflow = 'hidden';
        this.textarea.style.background = 'none';
        this.textarea.style.outline = `1px solid ${cloneLayer.fill()}`;
        this.textarea.style.resize = 'none';
        this.textarea.style.lineHeight = cloneLayer.lineHeight();
        this.textarea.style.fontFamily = cloneLayer.fontFamily();
        //this.textarea.style.transformOrigin = 'left top';
        this.textarea.style.textAlign = cloneLayer.align();
        this.textarea.style.color = cloneLayer.fill();
        this.textarea.style.height = 'fit-content';
        this.textarea.style.minHeight = `${fonteSizeVal+5}px`;
        //this.textarea.style.height = this.textarea.scrollHeight + 3 + 'px';
        this.textarea.focus();
        this.textarea.addEventListener('keyup', this.changeEditHeight.bind(this))
        this.textarea.addEventListener('keydown', this.chagneEnterBr.bind(this))
        //this.textarea.click()
        const {options} = this.stage.canvasaction;
        if(options&&options.textEditfocusCb)options.textEditfocusCb()
        console.log('zmMovedDom,zmMovedDom')
        
        zmMovedDom({
            dragHandle: this.textarea,
            dragTarget:this.textarea,
            parentDom:this.stage.canvasaction.parentDom.querySelector('.konvajs-content'),
            cb:({type,x,y})=>{
                window.shapeTest = this.shape;
                console.log('zmMovedDom cb',type)
                if(type==='move'){
                    cloneLayer.x((this.textarea.offsetLeft - stageBox.left)/this.stage.scale().x);
                    cloneLayer.y((this.textarea.offsetTop - stageBox.top - this.stage.y())/this.stage.scale().x );
                }else{
                    if(this.shape.parent === null){
                        this.moveFunc(cloneLayer);
                    }
                }
                
                // this.middlePoints[0] = this.shape.x();
                // this.middlePoints[1] = this.shape.y();
                // console.log('this.middlePoints',this.middlePoints)
            }
        })
        
    }
    changeEditHeight(e) {
        e.stopPropagation();
        //console.log('changeEditHeight', this.textarea.scrollHeight, this.textarea.clientHeight, e.keyCode);
        if (this.textarea.scrollHeight > this.textarea.clientHeight) {
            this.textarea.style.height = `${this.textarea.scrollHeight + 3}px`;
        }

    }
    chagneEnterBr(e){
        e.stopPropagation();
        // if ( e.keyCode == 13 ){
        //     // e.preventDefault();
        //     // this.textarea.innerHTML += "<br>";
        //     document.execCommand('defaultParagraphSeparator', false, 'p');
        // }
    }
    fireEdit(shape) {
        this.isSelected = true;
        shape.draggable(true);
        this.stage.container().style.cursor = 'move';
        if (this.tr) this.tr.remove()
        this.showlayer.add(this.tr);
        this.tr.attachTo(shape);
        shape.off('mouseenter');
        shape.off('mouseleave');
        shape.on('mouseenter', () => {
            console.log('mouseenter');
            this.stage.container().style.cursor = 'move';
        });

        shape.on('mouseleave', () => {
            console.log('mouseleave');
            this.stage.container().style.cursor = '';
        });

        this.showlayer.batchDraw();
    }
    formatTextStr(html){
        if(!html)return '';
        var str = html.replace(/<div><br><\/div>/g,'\n').replace(/<div>/g,'\n').replace(/<\/div>/g,'').replace(/<br>/g,'\n');
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }
    unfireEdit(shape) {
        //console.log('unfireEdit',shape.id(),this.textarea,this.textarea&&this.textarea.style.display,this.notedit)
        this.isSelected = false;
        if (this.textarea&&this.textarea.style&& this.textarea.style.display!='none' && !this.notedit && this.notedit!=undefined) {
            const newVal = this.formatTextStr(this.textarea.innerHTML);
            const oldVal = this.text;
            this.text = newVal;
            shape.text(this.text);
            shape.setAttr('isEdit', false)
            //var stageBox = this.stage.container().getBoundingClientRect();
            // shape.x((this.textarea.offsetLeft - stageBox.left)/this.stage.scale().x);
            // shape.y((this.textarea.offsetTop - stageBox.top - this.stage.y())/this.stage.scale().x );
            // const oldx = shape.x();
            // const oldy = shape.y();
            const newx= (this.textarea.offsetLeft)/this.stage.scale().x;
            const newy = (this.textarea.offsetTop  - this.stage.y())/this.stage.scale().x 

            shape.x(newx);
            shape.y(newy);
            shape.show();
            if(oldVal!=newVal || this.stage.canvasaction.editText.ismoving){
                this.stage.canvasaction.localClientId++;
                const x = shape.x();
                const y = shape.y();
                const sd = [
                    x * this.stage.scale().x,
                    y * this.stage.scale().x,
                    this.stage.canvasaction.localClientId,
                    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
                    [],
                    [makeUUID()],
                    [shape.id(), 3, this.text],
                    true
                ]
                this.stage.canvasaction.sendMessageToOutSider(sd);
                this.stage.canvasaction.pushCatchData(sd);
            }
            
            this.removeTextArea();
        }
        shape.draggable(false);
        if (this.tr) this.tr.remove()
        shape.off('mouseenter');
        shape.off('mouseleave');
        this.stage.container().style.cursor = '';
        this.showlayer.batchDraw();
    }

    removeTextArea(){
        // if (this.textarea.isConnected) {
        //     this.textarea.removeEventListener('keyup', this.changeEditHeight.bind(this));
        //     this.textarea.removeEventListener('keydown', this.chagneEnterBr.bind(this));
        //     this.textarea.parentNode.removeChild(this.textarea);
        // }
        if(this.textarea){
            this.stage.canvasaction.editText.ismoving = false;
            this.textarea.style.display='none';
            this.textarea = null;
            const {options} = this.stage.canvasaction;
            if(options&&options.textEditHidedCb)options.textEditHidedCb()
        }
    }
    changeTextVal(shape,text){
        this.text = text;
        shape.text(text)
    }
    destroy() {
        super.destroy();
        this.removeTextArea();
    }

}
