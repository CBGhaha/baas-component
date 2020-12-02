// 封装localstorage
function getLocalstorage(key) {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
}
function setLocalstorage(key, value) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

}

const zmLocalStorage = new Proxy({}, {
  get(target, key, reciver) {
    return getLocalstorage(key);
  },
  set(target, key, value, reciver) {
    setLocalstorage(key, value);
    return true;
  }
});
window.zmLocalStorage = zmLocalStorage;