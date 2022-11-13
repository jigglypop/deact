import { getID, getRegex, getTag } from "./util.js";
import { App } from "../src/index.js";
import { StackStore, Store } from "./store.js";

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
  let ordJsx = jsx;
  const sementic = getRegex("<([a-z])*", jsx)[0];
  jsx = jsx.replace(
    sementic,
    sementic + " id=" + id + " " + " name=" + id + " "
  );
  return { jsx, originalId: f.id, ordJsx };
}
export function getId(id) {
  return id ?? getID();
}
// 렌더링
export function render(fn, cpnId, isTop, props, cbs) {
  // 아이디 세팅
  const id = getId(cpnId);

  // id, fn, useState 스택, decoil 스택
  callStackStore.set([id, fn, [], []]);
  // 함수 실행
  let { jsx, originalId, ordJsx } = getJsx(fn, id, props, cbs);
  const components = componentStore.get(id) ?? getComponent(jsx);
  const children = cpnId && cpnId !== "app" ? components.children : [];
  const ordComponents = getComponent(ordJsx);
  // 렌더링 리플레이스 부분
  if (cpnId && cpnId !== "app") {
    useStateStackStore.set(id);
    children.forEach((childId, i) => {
      const ordjsx = ordComponents[i];
      const { fn: _fn, jsx: j, id } = componentStore.get(childId);
      let { jsx: _jsx, id: _id } = render(_fn, id, false, ordjsx.params, null);
      jsx = jsx.replace(new RegExp(`<(.)*${_fn.name}(.)*/>`, "g"), _jsx);
    });
  } else {
    // 컴포넌트 요소가 있는지 찾은 다음 트리 순회
    console.log(components);
    components.forEach(({ jsx: j }) => {
      const { fn: _fn } = fnStore.get(j.match(/[A-Z]([a-z])*/)[0]);
      const { jsx: _jsx, id: _id } = render(
        _fn,
        null,
        false,
        getParams(j),
        null
      );
      jsx = jsx.replace(j, _jsx);
      children.push(_id);
    });
  }
  // 자식요소 세팅
  componentStore.set(id, { jsx, id, fn, children, originalId, props: props });
  // 렌더링
  if (isTop) {
    const $Top = document.getElementById(id);
    if ($Top) $Top.innerHTML = jsx;
    else {
      document.getElementsByName(id)[0].innerHTML = jsx;
      deleteHookId(id, jsx);
    }
  }
  return { jsx, id };
}

export function deleteHookId(id) {
  const $Names = document.getElementsByName(id);
  const $Ord = $Names[0];
  const $New = $Names[1];
  $Ord.after($New);
  $Ord.remove();
  $New.removeAttribute("id");
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
// 렌더링 후처리
export function afterRender() {
  // 앱 최상단으로
  const $Apps = document.querySelectorAll("#app");
  document.querySelector("body").append($Apps[1]);
  // 최상단 삭제
  $Apps[0].remove();
  // 아이디 삭제, original id 있으면 세팅
  Object.keys(componentStore.store).forEach((key) => {
    const $El = document.getElementById(key);
    const originalId = componentStore.store[key].originalId;
    $El.removeAttribute("id");
    if (originalId) {
      $El.setAttribute("id", originalId);
    }
  });
}

// 훅 후처리
export function afterHoookRender() {
  // // 아이디 삭제, original id 있으면 세팅
  useStateStackStore.store.forEach((key) => {
    const $El = document.getElementsByName(key)[0];
    if ($El) {
      const originalId = componentStore.store[key].originalId;
      $El.removeAttribute("id");
      if (originalId) {
        $El.setAttribute("id", originalId);
      }
    }
  });
  useStateStackStore.clear();
}

// 스토어 인스턴스 두 개 생성
export const useStateStore = new Store();
export const useDecoilStateStore = new Store();
export const useEffectStore = new Store();
export const fnStore = new Store();
export const componentStore = new Store();
export const callStackStore = new StackStore();
export const useStateStackStore = new StackStore();
export const useDecoilStateStackStore = new StackStore();
// 함수 시작
export function init(...argument) {
  // 등록
  register(argument);
  // 렌더링
  render(App, "app", true, null, null);
  // 렌더링 후처리
  afterRender();
  // useEffect 실행
  addEffect();
}
