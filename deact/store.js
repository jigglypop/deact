// 스토어
export const Store = function () {
  const store = {};
  return {
    getAll() {
      return store;
    },
    get(name) {
      return store[name] ?? null;
    },
    set(name, value) {
      store[name] = value;
      return store[name];
    },
    store,
  };
};
// 스택 스토어
export const StackStore = function () {
  let store = [];
  return {
    get() {
      return store;
    },
    set(name) {
      store.push(name);
      return store;
    },
    clear() {
      store = [];
      return store;
    },
    store,
  };
};
// 셋 스토어
export const SetStore = function () {
  let store = set();
  return {
    get() {
      return store;
    },
    set(name) {
      store.add(name);
      return store;
    },
    clear() {
      store = set();
      return store;
    },
    store,
  };
};
