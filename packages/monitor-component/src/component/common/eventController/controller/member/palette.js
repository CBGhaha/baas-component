/*
 * 课件白板答题信令
 */
import SocketController from '../controller';
import commonAction from '../../../../common/redux/actions/common';

export const PALETTE_CONTROLLER = 'paletteController';

const shapMap = () => {
  const resultMap = {};
  ['ellipse', 'rectangle', 'triangle', 'circle_edit', 'ellipse_edit'].forEach(type => {
    resultMap[type] = (data) => {
      return {
        kind: { action: data.type, cursorIcon: 'shapecursor' },
        style: { strokeWidth: data.strokeWidth, stroke: data.color, fill: data.color, isFill: data.fill },
        mark: data.mark
      };
    };
  });
  return resultMap;
};
const lineMap = () => {
  const resultMap = {};
  ['line', 'linearrow', 'linedash', 'line_edit', 'linearrow_edit', 'linedash_edit'].forEach(type => {
    resultMap[type] = (data) => {
      return {
        kind: { action: data.type, cursorIcon: 'line_editcursor' },
        style: { strokeWidth: data.strokeWidth, stroke: data.color },
        mark: data.mark
      };
    };
  });
  return resultMap;
};
const deleteMap = () => {
  const resultMap = {};
  ['eraserrectangle', 'deleteSelectData', 'deletePageData'].forEach(type => {
    resultMap[type] = (data) => {
      return {
        kind: { action: data.type, cursorIcon: null },
        style: {}
      };
    };
  });
  return resultMap;
};

const toolDataMap = {
  point: (data) => {
    return {
      kind: { action: data.type, cursorIcon: null },
      style: {},
      mark: false
    };
  },
  select_shape: (data) => {
    return {
      kind: { action: data.type, cursorIcon: 'select_shapecursor' },
      style: {},
      mark: false
    };
  },
  brush: (data) => {
    return {
      kind: { action: data.type, cursorIcon: `pencursor-${data.color.replace('#', '')}` },
      style: { strokeWidth: data.strokeWidth, stroke: data.color },
      mark: false
    };
  },
  eraser: (data) => {
    return {
      kind: { action: data.type, cursorIcon: 'erasercursor' },
      style: { strokeWidth: data.radius },
      mark: false
    };
  },
  polygon_edit: (data) => {
    return {
      kind: { action: data.type, cursorIcon: 'polygon_editcursor' },
      style: { strokeWidth: data.strokeWidth, stroke: data.color },
      mark: data.mark
    };
  },
  ...shapMap(),
  ...lineMap(),
  coord_sys: (data) => {
    return {
      kind: { action: data.type, cursorIcon: 'coord_syscursor' },
      style: { strokeWidth: data.strokeWidth, stroke: data.color },
      mark: false
    };
  },
  text_edit: (data) => {
    return {
      kind: { action: data.type, cursorIcon: 'text_editcursor' },
      style: { fontSize: data.strokeWidth, stroke: data.color },
      mark: data.isMark
    };
  },
  ...deleteMap()
};

// 接受消息action
const acceptAction = {
  //  监听课件 答题交互
  PALETTE_EVENT(controller, data) {
    const nData = toolDataMap[data.type](data);
    return nData;
  },
  // 监听答题结果
  // 监听课件切换信息
  COURSE_EVENT(controller, data) {
    console.log('initCourseware', data);
    controller.parent.$store.dispatch(commonAction('initCourseware', data));
    return data;
  }
};

// 发送消息action
const sendAction = {
};
const paletteController = new SocketController(PALETTE_CONTROLLER, acceptAction, sendAction);
export default paletteController;
