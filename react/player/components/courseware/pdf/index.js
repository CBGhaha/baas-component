import React, { useEffect, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingComponent } from '../../../../components/requestLoading/index';
import { PlayerContext } from '../../../../config';
import { pdfHost } from '../../../../config';
import fetchResource, { preloadImageByUrl } from '../../../../utils/fetchResource';
import './index.less';
const preLoadImgSet = new Set();

export default function Pdf(props) {
  const { pageNum } = useContext(PlayerContext);
  const [loadUrl, setLoadUrl] = useState({ class: '', src: '' });
  const [loading, setLoading] = useState(true);
  const pageNumInstance = useRef(0);
  const [currentPdfHost, setCurrentPdfHost] = useState(pdfHost.IMG);
  const timer = useRef(null);
  const { value: pageNumValue } = pageNum;
  const { coursewareInfo, active } = props;
  const { id, $id, content } = coursewareInfo;


  // 预加载
  function preload(page) {

    for (let i = page; i < Math.min(page + 5, content.length); i++) {
      const pdfSrc = `${currentPdfHost}${id}/slide-${content[i] || 0}.png`;
      if (!preLoadImgSet.has(pdfSrc)) {
        preLoadImgSet.add(pdfSrc);
        preloadImageByUrl(pdfSrc);
      }
    }
  }

  // 加载当前pdf
  async function loadPdf(bool) {
    if (active) {
      const pdfSrc = `${currentPdfHost}${id}/slide-${content[pageNumValue] || 0}.png`;
      // track.push({ eventId: track.COURSEWARE_PPT_START, eventParam: { url: pdfSrc } });
      try {
        const data = await fetchResource(pdfSrc, { timeout: 5000 });
        if (pageNumInstance.current !== pageNumValue) return;
        const res = URL.createObjectURL(data);
        const imgDom = new Image();
        imgDom.src = res;
        imgDom.onload = ()=>{
          if (pageNumInstance.current !== pageNumValue) return;
          const rateMatch = (imgDom.naturalWidth / imgDom.naturalHeight) > (16 / 9);
          const $class = rateMatch ? 'overRate' : 'inRate';
          setLoadUrl({ class: $class, src: res });
          setLoading(false);
          preload(pageNumValue + 1);
        };
        // track.push({ eventId: track.COURSEWARE_PPT_SUCCESS, eventParam: { url: res } });
      } catch (err) { // 如果加载失败 切换资源域名再次加载
        if (currentPdfHost === pdfHost.IMG) {
          setCurrentPdfHost(pdfHost.DOC);
          loadFileTrack(pdfHost.IMG);
        } else if (currentPdfHost === pdfHost.DOC) {
          setCurrentPdfHost(pdfHost.OSS);
          loadFileTrack(pdfHost.DOC);
        } else {
          setCurrentPdfHost(pdfHost.IMG);
          loadFileTrack(pdfHost.OSS);
        }
        loadPdf(bool);
      }
    }
  }

  function loadFileTrack(pdfHost) {
    // track.push({ eventId: track.PDF_LOADFAIL, eventParam: { host: pdfHost } });
  }

  useEffect(()=>{
    setLoading(true);
    pageNumInstance.current = pageNumValue;
    // 防抖
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(()=>{
      console.log('课件链路：pdf翻页：', pageNumValue);
      loadPdf();
    }, 200);
  }, [pageNumValue, active]);
  return (
    <div className="pdf-box" style={{ width: '100%', height: '100%', border: 'none', outline: 'none' }}>
      <img src={loadUrl.src} className={`pdf-${loadUrl.class}`}/>
      {active && <div className="pdf-loading" style={{ display: loading ? 'flex' : 'none' }}>
        <LoadingComponent style={{ top: '50%' }} $id={$id}/>
      </div>}
    </div>
  );
}
Pdf.propTypes = {
  coursewareInfo: PropTypes.object,
  active: PropTypes.bool
};


