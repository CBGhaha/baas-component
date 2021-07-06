import React from 'react';

export const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKzqjw/P0Vy8CSvRkBpEadYwwYPl8Mk7uOe3IulybIIqVlnsdUJcj3uaYTbXFzk5CSAdvJ9i0MN6mAMYqdTvVEUCAwEAAQ==';
export const APP_ID = '11783';

export const coursewareTypeMap = {
  zml: 'zml',
  pdf: 'pdf',
  draftboard: 'draftboard'
};
export const pdfHost = {
  IMG: 'https://image.zmlearn.com/',
  DOC: 'https://doc.zmlearn.com/',
  OSS: 'https://zm-chat-slides.oss-cn-hangzhou.aliyuncs.com/'
};
export const lessonProgress = {
  pre: 'PRE_LESSON',
  in: 'IN_LESSON',
  after: 'AFTER_LESSON',
  close: 'CLOSE_LESSON'
};
export const lessonStage = {
  started: 'LESSON_STARTED',
  notStart: 'LESSON_NOT_START'
};

export const PlayerContext = React.createContext();
