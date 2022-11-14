import {
  addEffect,
  callStackStore,
  componentStore,
  render,
  useStateStore,
} from ".";

// useState 찾기
export const getUseState = (text) => {
  // const [state, setState] = useState(2); 형태로 된 파라미터 찾기, reduce로 꺼내기
  return (
    text.match(new RegExp("const(.)*\\[(.)*\\](.)*=(.)*useState(.)*", "g")) ||
    []
  ).reduce((acc, cur) => {
    const [name, value] = cur
      .match(new RegExp("\\[(.)*\\]"))[0]
      .replace(/(\[|\]|\/s)/g, "")
      .split(",");
    acc.push([name, null]);
    return acc;
  }, []);
};

export function useState(initState) {
  // 훅에서 상태 찾기
  const callStack = callStackStore.get();
  const stack = callStack[callStack.length - 1];
  const id = stack[0];
  let i = stack[2].length;
  // 훅 이름 파싱함수
  const hooksArr = getUseState(stack[1].toString());
  const hookName = hooksArr[i][0];
  // 인덱스
  const hooks =
    useStateStore.get(id) ??
    useStateStore.set(
      id,
      hooksArr.reduce((acc, cur) => {
        return { ...acc, [cur[0]]: null };
      }, {})
    );
  hooks[hookName] = hooks[hookName] || initState;
  // setState(클로저 내의 클로저)
  const setState = (function (_value) {
    const _hookName = hookName;
    return function (value) {
      hooks[_hookName] = value;
      const { props } = componentStore.get(id);
      render(stack[1], id, true, props, null);
      addEffect();
    };
  })();
  stack[2].push(i);
  return [hooks[hookName], setState];
}
