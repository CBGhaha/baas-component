import { Shape } from '../shape';
import { DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE, EDIT_LABLE_DXY } from '../global';
import { makeEditPoi, makeTextPoi, makeTransformer, makeMoveHover, makeUUID } from '../util';

export class LineEdit extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    this.shape = new Konva.Group({
      draggable: false,
      name: 'editshape'
    });
    this.tr = makeTransformer();
    this.tr.on('mousedown touchstart', (evt) => {
      console.log('tr mousedown');
      if (this.stage.canvasaction.isSelectMode()) {
        evt.cancelBubble = true;
      }
    });

    this.templayer.add(this.shape);
    //style.name = 'editshape';
    this.line = new Konva.Line(style);

    this.tempAchor = makeEditPoi(style);
    // this.tempAchor.on('mousedown', (evt) => {
    //     const d = Math.sqrt(Math.pow((this.middlePoints[3]-this.middlePoints[1]),2)+Math.pow((this.middlePoints[2]-this.middlePoints[0]),2))
    //     if(d<5){
    //         evt.cancelBubble = true;
    //     }
    // })
    makeMoveHover.bind(this)(this.tempAchor);
    this.tempAchor.on('dragmove', (evt) => {
      evt.cancelBubble = true;
      const shape = evt.target;
      const parent = shape.parent;
      const pIndex = shape.getAttr('pIndex');
      this.middlePoints[pIndex] = shape.x();
      this.middlePoints[pIndex + 1] = shape.y();
      parent.children[pIndex + 2].x(shape.x() + EDIT_LABLE_DXY.dx);
      parent.children[pIndex + 2].y(shape.y() + EDIT_LABLE_DXY.dy);
      console.log('tempAchor dragmove', pIndex);
      this.fireEdit(parent, true);
      this.reCal(parent.findOne('Line'));
    });

    this.tempAchor.on('dragend', (evt) => {
      evt.cancelBubble = true;
      const shape = evt.target;
      const pIndex = shape.getAttr('pIndex');
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
        [shape.parent.id(), 2, pIndex / 2],
        true
      ];
      this.stage.canvasaction.sendMessageToOutSider(sd);
      this.stage.canvasaction.pushCatchData(sd);
    });
    this.shape.add(this.tempAchor);
    this.achorTextCode = this.stage.getCharLabel();

    this.achorText = makeTextPoi(style, this.achorTextCode);
    this.shape.add(this.achorText);
    this.shape.add(this.line);
    this.firstAchor = null;
    this.isTempAchor = true;
  }

  startDataTemp(point) {
    return null;
  }

  moveAchorText(parent, line) {
    const points = line.points();
    const texts = parent.find('Text');

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
      [0, 0, this.clientid, this.toolname, [this.style.strokeWidth, 0, this.style.stroke, 0],
        [],
        [this.uid, this.middlePoints.concat(), this.isTempAchor ? 1 : 0]
      ]
    ];
  }

  pushPoint(point) {
    const pIndex = this.middlePoints.length;
    if (pIndex === 4) {

      this.middlePoints[2] = point.x / this.stage.scale().x;
      this.middlePoints[3] = point.y / this.stage.scale().x;

      if (this.isShift) {
        if (Math.abs(this.middlePoints[2] - this.middlePoints[0]) <
                    Math.abs(this.middlePoints[3] - this.middlePoints[1])) {
          this.middlePoints[2] = this.middlePoints[0];
          this.middlePoints[3] = point.y / this.stage.scale().x;
        } else {
          this.middlePoints[2] = point.x / this.stage.scale().x;
          this.middlePoints[3] = this.middlePoints[1];
        }
      }


      this.shape.children[this.shape.children.length - 1].x(this.middlePoints[2] + EDIT_LABLE_DXY.dx);
      this.shape.children[this.shape.children.length - 1].y(this.middlePoints[3] + EDIT_LABLE_DXY.dy);
      this.shape.children[this.shape.children.length - 2].x(this.middlePoints[2]);
      this.shape.children[this.shape.children.length - 2].y(this.middlePoints[3]);
      this.reCal(this.line);
    } else {

      this.middlePoints.push(point.x / this.stage.scale().x);
      this.middlePoints.push(point.y / this.stage.scale().x);
      const cloneLayer = this.tempAchor.clone({
        pIndex
      });
      cloneLayer.x(this.middlePoints[pIndex]);
      cloneLayer.y(this.middlePoints[pIndex + 1]);

      const cloneText = this.achorText.clone({
        pIndex,
        visible: this.isTempAchor
      });
      cloneText.x(this.middlePoints[pIndex] + EDIT_LABLE_DXY.dx);
      cloneText.y(this.middlePoints[pIndex + 1] + EDIT_LABLE_DXY.dy);
      cloneText.text(this.achorTextCode);
      this.achorTextCode = this.stage.makeCharLabel();
      this.shape.add(cloneLayer);
      this.shape.add(cloneText);
      if (pIndex === 0) {
        this.tempAchor.setAttr('status', 'fixed');
      } else if (pIndex === 2) {
        this.tempAchor.setAttr('status', 'end');
        this.reCal(this.line);
      }
    }


  }

  reCal(line) {
    line.points(this.middlePoints);
  }

  draw() {
    if (this.showtype !== 'replayData') this.templayer.batchDraw();
  }

  endDraw() {

    this.tempAchor.remove();
    this.achorText.remove();
    const cloneLayer = this.shape.clone();
    if (!this.isTempAchor)cloneLayer.find('.editpoi').forEach((it)=>it.hide());
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
      console.log('clicked');
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
        const { options } = this.stage.canvasaction;
        if (options && options.selectShapeCb) options.selectShapeCb();

      }
      evt.cancelBubble = true;
    });
    cloneLayer.on('mousedown touchstart', (evt) => {
      console.log('mousedown', this.stage.canvasaction.isSelectMode());
      if (this.stage.canvasaction.isSelectMode()) {
        evt.cancelBubble = true;
      }
    });
    cloneLayer.on('dragmove', () => {
      console.log('dragmove');
    });
    cloneLayer.on('dragend', () => {
      console.log('dragend');
      if (!this.isSelected) {
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
      ];
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
      ];
      this.stage.canvasaction.sendMessageToOutSider(sd);
      this.stage.canvasaction.pushCatchData(sd);

    });

  }

  fireEdit(shape, nocur) {
    this.isSelected = true;
    shape.draggable(true);
    if (!nocur) this.stage.container().style.cursor = 'move';
    if (this.tr) this.tr.remove();
    this.showlayer.add(this.tr);
    this.tr.attachTo(shape);
    shape.off('mouseenter');
    shape.off('mouseleave');
    shape.on('mouseenter', () => {
      this.stage.container().style.cursor = 'move';
    });

    shape.on('mouseleave', () => {
      //if(this.stage.getIntersection(this.stage.getPointerPosition(),'Group')!==shape){
      this.stage.container().style.cursor = '';
      //}
    });
    shape.find('Circle').forEach((it, ix) => {
      it.draggable(true);
    });
    this.showlayer.batchDraw();
  }

  unfireEdit(shape) {
    this.isSelected = false;
    shape.draggable(false);
    if (this.tr) this.tr.remove();
    shape.off('mouseenter');
    shape.off('mouseleave');
    this.stage.container().style.cursor = '';
    shape.find('Circle').forEach((it) => {
      it.draggable(false);
    });
    this.showlayer.batchDraw();
  }

  changeByPoint(shape, points, pIndex) {
    const achor = shape.find('Circle');
    const label = shape.find('Text');
    const line = shape.findOne('Line');
    this.middlePoints[pIndex * 2] = points[0];
    this.middlePoints[pIndex * 2 + 1] = points[1];
    if (achor && achor[pIndex]) {
      achor[pIndex].x(points[0]);
      achor[pIndex].y(points[1]);
      label[pIndex].x(points[0] + EDIT_LABLE_DXY.dx);
      label[pIndex].y(points[1] + EDIT_LABLE_DXY.dy);
      this.reCal(line);
    }
  }

}