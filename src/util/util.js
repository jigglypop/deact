export function getRegex(tag, text) {
  return text.match(new RegExp(tag, "g")) || [];
}

// 인자 찾기
export function getParams(text) {
  const datas = getRegex(':.*?=".*?"', text);
  let _datas = {};
  datas.map((item) => {
    const [name, value] = item.replace(/(\"|:)/g, "").split("=");
    _datas[name] = value;
  });
  return _datas;
}
// 함수 찾기
export function getFunctions(text) {
  const datas = getRegex('@.*?=".*?"', text);
  let _datas = {};
  datas.map((item) => {
    const [name, value] = item.replace(/(\"|@)/g, "").split("=");
    _datas[name] = value;
  });
  return _datas;
}
// 컴포넌트 가져오기
export function getComponent(text) {
  return getRegex("(<[A-Z].*/>)", text);
}
// 태그 판정
export function isTag(text) {
  return getRegex(`<([a-zA-Z-0-9:s])+>`, text);
}
// 아우터 판정
export function isOuter(text) {
  const Tag = "[a-zA-Z-0-9:s]";
  return getRegex(`<(${Tag})+>.*?</(${Tag})+>`, text);
}
// 태그 찾기
export function getTag(text) {
  return (text.match(new RegExp("[A-Z]([a-zA-Z])*", "g")) || [""])[0];
}
// 캐시
export const cache = {
  get(key) {
    const result = localStorage.getItem(key);
    if (result) {
      const data = JSON.parse(result);
      return data;
    } else {
      return null;
    }
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

// uuid 생성함수
export function getID() {
  return "xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
