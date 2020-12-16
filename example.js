import Player from './react/index';
// import Player from './dist/main.js';
// import './dist/main.css';
import { datapage } from './mock';

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
          'id': 'zmg-1',
          '$id': 'zmg-1',
          'name': 'PDF',
          'content': 'http://172.25.152.48:8000/?role=teacher&usage=class&gameId=100&device=PC&kjType=zmg&local=true',
          'page': 0,
          'pageTotal': 1
        }
      ]
    );
    playInstance.triggleEvent('COURSE_EVENT', { page: 1, id: 'zmg-1' });
    playInstance.triggleEvent('PALETTE_EVENT', { color: '#EF4C4F', strokeWidth: 2, type: 'brush' });

  }
  function handleWhiteboardData(data, cb) {
    cb({ success: true });
  }

  function handleWhiteboardPage(data, cb) {
    cb(datapage);
  }
  // let num = 2;
  // setInterval(()=>{
  //   playInstance.triggleEvent('COURSE_EVENT', { page: num++, id: 'draftboard' });
  // }, 5000);
}

