import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import PropsTypes from 'prop-types';

function ToastComponent(props) {
  const { content } = props;
  return <div className={'zm-toast-box'}>
    {content}
  </div>;
}
ToastComponent.propTypes = {
  content: PropsTypes.string,
  second: PropsTypes.number
};

export default function toast(content, second = 2000) {
  let toastDiv = document.getElementById('toast');
  if (!toastDiv) {
    toastDiv = document.createElement('div');
    toastDiv.id = 'toast';
    document.body.appendChild(toastDiv);
  }
  setTimeout(()=>{
    let toastDiv = document.getElementById('toast');
    toastDiv && document.body.removeChild(toastDiv);
  }, second);
  ReactDOM.render(
    <ToastComponent content={content}/>,
    toastDiv
  );
}