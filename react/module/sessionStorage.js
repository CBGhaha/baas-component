// 封装sessionstorage
function getSessionstorage(key) {
  const data = sessionStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
}
function setSessionstorage(key, value) {
  if (value === null) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
}

const zmSessionStorage = new Proxy({}, {
  get(target, key, reciver) {
    return getSessionstorage(key);
  },
  set(target, key, value, reciver) {
    setSessionstorage(key, value);
    return true;
  }
});
window.zmSessionStorage = zmSessionStorage;