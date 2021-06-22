import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import store from '../redux/store';
import useEventController from '../hooks/useEventController';
import DrawTools from '../components/drawTools/index';
import Courseware from './components/courseware/index';
import OutLine from './components/outLine/index';
import VideoList from './components/videoList/index';
import { calZmlScope } from '../utils/index';
import { PlayerContext } from '../config';
import './index.less';
const histroyPageMap = {};
// const initScope = calZmlScope();

// room 内容宽高比自适应
export default function Room(props) {
  const { eventControllersInstance } = props;
  const { whiteBoardController } = eventControllersInstance.controllers;
  const [coursewareId, setCoursewareId] = useState(null);
  const [scope, setScope] = useState({});
  const [pageNum, setPageNum] = useState(0);
  const [coursewareList, setCoursewareList] = useState([]);
  const [isPPT, setIsPPT] = useState(false);
  const [isZML, setIsZML] = useState(false);
  const [pageTotal, setPageTotal] = useState(0); //总页数
  const $pageNumSnapshot = useRef();
  const $coursewareIdSnapshot = useRef();
  const histroryTimer = useRef();
  const { userInfo } = store.getState();
  const isTeacher = userInfo.role === 'TEACHER';
  const isStudent = !isTeacher;

  $pageNumSnapshot.current = pageNum;
  $coursewareIdSnapshot.current = coursewareId;

  // // 监听翻页和课件切换信息
  useEventController(eventControllersInstance, 'COURSE_EVENT', handleCourseEvent);

  function handleCourseEvent(res) {
    // eventControllersInstance.send('playerTrackEvent', { eventId: 'CBG_COMMON_EVENT', eventParam: { data: res, describe: 'QT传递过来的课件信息' } });
    const { data } = res;
    let num = 0;
    if (data && data.page && typeof data.page === 'number') {
      num = data.page - 1;
    }
    if (typeof data.id !== 'string') {
      return;
    }
    compositesSetCoursewareId(data.id);
    compositesSetPageNum(num);
  }

  function compositesSetCoursewareId(id) {
    if (id !== $coursewareIdSnapshot.current) {
      $coursewareIdSnapshot.current = id;
      setCoursewareId(id);
    }
  }
  function compositesSetPageNum(page) {
    if ($pageNumSnapshot.current !== page) {
      $pageNumSnapshot.current = page;
      setPageNum(page);
    }
  }

  // 获取当前页历史白板消息
  useEffect(() => {
    async function getHistroy() {
      if (coursewareId && pageNum !== null) {
        // if (!histroyPageMap[`${coursewareId}_${pageNum}`]) {
        const res = await eventControllersInstance.send('whiteboard_page', pageNum, coursewareId);
        if (res && $pageNumSnapshot.current === pageNum && $coursewareIdSnapshot.current === coursewareId) {
          const { drawToolDatas, zmlMessageDatas } = res;
          if (!histroyPageMap[`${coursewareId}_${pageNum}`]) {
            console.log('课件链路：获取历史白板：', coursewareId, pageNum);
            whiteBoardController.emit('drawTool', {
              action: 'pushDataToLayer',
              payload: drawToolDatas,
              pageId: `${coursewareId}_${pageNum}`
            });
            histroyPageMap[`${coursewareId}_${pageNum}`] = true;
          }
          for (let key in zmlMessageDatas) {
            zmlMessageDatas[key].forEach(item=>{
              whiteBoardController.emit('zmlMessage', {
                action: key,
                data: item
              });
            });
          }
        } else {
          console.error('获取白板历史出错');
        }
      }
    }
    if (!coursewareList.length > 0) return;
    if (histroryTimer.current) clearTimeout(histroryTimer.current);
    histroryTimer.current = setTimeout(()=>{
      getHistroy();
    }, 300);
  }, [coursewareId, pageNum, coursewareList]);

  // ppt页数
  useEffect(() => {
    if (coursewareList.length > 0 && coursewareId) {
      const currentWare = coursewareList.find(i => i.id === coursewareId);
      if (currentWare) {
        setPageTotal(currentWare.pageTotal);
        currentWare.type === 'pdf' ? setIsPPT(true) : setIsPPT(false);
        currentWare.type === 'zml' ? setIsZML(true) : setIsZML(false);
      }
      // 如果课件不存在 则刷新一次页面重新请求
      if (!currentWare && (`${coursewareId}` !== `${zmSessionStorage.unkonwCourseware}`)) {
        // eventControllersInstance.send('QtAction', { action: 'queryCourseResource' });
        eventControllersInstance.send('QtAction', { action: 'sendCommonMsgToQt', data: { event: 'queryCourseResource' } });
        // QtBridge.sendMessageToQt('queryCourseResource'); // Qt课件强刷新一次
        console.error('课件不存在：', coursewareId, coursewareList, zmSessionStorage.coursewareReload);
        eventControllersInstance.send('playerTrackEvent', { eventId: 'CBG_ERROR_EVENT', eventParam: { id: coursewareId, list: coursewareList, describe: '没有收到课件id' } });
        zmSessionStorage.unkonwCourseware = coursewareId;
        location.reload();
      }
    }
  }, [coursewareId, coursewareList]);

  // 监听页面大小改变
  function handleSize() {
    setScope(calZmlScope());
  }
  // didMount+willlUnMount
  useEffect(() => {
    setScope(calZmlScope());
    window.addEventListener('resize', handleSize);
    whiteBoardController.on('setPage', compositesSetPageNum);
    whiteBoardController.on('changeCouerseId', compositesSetCoursewareId);
    eventControllersInstance.send('getCoursewareList').then(res=>{
      setCoursewareList(res);
    });
    return () => {
      window.removeEventListener('resize', handleSize);
      whiteBoardController.removeListener('setPage', compositesSetPageNum);
      whiteBoardController.removeListener('changeCouerseId', compositesSetCoursewareId);
    };
  }, []);

  useEffect(() => {
    setTimeout(()=>{
      eventControllersInstance.send('current_whiteboard_data').then(res=>{
        if (res && res.data) {
          const { currentLoad, sliderCurrentPage } = res.data;
          if (sliderCurrentPage && currentLoad) {
            const $page = sliderCurrentPage[currentLoad];
            compositesSetCoursewareId(currentLoad);
            compositesSetPageNum($page ? $page : 0);
          }
        }
      });
    }, 3000);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        pageNum: {
          value: pageNum,
          setValue: compositesSetPageNum
        },
        courseware: {
          coursewareId,
          compositesSetCoursewareId,
          coursewareList,
          setCoursewareList
        },
        eventControllersInstance
      }}
    >
      <div className="player-box">
        <div className="player-content">
          <div className="player-main" style={{ ...scope, overflow: 'hidden' }}>
            {coursewareList.length > 0 && <Courseware />}
            <DrawTools isZML={isZML} isTeacher={isTeacher} pageNumValue={pageNum} coursewareId={coursewareId} signalType="draw_tools_data"/>
            {!isStudent && <div style={{ display: isPPT ? 'block' : 'none' }}><OutLine coursewareId={coursewareId} active={isPPT} pageTotal={pageTotal} currentPage={pageNum} /></div>}
            {isTeacher && isZML && <VideoList coursewareId={coursewareId} currentPage={pageNum} />}
          </div>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}

Room.propTypes = {
  eventControllersInstance: PropTypes.object
};
