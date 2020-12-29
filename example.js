import Player from './react/index';
// import Player from './dist/main.js';
// import './dist/main.css';
// import { datapage } from './mock';
import mock from './mock';
console.log('mock:', mock);
createDemo();
function createDemo() {
  const playInstance = new Player(document.getElementById('appContent'), 'teacher');
  playInstance.on('getCoursewareList', handleGetCoursewareList);
  playInstance.on('whiteboard_data', handleWhiteboardData);
  playInstance.on('whiteboard_page', handleWhiteboardPage);
  playInstance.on('zmlLoadfail', ()=>{
    consonselect.log('zml加载失败');
  });

  playInstance.on('zmlCoursePageTotal', (page, cb)=>{
    cb({ success: true });
  });

  playInstance.render();

  function handleGetCoursewareList(data, cb) {
    cb(
      [
        { 'type': 'zmg',
          'id': '9a7e59f9-817f-4497-b5ad-1662fb9cef31',
          '$id': '9a7e59f9-817f-4497-b5ad-1662fb9cef31',
          'name': 'PDF',
          'content': 'http://172.25.152.48:8000/?role=teacher&usage=class&gameId=100&device=PC&kjType=zmg&local=true',
          'page': 0,
          'pageTotal': 1
        }
      ]
    );
    playInstance.triggleEvent('COURSE_EVENT', { page: 8, id: '9a7e59f9-817f-4497-b5ad-1662fb9cef31' });
    playInstance.triggleEvent('PALETTE_EVENT', { color: '#EF4C4F', strokeWidth: 2, type: 'brush' });

  }
  function handleWhiteboardData(data, cb) {
    cb({ success: true });
  }

  function handleWhiteboardPage(data, cb) {
    const [page, id] = data;
    cb(mock[id][page]);
    console.log('handleWhiteboardPage:', data);
  }
  // let num = 2;
  // setInterval(()=>{
  //   playInstance.triggleEvent('COURSE_EVENT', { page: num++, id: 'draftboard' });
  // }, 5000);
}

