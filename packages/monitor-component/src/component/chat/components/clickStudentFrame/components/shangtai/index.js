import React from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';

function Shangtai(props) {
  const { instance, onTableStudents } = props;
  const { userId } = instance;
  const onTable = onTableStudents.has(userId);
  // 处理禁言
  async function changeStatus(bool) {
    bool ? instance.tableUp() : instance.tableDown();
  }
  return (
    <span className={'shangtai-kind'} onClick={()=>{changeStatus(!onTable);}}>{onTable ? '下台' : '上台' }</span>
  );

}
Shangtai.propTypes = {
  instance: PropsTypes.any,
  onTableStudents: PropsTypes.any
};

export default connect(
  ({ onTableStudents })=>({ onTableStudents }),
  ()=>({

  }))(Shangtai);