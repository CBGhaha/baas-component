import React, { useEffect } from 'react';
// import { preloadImageByUrl } from '@/utils/index.js';
// import { pdfHost } from '@/config';
import PropTypes from 'prop-types';
// import ZmIcon from 'components/zmIcon';
import style from './item.less';
// import errImg from '@/assets/images/loaderror.png';

// const format = '?x-oss-process=image/resize,h_90,w_160';

export default function VideoListItem(props) {
  const { video, pageNumb, openPlay, active } = props;
  const videItem = video[pageNumb];

  const iconMap = {
    audio: 'https://web-data.zmlearn.com/image/vfNiNkb1Hb2mVqHnsKj2Cn/mp3.png',
    video: 'https://web-data.zmlearn.com/image/fm9n92FAyBJ4RzjL4bSyQm/mp4.png'
  };

  return (
    <div className={`${style.container} ${active === pageNumb ? style.active : ''}`} onClick={() => openPlay(pageNumb)}>
      <img src={iconMap[videItem.type]} />
      <span className={style.videolistitem} title={videItem.name}>{videItem.name}</span>
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