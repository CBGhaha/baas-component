
// const SOCKET_MESSAGE_OVERTIME = 10 * 1000;

// 获取对象有用的属性
export function getObjectUsefulAttribute(obj, attr) {
  return attr.reduce((a, b) => {
    a[b] = obj[b];
    return a;
  }, {});
}

