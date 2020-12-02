import React from 'react';
import PropTypes from 'prop-types';

function Zmicon(props) {
  const { icon } = props;
  return (
    <svg id="zmicon" {...props} aria-hidden="tool_mous">
      <use xlinkHref={`${!!icon && icon.includes('icon') ? `#${icon}` : `#icon-${icon}`}`}></use>
    </svg>
  );
}
Zmicon.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.any
};
export default Zmicon;
