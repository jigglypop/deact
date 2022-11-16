import { useEffect } from "../../deact/useEffect.js";
import { useState } from "../../deact/useState.js";
import { $ } from "../../deact/jQuery.js";
import { useDecoilState } from "../../deact/useDecoilState.js";
import { routerAtom } from "../store/router.js";

export function Dropdown() {
  const [num, setNum] = useDecoilState(routerAtom);
  const [state, setState] = useState(1);

  useEffect(() => {
    $("#button1").on("click", () => {
      setState(state + 1);
    });
  }, []);

  return {
    id: "dropdown",
    jsx: `
      <div class="area"   id="dropdown">
          드롭다운을 이 영역에 구현해주세요: ${state} : ${num.id}
          <Pagination />
          <button id="button1" >버튼</button>
      </div>`,
  };
}
