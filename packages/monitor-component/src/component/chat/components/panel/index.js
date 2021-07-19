
import React, { useEffect } from 'react';
import ZmIcon from '../../../common/components/zmIcon';
import PropsTypes from 'prop-types';
import './index.less';

/**
 *
 * 聊天区浮层面板
 *
*/

export default function Panel(props) {
  const { header, children, setShow, show } = props;
  function hideShow() {
    setShow(false);
  }
  useEffect(() => {
    window.addEventListener('blur', hideShow);
    // 销毁
    return () => {
      window.removeEventListener('blur', hideShow);
    };
  }, []);
  return (
    <div className={'panel-box'} style={{ display: show ? 'flex' : 'none' }}>
      <div className={'header'}>
        {header} <ZmIcon icon="icon-icon15guanbi" className={'close'} onClick={() => setShow(false)} />
      </div>
      <div className={'list'}>
        {children}
      </div>
    </div>
  );
}

Panel.propTypes = {
  show: PropsTypes.bool,
  header: PropsTypes.any,
  children: PropsTypes.any,
  setShow: PropsTypes.func
};
