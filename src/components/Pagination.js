export function Pagination() {
  return {
    jsx: `
      <div class="area" id="pagination">
        <button class="arrow"><<</button>
        <button style="color: red">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button class="arrow">>></button>
        <Card/>
                <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      </div>
    `,
  };
}
