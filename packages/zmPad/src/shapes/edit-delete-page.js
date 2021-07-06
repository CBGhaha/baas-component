import {
  Shape
} from '../shape';
import { DRAWTOOL_EDIT_PAGE_DELETE } from '../global';
export class EditDeletePage extends Shape {
  constructor(stage, style, clientid, toolname, showtype, data) {
    super(stage, style, clientid, toolname, showtype, data);
    this.data = data;
  }
  pushPoint(point) {
    this.showlayer.removeChildren();
    this.endDraw();
    //this.stage.resetCharLabel()
  }

  startDataTemp(point) {
    return null;
  }
  centerDataTemp(point) {
    return null;
  }
  endDataTemp(point) {
    return null;
  }
  draw() {

  }
  endDraw() {
    // const cacheDataInstance = this.stage.canvasaction.cacheDataInstance;
    // let data = cacheDataInstance.layerCachData[cacheDataInstance.currentLayerId];
    // if(!data) data = [];
    // console.log('endDraw',data);
    // for(let i=0;i<data.length;i++){
    //     if(data[i][3]===DRAWTOOL_EDIT_PAGE_DELETE){
    //         data.splice(0,i+1);
    //         break;
    //     }
    // }
    // cacheDataInstance.layerCachData[cacheDataInstance.currentLayerId] = data;

    if (this.showtype !== 'replayData') this.showlayer.batchDraw();
  }
  changeRegular() {

  }

}