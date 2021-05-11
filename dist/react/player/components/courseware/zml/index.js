import React, { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import store from '../../../../redux/store';
import useEventController from '../../../../hooks/useEventController';
import ZmlInstance from './zmlInstance';
import { PlayerContext } from '../../../../config';


// export default React.memo(Zml, (preProps, nextprops)=>{
//   if ((preProps.active === nextprops.active) && (preProps.coursewareInfo.content === nextprops.coursewareInfo.content)&&(preProps.coursewareInfo.content === nextprops.coursewareInfo.content)) {
//     return false;
//   }
//   return true;
// });
export default function Zml(props) {
  const { userInfo } = store.getState();
  const { role, usage, mode } = userInfo;
  const { pageNum, courseware, eventControllersInstance } = useContext(PlayerContext);
  const { whiteBoardController } = eventControllersInstance.controllers;
  const { coursewareList } = courseware;
  const { value: pageNumValue } = pageNum;
  const zmlInstance = useRef(null);
  const { active, coursewareInfo } = props;
  const timer = useRef(null);
  const isZml = useRef();
  isZml.current = active;

  // 监听老师关闭zml答题
  useEventController(eventControllersInstance, 'closeZMLExam', ()=>{
    zmlInstance.current.clearAnswering();
  });

  //  处理老师滚动白板
  function handleTeacherWheel(data) {
    if (isZml.current) {
      zmlInstance.current.handleScroll({ deltaY: data ? 50 : -50 });
    }
  }

  // Zml实例 初始化和销毁
  useEffect(()=>{
    zmlInstance.current = new ZmlInstance(coursewareInfo.content, handleIframeMsg, eventControllersInstance,coursewareInfo.id);
    whiteBoardController.on('teacherWheel', handleTeacherWheel);
    return ()=>{
      zmlInstance.current.destroyed();
      whiteBoardController.removeListener('teacherWheel', handleTeacherWheel);
    };
  }, []);

  // 处理翻页
  useEffect(()=>{
    if (zmlInstance.current && active) {
      // 防抖
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(()=>{
        zmlInstance.current.setPageNo(pageNumValue);
        if (role === PLAYER_USER_TYPE.teacher) {
          zmlInstance.current.handleScroll({ deltaY: 5000000 });
        }
      }, 200);
    }
  }, [pageNumValue, active]);

  // 处理zml iframe回调消息
  function handleIframeMsg(payload) {
    const { action, data } = payload;
    // 设置zml的总页数
    if (action === 'pageNumber') {
      const currentZml = coursewareList.find(i=>i.id === props.coursewareInfo.id);
      if (currentZml) {
        currentZml.pageTotal = data;
      }
    }
  }
  return (
    zmlInstance.current && <iframe
      className="zmlIframe"
      id="iframeId"
      src={`${coursewareInfo.origin}?role=${(role === PLAYER_USER_TYPE.teacher || mode === 'player') ? 'teacher' : 'student'}&device=PC&usage=${usage || 'bigClass'}`}
      style={{ width: '100%', height: '100%', display: 'block', border: 'none', outline: 'none' }}
    >
    </iframe>
  );
}
Zml.propTypes = {
  coursewareInfo: PropTypes.object,
  active: PropTypes.bool
};
