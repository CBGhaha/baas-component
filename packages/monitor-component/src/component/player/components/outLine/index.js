import React, { useState, useEffect, useRef, useContext } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { PlayerContext } from '../../../common/config';
import OutLineItem from './item/item';
import PropTypes from 'prop-types';
import './index.less';


function OutLine(props) {
  const [unfold, setUnfold] = useState(false);
  const virtuoso = useRef(null);
  const { coursewareId, pageTotal, currentPage, active } = props;
  const { eventControllersInstance } = useContext(PlayerContext);

  useEffect(() => {
    if (!active) return;
    virtuoso.current.scrollToIndex({
      index: currentPage
    });
  }, [coursewareId, currentPage, active]);

  const changeUnfold = (unfold)=>{
    setUnfold(!unfold);
    eventControllersInstance.send('playerTrackEvent', { eventId: unfold ? 'CLASSROOM_OUTLINE_OFF' : 'CLASSROOM_OUTLINE_ON' });
  };


  return (
    <div className="outline-container">
      <div style={{ width: unfold ? '308px' : '0px' }} className="outline-content">
        <div className="outline-header">{unfold ? '课程大纲' : ''}</div>
        {active && <Virtuoso
          ref={virtuoso}
          className="outline-scroll"
          totalCount={pageTotal}
          item={index => <OutLineItem key={`${coursewareId + index}`} coursewareId={coursewareId} pageNumb={index} currentPage={currentPage} />}
        />}
      </div>
      <div className="outline-handle" onClick={() => changeUnfold(unfold)}>
        <svg id="icon-arrowright" className={`outline-arrow ${unfold ? '' : 'outline-inunfold'}`} viewBox="0 0 1024 1024"><path d="M323.731 93.334c14.331 0 27.677 5.512 37.657 15.529l365.34 365.99c1.337 1.306 2.38 2.417 3.234 3.607l2.16 2.723c10.653 10.703 15.888 23.296 15.888 36.627 0 13.571-5.351 26.26-15.053 35.73l-367.853 363.953c-9.951 9.813-23.238 15.222-37.401 15.222-13.848 0-26.931-5.25-36.832-14.769-9.841-9.549-15.507-22.867-15.506-36.518 0-13.484 5.365-26.259 15.134-35.969l331.846-328.283-336.081-336.964c-9.607-9.666-14.915-22.296-14.915-35.619 0-13.958 5.673-27.055 15.937-36.876 9.768-9.271 22.734-14.381 36.444-14.381z"></path></svg>
      </div>
    </div>
  );
}

OutLine.propTypes = {
  coursewareId: PropTypes.string,
  pageTotal: PropTypes.number,
  currentPage: PropTypes.number,
  active: PropTypes.bool
};

export default OutLine;
