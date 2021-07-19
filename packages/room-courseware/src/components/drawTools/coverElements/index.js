import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lessonProgress } from '../../../config';
import { connect } from 'react-redux';
import './index.less';


function CoverElements(props) {
  const [showCoverAreas, setShowCoverAreas] = useState(true);
  const { zmlCoverEleList, userInfo } = props;
  useEffect(()=>{
    const handleDown = ()=>setShowCoverAreas(false);
    const handleUp = ()=>setShowCoverAreas(true);
    document.addEventListener('mousedown', (e)=>{
      if (e.target.getAttribute('tag') === 'cover-ele') {
        return;
      }
      handleDown();
    });
    document.addEventListener('mouseup', ()=>{
      handleUp();
    });
  }, []);

  function handleClickItem(e, item) {
    item.handleClick({
      x: item.x + e.nativeEvent.offsetX,
      y: item.y + e.nativeEvent.offsetY
    });
  }
  const { progress } = userInfo;
  const inLesson = progress === lessonProgress.in;
  // function handleWheel(e) {
  //   if (!isNotHold && e.deltaY !== 0) whiteBoardController.emit('teacherWheel',  { deltaY: e.deltaY > 0 ? 50 : -50 });
  // }
  return (
    <div className="coverElements-box">
      {
        zmlCoverEleList.map((area, index)=><div
          tag="cover-ele"
          onClick={(e)=>inLesson && handleClickItem(e, area)}
          key={index}
          style={{ ...area, display: showCoverAreas ? 'block' : 'none' }}
          className={`coverElements-coverItem ${!inLesson ? 'coverElements-disable' : 'none'}`}>
        </div>)
      }
    </div>
  );
}
CoverElements.propTypes = {
  zmlCoverEleList: PropTypes.array,
  userInfo: PropTypes.object
};
export default connect(
  ({ zmlCoverEleList, userInfo })=>({ zmlCoverEleList, userInfo }),
  ({ })=>({ }))(CoverElements);
