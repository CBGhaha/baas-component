import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './item.less';


export default function VideoListItem(props) {
  const { video, pageNumb, openPlay, active } = props;
  const videItem = video[pageNumb];

  const iconMap = {
    audio: 'https://web-data.zmlearn.com/image/vfNiNkb1Hb2mVqHnsKj2Cn/mp3.png',
    video: 'https://web-data.zmlearn.com/image/fm9n92FAyBJ4RzjL4bSyQm/mp4.png'
  };

  return (
    <div className={`videoList-container ${active === pageNumb ? 'videoList-active' : ''}`} onClick={() => openPlay(pageNumb)}>
      <img src={iconMap[videItem.type]} />
      <span className='videoList-videolistitem' title={videItem.name}>{videItem.name}</span>
    </div>
  );
}

VideoListItem.propTypes = {
  coursewareId: PropTypes.string,
  pageNumb: PropTypes.number,
  currentPage: PropTypes.number,
  active: PropTypes.number,
  setActive: PropTypes.func,
  openUnfold: PropTypes.func,
  video: PropTypes.array,
  openPlay: PropTypes.func
};