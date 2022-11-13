// HTTP_METHOD
const HTTP_METHOD = {
  GET(token) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    };
  },
};

export { HTTP_METHOD };
