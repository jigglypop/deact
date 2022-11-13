import { callStackStore, useEffectStore, useStateStore } from ".";

// useEffect 찾기
export const getUseEffect = (text) => {
  // useEffect(f, []) 형태로 된 파라미터 찾기, reduce로 꺼내기
  const _text = text.split("\n").join("").replace(/ /g, "");
  return (_text.match(new RegExp("useEffect\\((.+)\\[(.)*\\]\\)", "g")) || [])
    .reduce((acc, cur) => {
      const value = cur
        .match(new RegExp("\\[(.)*\\]"))[0]
        .replace(/(\[|\]|\/s)/g, "")
        .split(",");
      acc.push(value[0]);
      return acc;
    }, [])
    .filter((item) => {
      return item !== "";
    });
};

export function useEffect(f, value) {
  // 함수 아이디 가져오기
  const callStack = callStackStore.get();
  const stack = callStack[callStack.length - 1];
  const id = stack[0];
  // 파싱 가져오기
  const hooksArr = getUseEffect(stack[1].toString());
  // 바뀌었으면 콜백 함수 글로벌에 push (렌더링 이후에 실행하기 위함)
  useEffectStore.set(id, goUseEffect.bind({ id, f, value, hooksArr }));
}

export function goUseEffect() {
  const { id, value, f, hooksArr } = this;
  const hooks = useStateStore.get(id);
  const _hooks = {};
  for (let i = 0; i < hooksArr.length; i++) {
    _hooks[hooksArr[i]] = value[i];
  }
  let changed = true;
  // value에서 변한 것이 있는지 찾음
  if (hooksArr.length !== 0)
    changed = hooksArr.some((name) => hooks[name] !== _hooks[name]);
  if (changed) f();
}
