import React, { useState, useRef, useEffect, useContext } from 'react';
import { preloadImageByUrl } from '../../../../utils/index.js';
import { PlayerContext, pdfHost } from '../../../../config';
import PropTypes from 'prop-types';
import './item.less';
import errImg from '../../../../assets/images/loaderror.png';

const format = '?x-oss-process=image/resize,w_261,h_147';

function OutLineItem(props) {
  const { eventControllersInstance } = useContext(PlayerContext);
  const [loading, setLoading] = useState(true);
  const $img = useRef(null);

  const { coursewareId, pageNumb, currentPage } = props;
  useEffect(() => {
    const url = `${pdfHost.OSS}/${coursewareId}/slide-${pageNumb}.png${format}`;
    preloadImageByUrl(url)
      .then(() => {
        $img.current.src = url;
      })
      .catch(e => {
        console.log('>>e', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // 换页
  function slidePage() {
    eventControllersInstance.send('QtAction', { action: 'pptSwitchPage', data: { id: coursewareId, pageNo: pageNumb } });
    // QtBridge.pptSwitchPage({ id: coursewareId, pageNo: pageNumb });
  }

  return (
    <div className={`outline-item-container ${currentPage === pageNumb ? 'outline-item-active' : ''}`} onClick={slidePage}>
      <div className="outline-item-content">
        <img ref={$img} src={errImg} className="outline-item-img" />
        {loading && (
          <div id="outline-loading-item" className="outline-item-loading">
            <svg className="outline-item-icon" id="icon-loading" viewBox="0 0 1024 1024"><path d="M164.592 786.848l56.56 56.56 147.088-147.072-56.576-56.576-147.072 147.088z m678.816-565.696l-56.56-56.56-147.088 147.072 56.56 56.576 147.088-147.088z m-678.816 0l147.088 147.088 56.56-56.56-147.088-147.088-56.56 56.56zM272 464H64v80h208v-80z m367.76 232.32l147.088 147.088 56.56-56.56-147.072-147.088-56.576 56.56zM464 944h80V736h-80v208z m272-480v80h208v-80H736zM464 272h80V64h-80v208z" fill="#565D64"></path></svg>
          </div>
        )}
      </div>
      <p className="outline-item-pageNumb">
        <span className="outline-item-pageTag">{pageNumb + 1}</span>
      </p>
    </div>
  );
}

OutLineItem.propTypes = {
  coursewareId: PropTypes.string,
  pageNumb: PropTypes.number,
  currentPage: PropTypes.number
};

export default OutLineItem;
