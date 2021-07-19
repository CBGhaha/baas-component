import React, { useContext } from 'react';
import PropTypes, { any } from 'prop-types';
import { connect } from 'react-redux';
import Zml from './zml';
import Pdf from './pdf';
import Zmg from './zmg';
import Other from './other';
import Blackboard from '../../../common/components//blackboard';
import { PlayerContext } from '../../../common/config';
import './index.less';
const coursewares = {
  zml: Zml,
  pdf: Pdf,
  zmg: Zmg,
  draftboard: Blackboard
};

function Courseware(props) {
  const { courseware } = useContext(PlayerContext);
  const { coursewareId, coursewareList } = courseware;
  const { isZmlExaming, userInfo: { role } } = props;
  const currentWare = coursewareList.find(i => i.id === coursewareId);
  const isZml = currentWare && currentWare.type === 'zml';
  const isZmg = currentWare && currentWare.type === 'zmg';
  return (
    <div className={`zml-box ${role === ZM_USER_TYPE.student && (isZml || isZmg) && isZmlExaming ? 'zml-top' : ''}`}>
      {
        // 课件区
        coursewareList.map((item, index)=>
          <div key={index} className="zml-content" style={{ zIndex: coursewareId === item.id ? 0 : -1 }}>
            { React.createElement(coursewares[item.type] || Other, { coursewareInfo: item, active: coursewareId === item.id }, null)}
          </div>
        )
      }

    </div>
  );
}
Courseware.propTypes = {
  isZmlExaming: PropTypes.bool,
  userInfo: PropTypes.any
};

export default connect(
  ({ isZmlExaming, userInfo })=>({ isZmlExaming, userInfo }),
  ()=>({}))(Courseware);
