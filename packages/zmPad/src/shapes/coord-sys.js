import {
    Shape
} from "../shape";
import {
    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
    EDIT_LABLE_DXY
} from "../global";
import {makeTextPoi, makeTransformer, hoverImg, makeMoveHover, makeUUID} from "../util";

const MIN_SPACE = 10;

export class CoordSys extends Shape {
    constructor(stage, style, clientid, toolname, showtype) {
        super(stage, style, clientid, toolname, showtype);

        this.shape = new Konva.Group({
            draggable: false,
            name: 'editshape'
        });
        this.templayer.add(this.shape);

        this.tr = makeTransformer({disableMiu:true});
        this.tr.on('mousedown touchstart', (evt) => {
            if (this.stage.canvasaction.isSelectMode()) {
                evt.cancelBubble = true;
            }
        })
        this.linex = new Konva.Line(Object.assign({}, style, {
            dragBoundFunc: function (pos) {
                let y = pos.y;
                const parent = this.parent;
                const [, liney] = parent.find('Line');

                if (y - liney.getAbsolutePosition().y > Math.abs(parent.me.middlePoints[3]-parent.me.middlePoints[1])*parent.scaleY() - MIN_SPACE) {
                    y = Math.abs(parent.me.middlePoints[3]-parent.me.middlePoints[1])*parent.scaleY() - MIN_SPACE + liney.getAbsolutePosition().y
                } else if (y - liney.getAbsolutePosition().y < -Math.abs(parent.me.middlePoints[1]-liney.points()[1])*parent.scaleY()  + MIN_SPACE) {
                    y = -Math.abs(parent.me.middlePoints[1]-liney.points()[1])*parent.scaleY()  + MIN_SPACE + liney.getAbsolutePosition().y
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y
                };
            }
        }));
        this.linex.setAttr('pIndex', 0)
        this.liney = new Konva.Line(Object.assign({}, style, {
            dragBoundFunc: function (pos) {
                let x = pos.x;
                console.log(this.getAbsolutePosition().x, pos);
                const parent = this.parent;
                const [linex] = parent.find('Line');
                console.log(x,parent.x(),parent.me.middlePoints[0],linex.points()[2],parent.scaleX(),parent.scaleY())
                if ((x - linex.getAbsolutePosition().x) > Math.abs(parent.me.middlePoints[0]-linex.points()[2])*parent.scaleX() - MIN_SPACE) {
                    x = Math.abs(parent.me.middlePoints[0]-linex.points()[2])*parent.scaleX()- MIN_SPACE + linex.getAbsolutePosition().x
                } else if ((x - linex.getAbsolutePosition().x) < -Math.abs(parent.me.middlePoints[2]-parent.me.middlePoints[0])*parent.scaleX() + MIN_SPACE) {
                    x = -Math.abs(parent.me.middlePoints[2]-parent.me.middlePoints[0])*parent.scaleX() + MIN_SPACE + linex.getAbsolutePosition().x
                }
                return {
                    x,
                    y: this.getAbsolutePosition().y
                };
            }
        }));
        this.liney.setAttr('pIndex', 1)
        this.centerPoi = new Konva.Circle({
            x: -10,
            y: -10,
            radius: style.strokeWidth + 2,
            fill: 'white',
            stroke: style.stroke,
            draggable: false,
            pIndex: 4,
            shadowEnabled:false,
            shadowColor: style.stroke,
            shadowBlur: 10,
            shadowOpacity: 1
        });
        this.tempAchor = new Konva.RegularPolygon({
            x: -10,
            y: -10,
            sides: 3,
            radius: style.strokeWidth + 3,
            fill: style.stroke,
            draggable: false,
            shadowEnabled:false,
            shadowColor: style.stroke,
            shadowBlur: 10,
            shadowOpacity: 1,
            //rotate:-30,
            pIndex: 2,
            dragBoundFunc: function (pos) {
                console.log('pos',pos)
                let x = pos.x;
                const parent = this.parent;
                const [center] = parent.find('Circle');
                if (x < center.getClientRect().x + MIN_SPACE) {
                    x = center.getClientRect().x + MIN_SPACE
                }
                return {
                    x,
                    y: this.getAbsolutePosition().y
                };
            }
        });
        makeMoveHover.bind(this)(this.tempAchor);
        makeMoveHover.bind(this)(this.centerPoi);
        this.tempAchorY = this.tempAchor.clone({
            pIndex: 3,
            dragBoundFunc: function (pos) {
                let y = pos.y;
                const parent = this.parent;
                const [center] = parent.find('Circle');
                if (y > center.getClientRect().y - MIN_SPACE) {
                    y = center.getClientRect().y - MIN_SPACE
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y
                };
            }
        })
        this.tempAchor.rotate(-30);

        this.achorText = makeTextPoi(style,'x');
        this.achorTextY = this.achorText.clone({
            text: 'y'
        })


        this.shape.add(this.linex);
        this.shape.add(this.liney);
        this.shape.add(this.tempAchor);
        this.shape.add(this.tempAchorY);
        this.shape.add(this.achorText);
        this.shape.add(this.achorTextY);
        this.shape.add(this.centerPoi);
    }
    startDataTemp(point) {
        return null;
    }
    moveAchorText(parent, line) {


    }
    fitAchorText(text, parent) {

        // text.x(points[pIndex] + arr[findIndex].dx)
        // text.y(points[pIndex + 1] + arr[findIndex].dy)
    }
    centerDataTemp(point) {
        return null;
    }
    endDataTemp(point) {
        return [
            [0, 0, this.clientid, this.toolname, [this.style.strokeWidth,  0, this.style.stroke, 0],
                [],
                [this.uid, this.middlePoints.concat()]
            ]
        ];
    }
    pushPoint(point) {
        const pIndex = this.middlePoints.length;
        console.log('isSHift',this.isShift);
        if (pIndex === 4) {
            this.middlePoints[2] = point.x / this.stage.scale().x;
            this.middlePoints[3] = point.y / this.stage.scale().x;
        } else {
            this.middlePoints.push(point.x / this.stage.scale().x);
            this.middlePoints.push(point.y / this.stage.scale().x);
            if (pIndex === 0) {
                this.tempAchor.setAttr('status', 'fixed')
            } else if (pIndex === 2) {
                this.tempAchor.setAttr('status', 'end')
            }
        }
        if(this.isShift && this.middlePoints.length === 4){
            this.middlePoints[3] = this.middlePoints[1]+ (this.middlePoints[2] - this.middlePoints[0]);
        }
        this.reCal(this.shape)


    }

    reCal(shape, index, poi) {
        if (Number.isInteger(index)) {
            switch (index) {
                case 0:
                    const [arrowx0] = shape.find('RegularPolygon');
                    const [textx0] = shape.find('Text');
                    const [linex0] = shape.find('Line');
                    const [center0] = shape.find('Circle');
                    linex0.position(poi);

                    center0.y(linex0.points()[linex0.points().length - 1] + poi.y)
                    arrowx0.y(linex0.points()[linex0.points().length - 1] + poi.y)
                    textx0.y(linex0.points()[linex0.points().length - 1] + poi.y + EDIT_LABLE_DXY.dy)
                    break;
                case 1:
                    const [, arrowy1] = shape.find('RegularPolygon');
                    const [, texty1] = shape.find('Text');
                    const [, liney1] = shape.find('Line');
                    const [center1] = shape.find('Circle');
                    liney1.position(poi);

                    center1.x(liney1.points()[0] + poi.x)
                    arrowy1.x(liney1.points()[0] + poi.x)
                    texty1.x(liney1.points()[0] + poi.x + EDIT_LABLE_DXY.dx)
                    break;
                case 2:
                    const [arrowx2] = shape.find('RegularPolygon');
                    const [textx2] = shape.find('Text');
                    const [linex2] = shape.find('Line');
                    arrowx2.position(poi);
                    textx2.position({
                        x: poi.x + EDIT_LABLE_DXY.dx,
                        y: poi.y + EDIT_LABLE_DXY.dy,
                    })
                    linex2.points([linex2.points()[0], linex2.points()[1], poi.x - linex2.x(), linex2.points()[1]])
                    break;
                case 3:
                    const [, arrowy3] = shape.find('RegularPolygon');
                    const [, texty3] = shape.find('Text');
                    const [, liney3] = shape.find('Line');
                    arrowy3.position(poi);
                    texty3.position({
                        x: poi.x + EDIT_LABLE_DXY.dx,
                        y: poi.y + EDIT_LABLE_DXY.dy,
                    })
                    liney3.points([liney3.points()[0], poi.y - liney3.y(), liney3.points()[0], liney3.points()[liney3.points().length - 1]])
                    break;
                case 4:

                    break;
                default:
                    break;
            }
        } else {
            if (this.middlePoints.length === 2) {
                const centerPoi = shape.find('Circle')[0];
                centerPoi.x(this.middlePoints[0]);
                centerPoi.y(this.middlePoints[1]);
            } else {
                const p1 = {
                    x: this.middlePoints[0],
                    y: this.middlePoints[1]
                };
                const p2 = {
                    x: this.middlePoints[2],
                    y: this.middlePoints[3]
                };
                let rx = Math.abs(p2.x - p1.x);
                let ry = Math.abs(p2.y - p1.y);
                if (rx === 0) {
                    rx = ry;
                } else if (ry === 0) {
                    ry = rx;
                }
                const lines = shape.find('Line');
                const arrows = shape.find('RegularPolygon');
                const texts = shape.find('Text');
                const [arrowx, arrowy] = arrows;
                const [linex, liney] = lines;
                const [textx, texty] = texts;
                const linexPoints = [p1.x - rx, p1.y, p1.x + rx, p1.y];
                const lineyPoints = [p1.x, p1.y - ry, p1.x, p1.y + ry];
                linex.points(linexPoints);
                liney.points(lineyPoints);
                arrowx.position({
                    x: linexPoints[linexPoints.length - 2],
                    y: linexPoints[linexPoints.length - 1],
                })
                arrowy.position({
                    x: lineyPoints[0],
                    y: lineyPoints[1],
                })
                textx.position({
                    x: arrowx.x() + EDIT_LABLE_DXY.dx,
                    y: arrowx.y() + EDIT_LABLE_DXY.dy,
                })
                texty.position({
                    x: arrowy.x() + EDIT_LABLE_DXY.dx,
                    y: arrowy.y() + EDIT_LABLE_DXY.dy,
                })
            }
        }


    }

    draw() {
        if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }
    endDraw() {

        // this.tempAchor.remove();
        // this.achorText.remove();
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
        cloneLayer.on('dragmove', (evt) => {
            console.log('dragmove', evt.target);
            if (evt.target != cloneLayer) {
                evt.cancelBubble = true;
                const shape = evt.target;
                const pIndex = shape.getAttr('pIndex');
                this.fireEdit(cloneLayer);
                this.reCal(cloneLayer, pIndex, shape.position());
            }
        });
        cloneLayer.on('dragend', (evt) => {
            console.log('dragend', evt.target);
            if(!this.isSelected){
                return;
            }
            const nowShape = evt.target
            this.stage.canvasaction.localClientId++;
            let sd = [];
            if (nowShape == cloneLayer) {
                const x = cloneLayer.x();
                const y = cloneLayer.y();
                sd = [
                    x * this.stage.scale().x,
                    y * this.stage.scale().x,
                    this.stage.canvasaction.localClientId,
                    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
                    [],
                    [makeUUID()],
                    [cloneLayer.id(), 0],
                    true
                ]
            } else {
                const x = nowShape.x();
                const y = nowShape.y();
                const pIndex = nowShape.getAttr('pIndex')
                sd = [
                    x * this.stage.scale().x,
                    y * this.stage.scale().x,
                    this.stage.canvasaction.localClientId,
                    DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
                    [],
                    [makeUUID()],
                    [cloneLayer.id(), 2, pIndex],
                    true
                ]
            }

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
            if(this.stage.getIntersection(this.stage.getPointerPosition(),'Group')!==shape){
                this.stage.container().style.cursor = '';
            }
        });

        // shape.find('Circle').forEach((it, ix) => {
        //     it.draggable(true);
        // })
        shape.find('RegularPolygon').forEach((it, ix) => {
            it.draggable(true);
        })
        shape.find('Line').forEach((it, ix) => {
            it.draggable(true);
        })
        this.showlayer.batchDraw();
    }
    unfireEdit(shape) {
        this.isSelected = false;
        shape.draggable(false);
        if (this.tr) this.tr.remove()
        shape.off('mouseenter');
        shape.off('mouseleave');
        this.stage.container().style.cursor = '';
        // shape.find('Circle').forEach((it) => {
        //     it.draggable(false);
        // })
        shape.find('Line').forEach((it) => {
            it.draggable(false);
        })
        shape.find('RegularPolygon').forEach((it) => {
            it.draggable(false);
        })

        this.showlayer.batchDraw();
    }
    changeByPoint(shape, points, pIndex) {
        this.reCal(shape, pIndex, {
            x: points[0],
            y: points[1]
        });
    }
}