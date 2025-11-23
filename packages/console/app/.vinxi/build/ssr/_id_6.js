async function handler(evt) {
  const req = evt.request.clone();
  const url = new URL(req.url);
  const targetUrl = `https://docs.opencode.ai/docs${url.pathname}${url.search}`;
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body
  });
  return response;
}
const PUT = handler;
export {
  PUT
};
