import { init } from "./deact/index.js";
import { Dropdown } from "./src/components/DropDown.js";
import { Pagination } from "./src/components/Pagination.js";
import { Table } from "./src/components/Table.js";
import { App } from "./src/index.js";

init(App, Dropdown, Pagination, Table);
