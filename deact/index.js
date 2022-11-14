import { getID, getRegex, getTag } from "./util.js";
import { App } from "../src/index.js";
import { StackStore, Store } from "./store.js";

// 아이디 찾기
export const findId = (jsx) => {
  // id="" 형태로 된 파라미터 찾기
  return jsx.match(new RegExp("id=([a-z0-9])*", "g"))[0];
};
// 아이디 바꾸기
export const changeId = (jsx, originalId) => {
  return jsx.replace(findId(jsx), 'id="' + originalId + '" ');
};

// 인자 찾기
export const getParams = (text) => {
  // on="" 형태로 된 파라미터 찾기, reduce로 꺼내기임
  return (text.match(new RegExp('\\s.*?=".*?"', "g")) || []).reduce(
    (acc, cur) => {
      const [name, value] = cur.replace(/(\s|\"|:)/g, "").split("=");
      return { ...acc, [name]: value };
    },
    {}
  );
};
// 컴포넌트 인지
export const getComponent = (text) => {
  // <.*/> 형태로 된 컴포넌트 찾고 params와 함께 세팅
  return (text.match(new RegExp("(<.*/>)", "g")) || []).reduce((acc, jsx) => {
    return [
      ...acc,
      {
        jsx: jsx,
        id: getID(),
        params: getParams(jsx),
      },
    ];
  }, []);
};
export function getJsx(fn, id, props, cbs) {
  let args = {};
  if (props) args = { ...args, ...props };
  if (cbs) args = { ...args, ...cbs };
  const f = fn(args);
  let jsx = f.jsx;
  const sementic = getRegex("<([a-z])*", jsx)[0];
  jsx = jsx.replace(
    sementic,
    sementic + " id=" + id + " " + " name=" + id + " "
  );
  return { jsx, originalId: f.id };
}

// 렌더링
export function render(fn, id, isTop, props, cbs) {
  // id, fn, useState 스택, decoil 스택
  callStackStore.set([id, fn, [], []]);
  // 함수 실행
  let { jsx, originalId } = getJsx(fn, id, props, cbs);
  // 아이디 갈아끼우기
  jsx = changeId(jsx, originalId);
  const components = componentStore.get(id)
    ? componentStore.get(id).components
    : getComponent(jsx);
  useStateStackStore.set(id);
  // 컴포넌트 요소가 있는지 찾은 다음 트리 순회
  components.forEach(({ jsx: j, id: _id }) => {
    const { fn: _fn } = fnStore.get(j.match(/[A-Z]([a-z])*/)[0]);
    const { jsx: _jsx } = render(_fn, _id, false, getParams(j), null);
    jsx = jsx.replace(j, _jsx);
  });
  // 자식요소 세팅
  componentStore.set(id, {
    jsx,
    id,
    fn,
    originalId,
    props: props,
    components: components,
  });
  // 렌더링
  if (isTop) {
    document.getElementsByName(id)[0].innerHTML = jsx;
    const [$Top, $New] = document.getElementsByName(id);
    $Top.parentNode.replaceChild($New, $Top);
  }
  return { jsx, id };
}

// fn 함수에 이름 등록
export function register(arg) {
  arg.forEach((fn) =>
    fnStore.set(fn.name, {
      fn: fn,
    })
  );
}
// 렌더링 후 effect 런
export function addEffect() {
  Object.values(useEffectStore.getAll()).forEach((f) => f());
}
// 레코일 잠그기
export function closeDecoil() {
  const store = useDecoilStateStore.store;
  for (const key of Object.keys(store)) {
    store[key].init = false;
  }
}

// 스토어 인스턴스 두 개 생성
export const useStateStore = new Store();
export const useDecoilStateStore = new Store();
export const useEffectStore = new Store();
export const fnStore = new Store();
export const componentStore = new Store();
export const callStackStore = new StackStore();
export const useStateStackStore = new StackStore();
// 함수 시작
export function init(...argument) {
  // 등록
  register(argument);
  // 렌더링
  render(App, "app", true, null, null);
  // useEffect
  addEffect();
  // 데코일 잠그기
  closeDecoil();
}
