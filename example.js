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
        { 'type': 'pdf',
          'id': '36d44251-f048-42fd-b803-6415403301da',
          '$id': 4747,
          'name': 'PDF',
          'content': [0],
          'page': 0, 'pageTotal': 1
        },
        { 'type': 'zml',
          'id': '867',
          'name': 'ZML',
          'origin': 'https://zml-test.zmlearn.com/',
          'content': 'https://image.zmlearn.com/lecture/test/zml/courseware_867_2.json#867.3',
          'page': 0,
          'pageTotal': 0
        },
        {
          'type': 'draftboard',
          'id': 'draftboard',
          'name': '黑板',
          'page': 0,
          'pageTotal': 100
        }
      ]
    );
    playInstance.triggleEvent('COURSE_EVENT', { page: 1, id: 'draftboard' });
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

