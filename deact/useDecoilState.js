import {
  addEffect,
  callStackStore,
  componentStore,
  render,
  useDecoilStateStore,
} from ".";

// useDecoilState 찾기
export const getUseDecoilState = (text) => {
  // const [state, setState] = useDecoilState(2); 형태로 된 파라미터 찾기, reduce로 꺼내기
  return (
    text.match(
      new RegExp("const(.)*\\[(.)*\\](.)*=(.)*useDecoilState(.)*", "g")
    ) || []
  ).reduce((acc, cur) => {
    const [name, value] = cur
      .match(new RegExp("\\[(.)*\\]"))[0]
      .replace(/(\[|\]|\/s)/g, "")
      .split(",");
    acc.push([name, null]);
    return acc;
  }, []);
};

export function useDecoilState(atom) {
  // 훅에서 상태 찾기
  const callStack = callStackStore.get();
  const stack = callStack[callStack.length - 1];
  const id = stack[0];
  // 훅 이름 파싱함수
  const AtomName = atom.name;
  const AtomValue = atom();
  // 인덱스
  const hooks =
    useDecoilStateStore.get(AtomName) ??
    useDecoilStateStore.set(AtomName, {
      stack: [],
      init: true,
      value: AtomValue,
    });
  // setState(클로저 내의 클로저)
  const setState = (function (_value) {
    return function (value) {
      hooks.value = { ...value };
      decoilRender(AtomName);
    };
  })();
  if (hooks.init) hooks.stack.push(id);
  return [hooks.value, setState];
}

export function decoilRender(AtomName) {
  const stack = useDecoilStateStore.get(AtomName).stack;
  for (let id of stack) {
    const { props, fn } = componentStore.get(id);
    render(fn, id, true, props, null);
    addEffect();
  }
}
