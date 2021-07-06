import axios from 'axios';

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

export default async function fetchResource(url, config) {
  const defaultConfig = {
    responseType: 'blob',
    cancelToken: source.token
  };
  const { data } = await axios.get(url, { ... defaultConfig, ... config });
  return data;
}

export function preloadImageByUrl(url) {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    console.log(url, 'image ready');
  };
}
/**
 * 检测dom元素是否存在
 * @param selectors
 * @param attrKey
 * @param attrValue
 */
export function domElementExist(selectors, attrKey, attrValue) {
  const elements$ = document.querySelectorAll(selectors);
  if (!elements$) {
    return false;
  }
  if (elements$) {
    const eleArr$ = Array.from(elements$);
    return eleArr$.findIndex((ele$) => ele$[attrKey] === attrValue) > -1;
  }
  return false;
}
/*
* 动态加载script
*/
export function fetchScript(src, async = false) {
  const isExist = domElementExist('script', 'src', src);
  if (isExist) return;
  const body$ = document.querySelector('body');
  const newScript$ = document.createElement('script');
  newScript$.src = src;
  newScript$.async = async;
  if (body$) {
    body$.appendChild(newScript$);
  }
}

/**
* 动态加载link标签, 用于动态加载样式表
* @param href
* @param rel
*/
export function fetchStyle(href, rel = 'stylesheet') {
  const isExist = domElementExist('link', 'href', href);
  if (isExist) return;
  const body$ = document.querySelector('head');
  const newLink$ = document.createElement('link');
  newLink$.rel = rel;
  newLink$.href = href;
  if (body$) {
    body$.appendChild(newLink$);
  }
}
export function prefetch(href, type, as) {
  const isExist = domElementExist('link', 'href', href);
  if (isExist) return;
  const head$ = document.querySelector('head');
  const newLink$ = document.createElement('link');
  type && (newLink$.rel = type);
  as && (newLink$.as = as);
  newLink$.href = href;
  if (head$) {
    head$.appendChild(newLink$);
  }
}
