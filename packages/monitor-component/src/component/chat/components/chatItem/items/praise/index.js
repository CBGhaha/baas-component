import React from 'react';
import PropsTypes from 'prop-types';
import ZmIcon from '../../../../../common/components/zmIcon';
import './index.less';

export default function Praise(props) {
  const { data } = props;
  const { firstUsername, groupPraise } = data;
  function handleGetDetail() {
    data.getDetail();
  }
  return <div className={'zmchat-praise-box'}>
    {
      groupPraise ? <div className={'zmchat-group'} onClick={handleGetDetail}>
        <div className={'zmchat-other'}>
          <span>{firstUsername}</span> 等同学获得了赞
          <img src='https://web-data.zmlearn.com/image/nnKWj7q6nXPGFVGENYiAcm/dianzan.png'/>
          <ZmIcon icon="icon-arrowright" className={'zmchat-arrow'}/>
        </div>
      </div> : <div className={'zmchat-personal'}>
        <p>
          <span><i className={'zmchat-userName'}>{firstUsername}</i> 获得了赞</span>
          <img src='https://web-data.zmlearn.com/image/nnKWj7q6nXPGFVGENYiAcm/dianzan.png'/>
        </p>
      </div>
    }

  </div>;
}
Praise.propTypes = {
  data: PropsTypes.object
};