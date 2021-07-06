import { makeUUID } from "./util";

let onDebug = false;
let onMove = false;
let appInfo = {};
//const STAND_DOC_RATIO = 9/16;
// const penIcon = new Image();
// //const STAND_WIDH = 800;
// //const STAND_HEIGHT =450;
// penIcon.style.position = 'fixed';
// penIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDcvMDcvMTUv3CSZAAACQ0lEQVRYhb3XP2saYRzA8a96t0kpJQ5dhIDUIDkiOrVCbIMeaEKSPRLM1qVrh+5Bim/AF1Bfg4VmCmRoKJbuHbqlfyBNqp4aPX9d7uTSnPVP7vzBLerj5/s8x4EiIizjAh4B74Am8HL8+pLwJ8AnYAgI0ALeiAgB6wO+TSAQiAGnwGOXt1/7vfN1a7dSq9VkdXVVrBOwr57fuBGNRn+vrKyIpmnSaDQkFos5Az77iffi8fiVaZrSbDYlFApJPB6Xer0uiqKYwAWw7geeAHpra2vXnU5H7Dk/P5dIJCKqqg6BP8Azz58CC+9qmnZtGIb8O5qm/QAGwNPxGq/xjY2NVr/fv4NnMpnv1n1/fmudV3gwGOwlk8m2G57NZn9a+Is7az3EO2741tbWL7edexJg46lUquuG53K5SwvfnPgd98XT6XTPDdd1/WoavnCAjR8cHLgeu67r17PgCwXYeKlUcj32QqHQnhWfOwBIhEKh/iS8WCwa8+BzBdj44eHhjRu+vb3dnRefOcDGy+Xy0A3f2dnpL4LPFDAN393dHSyKTw1w4KYf+H8DgISiKDdHR0ejCfjwvvjEgGn43t6e6QXuGuDAxW/8TgCQUFV1MAnf398feYnfCpgBF6/xcQDwIBwOG/l8fqm4M6AIyPHx8VJxZ8Bb+6dypVJZGm7ZpIEz5x+GarUqpVLJd9wO2AQunQGABIPBkaqqWT9xEUEBXgEPAQP4Gg6Hv7Tb7Q+j0ejENM0LfB4F+AZ8BN4DJ61W68xv1Dl/AQ+g4z6prP8/AAAAAElFTkSuQmCC';
// penIcon.style.left = '0px';
// penIcon.style.top = '-32px';
// penIcon.style.transform = `translate(${-1000}px, ${-1000}px)`;
// penIcon.style.zIndex = 10;
// document.body.appendChild(penIcon);

let penIcon = null;

let lastDrawDataTime = 0;
const resArr = [];
//let mockPenToMouse = null;
let whiteBoardInstance = null;

let flag_ = false;
let lastRatio_ = 1;
const MIN_RATIO = 0.4;
const MAX_RATIO = 1.6;
const WIDTH_THRESHOLD = .03;
let LAST_X=0;
let LAST_Y=0;
let ACC_ID = 1000000;


const PEN_TOOL = 'pressurepen'

function mockPenToMouse(data) {
    const nowTime = performance.now();
    // 数据节流，防止过多数据造成渲染卡顿
    if (lastDrawDataTime && (nowTime - lastDrawDataTime < whiteBoardInstance.canvas.canvasaction.filterTimer) && data.nStatus == 17) {
        console.log('drop pen data', nowTime - lastDrawDataTime,whiteBoardInstance.canvas.canvasaction.filterTimer);
        return;
    }else{
        lastDrawDataTime = nowTime;
        __mockPenToMouse(data);
    }
    //__mockPenToMouse(data);
    
}

// 画笔模拟鼠标
function __mockPenToMouse(data) {

    if(!penIcon){
        penIcon = whiteBoardInstance.reboPenIcon.el
    }

    const {nStatus, nX = 0, nY = 0, nPress=1} = data;
    //console.log('__mockPenToMouse',JSON.stringify(data));
    let ratio = 1;
    if(!flag_)
    {
        flag_ = true;
        //记录第一次的压感
        lastRatio_ = nPress / 1024.000;
        if (lastRatio_ < MIN_RATIO)
            lastRatio_ = MIN_RATIO;
        ratio = lastRatio_;      
    }
    else
    {
        ratio = nPress / 1024.000;
        //判断上次压感是否是最细
        if (lastRatio_ > MIN_RATIO)
        {
            //当前压感小于上次的阈值
            if (ratio < (lastRatio_ * (1 - WIDTH_THRESHOLD)))
            {
                ratio = lastRatio_ * (1 - WIDTH_THRESHOLD);
                if (ratio < MIN_RATIO)
                    ratio = MIN_RATIO;
            }
            else if (ratio > (lastRatio_ * (1 + WIDTH_THRESHOLD)))
                ratio = lastRatio_ * (1 + WIDTH_THRESHOLD);
        }
        else
        {
            if (ratio > MIN_RATIO)
            {
                if(ratio > (lastRatio_ * (1 + WIDTH_THRESHOLD)))
                    ratio = lastRatio_ * (1 + WIDTH_THRESHOLD);
            }
            else
                ratio = MIN_RATIO;
        }
    }
    lastRatio_ = ratio;
    let press = MAX_RATIO*lastRatio_;
    //let press = 1;
    const stage = whiteBoardInstance.canvas.stage;
    const  layoutOptions = whiteBoardInstance.canvas.layoutOptions;
    
    const {
        onPenDraw=true , drawAppScrollTop = whiteBoardInstance.el.parentElement.scrollTop,
        drawAppWidth = stage.width(),
        drawAppHeight = stage.width() * layoutOptions.ratio,
        drawAppContainer = stage.getContent()
    } = appInfo;

    //Log('__mockPenToMouse',nStatus,nX,nY,stage);
    const {_nStatus, _clientX, _clientY} = __mockPenToMouse;

    if (!onPenDraw || !drawAppContainer) return;

    const clientX = drawAppWidth * nX;
    const clientY = drawAppHeight * nY;
    const dataX = layoutOptions.width * nX;
    const c_top =  (whiteBoardInstance.canvas.canvasaction.options&&whiteBoardInstance.canvas.canvasaction.options.disableScaleStage)?Math.abs(stage.y()):drawAppScrollTop;
    const dataY = c_top * layoutOptions.width/drawAppWidth + layoutOptions.height * nY;
    console.log('模拟事件相关数据', nStatus,nX*21050,nY*14700,nPress,lastRatio_,press,dataX,dataY);

    if ((_nStatus == nStatus) && (_clientX == clientX) && (_clientY == clientY)) return;
    __mockPenToMouse._nStatus = nStatus;
    __mockPenToMouse._clientX = clientX;//Math.round(clientX);
    __mockPenToMouse._clientY = clientY;//Math.round(clientY);
    let pointArr = [];
    const serverRatio = whiteBoardInstance.canvas.scaletoserver;
    if (nStatus == 17) {
        penIcon.style.transform = `translate(${clientX}px, ${clientY}px)`;
        LAST_X = dataX;
        LAST_Y = dataY;
        //!onMove && drawAppContainer.dispatchEvent(createEvent('mousedown', clientX, clientY, press));
        if(!onMove){
            const {stroke, strokeWidth} = whiteBoardInstance.canvas.canvasaction.localStyle;
            pointArr =[dataX, dataY, ACC_ID, PEN_TOOL, [strokeWidth, stroke], press,[makeUUID()]]
            //whiteBoardInstance.canvas.replayDataItem(pointArr, serverRatio, '');
        }else{
            pointArr =[dataX, dataY, ACC_ID, press]
        }
        
        
        whiteBoardInstance.canvas.replayDataItem(pointArr, serverRatio, 'mockpen');
        whiteBoardInstance.canvas.canvasaction.dataCallBack(pointArr) 
        //drawAppContainer.dispatchEvent(createEvent('mousemove', clientX, clientY, press));
        onMove = true;
        //console.log('mouseMove')
    } else {
        flag_ = false;
        penIcon.style.transform = `translate(${nStatus ? clientX : -1000}px, ${nStatus ? clientY : -1000}px)`;
        if (!onMove) return;
        //Log('mouseup',clientX, clientY);
        //console.log('mouseUp')
        onMove = false;
        pointArr =[LAST_X, LAST_Y, ACC_ID, press,true]
        whiteBoardInstance.canvas.replayDataItem(pointArr, serverRatio, 'mockpen');
        whiteBoardInstance.canvas.canvasaction.dataCallBack(pointArr)
        //console.log('replayDataItem',pointArr, serverRatio)
        ACC_ID = ACC_ID + 1;
        //drawAppContainer.dispatchEvent(createEvent('mouseup', LAST_X, LAST_Y, press));
    }
    if (!whiteBoardInstance.canvas.cacheDataInstance.layerCachData[whiteBoardInstance.canvas.cacheDataInstance.currentLayerId]) {
        whiteBoardInstance.canvas.cacheDataInstance.layerCachData[whiteBoardInstance.canvas.cacheDataInstance.currentLayerId] = []
    }
    whiteBoardInstance.canvas.cacheDataInstance.layerCachData[whiteBoardInstance.canvas.cacheDataInstance.currentLayerId].push(pointArr);

}

function createEvent(eventName, ofsx, ofsy, press) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(eventName, true, false, window, 0, ofsx, ofsy, ofsx, ofsy, false, false, false, false, 0, null);
    onMove = eventName === 'mousemove';
    let resultEvent = onMove ? fockMouseMoveEvent(evt) : evt;
    resultEvent.data = press; 
    return resultEvent;
};

function fockMouseMoveEvent(_evt) {
    var evt = new Event('mousemove');
    for (let key in _evt) {
        try {
            evt[key] = _evt[key];
        } catch (e) {
        }
    }
    evt.movementY = 1; // 应对 Konva.js 对 mousemove 事件属性判断
    return evt;
}
export function init (data,whiteInstance){
    whiteBoardInstance = whiteInstance;
    //console.log('mockPenToMouse begin,data',data);
    mockPenToMouse(data);
}
export function mockTest (whiteInstance,Test_data){
    whiteBoardInstance = whiteInstance;
    let i = 0;
    const data = Test_data;
    // for(var j=0;j<10000;j++){
    //     data.push(Test_data[j%Test_data.length])
    // }
    console.log('data',data);
    const fn  = (item) => {
        item.nX = item.nX/21050
        item.nY = item.nY/14700
        mockPenToMouse(item);
    }
    let ins = setInterval(()=>{
        if(i<data.length){
            fn(data[i]);
            i++;
        }else{
            clearInterval(ins);
        }
    },16)
    // for(var i=0;i<Test_data.length;i++){
    //     mockPenToMouse(Test_data[i]);
    // }
}
export function mockOneTest(index,Test_data){
    whiteBoardInstance = window.zmSketchInstance;
    let item = Test_data[index]
    item.nX = item.nX/21050
    item.nY = item.nY/14700
    mockPenToMouse(item);
}

export function hideRoboPen(){
    if(penIcon && !penIcon.style.transform.includes('-1000px'))penIcon.style.transform = `translate(${-1000}px, ${-1000}px)`;
}