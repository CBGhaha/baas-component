import React from 'react';
import rightImg from '../../../../common/assets/images/right.png';
import errorImg from '../../../../common/assets/images/error.png';
import './index.less';
import PropsTypes from 'prop-types';


export default function Switch(props) {
  const { isOpen, handleSwitch } = props;

  return (
    <div className={`${'input-switch'}`}>
      <button style={{ backgroundImage: `url(${isOpen ? rightImg : errorImg})` }} className={isOpen ? 'opened' : ''} onClick={()=>{handleSwitch(!isOpen);}}>
        <span></span>
      </button>
    </div>
  );

}
Switch.propTypes = {
  isOpen: PropsTypes.bool,
  handleSwitch: PropsTypes.any
};

