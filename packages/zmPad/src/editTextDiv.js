import { el } from 'redom';
import { zmMovedDom } from './util';
export class EditText {
  constructor(canvas) {
    this.canvas = canvas;
    this.el = el('div.zm-sketchpad-edittext', {
      contentEditable: true,
      // onfocus: e => {
      // },
      // onkeydown:e => {
      // },
      style: {
        position: 'absolute',
        zIndex: '1',
        display: 'none',
        minWidth: '100px',
        border: 'none',
        padding: '0px 0px 0px 2px',
        transform: 'translateX(-2px)',
        margin: '0px',
        overflow: 'hidden',
        background: 'none',
        resize: 'none',
        height: 'fit-content'
      } });
    //"position:absolute;z-index:1;display:none;min-width:100px;border:none;padding:0px;margin:0px;overflow:hidden;background:none;resize:none;height:fit-content;"
  }
  onmount() {
    console.log('mounted Hello');

    this.canvas.stage.on('yChange', (evt)=> {
      //if(this.canvas.heightScale==1){
      const oldVal = evt.oldVal;
      const newVal = evt.newVal;
      const dy = newVal - oldVal;
      const offsetTop = this.el.offsetTop;
      this.el.style.top = (offsetTop + dy) + 'px';
      //console.log('ychange:',oldVal,newVal)
      //}

    });

    zmMovedDom({
      dragHandle: this.el,
      dragTarget: this.el,
      cb: ({ type, x, y })=>{
        const shape = (this.canvas.canvasaction.shape && this.canvas.canvasaction.shape.shape) || this.shape;
        if (shape) {
          const cloneLayer = shape;
          //const stageBox = this.canvas.stage.container().getBoundingClientRect();

          if (type === 'move') {
            //console.log('this.el.offsetLeft,stageBox.left',this.el.offsetLeft,stageBox.left)
            this.ismoving = true;
            cloneLayer.x(this.el.offsetLeft / this.canvas.stage.scale().x);
            cloneLayer.y((this.el.offsetTop - this.canvas.stage.y()) / this.canvas.stage.scale().x);

          } else {
            if (cloneLayer === null) {
              this.canvas.canvasaction.shape.moveFunc(cloneLayer);
            }
          }
        }

      }
    });
  }
}