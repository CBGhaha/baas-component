import {
  Shape
} from '../shape';
import {
  DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE
} from '../global';
import { makeTransformer, makeUUID } from '../util';
export class SimpleEllipseEdit extends Shape {
  constructor(stage, style, clientid, toolname, showtype) {
    super(stage, style, clientid, toolname, showtype);
    style.name = 'editshape';
    this.shape = new Konva.Ellipse(style);
    this.templayer.add(this.shape);
    this.tr = makeTransformer();
    this.tr.on('mousedown touchstart', (evt) => {
      if (this.stage.canvasaction.isSelectMode()) {
        evt.cancelBubble = true;
      }
    });
    //this.startPromiseResolve = null;
    this.startData = null;

  }
  startDataTemp(point) {
    this.startData = [
      point.x,
      point.y,
      this.clientid,
      this.toolname,
      [this.style.strokeWidth, this.isFill ? 1 : 0, this.isFill ? this.style.fill : this.style.stroke, this.isShift ? 1 : 0],
      [],
      [this.uid]
    ];
    return null;
    // return [
    //     point.x,
    //     point.y,
    //     this.clientid,
    //     this.toolname,
    //     [this.style.strokeWidth, this.isFill?1:0,this.isFill?this.style.fill:this.style.stroke,this.isShift?1:0]
    // ];
  }
  centerDataTemp(point) {}
  endDataTemp(point) {
    if (this.startData) this.startData[4][3] = this.isShift ? 1 : 0;
    //if(this.startPromiseResolve)this.startPromiseResolve(this.startData)
    return [this.startData, [point.x, point.y, this.clientid, true]];
  }
  draw() {
    if (this.middlePoints.length > 3) {
      const originpoi = {
        x: this.middlePoints[0],
        y: this.middlePoints[1]
      };
      const lastpoi = {
        x: this.middlePoints[this.middlePoints.length - 2],
        y: this.middlePoints[this.middlePoints.length - 1]
      };
      if (this.isShift) {
        const radius = Math.min(Math.abs((lastpoi.x - originpoi.x) / 2), Math.abs((lastpoi.y - originpoi.y) / 2));

        if (originpoi.x < lastpoi.x) {
          this.shape.x(originpoi.x + radius);
          this.shape.y(originpoi.y + radius);
        } else {
          this.shape.x(originpoi.x - radius);
          this.shape.y(originpoi.y - radius);
        }
        this.shape.radius({
          x: radius,
          y: radius
        });
        //console.log('radius',radius,this.shape.x(),this.shape.y());

      } else {
        this.shape.x((originpoi.x + lastpoi.x) / 2);
        this.shape.y((originpoi.y + lastpoi.y) / 2);
        this.shape.radius({
          x: Math.abs(originpoi.x - lastpoi.x) / 2,
          y: Math.max(Math.abs(originpoi.y - lastpoi.y) / 2, 2)
        });
      }

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
        const { options } = this.stage.canvasaction;
        if (options && options.selectShapeCb)options.selectShapeCb();

      }
      evt.cancelBubble = true;
    });
    cloneLayer.on('mousedown touchstart', (evt) => {
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
  fireEdit(shape) {
    this.isSelected = true;
    shape.draggable(true);
    this.stage.container().style.cursor = 'move';
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
      if (this.stage.getIntersection(this.stage.getPointerPosition(), 'Ellipse') !== shape) {
        this.stage.container().style.cursor = '';
      }
    });
    this.showlayer.batchDraw();
  }
  unfireEdit(shape) {
    this.isSelected = false;
    if (this.tr) this.tr.remove();
    shape.off('mouseenter');
    shape.off('mouseleave');
    this.stage.container().style.cursor = '';
    shape.draggable(false);
    this.showlayer.batchDraw();
  }

}