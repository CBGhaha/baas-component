export default function commonAction(type, data) {
  return {
    type,
    payload: data
  };
}
