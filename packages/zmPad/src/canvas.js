import { el } from "redom";
// import { Socket } from 'phoenix/assets/js/phoenix';
import { makeShapeInstance } from "./shapefactory";
import {testdata, reBuildTextStroke, getActionItemUid, isMobile} from "./util";

import { dispatch } from "./dispatch";

import Konva from "konva";

import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    CANVAS_RATIO,
    DRAWTOOL_PRESSUREPEN,
    DRAWTOOL_SMOOTHLINE,
    DRAWTOOL_ROBOPEN,
    DRAWTOOL_RECT_EDIT,
    DRAWTOOL_POLYGON_EDIT,
    DRAWTOOL_EDIT_SHAPE_DELETE,
    DRAWTOOL_ELLIPSE_EDIT,
    DRAWTOOL_CIRCLE_EDIT,
    DRAWTOOL_SIMPLE_ELLIPSE_EDIT,
    DRAWTOOL_SIMPLE_TRIANGLE_EDIT,
    DRAWTOOL_TRIANGLE,
    DRAWTOOL_LINEARROW,
    DRAWTOOL_LINE_EDIT,
    DRAWTOOL_TEXTTOOL,
    DRAWTOOL_TEXTTOOL_EDIT,
    DRAWTOOL_LINEDASH_EDIT,
    DRAWTOOL_LINEARROW_EDIT,
    DRAWTOOL_LINEARROWDASH_EDIT,
    DRAWTOOL_COORDSYS_EDIT,
    DRAWTOOL_SELCTE_SHAPE,
    DRAWTOOL_PENCIL,
    DRAWTOOL_EDIT_RECOVER
} from "./global";
import { CanvasAction } from "./canvasaction";
import { CacheData } from "./store";

const PRESSURE_ARR = [DRAWTOOL_ROBOPEN,DRAWTOOL_SMOOTHLINE,DRAWTOOL_PRESSUREPEN]
const simple_edit_arr = [DRAWTOOL_ELLIPSE_EDIT,DRAWTOOL_CIRCLE_EDIT,DRAWTOOL_LINE_EDIT,DRAWTOOL_LINEDASH_EDIT,DRAWTOOL_LINEARROW_EDIT,DRAWTOOL_LINEARROWDASH_EDIT,DRAWTOOL_COORDSYS_EDIT]
// let socket = new Socket("ws://127.0.0.1:4000/socket", {params: {token: window.userToken}})

// // socket.connect()

// // Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("room:lobby", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

// channel.on("new_msg", payload => {console.log('new_msg',payload)})
// setTimeout(()=>channel.push("new_msg", {body: "name 满脸"}),1000)

export class Canvas {
  constructor(isRecord,options) {
    this.el = el("div.canvas");
    this.stage = null;
    this.isRecord = isRecord;
    this.templayer = null;
    this.showlayer = null;
    this.canvasaction = null;
    this.resizeEventListener = this.resizeEventListener.bind(this);
    this.resizeDetail = this.resizeDetail.bind(this);
    this.clearLocalDraw = this.clearLocalDraw.bind(this);
    this.stageY = this.stageY.bind(this);
    this.showLayerById = this.showLayerById.bind(this);
    this.redraw = this.redraw.bind(this);
    this.filterCacheData = this.filterCacheData.bind(this);
    this.replayHashMap = {};
    this.recordPlayedIndex = 0;
    this.recordPlayingTime = 0;
    this.recordPlayedTimeReducer = 0;
    this.scaletoserver = null;
    this.whiteboarddata = { duration: 0, whiteboard: [] };
    //this.outerIframeListener = this.outerIframeListener.bind(this);
    this.msgport = null;
    this.dataCallBack = null;
    this.parentDom = null;
    this.cacheDataInstance = new CacheData();
    this.heightScale = 1;
    this.zoom = 1;
    this.resizeCb = null;
    this.options = options;
    this.imgCache = {};
    this.imgTemp = {};
    this.rotateTimeOuter = null;
    this.rotateTmp = null;
    this.char_begin = 65;
    this.makeCharLabel = this.makeCharLabel.bind(this)
    this.getCharLabel = this.getCharLabel.bind(this)
    this.changeCharLabel = this.changeCharLabel.bind(this)
    this.resetCharLabel = this.resetCharLabel.bind(this)
    this.clearReplayHashMap = this.clearReplayHashMap.bind(this)
    this.layoutOptions = {width:CANVAS_WIDTH,height:CANVAS_HEIGHT,ratio:CANVAS_RATIO}
    // this.layerCachData = {};
    // this.currentLayerId = "1";
  }
  //递增字母id
  makeCharLabel() {
    this.char_begin++;
    return this.getCharLabel()
  }
  //获取字母id
  getCharLabel () {
    const num = Math.floor((this.char_begin - 65) / 26)
    const label = (this.char_begin - 65) % 26;
    if (num > 0) {
      return `${String.fromCharCode(label+65)}${num}`;
    } else {
      return `${String.fromCharCode(label+65)}`;
    }
  }
  //更改字母数
  changeCharLabel(val) {
    this.char_begin = this.char_begin + val
  }
  //重置字母id
  resetCharLabel() {
    this.char_begin = 65;
  }
  //clear replayHashMap
  clearReplayHashMap() {
    this.replayHashMap = {};
  }
  showLayerById(id) {
    const tt = performance.now();
    if (this.cacheDataInstance.currentLayerId !== id) {
      this.clearReplayHashMap()
      this.cacheDataInstance.currentLayerId = id;
      this.canvasaction.removeSelectShape();
      this.showlayer.destroyChildren();
      this.resetCharLabel();
      this.canvasaction.deleteTempShape();
      const serverRatio = this.scaletoserver;
      //console.log('tt0:',performance.now()-tt)
      const cacheData = this.filterCacheData(this.cacheDataInstance.layerCachData[
        this.cacheDataInstance.currentLayerId
      ]);
      //console.log('tt1:',performance.now()-tt)
      if (cacheData) {
        for (let i = 0; i < cacheData.length; i++) {
          const item = cacheData[i];
          this.replayDataItem(item, serverRatio, "replayData");
        }
        //console.log('tt2:',performance.now()-tt)
      }
      //this.showlayer.batchDraw()
    } else {
    }
  }

  filterCacheData(cacheData){
    const filterActionIds = [];
    const filterUids = [];
    const filterData = [];
    if (cacheData) {
        const len = cacheData.length;
        for (var i = len - 1; i > -1; i--) {
            const item = cacheData[i];
            const [x, y, id, name, a, b, c] = item;
            if (name === DRAWTOOL_EDIT_RECOVER) {
                filterUids.push(c[0])
                filterActionIds.push(id);
            }
            if (filterUids.includes(getActionItemUid(item))) {
                filterActionIds.push(id);
            }
            if (filterActionIds.includes(id)) {
                continue;
            }
            filterData.unshift(item);
        }

    }
    return filterData
  }

  redraw() {
      const serverRatio = this.scaletoserver;
      const cacheData = this.filterCacheData(this.cacheDataInstance.layerCachData[
          this.cacheDataInstance.currentLayerId
      ]);
      //if(cacheData.length>0){
        this.resetCharLabel()
      //}
      for (let i = 0; i < cacheData.length; i++) {
          const it_data = cacheData[i];
          this.replayDataItem(it_data, serverRatio, "replayData");
      }
          
  }

  clearDataToLayer(layerId = null){
    if(layerid){
          this.cacheDataInstance.layerCachData[layerid] = [];
    }else{
      this.cacheDataInstance.layerCachData[
        this.cacheDataInstance.currentLayerId
      ] = [];
    }
  }
  setDataToLayer(data = [],layerid = null){
    const len = data.length;
    if (len > 0) {
      const serverRatio = this.scaletoserver;
      if(layerid!==null){
        this.cacheDataInstance.layerCachData[layerid] = [];
      }else{
        this.cacheDataInstance.layerCachData[
          this.cacheDataInstance.currentLayerId
        ] = [];
      }
      const isCurrent = (layerid === null || (layerid!==null && this.cacheDataInstance.currentLayerId === layerid));
      if(isCurrent){
          this.clearReplayHashMap()
          this.showlayer.destroyChildren();
          this.resetCharLabel()
      }
      for (let i = 0; i < len; i++) {
        const item = data[i];
        if(layerid){
          this.cacheDataInstance.layerCachData[layerid].push(item);
        }else{
            this.cacheDataInstance.layerCachData[this.cacheDataInstance.currentLayerId].push(item);
        }
        // if(isCurrent){
        //     this.replayDataItem(item, serverRatio, "replayData");
        // }
        

      }
      
      if(isCurrent){
        const cacheData = this.filterCacheData(data);
        if (cacheData) {
          for (let i = 0; i < cacheData.length; i++) {
            const item = cacheData[i];
            this.replayDataItem(item, serverRatio, "replayData");
          }
        }
      }
      this.showlayer.batchDraw();
    }
  }
  pushDataToLayer(data = [],layerid = null) {
    const len = data.length;
    if (len > 0) {
      const serverRatio = this.scaletoserver;
      if (
        !this.cacheDataInstance.layerCachData[
          this.cacheDataInstance.currentLayerId
        ]
      ) {
        this.cacheDataInstance.layerCachData[
          this.cacheDataInstance.currentLayerId
        ] = [];
      }
      if(layerid && !this.cacheDataInstance.layerCachData[layerid]
      ){
          this.cacheDataInstance.layerCachData[layerid] = [];
      }
      for (let i = 0; i < len; i++) {
        const item = data[i];
        if(layerid){
          this.cacheDataInstance.layerCachData[layerid].push(item);
        }else{
            this.cacheDataInstance.layerCachData[this.cacheDataInstance.currentLayerId].push(item);
        }
        if(layerid === null || (layerid!==null && this.cacheDataInstance.currentLayerId === layerid)){
            this.replayDataItem(item, serverRatio, "replayData");
        }
        

      }
      this.showlayer.batchDraw();
    }
  }
  rotateDetail (size,img,deg,id)  {
    if(id !== this.cacheDataInstance.currentLayerId)return;
    this.imagelayer.destroyChildren()
    let imgWidth = size.width;
    let imgHeight = size.height;
    let isNoCenter = false;
    if(this.heightScale===1){
      imgWidth = size.height/img.naturalHeight * img.naturalWidth;
    }else{
      imgHeight = size.width/img.naturalWidth * img.naturalHeight;
      if(imgHeight>size.height){
        imgHeight = size.height;
        imgWidth =  imgHeight /img.naturalHeight * img.naturalWidth;
        isNoCenter = true;
      }
    }
    let x = (size.width - imgWidth)/2;
    let w = imgWidth;
    let h = imgHeight;
    let y = 0;
    if(isNoCenter){
      x = 0;
    }
    if (deg === 90) {
      if (this.heightScale === 1) {
        w = imgHeight;
        h = imgHeight * img.naturalHeight / img.naturalWidth;
        x = size.width - (size.width - imgHeight * img.naturalHeight / img.naturalWidth) / 2;
      } else {
        w = size.width * this.layoutOptions.ratio;
        h = w * img.naturalHeight / img.naturalWidth;
        h = size.width;
        w = h / img.naturalHeight * img.naturalWidth;
        x = size.width - (size.width - w * img.naturalHeight / img.naturalWidth) / 2;
      }

    } else if (deg === 180) {
      //x = size.width - (size.width - imgWidth) / 2;
      x = size.width - (isNoCenter?(size.width - imgWidth): (size.width - imgWidth) / 2);
      y = h;
    } else if (deg === 270) {
      if (this.heightScale === 1) {
        w = imgHeight;
        h = imgHeight * img.naturalHeight / img.naturalWidth;
        x = (size.width - h) / 2;
        y = w;
      }else{
        w = size.width * this.layoutOptions.ratio;
        h = w * img.naturalHeight / img.naturalWidth;

        h = size.width;
        w = h / img.naturalHeight * img.naturalWidth;

        x = (size.width - h) / 2;
        y = w;
      }

    }

    let imgFile = new Konva.Image({
      image: img,
      y:y/this.stage.scale().y,
      x:x/this.stage.scale().x,
      rotation:deg,
      width:w/this.stage.scale().x,
      height:h/this.stage.scale().y,
    });
    this.imagelayer.add(imgFile);
    this.imagelayer.batchDraw();
  }
  //新增旋转画布
  rotate(deg,src,id){
    this.rotateTmp = {deg,src,id}
    if(this.rotateTimeOuter)clearTimeout(this.rotateTimeOuter)
    this.rotateTimeOuter = setTimeout(()=>{
      if(this.imgTemp[id])this.imgTemp[id].src='';
      const size = this.resize();
      deg = deg>360?deg%360:deg;
      let img;
      if(this.imgCache[id]){
        img = this.imgCache[id];
        this.rotateDetail(size,img,deg,id)
      }else{
        let simpleText = new Konva.Text({
          x: (this.stage.getWidth() / 2 -90)/this.stage.scale().x,
          y: (this.stage.getWidth() * this.layoutOptions.ratio / 2 -15)/this.stage.scale().y,
          text: '正在加载中...',
          fill: '#566DAC',
          fontSize: 30,
        });
        if(id === this.cacheDataInstance.currentLayerId){

          this.imagelayer.add(simpleText);
          this.imagelayer.batchDraw();
        }

        img = new Image();
        img.src = src;
        if(this.options&&this.options.isExportData){
          img.crossOrigin = 'Anonymous';
        }
        //img.crossOrigin = 'Anonymous';
        //if(!isMobileDevice)img.crossOrigin = 'Anonymous';
        this.imgTemp[id] = img;
        img.onload = () => {
          this.imgCache[id] = img;
          delete this.imgTemp[id];
          this.rotateDetail(size,img,deg,id)
        }
        img.onerror=()=>{
          simpleText.text('加载图片失败');
          this.imagelayer.batchDraw();
        };

      }

    },200)

  }

  init() {
    if(this.options && this.options.layout === 1){
      this.layoutOptions = {width:CANVAS_HEIGHT,height:CANVAS_WIDTH,ratio:1/CANVAS_RATIO}
    }
    const size = this.resize();
    this.stage = new Konva.Stage(
      Object.assign({ container: this.el }, this.layoutOptions)
    );
    if(this.options && this.options.pixelRatioFixed){
      Konva.pixelRatio = 1;
    }
    //

    this.stage.size(size);
    const scale = size.width / this.layoutOptions.width;
    this.stage.scale({
        x: scale,
        y: scale
    });

    this.templayer = new Konva.Layer({
      name: "templayer"
    });
    this.showlayer = new Konva.Layer({
      name: "showlayer"
    });
    this.templayer.hitGraphEnabled(false);
    this.showlayer.hitGraphEnabled(false);
    reBuildTextStroke(this.templayer);
    reBuildTextStroke(this.showlayer);
    //image layer begin
    if(this.options && this.options.hasImgLayer){
      this.imagelayer = new Konva.Layer({
        name: "imagelayer"
      })
      this.imagelayer.hitGraphEnabled(false);
      this.stage.add(this.imagelayer);
    }

    //image layer end

    this.stage.add(this.showlayer);
    this.stage.add(this.templayer);

    this.canvasaction = new CanvasAction(this.stage, this.cacheDataInstance, this.options);
    this.stage.canvasaction = this.canvasaction;
    this.stage.showlayer = this.showlayer;
    this.stage.templayer = this.templayer;
    this.stage.resetCharLabel = this.resetCharLabel;
    this.stage.getCharLabel = this.getCharLabel;
    this.stage.makeCharLabel = this.makeCharLabel;
    this.stage.changeCharLabel = this.changeCharLabel;

    this.canvasaction.scaletoserver = this.scaletoserver;
    this.canvasaction.dataCallBack = this.dataCallBack;
    this.canvasaction.parentDom = this.parentDom;
    this.canvasaction.redraw = this.redraw;
    this.canvasaction.editText = this.editText;
    this.canvasaction.heightScale = this.heightScale;
    // this.canvasaction.layerCachData = this.layerCachData;
    // this.canvasaction.currentLayerId = this.currentLayerId;
    this.showLayerById(1);

    if (!this.isRecord) this.canvasaction.initEvent();
    if(this.resizeCb)this.resizeCb(this.layoutOptions);
  }
  onmount() {
    // Create an empty project and a view for the canvas:
    console.log("onmount onmount");
    this.init();
    if(!this.options||!this.options.disabledResize)this.resizeEvent();
  }
  onunmount() {
    window.removeEventListener("resize", this.resizeEventListener);
    if (this.canvasaction) this.canvasaction.removeEvent();
    //window.removeEventListener('message', this.outerIframeListener);
  }
  // outerIframeListener(e){
  //     console.log('outerIframeListener',e)
  //     if(!this.msgport){
  //         this.msgport = e.ports[0];
  //         console.log('e.ports[0]',e.ports[0])
  //         this.canvasaction.msgport = e.ports[0]
  //     }
  //     //e.ports[0].postMessage('Message received by IFrame: "' + e.data + '"');
  // }
  setZoom(val){
    this.zoom = val;
    this.resizeEventListener();
  }

  resize() {
    //console.log('resize') * window.devicePixelRatio
    const clientRect = this.parentDom.getBoundingClientRect();
    const width = clientRect.width * this.zoom;
    const height = clientRect.height * this.zoom;
    const sheight = width * this.layoutOptions.ratio;
    let returnItem = null;
    if (sheight > height) {
      this.scaletoserver = height / this.layoutOptions.height;
      returnItem = {
        width: height / this.layoutOptions.ratio ,
        height: height * this.heightScale
      };
    } else {
      this.scaletoserver = width / this.layoutOptions.width;
      returnItem = {
        width:width ,
        height: width * this.layoutOptions.ratio * this.heightScale
      };
    }
    if (this.canvasaction) this.canvasaction.scaletoserver = this.scaletoserver;
    return returnItem;
  }
  resizeEventListener() {
    this.resizeDetail();
    if(this.resizeCb)this.resizeCb(this.resize());
  }

  resizeDetail(disableParentSize=false){
      const newSize = this.resize();
      if(!(this.options&&this.options.disableScaleStage))this.stage.size(newSize);
      else{
        const n_size = {width:newSize.width,height:newSize.height/this.heightScale}
        this.stage.size(n_size)
        const h = (!disableParentSize)?newSize.height:n_size.height;
        this.el.parentElement.style.height = `${h}px`;
      }
      //this.stage.size(newSize);
      const scale = newSize.width / this.layoutOptions.width;
      this.stage.scale({
          x: scale,
          y: scale
      });
      this.stage.draw();
      this.resizeEditText()
  }
  resizeEditText(){
      if(this.canvasaction.tooltype === DRAWTOOL_TEXTTOOL_EDIT
          || this.canvasaction.tooltype === DRAWTOOL_SELCTE_SHAPE){
          if(this.canvasaction.shape && this.canvasaction.shape.toolname === DRAWTOOL_TEXTTOOL_EDIT){
              if(this.canvasaction.shape.textarea&&this.canvasaction.shape.textarea.isConnected){
                  this.canvasaction.shape.resizeTextArea(this.canvasaction.shape.shape);
              }
          }else{
              const texts = this.showlayer.find('Text').filter((it)=>it.getAttr('isEdit'));
              texts.forEach((it)=>{
                  it.me.resizeTextArea(it);
              })
          }
      }

  }


  stageY(data){
    const val = this.stage.y()
    if(data!==val){
      this.stage.y(data);
      this.resizeEditText();
    }
  }

  scaleHeight(hratio,disableParentSize=false) {
    this.heightScale = hratio;
    this.canvasaction.heightScale = hratio;
    const newSize = this.resize();
    if(!(this.options&&this.options.disableScaleStage))this.stage.size(newSize);
    else{
      const n_size = {width:newSize.width,height:newSize.height/this.heightScale}
      this.stage.size(n_size)
      const h = (!disableParentSize)?newSize.height:n_size.height;
      this.el.parentElement.style.height = `${h}px`
    }
    if(this.resizeCb)this.resizeCb(newSize);
  }

  resizeEvent() {
    window.addEventListener("resize", this.resizeEventListener);
  }

  replayData(data = testdata) {
    const len = data.whiteboard.length;
    const serverRatio = this.scaletoserver;
    for (let i = 0; i < len; i++) {
      const item = data.whiteboard[i].data;
      this.replayDataItem(item, serverRatio, "replayData");
    }
  }
  editLayerPush(shape,item,serverRatio){
    const data = item[6][1];
    const len = data.length;
    if(shape.toolname === DRAWTOOL_POLYGON_EDIT){
      for(var i=0;i<len;i=i+2){
        const poi = {
          x:data[i]*serverRatio,
          y:data[i+1]*serverRatio
        }
        shape.pushPoint(poi);
        shape.pushControlPoint(poi);
      }
      shape.pushPoint({
        x:data[0]*serverRatio,
        y:data[1]*serverRatio
      });
    }else if(simple_edit_arr.includes(shape.toolname)){
      for(var i=0;i<len;i=i+2){
        const poi = {
          x:data[i]*serverRatio,
          y:data[i+1]*serverRatio
        }
        shape.pushPoint(poi);
      }
    }else if(shape.toolname===DRAWTOOL_TEXTTOOL_EDIT){
        const poi = {
          x:item[0]*serverRatio,
          y:item[1]*serverRatio
        }
        shape.pushPoint(poi);
        shape.text = data;
    }

    shape.draw();
    shape.endDraw();
  }
  replayDataItem(item, serverRatio, replykind) {
    const existItem = this.replayHashMap[item[2]];
    const x = item[0] * serverRatio;
    const y = item[1] * serverRatio;
    let pressure = 1;
    if (existItem) {
      if(PRESSURE_ARR.includes(existItem.toolname)){
        pressure = item[5] || item[3]
        //console.log('121221',existItem.toolname, pressure);
        existItem.pressure = pressure;
      }
      existItem.pushPoint({
        x,
        y
      },(existItem.toolname === DRAWTOOL_SMOOTHLINE ? item[6] || item[4]:null));

      if (item[item.length - 1] === true) {
        existItem.draw();
        existItem.endDraw((existItem.toolname === DRAWTOOL_SMOOTHLINE ? item[4]:null));
        delete this.replayHashMap[item[2]]
      } else if (this.isRecord || replykind==='mockpen') {
        existItem.draw();
      }
    } else {
      //f(item[3]==='eraser' || item[3]==='eraserrectangle')return;
      const ShapeClass = makeShapeInstance(item[3]);

      if (item.length < 4 || !Array.isArray(item[4])) return;
      let stroke = item[4][1];
      let isShift = false;
      let isFill = false;
      let uid = false;
      let edit_push = false;
      let isTempAchor = true;



      if (item[4].length === 4 && item[3]!=="linearrow") {
        stroke = item[4][2];
        if (item[4][1] === 1) isFill = true;
        if (item[4][3] === 1) isShift = true;
      }
      if(item[3] === 'line'){
        if (item[4][2] === 1) isShift = true;
      }
      if(item[3]==="triangle"){
          stroke = item[4][1];
          if (item[4][7] === 1) isFill = true;
          if (item[4][6] === 1) isShift = true;
      }else if(item[3]==="star"){
        if (item[4][2] === 1) isFill = true;
      }else if(PRESSURE_ARR.includes(item[3])){
        pressure = item[5];
        this.stage.heightScale = this.heightScale;
      }else if(item[3]===DRAWTOOL_RECT_EDIT){
        uid = item[6][0];
      }else if(item[3]===DRAWTOOL_POLYGON_EDIT){
        uid = item[6][0];
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3]===DRAWTOOL_ELLIPSE_EDIT){
        uid = item[6][0]
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3]===DRAWTOOL_CIRCLE_EDIT){
        uid = item[6][0]
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3]===DRAWTOOL_SIMPLE_ELLIPSE_EDIT){
        uid = item[6][0];
      }else if(item[3]===DRAWTOOL_SIMPLE_TRIANGLE_EDIT){
        uid = item[6][0];
        if (item[4][7] === 1) isFill = true;
        if (item[4][6] === 1) isShift = true;
      }else if(item[3]===DRAWTOOL_LINE_EDIT){
        uid = item[6][0];
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3] === DRAWTOOL_TEXTTOOL_EDIT){
        uid = item[6][0];
        edit_push = true;
      }else if(item[3] === DRAWTOOL_LINEDASH_EDIT){
        uid = item[6][0];
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3] === DRAWTOOL_LINEARROW_EDIT){
        uid = item[6][0];
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3] === DRAWTOOL_LINEARROWDASH_EDIT){
        uid = item[6][0];
        edit_push = true;
        isTempAchor = !!item[6][2];
      }else if(item[3] === DRAWTOOL_COORDSYS_EDIT){
        uid = item[6][0];
        edit_push = true;
      }else if(item[3] === DRAWTOOL_PENCIL){
        uid = item[6]&&item[6][0];
      }

      const shape = new ShapeClass(
        this.stage,
        isFill
          ? { stroke,fill:stroke}
          : {
              stroke,
              strokeWidth: item[4][0],
              fontSize: item[4][0],
            },
        item[2],
        item[3],
        replykind,
        item[6],
      );
      shape.isFill = isFill;
      shape.isShift = isShift;
      shape.pressure = pressure;
      shape.uid = uid;
      shape.isTempAchor = isTempAchor;
      if(edit_push){
        this.editLayerPush(shape,item,serverRatio);
        return;
      }else{
        shape.pushPoint({
          x,
          y
        },(shape.toolname === DRAWTOOL_SMOOTHLINE ? item[6] || item[4]:null));
      }


      // 有可能是最后一笔
      if (item[item.length-1] === true || shape.toolname === DRAWTOOL_TEXTTOOL) {
        //如果只有一个数据
            // shape.pushPoint({
            //     x,
            //     y
            // });
            if([DRAWTOOL_TRIANGLE,DRAWTOOL_SIMPLE_TRIANGLE_EDIT].includes(shape.toolname)){
              shape.pushPoint({
                x:item[4][2] * serverRatio,
                y:item[4][3] * serverRatio
              });
              shape.pushPoint({
                x:item[4][4] * serverRatio,
                y:item[4][5] * serverRatio
              });
            }else if([DRAWTOOL_LINEARROW].includes(shape.toolname)){
              shape.pushPoint({
                x:item[4][2] * serverRatio,
                y:item[4][3] * serverRatio
              });
            }
        shape.draw();
        shape.endDraw((shape.toolname === DRAWTOOL_SMOOTHLINE ? item[4]:null));
      } else {
        this.replayHashMap[item[2]] = shape;
      }
      if(item[item.length - 1] === true){
        delete this.replayHashMap[item[2]];
      }
    }
  }
  clearLocalDraw(){
    const data  = this.replayHashMap;
    for(var key in data){
      // if(Number.isInteger(Number(key))&&data[key]){
      //   console.log('clearLocalDraw',data[key])
      //   const shape = data[key];
      //   if(shape){
      //     const shapeArr= shape.shapeArr
      //     const shape_len = shapeArr.length;
      //     for(var i=0;i<shape_len;i++){
      //         const c_layer = shapeArr[i];
      //         c_layer.remove();
      //         c_layer.destroy();
      //     }
      //     data[key] = null;
      //   }
      // }
      if(Number.isInteger(Number(key))&&data[key]){
        const middlePoints = data[key].middlePoints;
        const scale_d =  this.stage.scale().x;
        const pointArr =this.canvasaction.dataToServer([middlePoints[middlePoints.length-2] * scale_d, middlePoints[middlePoints.length-1]*scale_d, data[key].clientid, data[key].pressure,true])
        console.log('pointArr pointArr',pointArr,scale_d)
        this.replayDataItem(pointArr, this.scaletoserver, 'mockpen');
        this.canvasaction.dataCallBack(pointArr)
      }

    }
  }
  initRecordData(data = testdata) {
    this.whiteboarddata = data;
    dispatch(this, "duration", this.whiteboarddata.duration);
    dispatch(this, "playingtime", 0);
  }
  recordPlay() {
    this.recordPlayingTime = performance.now();

    const fun = () => {
      const nowtime = performance.now();
      const space = nowtime - this.recordPlayingTime;
      dispatch(this, "playingtime", space);
      //console.log('recordPlay fun', this.recordPlayedIndex);
      if (
        this.whiteboarddata.whiteboard[this.recordPlayedIndex]["timespan"] +
          this.recordPlayedTimeReducer <=
        space
      ) {
        const serverRatio = this.scaletoserver;
        this.replayDataItem(
          this.whiteboarddata.whiteboard[this.recordPlayedIndex]["data"],
          serverRatio
        );
        this.recordPlayedIndex++;
        if (this.recordPlayedIndex === this.whiteboarddata.whiteboard.length)
          return;
        this.recordPlayedTimeReducer += this.whiteboarddata.whiteboard[
          this.recordPlayedIndex
        ]["timespan"];
      }
      //this.recordPlayingTime = nowtime;
      requestAnimationFrame(fun);
    };
    requestAnimationFrame(fun);
  }
  update(data) {
    this.data = data;
  }
}
