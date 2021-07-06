function queryParse(queryStr) {
  const str = queryStr.replace('?', '').split('&');
  const queryDict = {};
  str.map(item => {
    const qk = item.split('=');
    queryDict[qk[0]] = qk[1];
  });
  return queryDict;
  // TODO fromEntries chrome 73+ 以上才支持
  // qt 5.12.10 浏览器版本为 chrome 69
  // 同时 fromEntries 是es2019中提出， 当前 babel 无法转换
  // return Object.fromEntries(str.map(i=>i.split('=')));
}

function push(path, query) {
  const qurtyStr = !query ? '' : Object.entries(query).reduce((sum, arr) => `${sum}${sum !== '?' ? '&' : ''}${arr[0]}=${arr[1]}`, '?');
  window.$history.push(`${path}${qurtyStr}`);
}

export default function useRouter() {
  const query = queryParse(window.$history.location.search);
  return { ... window.$history, push, query };
}
