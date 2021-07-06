import {
  el,
  unmount,
} from 'redom';
import {
  dispatch
} from './dispatch';
import {
  Hello
} from './hello';
import {
  Canvas
} from './canvas';
import {
  EditText
} from './editTextDiv' 
import {
  RobotPenIcon
} from './robPenIcon'
import {
  getUrlVars
} from './util';
import {
  RecordControl
} from './recordcontrol';

export class App {
  constructor(dataCb, dom, resizeCb, options) {
    //console.log(getUrlVars('type'));
    const isRecord = getUrlVars('type') === 'recordplay';
    //this.recordplay = isRecord?new RecordControl():'';
    this.el = el('.app',
      {style:'position:relative;overflow-x: hidden;'},
      this.canvas = new Canvas(isRecord,options),
      this.editText = new EditText(this.canvas),
      this.reboPenIcon = new RobotPenIcon(),
      this.recordplay = (isRecord ? new RecordControl(this.canvas) : ''),
    );
    this.data = {};
    this.canvas.dataCallBack = dataCb;
    this.canvas.parentDom = dom;
    this.canvas.resizeCb = resizeCb;
    this.canvas.editText = this.editText;

    //window.testobj = this.canvas;
  }
  update(data) {
    console.log('App update', data)
    const {
      hello
    } = data;
    this.recordplay.update(hello)
    this.data = data;
  }
  destroy(){
    unmount(this.canvas.parentDom, this);
  }
}