import { cache } from "../util/util.js";
import { HTTP_METHOD } from "./method.js";

const requestGet = async (url, token) => {
  const res = await fetch(url, HTTP_METHOD.GET(token));
  const data = await res.json();
  const _token = res.headers.get("token");
  if (_token) {
    cache.set("token", _token);
  }
  return data;
};

const request = {
  get: requestGet,
};

export default request;
