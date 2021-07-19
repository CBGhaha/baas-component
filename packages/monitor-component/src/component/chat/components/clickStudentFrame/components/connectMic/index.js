import React from 'react';
import './index.less';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';

function ConnectMic(props) {
  const { instance, onMicStudents, onTableStudents } = props;
  const { userId } = instance;
  const onTable = onTableStudents.has(userId);
  const isOnMic = onMicStudents.has(userId);

  async function changeStatus(bool) {
    bool ? instance.micConnect() : instance.micClose();
  }

  return (
    <span className={'connectMic-kind'} disable={+onTable} onClick={()=>{!onTable && changeStatus(!isOnMic);}}>{isOnMic ? '下麦' : '上麦' }</span>
  );

}
ConnectMic.propTypes = {
  instance: PropsTypes.any,
  onTableStudents: PropsTypes.any,
  onMicStudents: PropsTypes.any
};

export default connect(
  ({ onMicStudents, onTableStudents })=>({ onMicStudents, onTableStudents }),
  ()=>({

  }))(ConnectMic);
