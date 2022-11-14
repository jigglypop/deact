import { useState } from "../deact/useState.js";

export function App() {
  const [state, setState] = useState(1);

  return {
    id: "app",
    jsx: `
    <div class="App">
      <Dropdown />
      <Table />
  </div>`,
  };
}
