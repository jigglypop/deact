import { useEffect } from "../deact/useEffect.js";
import request from "./api/request.js";

export function App() {
  useEffect(async () => {
    await request.get("/web/src/data.json").then((data) => console.log(data));
  }, []);

  return {
    jsx: `
    <div class="App">
      <div id="page_title">Grepp Enterprise</div>
      <div class="area" id="dropdown">
          드롭다운을 이 영역에 구현해주세요
      </div>
      <div class="area" id="table">
          테이블을 이 영역에 구현해주세요
      </div>
      <div class="area" id="pagination">
          <button class="arrow"><<</button>
          <button style="color:red">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button class="arrow">>></button>
      </div>
  </div>`,
  };
}
