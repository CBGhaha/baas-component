import React, { useEffect, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.less';
const preLoadImgSet = new Set();

export default function Pdf(props) {
  const { coursewareInfo, active } = props;

  return (
    <div className="other-box" style={{ width: '100%', height: '100%', border: 'none', outline: 'none' }}>
    </div>
  );
}
Pdf.propTypes = {
  coursewareInfo: PropTypes.object,
  active: PropTypes.bool
};


