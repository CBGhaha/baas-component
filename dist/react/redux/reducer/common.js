export default function common(type, initState) {
  return function(state = initState, action) {
    return action.type === type ?
      action.payload :
      state;
  };
}
