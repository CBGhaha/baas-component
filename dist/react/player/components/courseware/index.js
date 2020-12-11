import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../../../redux/store';
import Zml from './zml';
import Pdf from './pdf';
import Blackboard from '../../../components//blackboard';
import { PlayerContext } from '../../../config';
import './index.less';
const coursewares = {
  zml: Zml,
  pdf: Pdf,
  draftboard: Blackboard
};

function Courseware(props) {
  const { courseware } = useContext(PlayerContext);
  const { coursewareId, coursewareList } = courseware;

  const { userInfo: { role } } = store.getState();
  const { isZmlExaming } = props;
  const currentWare = coursewareList.find(i => i.id === coursewareId);
  const isZml = currentWare && currentWare.type === 'zml';
  return (
    <div className={`zml-box ${role === USER_TYPE.student && isZml && isZmlExaming ? 'zml-top' : ''}`}>
      {
        // 课件区
        coursewareList.map((item, index)=>
          <div key={index} className="zml-content" style={{ zIndex: coursewareId === item.id ? 0 : -1 }}>
            { React.createElement(coursewares[item.type], { coursewareInfo: item, active: coursewareId === item.id }, null)}
          </div>
        )
      }

    </div>
  );
}
Courseware.propTypes = {
  isZmlExaming: PropTypes.bool
};

export default connect(
  ({ isZmlExaming })=>({ isZmlExaming }),
  ()=>({}))(Courseware);
