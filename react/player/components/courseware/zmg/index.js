import React, { useEffect, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ZmgInstance from './zmgInstance';
import useEventController from '../../../../hooks/useEventController';
import { PlayerContext } from '../../../../config';
import store from '../../../../redux/store';

export default function Zmg(props) {
  const { userInfo: { role } } = store.getState();
  const { pageNum, courseware, eventControllersInstance } = useContext(PlayerContext);
  const zmgInstance = useRef();
  const [contentUrl, setContentUrl] = useState();
  const { whiteBoardController } = eventControllersInstance.controllers;
  const { setCoursewareList, coursewareList } = courseware;
  const { value: pageNumValue } = pageNum;
  const { active, coursewareInfo } = props;


  useEventController(eventControllersInstance, 'zmgLocalhost', handleZmgLocalhost);


  useEffect(()=>{
    zmgInstance.current = new ZmgInstance(handleIframeMsg, eventControllersInstance);
    return ()=>{
      zmgInstance.current.destroyed();
    };
  }, []);

  function handleZmgLocalhost(res) {
    console.log('handleZmgLocalhost:', res);
    setContentUrl(res.data);
    // zmgInstance.current.destroyed();
    // zmgInstance.current = new ZmgInstance(handleIframeMsg, eventControllersInstance);
  }
  function handleIframeMsg() {

  }

  return (
    <iframe
      id="zmg-iframe"
      className="zmgIframe"
      src={contentUrl || coursewareInfo.content}
      style={{ width: '100%', height: '100%', display: 'block', border: 'none', outline: 'none' }}
    >
    </iframe>
  );
}
Zmg.propTypes = {
  coursewareInfo: PropTypes.object,
  active: PropTypes.bool
};
