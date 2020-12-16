import store from '../redux/store';
import { lessonProgress } from '../config';

/**
 * 加载图片
 * @param  {string} url 图片链接地址
 */
export function preloadImageByUrl(url) {
  return new Promise((res, rej) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      console.log(url, 'image ready');
      res(true);
    };
    image.onerror = (e) => {
      rej(e);
    };
  });
}

export function getTime(dis) {
  const s = `${dis % 60}`.padStart(2, 0);
  const min = `${Math.floor((dis % (60 * 60)) / 60)}`.padStart(2, 0);
  const hour = `${Math.floor((dis / (60 * 60)))}`.padStart(2, 0);
  return `${hour}:${min}:${s}`;

}

export function calZmlScope() {
  const CONTENT_RATE = 16 / 9;
  const contentBox = document.getElementById('courseware-player');
  let width = contentBox.offsetWidth;
  let height = contentBox.offsetHeight;
  const currentRate = width / height;
  if (currentRate > CONTENT_RATE) {
    width = height * CONTENT_RATE;
  } else {
    height = width / CONTENT_RATE;
  }
  return { width, height };
}

export function isAudience() {
  const { userInfo: { role, progress } } = store.getState();
  return (role === USER_TYPE.student) || (role === USER_TYPE.tutor && progress === lessonProgress.in);
  return true;
}