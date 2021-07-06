import { Shape } from '../shape';
import { DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE, EDIT_LABLE_DXY } from '../global';
import { hexToRgba, makeEditPoi, makeTextPoi, makeTransformer, makeMoveHover, makeUUID } from '../util';

/**
 * 椭圆计算公式
 * a^2 - b^2 = c^2
 * x^2/a^2 + y^2/b^2 = 1
 */
export class EllipseEdit extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);

    this.shape = new Konva.Group({
      draggable: false,
      name: 'editshape'
    });
    this.templayer.add(this.shape);

    this.tr = makeTransformer();
    this.tr.on('mousedown touchstart', (evt) => {
      if (this.stage.canvasaction.isSelectMode()) {
        evt.cancelBubble = true;
      }
    });
    //style.name = 'editshape';
    style.x = -10;
    style.y = -10;
    this.ellipse = new Konva.Ellipse(Object.assign({}, style, { fill: hexToRgba(style.stroke, 0.1) }));

    this.tempAchor = makeEditPoi(style);
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
      this.reCal(parent.findOne('Ellipse'));
    });

    this.tempAchor.on('dragend', (evt) => {
      console.log('dragend1', this.isSelected);
      if (!this.isSelected) {
        return;
      }
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
    this.shape.add(this.ellipse);
    this.firstAchor = null;
    this.isTempAchor = true;
  }

  startDataTemp(point) {
    return null;
  }

  moveAchorText(parent, line) {
  }

  fitAchorText(text, parent) {

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
    if (pIndex < 6) {
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
      if (pIndex === 2) {
        this.tempAchor.setAttr('status', 'fixed');
      } else if (pIndex === 4) {
        this.tempAchor.setAttr('status', 'end');
        console.log('pushPoint', pIndex, this.middlePoints);
        this.reCal(this.ellipse);
      }
    } else {
      // this.tempAchor.remove();
      // this.achorText.remove();
      this.middlePoints[4] = point.x / this.stage.scale().x;
      this.middlePoints[5] = point.y / this.stage.scale().x;
      this.shape.children[this.shape.children.length - 1].x(this.middlePoints[4] + EDIT_LABLE_DXY.dx);
      this.shape.children[this.shape.children.length - 1].y(this.middlePoints[5] + EDIT_LABLE_DXY.dy);
      this.shape.children[this.shape.children.length - 2].x(this.middlePoints[4]);
      this.shape.children[this.shape.children.length - 2].y(this.middlePoints[5]);
      this.reCal(this.ellipse);
    }

  }

  reCal(ellipse) {
    const p1 = {
      x: this.middlePoints[0],
      y: this.middlePoints[1]
    };
    const p2 = {
      x: this.middlePoints[2],
      y: this.middlePoints[3]
    };
    const p3 = {
      x: this.middlePoints[4],
      y: this.middlePoints[5]
    };
    const yL = p1.y - p2.y;
    const xL = p1.x - p2.x;
    const degree = Math.atan(yL / xL);
    const oPoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
    const dx = (p3.x - oPoint.x);
    const dy = (p3.y - oPoint.y);
    const cSqu = Math.pow((oPoint.x - p1.x), 2) + Math.pow((oPoint.y - p1.y), 2);
    const xSqu = Math.pow((p3.x - oPoint.x), 2);
    const ySqu = Math.pow((p3.y - oPoint.y), 2);
    const rx1 = dy / Math.cos(degree);
    const rx2 = (dx + rx1 * Math.sin(degree)) * Math.sin(degree);
    const rySqu = Math.pow((rx2 - rx1), 2);
    //const rxSqu = (xSqu + ySqu) - rySqu
    const b = (cSqu - xSqu - ySqu);
    const r1Squ = (-b + Math.sqrt((Math.pow(b, 2) + 4 * cSqu * rySqu), 2)) / 2;
    const r1 = Math.sqrt(r1Squ, 2);
    const r2 = Math.sqrt((r1Squ + cSqu), 2);

    //console.log('r2,r1',r2,r1)
    ellipse.x(oPoint.x);
    ellipse.y(oPoint.y);
    ellipse.radiusX(r2);
    ellipse.radiusY(r1);
    ellipse.rotation(degree / (Math.PI / 180));

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
      console.log('dragend', this.isSelected);
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
      console.log('mouseenter');
      this.stage.container().style.cursor = 'move';
    });

    shape.on('mouseleave', () => {
      console.log('mouseleave');
      if (this.stage.getIntersection(this.stage.getPointerPosition(), 'Group') !== shape) {
        this.stage.container().style.cursor = '';
      }
    });
    shape.find('Circle').forEach((it) => {
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
    const ellipse = shape.findOne('Ellipse');
    const label = shape.find('Text');
    this.middlePoints[pIndex * 2] = points[0];
    this.middlePoints[pIndex * 2 + 1] = points[1];
    if (achor && achor[pIndex]) {
      achor[pIndex].x(points[0]);
      achor[pIndex].y(points[1]);
      label[pIndex].x(points[0] + EDIT_LABLE_DXY.dx);
      label[pIndex].y(points[1] + EDIT_LABLE_DXY.dy);
      this.reCal(ellipse);
    }
  }
}