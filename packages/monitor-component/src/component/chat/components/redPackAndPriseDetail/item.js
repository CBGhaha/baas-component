import React from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.less';

function Item(props) {
  const { data, type, activeTutor, userInfo: { role } } = props;
  const isUnknow = role === ZM_USER_TYPE.tutor && +data.tutorId !== +activeTutor.userId;
  return <div className={'redPackAndPriseDetail-item'}>
    <img src={isUnknow ? 'https://web-data.zmlearn.com/image/k5dqL8UYzDXvJgtB47Y3zz/unknow-icon.png' : data.avatar}/>
    <span>{isUnknow ? '匿名学生' : data.name}</span>
    <span className={'num'}>
      <img src={type === 'redPackage' ? 'https://web-data.zmlearn.com/image/hvNL5wrYcmFFJoECHK8wdh/gold.png' : 'https://web-data.zmlearn.com/image/nnKWj7q6nXPGFVGENYiAcm/dianzan.png'}/>
      +{data.coinAmount || 1}
    </span>
  </div>;
}
Item.propTypes = {
  data: PropsTypes.object,
  type: PropsTypes.string,
  activeTutor: PropsTypes.object,
  userInfo: PropsTypes.object
};
export default connect(
  ({ activeTutor, userInfo })=>({ activeTutor, userInfo }),
  ()=>({}))(Item);