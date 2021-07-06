//import {sceneFunc} from "../../zmKonvaPlugin/lib";
import { sceneFunc } from 'zmKonvaPlugin';
import { DRAWTOOL_PENCIL } from './global';

export class Shape {
  constructor(stage, style, clientid, toolname, showtype, text) {
    //console.log('shape',stage,style,clientid,toolname)
    this.middlePoints = [];
    // this.templayer = stage.findOne('.templayer');
    // this.showlayer = stage.findOne('.showlayer');
    this.templayer = stage.templayer;
    this.showlayer = stage.showlayer;
    this.style = style;
    // this.drawMiddle = this.drawMiddle.bind(this);
    // this.drawEnd = this.drawEnd.bind(this);
    this.stage = stage;
    this.shape = null;
    this.isShift = false;
    this.isFill = false;
    this.clientid = clientid;
    this.toolname = toolname;
    this.style = style;
    this.showtype = showtype;
    this.pressure = 1;
  }

  startDataTemp(point) {

  }
  centerDataTemp(point) {
    return [point.x, point.y, this.clientid];
  }
  endDataTemp(point) {
    return [[point.x, point.y, this.clientid, true]];
  }

  pushPoint(point) {
    this.middlePoints.push(point.x / this.stage.scale().x);
    this.middlePoints.push(point.y / this.stage.scale().x);
  }
  draw() {

  }
  endDraw() {
    const cloneLayer = this.shape.clone();
    if (this.toolname === DRAWTOOL_PENCIL) {
      cloneLayer.sceneFunc(sceneFunc);
    }
    this.shape.remove();
    this.shape.destroy();
    this.showlayer.add(cloneLayer);
    if (this.showtype === 'replayData') {
      // this.showlayer.batchDraw();
      // this.templayer.batchDraw();
    } else {
      // this.showlayer.draw();
      // this.templayer.draw();
      cloneLayer.draw();
    }

    //window.stage = this.stage;
  }
  customEndFunc() {

  }
  destroy() {
    this.shape.remove();
    this.shape.destroy();
  }


}