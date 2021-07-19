const track = {
  push(controllerInstance, parmas) {
    console.log('发送了埋点:', parmas);
    controllerInstance.send('track', parmas);
  }
};
export default track;