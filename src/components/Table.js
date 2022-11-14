import { $ } from "../../deact/jQuery";
import { useDecoilState } from "../../deact/useDecoilState";
import { useEffect } from "../../deact/useEffect";
import { routerAtom } from "../store/router";

export function Table() {
  console.log("Table 렌더링");
  const [num, setNum] = useDecoilState(routerAtom);

  useEffect(() => {
    $("#button").on("click", () => {
      setNum({
        ...num,
        id: num.id + 1,
      });
    });
  }, []);
  return {
    id: "table",
    jsx: `<div class="area" id="table">
    <button id="button" >+</button>
    테이블을 이 영역에 구현해주세요 : ${num.id}
    </div>`,
  };
}
