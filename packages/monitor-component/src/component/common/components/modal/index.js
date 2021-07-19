import React from 'react';
import PropsTypes from 'prop-types';
import './index.less';

export default function Modal(props) {
  const { show, conform, cancel, title, onClose, content, className, style = {}, footer } = props;
  function handleClickBg(e) {
    e.nativeEvent.stopImmediatePropagation();
    if (onClose) {
      onClose();
    }
  }
  return (
    <div className={`${'zm-modal-box'}`} onClick={handleClickBg} style={{ display: show ? 'flex' : 'none' }}>
      <div className={className} style={style || {}} onClick={(e)=>{e.stopPropagation();}}>
        <p className={'title'}>{title}</p>
        {content && <div className={'content'}>{content}</div>}
        <div className={'oprator'}>
          <button onClick={cancel.cb}>{cancel.txt}</button>
          <button onClick={conform.cb}>{conform.txt}</button>
        </div>
        {footer}
      </div>

    </div>
  );
}
Modal.propTypes = {
  show: PropsTypes.bool,
  conform: PropsTypes.object,
  cancel: PropsTypes.object,
  onClose: PropsTypes.func,
  className: PropsTypes.string,
  style: PropsTypes.object,
  title: PropsTypes.string,
  footer: PropsTypes.any,
  content: PropsTypes.any
};