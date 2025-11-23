function redirect(url, init = 302) {
  let responseInit;
  let revalidate;
  if (typeof init === "number") {
    responseInit = {
      status: init
    };
  } else {
    ({
      revalidate,
      ...responseInit
    } = init);
    if (typeof responseInit.status === "undefined") {
      responseInit.status = 302;
    }
  }
  const headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  revalidate !== void 0 && headers.set("X-Revalidate", revalidate.toString());
  const response = new Response(null, {
    ...responseInit,
    headers
  });
  return response;
}
function json(data, init = {}) {
  const {
    revalidate,
    ...responseInit
  } = init;
  const headers = new Headers(responseInit.headers);
  revalidate !== void 0 && headers.set("X-Revalidate", revalidate.toString());
  headers.set("Content-Type", "application/json");
  const response = new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
  response.customBody = () => data;
  return response;
}
export {
  json as j,
  redirect as r
};
