import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropsTypes from 'prop-types';
import './index.less';


export function LoadingComponent(props) {
  const { $id, style } = props;
  useEffect(()=>{
    // setTimeout(()=>{
    // svgaPlayer($id, loadingSvga);
    // // }, 500);

  }, []);
  return <div className="requestLoading-box" style={style || {}}>
    <div id={$id}></div>
    加载中...
  </div>;
}
LoadingComponent.propTypes = {
  $id: PropsTypes.any,
  style: PropsTypes.object
};
export default function loading(content) {
  const elId = `loading-${new Date().getTime()}`;
  const loadingDiv = document.createElement('div');
  loadingDiv.id = elId;
  document.body.appendChild(loadingDiv);
  ReactDOM.render(
    <LoadingComponent content={content} $id={`${elId}-svga`}/>,
    loadingDiv
  );

  return ()=>{
    document.body.removeChild(loadingDiv);
  };
}