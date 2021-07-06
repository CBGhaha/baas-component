import {
    Shape
} from '../shape';
import {
    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE
} from '../global';
import {makeTransformer, makeUUID} from "../util";
export class SimpleTriangleEdit extends Shape {
    constructor(stage, style, clientid, toolname, showtype) {
        super(stage, style, clientid, toolname, showtype);
        style.name = 'editshape';
        this.shape = new Konva.Line(style);
        this.templayer.add(this.shape);
        this.tr = makeTransformer();
        this.tr.on('mousedown touchstart', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                evt.cancelBubble = true;
            }
        })
        this.shiftPois = null;

    }
    startDataTemp(point) {}
    centerDataTemp(point) {}
    endDataTemp(point) {
        return [
            [
                this.middlePoints[0] * this.stage.scale().x,
                this.middlePoints[1] * this.stage.scale().x,
                this.clientid,
                this.toolname,
                [
                    this.style.strokeWidth,
                    this.isFill ? this.style.fill : this.style.stroke,
                    // point.x,
                    // point.y,
                    // 2*this.middlePoints[0]*this.stage.scale().x - point.x ,
                    // point.y,
                    this.shiftPois[0] * this.stage.scale().x,
                    this.shiftPois[1] * this.stage.scale().x,
                    (this.shiftPois.length < 4 ? this.shiftPois[0] : this.shiftPois[2]) * this.stage.scale().x,
                    (this.shiftPois.length < 4 ? this.shiftPois[1] : this.shiftPois[3]) * this.stage.scale().x,
                    this.isShift ? 1 : 0,
                    this.isFill ? 1 : 0
                ],
                [],
                [this.uid],
                true
            ]
        ];
    }
    draw() {
        if (this.middlePoints.length > 3) {
            const originpoi = {
                x: this.middlePoints[0],
                y: this.middlePoints[1]
            }
            //const midpoi = {x:this.middlePoints[this.middlePoints.length-4],y:this.middlePoints[this.middlePoints.length-3]}
            const lastpoi = {
                x: this.middlePoints[this.middlePoints.length - 2],
                y: this.middlePoints[this.middlePoints.length - 1]
            }
            if (this.isShift) {
                const x1 = (lastpoi.y - originpoi.y) / Math.sqrt(3) + originpoi.x;
                const x2 = originpoi.x - (lastpoi.y - originpoi.y) / Math.sqrt(3);
                this.shape.points([originpoi.x, originpoi.y, x1, lastpoi.y, x2, lastpoi.y])
                this.shiftPois = [x1, lastpoi.y, x2, lastpoi.y]

            } else {
                if (`${this.clientid}`.indexOf('.') > 0) {
                    const midpoi = {
                        x: this.middlePoints[this.middlePoints.length - 4],
                        y: this.middlePoints[this.middlePoints.length - 3]
                    }
                    this.shape.points([originpoi.x, originpoi.y, midpoi.x, midpoi.y, lastpoi.x, lastpoi.y]);
                    this.shiftPois = [midpoi.x, midpoi.y, lastpoi.x, lastpoi.y]

                } else {
                    const poi = {
                        x: (2 * originpoi.x) - lastpoi.x,
                        y: lastpoi.y
                    };
                    if (poi.y === originpoi.y) {
                        poi.y = originpoi.y + 1;
                        lastpoi.y = lastpoi.y + 1
                    }
                    this.shape.points([originpoi.x, originpoi.y, lastpoi.x, lastpoi.y, poi.x, poi.y]);
                    this.shiftPois = [lastpoi.x, lastpoi.y, poi.x, poi.y]

                }
            }
            this.shape.closed(true);

            if (this.showtype !== 'replayData') this.templayer.batchDraw();
        }

    }
    endDraw() {
        const cloneLayer = this.shape.clone();
        this.shape.remove();
        this.shape.destroy();
        this.showlayer.add(cloneLayer);
        cloneLayer.me = this;
        cloneLayer.id(this.uid);
        if (this.showtype === 'replayData') {} else {
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
                    this.fireEdit(cloneLayer);
                }
                const {options} = this.stage.canvasaction;
                if(options&&options.selectShapeCb)options.selectShapeCb()

            }
            evt.cancelBubble = true;
        })
        cloneLayer.on('mousedown touchstart', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                evt.cancelBubble = true;
            }
        })
        cloneLayer.on('dragmove', () => {
            console.log('dragmove');
        });
        cloneLayer.on('dragend', () => {
            console.log('dragend');
            if(!this.isSelected){
                return;
            }
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
    }
    fireEdit(shape) {
        this.isSelected = true;
        shape.draggable(true)
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
            if(this.stage.getIntersection(this.stage.getPointerPosition(),'Line')!==shape){
                this.stage.container().style.cursor = '';
            }
        });
        this.showlayer.batchDraw();
    }
    unfireEdit(shape) {
        this.isSelected = false;
        if (this.tr) this.tr.remove()
        shape.off('mouseenter');
        shape.off('mouseleave');
        this.stage.container().style.cursor = '';
        shape.draggable(false)
        this.showlayer.batchDraw();
    }

}