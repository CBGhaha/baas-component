import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lessonProgress } from '../../../config';
import { connect } from 'react-redux';
import './index.less';


function CoverElements(props) {
  const [showCoverAreas, setShowCoverAreas] = useState(true);
  const { zmlCoverEleList } = props;
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
  const { lesson_progress } = window.lessonInfo;
  const inLesson = lesson_progress === lessonProgress.in;
  return (
    <div className="coverElements-box">
      {
        zmlCoverEleList.map((area, index)=><div
          tag="cover-ele"
          onClick={(e)=>inLesson && handleClickItem(e, area)}
          key={index}
          style={{ ...area, display: showCoverAreas ? 'block' : 'none' }}
          className={`coverElements-coverIte ${!inLesson ? 'coverElements-disable' : 'none'}`}>
        </div>)
      }
    </div>
  );
}
CoverElements.propTypes = {
  zmlCoverEleList: PropTypes.array
};
export default connect(
  ({ zmlCoverEleList })=>({ zmlCoverEleList }),
  ()=>({}))(CoverElements);
