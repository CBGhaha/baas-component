import React from 'react';
import PropTypes from 'prop-types';
import './index.less';
export default function Blackboard(props) {
  const { className } = props;
  return (
    <div className={`blackboard-box ${className}`}>
    </div>
  );
}

Blackboard.propTypes = {
  className: PropTypes.string
};
