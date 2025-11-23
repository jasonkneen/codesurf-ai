import { H3Event, setResponseStatus as setResponseStatus$1, setHeader as setHeader$1, appendResponseHeader as appendResponseHeader$1, getRequestIP as getRequestIP$1, parseCookies as parseCookies$1, getResponseStatus as getResponseStatus$1, getResponseStatusText as getResponseStatusText$1, getCookie as getCookie$1, setCookie as setCookie$1, getResponseHeader as getResponseHeader$1, setResponseHeader as setResponseHeader$1, removeResponseHeader as removeResponseHeader$1, getResponseHeaders as getResponseHeaders$1, getRequestURL as getRequestURL$1, getRequestWebStream as getRequestWebStream$1, useSession as useSession$1 } from "h3";
import { getContext } from "unctx";
import { AsyncLocalStorage } from "node:async_hooks";
function defineMiddleware(options) {
  return options;
}
function toWebRequestH3(event) {
  let readableStream;
  const url = getRequestURL(event);
  const base = {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers
  };
  if (event.node.req.body instanceof ArrayBuffer) {
    return new Request(url, {
      ...base,
      body: event.node.req.body
    });
  }
  return new Request(url, {
    ...base,
    get body() {
      if (readableStream) {
        return readableStream;
      }
      readableStream = getRequestWebStream(event);
      return readableStream;
    }
  });
}
function toWebRequest(event) {
  event.web ??= {
    request: toWebRequestH3(event),
    url: getRequestURL(event)
  };
  return event.web.request;
}
function getHTTPEvent() {
  return getEvent();
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || obj?.[HTTPEventSymbol] instanceof H3Event || obj?.__is_event__ === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    let event = args[0];
    if (!isEvent(event)) {
      if (!globalThis.app.config.server.experimental?.asyncContext) {
        throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      }
      event = getHTTPEvent();
      if (!event) {
        throw new Error(`No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
      }
      args.unshift(event);
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const getRequestURL = createWrapperFunction(getRequestURL$1);
const getRequestIP = createWrapperFunction(getRequestIP$1);
const setResponseStatus = createWrapperFunction(setResponseStatus$1);
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseStatusText = createWrapperFunction(getResponseStatusText$1);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
const getResponseHeader = createWrapperFunction(getResponseHeader$1);
const setResponseHeader = createWrapperFunction(setResponseHeader$1);
const appendResponseHeader = createWrapperFunction(appendResponseHeader$1);
const parseCookies = createWrapperFunction(parseCookies$1);
const getCookie = createWrapperFunction(getCookie$1);
const setCookie = createWrapperFunction(setCookie$1);
const useSession = createWrapperFunction(useSession$1);
const setHeader = createWrapperFunction(setHeader$1);
const getRequestWebStream = createWrapperFunction(getRequestWebStream$1);
const removeResponseHeader = createWrapperFunction(removeResponseHeader$1);
const getWebRequest = createWrapperFunction(toWebRequest);
function getNitroAsyncContext() {
  const nitroAsyncContext = getContext("nitro-app", {
    asyncContext: globalThis.app.config.server.experimental?.asyncContext ? true : false,
    AsyncLocalStorage
  });
  return nitroAsyncContext;
}
function getEvent() {
  return getNitroAsyncContext().use().event;
}
const fetchEventContext = "solidFetchEvent";
function createFetchEvent(event) {
  return {
    request: getWebRequest(event),
    response: createResponseStub(event),
    clientAddress: getRequestIP(event),
    locals: {},
    nativeEvent: event
  };
}
function cloneEvent(fetchEvent) {
  return {
    ...fetchEvent
  };
}
function getFetchEvent(h3Event) {
  if (!h3Event.context[fetchEventContext]) {
    const fetchEvent = createFetchEvent(h3Event);
    h3Event.context[fetchEventContext] = fetchEvent;
  }
  return h3Event.context[fetchEventContext];
}
function mergeResponseHeaders(h3Event, headers) {
  for (const [key, value] of headers.entries()) {
    appendResponseHeader(h3Event, key, value);
  }
}
class HeaderProxy {
  event;
  constructor(event) {
    this.event = event;
  }
  get(key) {
    const h = getResponseHeader(this.event, key);
    return Array.isArray(h) ? h.join(", ") : h || null;
  }
  has(key) {
    return this.get(key) !== null;
  }
  set(key, value) {
    return setResponseHeader(this.event, key, value);
  }
  delete(key) {
    return removeResponseHeader(this.event, key);
  }
  append(key, value) {
    appendResponseHeader(this.event, key, value);
  }
  getSetCookie() {
    const cookies = getResponseHeader(this.event, "Set-Cookie");
    return Array.isArray(cookies) ? cookies : [cookies];
  }
  forEach(fn) {
    return Object.entries(getResponseHeaders(this.event)).forEach(([key, value]) => fn(Array.isArray(value) ? value.join(", ") : value, key, this));
  }
  entries() {
    return Object.entries(getResponseHeaders(this.event)).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(getResponseHeaders(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(getResponseHeaders(this.event)).map((value) => Array.isArray(value) ? value.join(", ") : value)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function createResponseStub(event) {
  return {
    get status() {
      return getResponseStatus(event);
    },
    set status(v) {
      setResponseStatus(event, v);
    },
    get statusText() {
      return getResponseStatusText(event);
    },
    set statusText(v) {
      setResponseStatus(event, getResponseStatus(event), v);
    },
    headers: new HeaderProxy(event)
  };
}
export {
  getFetchEvent as a,
  setResponseStatus as b,
  setHeader as c,
  defineMiddleware as d,
  cloneEvent as e,
  getCookie as g,
  mergeResponseHeaders as m,
  parseCookies as p,
  setCookie as s,
  useSession as u
};
