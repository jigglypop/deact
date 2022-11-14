import { useDecoilState } from "../../deact/useDecoilState";
import { routerAtom } from "../store/router";

export function Card() {
  const [num, setNum] = useDecoilState(routerAtom);

  return {
    jsx: `
      <div class="card" >
        <h1>카드 : ${num.id} </h1>
      </div>
    `,
  };
}
