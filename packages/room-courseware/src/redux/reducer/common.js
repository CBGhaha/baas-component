export default function common(type, initState) {
  return function(state = initState, action) {
    if (type === 'RESET') { // 重置state
      return initState;
    }
    // 修改state
    return action.type === type ?
      action.payload :
      state;
  };
}
