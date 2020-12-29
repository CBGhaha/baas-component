import mockSign from './sign.js';

const pageMap = {};
let current_page = 0;
let current_id = null;
mockSign.whiteboardInfos.forEach(item=>{
  if (item.data[3] === '!load-slides' && item.data[4]) {
    current_id = item.data[4][0];
    if (!pageMap[current_id]) pageMap[current_id] = {};
  }
  if (item.data[3] === '!switch-slide' && item.data[4]) {
    current_page = item.data[4][0];
    if (pageMap[current_id] && !pageMap[current_id][current_page]) {
      pageMap[current_id][current_page] = [];
    }
  }
  if (item.data[2] > -1) {
    if (!(pageMap[current_id] && pageMap[current_id][current_page])) return;
    const arr = pageMap[current_id][current_page];
    if (arr.length > 0) {
      const ds = item.ts - arr[arr.length - 1]['ts'];
      if (ds < 0) {
        alert('乱序：', ds);
      }
      console.log('ds:', ds);
    }


    pageMap[current_id][current_page].push(item);

  }
});
console.log('pageMap:', pageMap);
export default pageMap;
