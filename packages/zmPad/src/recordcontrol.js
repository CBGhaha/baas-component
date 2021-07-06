import {
    el,
    setAttr
} from 'redom';
// import { Socket } from 'phoenix/assets/js/phoenix';
import {
    makeShapeInstance
} from './shapefactory';

import Konva from 'konva';

import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    CANVAS_RATIO
} from './global';



export class RecordControl {
    constructor(canvas) {
        this.canvas = canvas;
        this.el = el('div.recordcontrol',
                        el('div.flexrow',
                        this.playorpause = el('a.pointer',{
                            onclick:e=>{
                                const isPlaying = this.playorpause.textContent === '暂停';
                                this.playorpause.textContent = (isPlaying?'播放':'暂停');
                                if(!isPlaying)this.canvas.recordPlay();
                            },
                        },'播放'),
                        this.playtimetip = el('div',"21:00/31:00"),
                        this.progress = el('progress.controlprogress',{value:0,max:100})),
                );
        this.data = {playingtime:0};            

    }
    init() {

    }
    onmount() {
        // Create an empty project and a view for the canvas:
        this.init();
    }
    onunmount() {

    }

    update(data) {
        setAttr(this.progress, {value: data.playingtime / data.duration * 100});
        //this.data = data;
    }
}
