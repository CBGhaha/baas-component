import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ZmIcon from '../../../../common/components/zmIcon';
import track from '../../../../common/utils/track';
import './index.less';


function ScreenShotBtn(props) {
  const [prscrnCheckShow, setPrscrnCheckShow] = useState(false);
  const [prscrnCheckVal, setPrscrnCheckVal] = useState(false);


  const { handlepPrscrn } = props;

  // enter发送


  // 截图上隐藏窗口
  function prscrnCheckChange(e) {
    setPrscrnCheckVal(e.target.checked);
    setPrscrnCheckShow(false);
  }

  useEffect(() => {
    function hideTarget() {
      setPrscrnCheckShow(false);
    }
    window.addEventListener('blur', hideTarget);
    return () => {
      window.removeEventListener('blur', hideTarget);
    };
  }, []);


  return (<div className={'screen-prscrn'}>
    <ZmIcon icon='icon-icon_jietu' onClick={() => {handlepPrscrn(prscrnCheckVal);}} className={'icon'}/>
    <ZmIcon icon="icon-arrowdown" onClick={(e) => {e.nativeEvent.stopImmediatePropagation();setPrscrnCheckShow(!prscrnCheckShow);}} className={'arow'}/>
    <div className={`${'pop'} ${'pop2'}`}>屏幕截图</div>
    {prscrnCheckShow && (
      <div className={'checkWrap'} onClick={(e)=>{e.nativeEvent.stopImmediatePropagation();}}>
        <label className={'label'}>
          <input type="checkbox" className={'checkbox'} checked={prscrnCheckVal} onChange={prscrnCheckChange} />
                  截图时隐藏教室界面
        </label>
      </div>
    )}
  </div>
  );
}

ScreenShotBtn.propTypes = {
  handlepPrscrn: PropTypes.func
};
export default ScreenShotBtn;
