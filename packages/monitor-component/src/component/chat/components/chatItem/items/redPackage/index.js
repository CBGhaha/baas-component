import React from 'react';
import './index.less';
import PropsTypes from 'prop-types';
import ZmIcon from '../../../../../common/components/zmIcon';
import img_xiaojinbi from '../../../../../common/assets/images/xiaojinbi.png';

export default function RedPackage(props) {
  const { data } = props;
  const { redPacketSubject, firstUsername, awardUserInfos, coinAmount, supplyRoleName } = data;
  function handleGetDetail() {
    data.getDetail();
  }
  return (
    <div className={'redPackage-box'}>
      {redPacketSubject === 'SPECIFY_USER' ? (
        <div className={'specify'}>
          <p>
            <span className={'repack'}>老师给</span>
            <span className={'name'}> {firstUsername || (awardUserInfos || []).map(item => item.name).join('、')}</span>
            <span className={'repack'}> 发了个红包</span>
            <img className={'img'} src={img_xiaojinbi} alt="" />
            <span className={'coin'}>+{coinAmount}</span>
          </p>
        </div>
      ) : (
        <div className={'whole'} onClick={handleGetDetail}>
          <p className={'conent'}>
            <span className={'name'}>{redPacketSubject === 'WHOLE' ? supplyRoleName : '老师给他们'}发了一个红包</span>
            <img className={'img'} src="https://web-data.zmlearn.com/image/bi7Y98mmrBUwaEJGaMXeep/xiaohongbao.png" alt="" />
            <ZmIcon icon="icon-arrowright" className={'arrow'} />
          </p>
        </div>
      )}
    </div>
  );
}
RedPackage.propTypes = {
  data: PropsTypes.object
};
