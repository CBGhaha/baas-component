import { EDIT_CIRCLE_RADIUS, DRAWTOOL_EDIT_SHAPE_DELETE, DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE } from './global';

export function getUrlVars(key) {
  var vars = [];
  var hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars[key];
}

export let testdata = [];

//生成唯一id
export const makeUUID = () => Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);

// let char_begin = 65;
// //获取字母id
// export const getCharLabel = () => {
//     const num =  Math.floor((char_begin-65)/26)
//     const label = (char_begin-65)%26;
//     if(num>0){
//         return `${String.fromCharCode(label+65)}${num}`;
//     }else{
//         return `${String.fromCharCode(label+65)}`;
//     }
// }
// //递增字母id
// export const makeCharLabel = () => {
//     char_begin++;
//     return getCharLabel()
// }
// //更改字母数
// export const changeCharLabel = (val) => {
//     char_begin = char_begin + val
// }
// //重置字母id
// export const resetCharLabel = () => {
//     char_begin = 65;
// }
//hex 16 转rgba
export function hexToRgba(hex, opacity) {
  return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
}

//生成通用编辑点
export function makeEditPoi(style, visible = true) {
  console.log('makeEditPoi', visible);
  return new Konva.Circle({
    x: -10,
    y: -10,
    name: 'editpoi',
    radius: EDIT_CIRCLE_RADIUS,
    fill: 'white',
    draggable: false,
    stroke: style.stroke,
    shadowEnabled: false,
    shadowColor: style.stroke,
    shadowBlur: 10,
    visible,
    shadowOpacity: 1
  });
}

// 生成文字标点
export function makeTextPoi(style, achorTextCode, visible = true) {
  return new Konva.Text({
    x: -10,
    y: -10,
    width: 20,
    fill: style.stroke,
    text: achorTextCode,
    stroke: 'white',
    strokeWidth: 1,
    fontSize: 12,
    align: 'left',
    visible,
    fontFamily: 'Times New Roman'
  });
}

// 生成通用tr
export function makeTransformer(options = {}) {
  const { disableMiu } = options;
  return new Konva.Transformer({
    rotateEnabled: false,
    anchorSize: 7,
    anchorCornerRadius: 3,
    borderStroke: '#298DF8',
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    boundBoxFunc: function(oldBoundBox, newBoundBox) {
      console.log('oldBoundBox,newBoundBox', oldBoundBox, newBoundBox);
      if (disableMiu) {
        if (newBoundBox.width < 0 || newBoundBox.height < 0) {
          return oldBoundBox;
        }
      }
      return newBoundBox;
    }
  }
  );}

// 重新渲染Text stroke

export function reBuildTextStroke(layer) {
  const oldFunc = layer.getContext().fillStrokeShape;
  layer.getContext().fillStrokeShape = function(shape) {
    if (shape instanceof Konva.Text) {
      if (shape.getStrokeEnabled()) {
        this._stroke(shape);
      }
      if (shape.getFillEnabled()) {
        this._fill(shape);
      }
    } else {
      oldFunc.call(this, shape);
    }
  };
}

export const hoverImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAZCAYAAAA14t7uAAADh0lEQVRIS7WVXUiTURjHj8vlx5y6NiQSFD8QwfAmUURQr0qEBJFdBKLdSGLgZFfrQlmCCJp4I114MZgfixQTImJQmDehoASxlBJTGAvNr23O1Onm2/Mf71nHOW1d9MKfc97zHn7v/zzPc86JY//piRO46PN3tJL8DS3vx2xDBClkMG8BOZMFMPoxPxwM2DVS/NbW1oOCgoJXHo8HsCApIAvgmN1zMKBKUoLf738bCAT2W1tbjaOjo24a88s6jVjBle45OJ5mXSclu93u5xsbG/rc3FwngdtbWlo+0/gv0hEJcKyAu78ULoITaVbK+vr6k5GRkfalpSVpeHj4hNreioqKF/TNRzqU3YvwqImNBKfOzc09XFlZ6WlubmaFhYVsampKUqvVr2tqap4uLy9vy/Bj2T1yEDXuYoyTaFKqzWa7l5mZaamqqgotU6VSMXLO6urqvnV3dxv7+/uXafhACA3gF0IjghNoQprBYCg2Go327Ozsc/Fra2uT+vr6DmZmZrroJ29kOA8Nh4dLUiw3gFPT09Nv7uzsLCYlJcWfniJXf57S0lI2OTkpHR8fW8vLy5/t7e155MSichB3/oPwTkMdoyrUJN3R0dH7oqKiW2traxeyrtVq2fj4uFRWVvapo6PDaLVaMQlVw+Me2lTizgM4haTd3d216fX6O7TsC2AMKBQK1tnZyUwm07bdbjfU19d/oGGEBfBQxYhgbBAV6YbT6Rw0m833LRbLObBGo2E5OTlcUmNjIysuLg66XK7erKysQSGhYTAAACeTNA6HwzQ9Pf2oq6srBKYqYfPz8ywjI+PQ5/NtkTZILq/X6yR9pxV+7enpcVCZIiRITFA83bD7UHKa2dnZZnLd3dTUxJRKJaN3iQATtbW1E/KS+bKxGwHDO/oXQgFjOC8ATqOtfJfKzVJZWckGBgZYQ0PDYl5enjkYDHplECCoBLg7EfohtyRJdAxwqOQo27eplt9RTUtjY2M/q6urHy8sLPygbwBjc4jlBRBX+JgVwSg5gFU6nU67ubn5heJ4NjQ01EYVgIMI0H15yWFncBdF4TpGKABGAhEONR2fHymJ1pKSkpcyDE4RT7i99IwACE/k1YQEwnXi6urqw/z8/EnqY3mA8bjyk40zoraRYLgGHM4hfAcYsJjP4kjHPByA86sKY/yKEu+/K91GA3O4eGNHJuev0MvA0cb/+fr/DeeQji288n1qAAAAAElFTkSuQmCC';
export function makeMoveHover(achor) {
  achor.on('mouseenter', (evt)=>{
    if (this.stage.canvasaction.isSelectMode() && this.isSelected) {
      evt.cancelBubble = true;
      const shape = evt.target;
      shape.shadowEnabled(true);
      this.showlayer.batchDraw();
      this.stage.container().style.cursor = `url('${hoverImg}') 5 5,auto`;
      console.log('mouseenter');
    }
  });

  achor.on('mouseleave', (evt)=>{

    if (this.stage.canvasaction.isSelectMode() && this.isSelected) {
      //evt.cancelBubble = true;
      //console.log('')
      const shape = evt.target;
      shape.shadowEnabled(false);
      this.showlayer.batchDraw();
      this.stage.container().style.cursor = 'move';
    }
  });
}


export const zmMovedDom = (options)=> {
  let dragObj = null;
  let xOffset = 0;
  let yOffset = 0;
  const { dragHandle, dragTarget, parentDom, cb } = options;
  console.log('addEventListener mousedown');
  dragHandle.addEventListener('mousedown', startDrag, true);
  dragTarget.addEventListener('touchstart', startDrag, true);
  // if(!zmMovedDom.cachArr)zmMovedDom.cachArr = [];

  // for(let i=0;i<zmMovedDom.cachArr.length;i++){
  //     const c_item = zmMovedDom.cachArr[i];
  //     if(!c_item[0].isConnected){
  //         document.removeEventListener('mouseup',c_item[1])
  //     }
  // }
  // zmMovedDom.cachArr = zmMovedDom.cachArr.filter((it)=>it[0].isConnected)
  // zmMovedDom.cachArr.push([dragHandle,onmouseup])

  function startDrag(e) {
    // e.preventDefault();
    e.stopPropagation();
    dragObj = dragTarget;
    dragObj.style.position = 'absolute';
    //dragObj.style.height="100%";
    //let rect = dragObj.getBoundingClientRect();

    if (e.type == 'mousedown') {
      xOffset = e.clientX - dragObj.offsetLeft;
      yOffset = e.clientY - dragObj.offsetTop;
      console.log('addEventListener mousemove');
      window.addEventListener('mousemove', dragObject, true);
    } else if (e.type == 'touchstart') {
      console.log('touchmove');
      xOffset = e.targetTouches[0].clientX - dragObj.offsetLeft;
      yOffset = e.targetTouches[0].clientY - dragObj.offsetTop;
      window.addEventListener('touchmove', dragObject, true);
    }
  }

  function dragObject(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('dragObject move move');
    if (dragObj == null) {
      return;
    } else if (e.type == 'mousemove') {
      let x = e.clientX - xOffset;
      let y = e.clientY - yOffset;
      const minX = parentDom ? parentDom.getBoundingClientRect().left : 0;
      const minY = parentDom ? parentDom.getBoundingClientRect().top : 0;
      if (x < minX)x = minX;
      if (y < minY)y = minY;
      if (parentDom) {
        //console.log('y,dragObj.offsetHeight,parentDom.offsetHeight,parentDom.offsetTop',y,dragObj.offsetHeight,parentDom.offsetHeight,parentDom.offsetTop)
        if (y + dragObj.offsetHeight > (parentDom.offsetHeight + parentDom.getBoundingClientRect().top))y = parentDom.offsetHeight + parentDom.getBoundingClientRect().top - dragObj.offsetHeight;
        if (x + dragObj.offsetWidth > (parentDom.offsetWidth + parentDom.getBoundingClientRect().left))x = parentDom.offsetWidth + parentDom.getBoundingClientRect().left - dragObj.offsetWidth;
      } else {
        if (y + dragObj.offsetHeight > dragObj.parentElement.scrollHeight)y = dragObj.parentElement.scrollHeight - dragObj.offsetHeight;
        if (x + dragObj.offsetWidth > dragObj.parentElement.offsetWidth)x = dragObj.parentElement.offsetWidth - dragObj.offsetWidth;
      }

      dragObj.style.left = x + 'px';
      dragObj.style.top = y + 'px';
      cb && cb({ type: 'move', x, y });
    } else if (e.type == 'touchmove') {
      let x = e.targetTouches[0].clientX - xOffset;
      let y = e.targetTouches[0].clientY - yOffset;
      const minX = parentDom ? parentDom.getBoundingClientRect().left : 0;
      const minY = parentDom ? parentDom.getBoundingClientRect().top : 0;
      if (x < minX)x = minX;
      if (y < minY)y = minY;
      if (parentDom) {
        //console.log('y,dragObj.offsetHeight,parentDom.offsetHeight,parentDom.offsetTop',y,dragObj.offsetHeight,parentDom.offsetHeight,parentDom.offsetTop)
        if (y + dragObj.offsetHeight > (parentDom.offsetHeight + parentDom.getBoundingClientRect().top))y = parentDom.offsetHeight + parentDom.getBoundingClientRect().top - dragObj.offsetHeight;
        if (x + dragObj.offsetWidth > (parentDom.offsetWidth + parentDom.getBoundingClientRect().left))x = parentDom.offsetWidth + parentDom.getBoundingClientRect().left - dragObj.offsetWidth;
      } else {
        if (y + dragObj.offsetHeight > dragObj.parentElement.scrollHeight)y = dragObj.parentElement.scrollHeight - dragObj.offsetHeight;
        if (x + dragObj.offsetWidth > dragObj.parentElement.offsetWidth)x = dragObj.parentElement.offsetWidth - dragObj.offsetWidth;
      }
      dragObj.style.left = x + 'px';
      dragObj.style.top = y + 'px';
      cb && cb({ type: 'move', x, y });
      // dragObj.style.left = e.targetTouches[0].clientX-xOffset +"px";
      // dragObj.style.top = e.targetTouches[0].clientY-yOffset +"px";
    }
  }
  function onmouseup(e) {
    if (dragObj) {
      dragObj = null;
      console.log('remove mousemove');
      window.removeEventListener('mousemove', dragObject, true);
      window.removeEventListener('touchmove', dragObject, true);
      cb && cb({ type: 'moveend' });
    }
    if (!dragHandle || !dragHandle.isConnected) {
      document.removeEventListener('mouseup', onmouseup);
      document.removeEventListener('touchend', onmouseup);
    }

  }
  document.addEventListener('mouseup', onmouseup);
  document.addEventListener('touchend', onmouseup);
};

export function getActionItemUid(item) {
  const [x, y, id, name] = item;
  const nameFilters = [DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE, DRAWTOOL_EDIT_SHAPE_DELETE];
  if (nameFilters.includes(name)) return item[5] && item[5][0];
  else return item[6] && item[6][0];
}
//是否为移动端
export function isMobile () {
  return navigator && navigator.userAgent && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
}
//是否为触摸设备
export function isTouchDevice() {
  return (navigator && navigator.maxTouchPoints > 0);
}

//ios版本
export function iosVersion() {
  let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (ver) {
    return parseInt(ver[1], 10);
  } else return false;
}