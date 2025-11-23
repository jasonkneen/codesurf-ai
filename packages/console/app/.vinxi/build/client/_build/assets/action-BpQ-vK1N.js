import { a as createMemo, Q as $TRACK, g as getOwner, f as onCleanup, e as createSignal } from './web-B4FMlVCr.js';
import { p as useRouter, m as mockBase, r as hashKey, t as cacheKeyOp, q as query, v as revalidate } from './query-C7ETZYOA.js';

const actions = /* #__PURE__ */new Map();
function useSubmissions(fn, filter) {
  const router = useRouter();
  const subs = createMemo(() => router.submissions[0]().filter(s => s.url === fn.base && (!filter || filter(s.input))));
  return new Proxy([], {
    get(_, property) {
      if (property === $TRACK) return subs();
      if (property === "pending") return subs().some(sub => !sub.result);
      return subs()[property];
    },
    has(_, property) {
      return property in subs();
    }
  });
}
function useSubmission(fn, filter) {
  const submissions = useSubmissions(fn, filter);
  return new Proxy({}, {
    get(_, property) {
      if (submissions.length === 0 && property === "clear" || property === "retry") return () => {};
      return submissions[submissions.length - 1]?.[property];
    }
  });
}
function useAction(action) {
  const r = useRouter();
  return (...args) => action.apply({
    r
  }, args);
}
function action(fn, options = {}) {
  function mutate(...variables) {
    const router = this.r;
    const form = this.f;
    const p = (router.singleFlight && fn.withOptions ? fn.withOptions({
      headers: {
        "X-Single-Flight": "true"
      }
    }) : fn)(...variables);
    const [result, setResult] = createSignal();
    let submission;
    function handler(error) {
      return async res => {
        const result = await handleResponse(res, error, router.navigatorFactory());
        let retry = null;
        o.onComplete?.({
          ...submission,
          result: result?.data,
          error: result?.error,
          pending: false,
          retry() {
            return retry = submission.retry();
          }
        });
        if (retry) return retry;
        if (!result) return submission.clear();
        setResult(result);
        if (result.error && !form) throw result.error;
        return result.data;
      };
    }
    router.submissions[1](s => [...s, submission = {
      input: variables,
      url,
      get result() {
        return result()?.data;
      },
      get error() {
        return result()?.error;
      },
      get pending() {
        return !result();
      },
      clear() {
        router.submissions[1](v => v.filter(i => i !== submission));
      },
      retry() {
        setResult(undefined);
        const p = fn(...variables);
        return p.then(handler(), handler(true));
      }
    }]);
    return p.then(handler(), handler(true));
  }
  const o = typeof options === "string" ? {
    name: options
  } : options;
  const url = fn.url || o.name && `https://action/${o.name}` || (`https://action/${hashString(fn.toString())}` );
  mutate.base = url;
  return toAction(mutate, url);
}
function toAction(fn, url) {
  fn.toString = () => {
    if (!url) throw new Error("Client Actions need explicit names if server rendered");
    return url;
  };
  fn.with = function (...args) {
    const newFn = function (...passedArgs) {
      return fn.call(this, ...args, ...passedArgs);
    };
    newFn.base = fn.base;
    const uri = new URL(url, mockBase);
    uri.searchParams.set("args", hashKey(args));
    return toAction(newFn, (uri.origin === "https://action" ? uri.origin : "") + uri.pathname + uri.search);
  };
  fn.url = url;
  {
    actions.set(url, fn);
    getOwner() && onCleanup(() => actions.delete(url));
  }
  return fn;
}
const hashString = s => s.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0) | 0, 0);
async function handleResponse(response, error, navigate) {
  let data;
  let custom;
  let keys;
  let flightKeys;
  if (response instanceof Response) {
    if (response.headers.has("X-Revalidate")) keys = response.headers.get("X-Revalidate").split(",");
    if (response.customBody) {
      data = custom = await response.customBody();
      if (response.headers.has("X-Single-Flight")) {
        data = data._$value;
        delete custom._$value;
        flightKeys = Object.keys(custom);
      }
    }
    if (response.headers.has("Location")) {
      const locationUrl = response.headers.get("Location") || "/";
      if (locationUrl.startsWith("http")) {
        window.location.href = locationUrl;
      } else {
        navigate(locationUrl);
      }
    }
  } else if (error) return {
    error: response
  };else data = response;
  // invalidate
  cacheKeyOp(keys, entry => entry[0] = 0);
  // set cache
  flightKeys && flightKeys.forEach(k => query.set(k, custom[k]));
  // trigger revalidation
  await revalidate(keys, false);
  return data != null ? {
    data
  } : undefined;
}

export { actions as a, action as b, useAction as c, useSubmission as u };
