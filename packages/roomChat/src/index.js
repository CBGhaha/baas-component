// import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import style from './index.less';

export default function renderAPP(element, dom, cb) {
  ReactDOM.render(
    <div id="courseware-player" className={style.box} style={{ width: '100%', height: '100%' }}>
      {element}
    </div>,
    dom,
    ()=>{cb && cb();}
  );
}

// export function aaa() {
//   React.createElement();
//   ReactDOM.render();
//   console.log('style', style);
// }