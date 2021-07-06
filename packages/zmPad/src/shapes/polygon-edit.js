import { Shape } from '../shape';
import { DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE, EDIT_LABLE_DXY } from '../global';
import { hexToRgba, makeEditPoi, makeTextPoi, makeTransformer, hoverImg, makeMoveHover, makeUUID } from '../util';

export class PolygonEdit extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);

    this.shape = new Konva.Group({
      draggable: false,
      name: 'editshape'
    });
    this.tr = makeTransformer();
    this.tr.on('mousedown touchstart', (evt) => {
      if (this.stage.canvasaction.isSelectMode()) {
        evt.cancelBubble = true;
      }
    });
    this.line = new Konva.Line(style);
    this.line.lineCap('round');
    this.line.lineJoin('round');
    this.line.fill(hexToRgba(style.stroke, 0.1));
    this.shape.add(this.line);
    //this.shape.bezier(true);
    this.templayer.add(this.shape);
    this.controlPoints = [];
    this.tempAchor = makeEditPoi(style);
    this.isTempAchor = true;
    // this.tempAchor.on('mousedown', (evt) => {
    //     const length = this.controlPoints.length;
    //     console.log('length length',length,this.middlePoints)
    //     if(length===4 && this.middlePoints[this.middlePoints.length-1] === this.middlePoints[1]
    //         && this.middlePoints[this.middlePoints.length-2] === this.middlePoints[0] ){
    //
    //          evt.cancelBubble = true;
    //     }
    // })
    makeMoveHover.bind(this)(this.tempAchor);
    this.tempAchor.on('dragmove', (evt) => {
      evt.cancelBubble = true;
      const shape = evt.target;
      const parent = shape.parent;
      const line = parent.findOne('Line');
      const pIndex = shape.getAttr('pIndex');
      const points = line.points();
      points[pIndex] = shape.x();
      points[pIndex + 1] = shape.y();
      parent.children[pIndex + 2].x(shape.x() + EDIT_LABLE_DXY.dx);
      parent.children[pIndex + 2].y(shape.y() + EDIT_LABLE_DXY.dy);
      line.points(points);
      line.draw();
      this.fireEdit(parent, true);
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
    this.firstAchor = null;

  }

  startDataTemp(point) {
    return null;
  }

  moveAchorText(parent, line) {
    const points = line.points();
    const texts = parent.find('Text');

    texts.forEach((element, index) => {
      console.log('index', index * 2, index * 2 + 1, points[index * 2], points[index * 2 + 1]);
      element.x(points[index * 2]);
      element.y(points[index * 2 + 1]);
      this.fitAchorText(element, parent);
    });
  }

  fitAchorText(text, parent) {
    const dd = 16;
    const line = parent.findOne('Line');
    const parentRect = line.getClientRect();
    const textRectTop = text.getClientRect();
    const textRectBottom = text.getClientRect();
    const textRectLeft = text.getClientRect();
    const textRectRight = text.getClientRect();
    textRectTop.y = textRectTop.y - dd;
    textRectBottom.y = textRectBottom.y + dd;
    textRectLeft.x = textRectLeft.x - dd;
    textRectRight.x = textRectRight.x + dd;
    const arr = [{
      rect: textRectTop,
      rect2: Object.assign({}, textRectTop, {
        x: textRectTop.x + dd
      }),
      dx: 0,
      dy: -dd,
      align: 'center',
      verticalAlign: 'bottom'
    },
    {
      rect: textRectBottom,
      rect2: Object.assign({}, textRectBottom, {
        x: textRectBottom.x + dd
      }),
      dx: 0,
      dy: dd - 10,
      align: 'center',
      verticalAlign: 'top'
    },
    {
      rect: textRectLeft,
      rect2: textRectLeft,
      dx: -dd,
      dy: 0,
      align: 'right',
      verticalAlign: 'middle'
    },
    {
      rect: textRectRight,
      rect2: textRectRight,
      dx: dd - 10,
      dy: 0,
      align: 'left',
      verticalAlign: 'middle'
    }
    ];
    const len = arr.length;
    const points = line.points();
    const pIndex = text.getAttr('pIndex');
    if (isNaN(parentRect.x)) {
      text.x(this.controlPoints[pIndex] + arr[0].dx);
      text.y(this.controlPoints[pIndex + 1] + arr[0].dy);
      return;
    }
    let findIndex = 2;
    for (var i = 0; i < len; i++) {
      if (this.stage.getIntersection(arr[i].rect) !== line &&
                this.stage.getIntersection(arr[i].rect2) !== line
      ) {
        findIndex = i;
        break;
      }
    }
    text.x(points[pIndex] + arr[findIndex].dx);
    text.y(points[pIndex + 1] + arr[findIndex].dy);
  }

  centerDataTemp(point) {
    return null;
  }

  endDataTemp(point) {
    return [
      [0, 0, this.clientid, this.toolname, [this.style.strokeWidth, this.style.stroke],
        [],
        [this.uid, this.controlPoints, this.isTempAchor ? 1 : 0]
      ]
    ];
  }

  pushPoint(point) {
    this.middlePoints = this.controlPoints.concat([point.x / this.stage.scale().x, point.y / this.stage.scale().x]);
    this.tempAchor.x(this.middlePoints[this.middlePoints.length - 2]);
    this.tempAchor.y(this.middlePoints[this.middlePoints.length - 1]);
    this.achorText.x(this.middlePoints[this.middlePoints.length - 2] + EDIT_LABLE_DXY.dx);
    this.achorText.y(this.middlePoints[this.middlePoints.length - 1] + EDIT_LABLE_DXY.dy);
    if (this.firstAchor) {
      if (Konva.Util.haveIntersection(this.tempAchor.getClientRect(), this.firstAchor.getClientRect())) {
        this.firstAchor.stroke('red');
        this.tempAchor.stroke('red');
        this.tempAchor.isEnd = true;
        this.tempAchor.hide();
        this.achorText.hide();
        this.middlePoints[this.middlePoints.length - 2] = this.middlePoints[0];
        this.middlePoints[this.middlePoints.length - 1] = this.middlePoints[1];
      } else {
        this.firstAchor.stroke(this.style.stroke);
        this.tempAchor.stroke(this.style.stroke);
        this.tempAchor.isEnd = false;
        this.tempAchor.show();
        if (this.isTempAchor) this.achorText.show();
      }
    }


  }

  pushControlPoint(point) {

    if (!this.tempAchor.isEnd) {
      const pIndex = this.controlPoints.length;
      const x = point.x / this.stage.scale().x;
      const y = point.y / this.stage.scale().x;
      if (this.controlPoints.length > 0) {
        if (x === this.controlPoints[this.controlPoints.length - 2] && y === this.controlPoints[this.controlPoints.length - 1]) {
          return;
        }
      }
      this.controlPoints.push(x);
      this.controlPoints.push(y);
      const cloneLayer = this.tempAchor.clone({
        pIndex
      });
      cloneLayer.x(this.controlPoints[this.controlPoints.length - 2]);
      cloneLayer.y(this.controlPoints[this.controlPoints.length - 1]);
      const cloneText = this.achorText.clone({
        pIndex,
        visible: this.isTempAchor
      });
      cloneText.x(this.controlPoints[this.controlPoints.length - 2] + EDIT_LABLE_DXY.dx);
      cloneText.y(this.controlPoints[this.controlPoints.length - 1] + EDIT_LABLE_DXY.dy);
      cloneText.text(this.achorTextCode);
      this.achorTextCode = this.stage.makeCharLabel();
      this.achorText.text(this.achorTextCode);
      this.shape.add(cloneLayer);
      this.shape.add(cloneText);
      console.log('this.shape', this.shape, x, y);
      //this.fitAchorText(cloneText, this.shape);
      if (!this.firstAchor) {
        this.firstAchor = cloneLayer;
      }
    } else {
      console.log('this.tempAchor remove');

    }


  }

  draw() {
    this.line.points(this.middlePoints);
    if (this.showtype !== 'replayData') this.templayer.batchDraw();
  }

  endDraw() {
    const points = this.line.points();
    this.line.points(points.slice(0, points.length - 2));
    this.line.closed(true);
    this.tempAchor.remove();
    this.achorText.remove();
    if (this.firstAchor) this.firstAchor.stroke(this.style.stroke);
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
      this.templayer.batchDraw();
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
    // const l = cloneLayer.children[0];
    // this.moveAchorText(cloneLayer, l);
    // this.templayer.batchDraw();
    // this.showlayer.batchDraw();

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
      console.log('mouseleave', this.stage.getPointerPosition());
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
    const label = shape.find('Text');
    const line = shape.findOne('Line');
    if (achor && achor[pIndex]) {
      const line_points = line.points();
      achor[pIndex].x(points[0]);
      achor[pIndex].y(points[1]);
      label[pIndex].x(points[0] + EDIT_LABLE_DXY.dx);
      label[pIndex].y(points[1] + EDIT_LABLE_DXY.dy);
      line_points[pIndex * 2] = points[0];
      line_points[pIndex * 2 + 1] = points[1];
      line.points(line_points);

    }
  }
}
