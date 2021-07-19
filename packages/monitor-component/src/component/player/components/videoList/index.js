import React, { useState, useEffect, useRef, useContext } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { PlayerContext } from '../../../common/config';
import VideoListItem from './item/index';
import PropTypes from 'prop-types';
import './index.less';

function OutLine(props) {
  const { eventControllersInstance } = useContext(PlayerContext);
  const { whiteBoardController } = eventControllersInstance.controllers;
  const [unfold, setUnfold] = useState(true);
  const virtuoso = useRef(null);
  const { coursewareId, currentPage } = props;
  const [allVideoList, setAllVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState([]);
  const [active, setActive] = useState(0);

  function openPlay(index, mode) {
    const videoItem = currentVideo[index];
    if (!videoItem) {
      return;
    }
    const param = {
      mediaId: videoItem.id,
      mediaUrl: videoItem.src,
      mediaName: videoItem.name,
      mode: mode || 'manual', // 手动 manual, 自动 auto
      pageNo: currentPage,
      type: videoItem.type
    };
    eventControllersInstance.send('QtAction', { action: 'openPlayer', data: param });
    // QtBridge.openPlayer(param);
    setActive(index);
  }

  // 初始化时设置 allVideoList, currentVideo
  useEffect(() => {
    whiteBoardController.on('zml_all_video', (res) => {
      setAllVideoList(res);
    });
    return () => {
      whiteBoardController.removeAllListeners('zml_all_video');
    };
  }, []);

  useEffect(() => {
    if (allVideoList && allVideoList.length) {
      setCurrentVideo(allVideoList[currentPage]);
    }
  }, [allVideoList, currentPage]);

  useEffect(() => {
    if (virtuoso.current) {
      virtuoso.current.scrollToIndex({
        index: 0
      });
    }
    // 保证从其他 ppt 切到zml，视频列表初始化
    if (!allVideoList.length && window.zmlAllVideo) {
      setAllVideoList(window.zmlAllVideo);
    }
  }, [currentPage]);

  useEffect(()=>{
    setUnfold(true);
    setActive(0);
    eventControllersInstance.send('QtAction', { action: 'closePlayer' });
    setTimeout(()=>{
      openPlay(0, 'auto');
    }, 1000);
  }, [currentVideo]);

  return (
    currentVideo && currentVideo.length ?
      <div className='videoList-box-container'>
        <div style={{ width: unfold ? '240px' : '0px' }} className='videoList-box-content'>
          <div className='videoList-box-header'>{unfold ? '视频列表' : ''}</div>
          <Virtuoso
            ref={virtuoso}
            key={currentPage}
            className='videoList-box-scroll'
            totalCount={ currentVideo.length }
            item={index =>
              <VideoListItem video={currentVideo} coursewareId={coursewareId} pageNumb={index} active={active} setActive={(index)=>{setActive(index);}} openPlay={openPlay} />}
          />
        </div>
        <div className='videoList-box-handle' onClick={() => setUnfold(!unfold)}>
          <svg id="icon-arrowright" className={`videoList-box-arrow ${unfold ? '' : 'videoList-box-inunfold'}`} viewBox="0 0 1024 1024"><path d="M323.731 93.334c14.331 0 27.677 5.512 37.657 15.529l365.34 365.99c1.337 1.306 2.38 2.417 3.234 3.607l2.16 2.723c10.653 10.703 15.888 23.296 15.888 36.627 0 13.571-5.351 26.26-15.053 35.73l-367.853 363.953c-9.951 9.813-23.238 15.222-37.401 15.222-13.848 0-26.931-5.25-36.832-14.769-9.841-9.549-15.507-22.867-15.506-36.518 0-13.484 5.365-26.259 15.134-35.969l331.846-328.283-336.081-336.964c-9.607-9.666-14.915-22.296-14.915-35.619 0-13.958 5.673-27.055 15.937-36.876 9.768-9.271 22.734-14.381 36.444-14.381z"></path></svg>
        </div>
      </div> : null
  );
}

OutLine.propTypes = {
  coursewareId: PropTypes.string,
  currentPage: PropTypes.number
};

export default OutLine;
