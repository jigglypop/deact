import { useEffect } from "../../deact/useEffect.js";
import { useState } from "../../deact/useState.js";
import { $ } from "../../deact/jQuery.js";
import { useDecoilState } from "../../deact/useDecoilState.js";
import { routerAtom } from "../store/router.js";

export function Dropdown() {
  console.log("dropdown 렌더링");
  const [num, setNum] = useDecoilState(routerAtom);
  const [state, setState] = useState(1);

  useEffect(() => {
    $("#dropdown").on("click", () => {
      setNum({
        ...num,
        id: num.id + 1,
      });
    });
  }, []);

  return {
    id: "dropdown",
    jsx: `
      <div class="area" id="dropdown">
          드롭다운을 이 영역에 구현해주세요: ${state} : ${num.id}
          <Pagination />
      </div>`,
  };
}
