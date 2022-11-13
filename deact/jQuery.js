import { isOuter, isTag } from "./util.js";

export const $ = (element) => {
  let $El = null;
  if (typeof element === "string") {
    if (isOuter(element) && isOuter(element).length !== 0) {
      const tag = isTag(element);
      let temp = "";
      if (tag && tag[0]) {
        temp = tag[0].replace(/<|>/g, "");
      }
      $El = document.createElement(`${temp}`);
    } else {
      $El = document.querySelector(element);
    }
  } else if (element instanceof HTMLElement) {
    $El = element;
  }

  const Arguments = {
    append($target) {
      if ($El instanceof HTMLElement) {
        $target.appendChild($El);
      }
    },
    get() {
      if ($El) {
        return $El;
      } else {
        return null;
      }
    },
    val(key, value) {
      if (!value) {
        if (typeof element === "string") {
          const $El = this.get();
          if ($El instanceof HTMLElement) {
            const result = getComputedStyle($El).getPropertyValue(key);
            if (!result) {
              return null;
            }
            return result;
          } else {
            return null;
          }
        } else if (element instanceof HTMLElement) {
          const result = getComputedStyle(element).getPropertyValue(key);
          if (!result) {
            return null;
          }
          return result;
        }
        return null;
      } else {
        if (typeof element === "string") {
          const $El = this.get();
          if ($El instanceof HTMLElement) {
            $El.style.setProperty(key, value);
          } else {
            return null;
          }
        } else if (element instanceof HTMLElement) {
          element.style.setProperty(key, value);
        } else {
          return null;
        }
      }
    },
    on(type, cb) {
      const $element = this.get();
      if ($element === null) {
        return;
      }
      cb.bind(this);
      $element.addEventListener(type, cb);
      return {
        ...Arguments,
      };
    },
    ready(cb) {
      if (element === document) {
        cb();
      }
    },
    css(attr, value) {
      const $element = this.get();
      if ($element === null) {
        return;
      }
      setCSSProperty($element, attr, value);
      return {
        ...Arguments,
      };
    },
    addClass(className) {
      $El?.classList.add(className);
      return {
        ...Arguments,
      };
    },
    toggleClass(className) {
      $El?.classList.toggle(className);
      return {
        ...Arguments,
      };
    },
    removeClass(className) {
      $El?.classList.remove(className);
      return {
        ...Arguments,
      };
    },
  };

  return {
    ...Arguments,
  };
};
