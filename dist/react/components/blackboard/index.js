import React from 'react';
import PropTypes from 'prop-types';
import style from './index.less';
export default function Blackboard(props) {
  const { className } = props;
  return (
    <div className={`${style.box} ${className}`}>
    </div>
  );
}

Blackboard.propTypes = {
  className: PropTypes.string
};
