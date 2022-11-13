import { callStackStore } from ".";

export const getRegex = (tag, text) => {
  return text.match(new RegExp(tag, "g")) || [];
};
// 태그 찾기
export function getTag(text) {
  return (text.match(new RegExp("[A-Z]([a-zA-Z])*", "g")) || [""])[0];
}
export const isTag = (text) => {
  return getRegex(`<([a-zA-Z-0-9:s+>`, text);
};

export const isOuter = (text) => {
  const Tag = "[a-zA-Z-0-9:s]";
  return getRegex(`<(${Tag})+>.*?</(${Tag})+>`, text);
};
// uuid 생성함수
export const getID = () => {
  return "xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const getIdInStack = () => {
  // 훅에서 상태 찾기
  const callStack = callStackStore.get();
  const stack = callStack[callStack.length - 1];
  return stack[0];
};
