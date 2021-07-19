import React from 'react';
import ZmIcon from '../../../../common/components/zmIcon';
import './index.less';


function ScreenShotBtn() {
  return (<div className={'forbid-prscrn'}>
    <ZmIcon icon='icon-icon_jietu' className={'icon'}/>
    <ZmIcon icon="icon-arrowdown" className={'arow'}/>
  </div>
  );
}
export default ScreenShotBtn;
