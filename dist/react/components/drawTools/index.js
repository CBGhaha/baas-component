import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './index.less';
import './cursor.global.less';
import useEventController from '@/hooks/useEventController';
import dawToolsInstance from './drawToolsInstance/index';
import { PlayerContext } from '@/config';

let lastToolType;

function DrawTool(props) {
  const { eventControllersInstance } = useContext(PlayerContext);
  const { whiteBoardController } = eventControllersInstance.controllers;
  const [toolType, setToolType] = useState('');
  const [cursorClassName, setCursorClassName] = useState('');
  const { pageNumValue, coursewareId, signalType, dataPipe, userInfo } = props;
  const drawToolsInstance = useRef(null);
  const mockEraser = useRef();
  const drawRef = useRef();
  const timer = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [scalex, setScalex] = useState(0);
  const [currenttool, setCurrenttool] = useState({});

  // 监听教具发来的
  useEventController(eventControllersInstance, 'PALETTE_EVENT', (res) => {
    const { data } = res;
    console.log('PALETTE_EVENT:', res);
    setTool(data.kind, data.style, data.mark);
  });

  useEffect(() => {
    // 初始化教具实例
    drawToolsInstance.current = dawToolsInstance(document.getElementById('draw'), USER_TYPE.teacher, signalType, dataPipe, eventControllersInstance);
    whiteBoardController.on('drawTool', handleDraw);
    whiteBoardController.on('drawtoolScroll', handleDrawtoolScroll);
    const contentWidth = drawRef.current.offsetWidth;
    setScalex((+contentWidth / 800).toFixed(4));
    return () => {
      drawToolsInstance.current.destroyed();
      whiteBoardController.removeListener('drawTool', handleDraw);
      whiteBoardController.removeListener('drawtoolScroll', handleDrawtoolScroll);
    };
  }, []);

  /*————图案填充————*/
  function handleDraw(data) {
    // console.log('handleDraw:', data);
    const { action, payload, pageId } = data;
    if (drawToolsInstance.current) {
      drawToolsInstance.current[action](payload, pageId);
    }
  }
  // 根据课件滚动高度 设置白板的滚动高度
  function handleDrawtoolScroll(data) {
    const { scrollRatio, heightRatio } = data;
    drawToolsInstance.current.handleScroll(scrollRatio * drawRef.current.offsetHeight * heightRatio);

  }

  /*————绘制指定页—————*/
  useEffect(()=>{
    // 多边形在未闭合时翻页 ，角标会存在bug 。hack解决方式是手动切换一次教具类型 在切换回来
    if (toolType === 'polygon_edit') {
      const recoverLastToolType = lastToolType;
      // 先跳转画笔
      setTool({ action: 'brush', cursorIcon: 'pencursor-EF4C4F' }, { strokeWidth: 2, stroke: '#EF4C4F' }, false);
      setTimeout(()=>{
        // 再恢复原来的教具
        if (recoverLastToolType) {
          setTool(...recoverLastToolType);
        }
      }, 200);
    }
    setIsLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(()=>{
      drawToolsInstance.current.handleScroll(0);
      timer.current = null;
      drawToolsInstance.current.showLayerById(`${coursewareId}_${pageNumValue}`);
      setIsLoading(false);
    }, 200);
  }, [pageNumValue, coursewareId]);

  /*———讲师设置教具———*/
  function setTool(tool, style = {}, isNumMark) {
    lastToolType = [tool, style, isNumMark];
    const { action, cursorIcon } = tool;
    setCurrenttool({
      ... tool,
      ... style
    });
    if (drawToolsInstance.current) {
      const { isFill } = style;
      if (typeof isFill === 'boolean') {
        drawToolsInstance.current.setIsFill(isFill);
      }
      setCursorClassName(cursorIcon);
      setToolType(action);
      if (drawToolsInstance.current[action]) {
        drawToolsInstance.current[action]();
      } else {
        drawToolsInstance.current.setToolKind(action, isNumMark);
        drawToolsInstance.current.setLocalStyle(style);
      }
    }
  }

  // 设置 text_edit 的高度, hack出现滚动条
  function limitTextEidt(offsetX, offsetY) {
    const $draw = document.querySelector('#draw');
    const contentWidth = $draw.offsetWidth;
    const contentHeight = $draw.offsetHeight;
    const textEditList$ = document.body.querySelectorAll('div[contenteditable=true]');
    const textEdit$ = textEditList$[textEditList$.length - 1];
    if (textEdit$) {
      // textEdit$.style.width = '100px';
      textEdit$.style.whiteSpace = 'nowrap';
      textEdit$.style.minWidth = `${Math.min(100, contentWidth - offsetX)}px`;
      textEdit$.style.maxWidth = `${contentWidth - offsetX - 2}px`;
      textEdit$.style.maxHeight = `${contentHeight - offsetY - 2}px`;
    }
  }
  //
  function editText(e) {
    if (currenttool.action === 'text_edit') {
      const { offsetX, offsetY } = e;
      limitTextEidt(offsetX, offsetY);
    }
  }

  // 监听鼠标移动 且只有eraser
  const handlerMouseMove = (e) => {
    if (currenttool.action !== 'eraser') {
      return;
    }
    if (mockEraser.current) mockEraser.current.style.display = 'block';
    const mockEraser$ = document.querySelector('.mockEraser');
    if (!mockEraser$) return;
    const { strokeWidth } = currenttool;
    const offsetSize = strokeWidth * scalex / 2;
    mockEraser$.style.width = `${strokeWidth * scalex}px`;
    mockEraser$.style.height = `${strokeWidth * scalex}px`;
    mockEraser$.style.transform = `translate(${e.offsetX - offsetSize}px, ${e.offsetY - offsetSize}px)`;
  };
  // 鼠标离开
  const handlerMouseLeave = () => {
    if (mockEraser.current) mockEraser.current.style.display = 'none';
  };
  const handlerMouseEnter = () => {
    let displayState = 'none';
    if (currenttool.action === 'eraser') {
      displayState = 'block';
    }
    if (mockEraser.current) mockEraser.current.style.display = displayState;
  };

  useEffect(() => {
    drawRef.current.addEventListener('mousemove', handlerMouseMove);
    drawRef.current.addEventListener('mouseenter', handlerMouseEnter);
    drawRef.current.addEventListener('mouseleave', handlerMouseLeave);
    return function removeDrawMouse() {
      drawRef.current.addEventListener('mousemove', handlerMouseMove);
      drawRef.current.addEventListener('mouseenter', handlerMouseEnter);
      drawRef.current.addEventListener('mouseleave', handlerMouseLeave);
    };
  });


  // 监听老师画板滚动
  function handleWheel(e) {
    if (userInfo.role !== 'student' && e.deltaY !== 0) whiteBoardController.emit('teacherWheel', e.deltaY > 0);
  }

  return (
    <div className="box">
      <div id="draw" ref={drawRef} onWheel={handleWheel} className={`${style.draw} ${cursorClassName}`} style={{ zIndex: toolType === 'point' || isLoading ? -1 : 1 }} onClick={(e) => editText(e.nativeEvent)}>
        {userInfo.role === 'student' && <div className={style.cover}></div>}
        { <div style={{ opacity: currenttool.action !== 'eraser' ? 0 : 1 }} ref={mockEraser} className={`${style.mockEraser} mockEraser`}></div>}
      </div>
    </div >
  );
}
DrawTool.propTypes = {
  pageNumValue: PropTypes.number,
  coursewareId: PropTypes.string,
  signalType: PropTypes.string,
  dataPipe: PropTypes.func,
  userInfo: PropTypes.object
};
export default connect(
  ({ userInfo })=>({ userInfo }),
  ()=>({}))(DrawTool);
