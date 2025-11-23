const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/_...404_-CE7nDJOJ.js","assets/web-B4FMlVCr.js","assets/index-BZyZejwR.js","assets/HttpStatusCode-B9tIHqYd.js","assets/logo-ornate-dark-BX3xCqAP.js","assets/_..-D_AkgyqN.css","assets/index-ChW47Hhj.js","assets/legal-DluzAPvH.js","assets/store-CSXr9rVx.js","assets/query-C7ETZYOA.js","assets/server-runtime-BVQMvLQK.js","assets/components-D9Uvz6lf.js","assets/legal-5VLHpb63.css","assets/index-u6MH6ulC.css","assets/index-BteVvsYL.js","assets/faq-2C9dHwiF.js","assets/index-CT93zlI6.css","assets/index-CF3IfVl8.js","assets/email-signup-CG9qNeuw.js","assets/action-BpQ-vK1N.js","assets/icon-phIboNhp.js","assets/index-DSylxheB.css","assets/temp-Cb9udCGH.js","assets/index-BK8KsiIf.js","assets/common-DDAj15d0.js","assets/index-Dnu49T5z.css","assets/index-CTh-1idP.js","assets/index-CNNQtHXf.css","assets/index-Csf4l2g3.js","assets/index-CY90ygHZ.css","assets/index-B0oUN2Cl.js","assets/dropdown-CX9xLjCi.js","assets/dropdown-BAPK2b_-.css","assets/index-BBMLwsaN.css","assets/index-cOtPZBOd.js","assets/index-brY0j7J5.css","assets/_id_-DqqDJ3c1.js","assets/_id_-DG5K8kgx.css","assets/workspace-BklVPHwD.js","assets/workspace-iWQlazZt.css","assets/index-C2IOc4vl.js","assets/index-lITPUIlJ.css"])))=>i.map(i=>d[i]);
import { M as MetaProvider, T as Title, a as Meta } from './index-BZyZejwR.js';
import { c as children, a as createMemo, b as createComponent, m as memo, g as getOwner, u as untrack, S as Show, o as on, d as createRoot, e as createSignal, f as onCleanup, s as sharedConfig, h as delegateEvents, i as getNextElement, t as template, j as spread, k as mergeProps, r as runHydrationEvents, l as insert$1, n as lazy, p as Suspense, E as ErrorBoundary$1, q as hydrate } from './web-B4FMlVCr.js';
import { c as createBranches, a as createRouterContext, R as RouterContextObj, s as setInPreloadFn, g as getIntent, b as createRouteContext, d as RouteContextObj, m as mockBase, e as createBeforeLeave, k as keepDepth, f as saveCurrentDepth, n as notifyIfNotBlocked } from './query-C7ETZYOA.js';
import { a as actions } from './action-BpQ-vK1N.js';
import { H as HttpStatusCode } from './HttpStatusCode-B9tIHqYd.js';

const genericMessage = "Invariant Violation";
const {
  setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
  }
} = Object;
class InvariantError extends Error {
  framesToPop = 1;
  name = genericMessage;
  constructor(/** @type {string | number} */message = genericMessage) {
    super(typeof message === "number" ? `${genericMessage}: ${message} (see https://github.com/apollographql/invariant-packages)` : message);
    setPrototypeOf(this, InvariantError.prototype);
  }
}

/**
 * @param {any} condition
 * @param {string | number} message
 * @returns {asserts condition}
 */
function invariant(condition, message) {
  if (!condition) {
    throw new InvariantError(message);
  }
}

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}

const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const normalize = function(path) {
  if (path.length === 0) {
    return ".";
  }
  path = normalizeWindowsPath(path);
  const isUNCPath = path.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";
  path = normalizeString(path, !isPathAbsolute);
  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (_DRIVE_LETTER_RE.test(path)) {
    path += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }
  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
const join = function(...arguments_) {
  if (arguments_.length === 0) {
    return ".";
  }
  let joined;
  for (const argument of arguments_) {
    if (argument && argument.length > 0) {
      if (joined === void 0) {
        joined = argument;
      } else {
        joined += `/${argument}`;
      }
    }
  }
  if (joined === void 0) {
    return ".";
  }
  return normalize(joined.replace(/\/\/+/g, "/"));
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};

function virtualId(/** @type {string} */moduleName) {
  return `virtual:${moduleName}`;
}
function handlerModule(/** @type {import("./router-mode").Router} */router) {
  return router.handler?.endsWith(".html") ? isAbsolute(router.handler) ? router.handler : join(router.root, router.handler) : `$vinxi/handler/${router.name}`;
}

const manifest = new Proxy({}, {
  get(target, routerName) {
    invariant(typeof routerName === "string", "Bundler name should be a string");
    return {
      name: routerName,
      type: "client",
      handler: (
        // @ts-ignore
        virtualId(handlerModule({
          name: routerName
        }))
      ),
      baseURL: "/_build",
      chunks: new Proxy({}, {
        get(target2, chunk) {
          invariant(typeof chunk === "string", "Chunk expected");
          let outputPath = join("/_build", chunk + ".mjs");
          return {
            import() {
              return import(
                /* @vite-ignore */
                outputPath
              );
            },
            output: {
              path: outputPath
            }
          };
        }
      }),
      inputs: new Proxy({}, {
        get(target2, input) {
          invariant(typeof input === "string", "Input must be string");
          let outputPath = window.manifest[input].output;
          return {
            async import() {
              return import(
                /* @vite-ignore */
                outputPath
              );
            },
            async assets() {
              {
                return window.manifest[input].assets;
              }
            },
            output: {
              path: outputPath
            }
          };
        }
      })
    };
  }
});

globalThis.MANIFEST = manifest;

const createRouterComponent = (router) => (props) => {
  const {
    base
  } = props;
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), props.base || ""));
  let context;
  const routerState = createRouterContext(router, branches, () => context, {
    base,
    singleFlight: props.singleFlight,
    transformUrl: props.transformUrl
  });
  router.create && router.create(routerState);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return createComponent(Root, {
        routerState,
        get root() {
          return props.root;
        },
        get preload() {
          return props.rootPreload || props.rootLoad;
        },
        get children() {
          return [memo(() => (context = getOwner()) && null), createComponent(Routes, {
            routerState,
            get branches() {
              return branches();
            }
          })];
        }
      });
    }
  });
};
function Root(props) {
  const location = props.routerState.location;
  const params = props.routerState.params;
  const data = createMemo(() => props.preload && untrack(() => {
    setInPreloadFn(true);
    props.preload({
      params,
      location,
      intent: getIntent() || "initial"
    });
    setInPreloadFn(false);
  }));
  return createComponent(Show, {
    get when() {
      return props.root;
    },
    keyed: true,
    get fallback() {
      return props.children;
    },
    children: (Root2) => createComponent(Root2, {
      params,
      location,
      get data() {
        return data();
      },
      get children() {
        return props.children;
      }
    })
  });
}
function Routes(props) {
  const disposers = [];
  let root;
  const routeStates = createMemo(on(props.routerState.matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot((dispose) => {
          disposers[i] = dispose;
          next[i] = createRouteContext(props.routerState, next[i - 1] || props.routerState.base, createOutlet(() => routeStates()[i + 1]), () => {
            const routeMatches = props.routerState.matches();
            return routeMatches[i] ?? routeMatches[0];
          });
        });
      }
    }
    disposers.splice(nextMatches.length).forEach((dispose) => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createOutlet(() => routeStates() && root)();
}
const createOutlet = (child) => {
  return () => createComponent(Show, {
    get when() {
      return child();
    },
    keyed: true,
    children: (child2) => createComponent(RouteContextObj.Provider, {
      value: child2,
      get children() {
        return child2.outlet();
      }
    })
  });
};

function intercept([value, setValue], get, set) {
  return [value, set ? v => setValue(set(v)) : setValue];
}
function createRouter$1(config) {
  let ignore = false;
  const wrap = value => typeof value === "string" ? {
    value
  } : value;
  const signal = intercept(createSignal(wrap(config.get()), {
    equals: (a, b) => a.value === b.value && a.state === b.state
  }), undefined, next => {
    !ignore && config.set(next);
    if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = true;
    return next;
  });
  config.init && onCleanup(config.init((value = config.get()) => {
    ignore = true;
    signal[1](wrap(value));
    ignore = false;
  }));
  return createRouterComponent({
    signal,
    create: config.create,
    utils: config.utils
  });
}
function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
function scrollToHash(hash, fallbackTop) {
  const el = hash && document.getElementById(hash);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}

function setupNativeEvents(preload = true, explicitLinks = false, actionBase = "/_server", transformUrl) {
  return router => {
    const basePath = router.base.path();
    const navigateFromRoute = router.navigatorFactory(router.base);
    let preloadTimeout;
    let lastElement;
    function isSvg(el) {
      return el.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function handleAnchor(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find(el => el instanceof Node && el.nodeName.toUpperCase() === "A");
      if (!a || explicitLinks && !a.hasAttribute("link")) return;
      const svg = isSvg(a);
      const href = svg ? a.href.baseVal : a.href;
      const target = svg ? a.target.baseVal : a.target;
      if (target || !href && !a.hasAttribute("state")) return;
      const rel = (a.getAttribute("rel") || "").split(/\s+/);
      if (a.hasAttribute("download") || rel && rel.includes("external")) return;
      const url = svg ? new URL(href, document.baseURI) : new URL(href);
      if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
      return [a, url];
    }
    function handleAnchorClick(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      const to = router.parsePath(url.pathname + url.search + url.hash);
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(to, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state ? JSON.parse(state) : undefined
      });
    }
    function handleAnchorPreload(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      router.preloadRoute(url, a.getAttribute("preload") !== "false");
    }
    function handleAnchorMove(evt) {
      clearTimeout(preloadTimeout);
      const res = handleAnchor(evt);
      if (!res) return lastElement = null;
      const [a, url] = res;
      if (lastElement === a) return;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      preloadTimeout = setTimeout(() => {
        router.preloadRoute(url, a.getAttribute("preload") !== "false");
        lastElement = a;
      }, 20);
    }
    function handleFormSubmit(evt) {
      if (evt.defaultPrevented) return;
      let actionRef = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : evt.target.getAttribute("action");
      if (!actionRef) return;
      if (!actionRef.startsWith("https://action/")) {
        // normalize server actions
        const url = new URL(actionRef, mockBase);
        actionRef = router.parsePath(url.pathname + url.search);
        if (!actionRef.startsWith(actionBase)) return;
      }
      if (evt.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const handler = actions.get(actionRef);
      if (handler) {
        evt.preventDefault();
        const data = new FormData(evt.target, evt.submitter);
        handler.call({
          r: router,
          f: evt.target
        }, evt.target.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
      }
    }
    // ensure delegated event run first
    delegateEvents(["click", "submit"]);
    document.addEventListener("click", handleAnchorClick);
    if (preload) {
      document.addEventListener("mousemove", handleAnchorMove, {
        passive: true
      });
      document.addEventListener("focusin", handleAnchorPreload, {
        passive: true
      });
      document.addEventListener("touchstart", handleAnchorPreload, {
        passive: true
      });
    }
    document.addEventListener("submit", handleFormSubmit);
    onCleanup(() => {
      document.removeEventListener("click", handleAnchorClick);
      if (preload) {
        document.removeEventListener("mousemove", handleAnchorMove);
        document.removeEventListener("focusin", handleAnchorPreload);
        document.removeEventListener("touchstart", handleAnchorPreload);
      }
      document.removeEventListener("submit", handleFormSubmit);
    });
  };
}

function Router(props) {
  const getSource = () => {
    const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
    const state = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? undefined : window.history.state;
    return {
      value: url + window.location.hash,
      state
    };
  };
  const beforeLeave = createBeforeLeave();
  return createRouter$1({
    get: getSource,
    set({
      value,
      replace,
      scroll,
      state
    }) {
      if (replace) {
        window.history.replaceState(keepDepth(state), "", value);
      } else {
        window.history.pushState(state, "", value);
      }
      scrollToHash(decodeURIComponent(window.location.hash.slice(1)), scroll);
      saveCurrentDepth();
    },
    init: notify => bindEvent(window, "popstate", notifyIfNotBlocked(notify, delta => {
      if (delta) {
        return !beforeLeave.confirm(delta);
      } else {
        const s = getSource();
        return !beforeLeave.confirm(s.value, {
          state: s.state
        });
      }
    })),
    create: setupNativeEvents(props.preload, props.explicitLinks, props.actionBase, props.transformUrl),
    utils: {
      go: delta => window.history.go(delta),
      beforeLeave
    }
  })(props);
}

/**
 *
 * @param {{ attrs: Record<string, string>; children: string }[]} styles
 * @param {*} data
 */

/**
 *
 * @param {{ attrs: Record<string, string>; children: string }[]} styles
 */
function preloadStyles(styles) {
  styles.forEach(style => {
    if (!style.attrs.href) {
      return;
    }
    let element = document.head.querySelector(`link[href="${style.attrs.href}"]`);
    if (!element) {
      // create a link preload element for the css file so it starts loading but doesnt get attached
      element = document.createElement("link");
      element.setAttribute("rel", "preload");
      element.setAttribute("as", "style");
      element.setAttribute("href", style.attrs.href);
      document.head.appendChild(element);
    }
  });
}

var _tmpl$$1 = /* @__PURE__ */ template(`<style>`), _tmpl$2 = /* @__PURE__ */ template(`<link>`), _tmpl$3 = /* @__PURE__ */ template(`<script> `), _tmpl$4 = /* @__PURE__ */ template(`<noscript>`);
const assetMap = {
  style: (props) => (() => {
    var _el$ = getNextElement(_tmpl$$1);
    spread(_el$, mergeProps(() => props.attrs), false, true);
    insert$1(_el$, () => props.children);
    runHydrationEvents();
    return _el$;
  })(),
  link: (props) => (() => {
    var _el$2 = getNextElement(_tmpl$2);
    spread(_el$2, mergeProps(() => props.attrs), false, false);
    runHydrationEvents();
    return _el$2;
  })(),
  script: (props) => {
    return props.attrs.src ? (() => {
      var _el$3 = getNextElement(_tmpl$3);
      spread(_el$3, mergeProps(() => props.attrs, {
        get id() {
          return props.key;
        }
      }), false, true);
      runHydrationEvents();
      return _el$3;
    })() : null;
  },
  noscript: (props) => (() => {
    var _el$4 = getNextElement(_tmpl$4);
    spread(_el$4, mergeProps(() => props.attrs), false, true);
    runHydrationEvents();
    return _el$4;
  })()
};
function renderAsset(asset, nonce) {
  let {
    tag,
    attrs: {
      key,
      ...attrs
    } = {
      key: void 0
    },
    children
  } = asset;
  return assetMap[tag]({
    attrs: {
      ...attrs,
      nonce
    },
    key,
    children
  });
}

function lazyRoute(component, clientManifest, serverManifest, exported = "default") {
  return lazy(async () => {
    {
      const mod = await component.import();
      const Component = mod[exported];
      let assets = await clientManifest.inputs?.[component.src].assets();
      const styles = assets.filter((asset) => asset.tag === "style" || asset.attrs.rel === "stylesheet");
      if (typeof window !== "undefined") {
        preloadStyles(styles);
      }
      const Comp = (props) => {
        return [...styles.map((asset) => renderAsset(asset)), createComponent(Component, props)];
      };
      return {
        default: Comp
      };
    }
  });
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/_build/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true               && deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const fileRoutes = [{ "page": true, "$component": { "src": "src/routes/[...404].tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './_...404_-CE7nDJOJ.js'
),true              ?__vite__mapDeps([0,1,2,3,4,5]):void 0), "import": (() => {
  const id = "src/routes/[...404].tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/*404", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/[...404].tsx" }, { "page": true, "$component": { "src": "src/routes/brand/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-ChW47Hhj.js'
),true              ?__vite__mapDeps([6,1,2,7,4,8,9,10,11,12,13]):void 0), "import": (() => {
  const id = "src/routes/brand/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/brand/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/brand/index.tsx" }, { "page": true, "$component": { "src": "src/routes/enterprise/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-BteVvsYL.js'
),true              ?__vite__mapDeps([14,1,2,7,4,8,9,10,11,12,15,16]):void 0), "import": (() => {
  const id = "src/routes/enterprise/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/enterprise/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/enterprise/index.tsx" }, { "page": true, "$component": { "src": "src/routes/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-CF3IfVl8.js'
),true              ?__vite__mapDeps([17,1,2,18,10,19,9,20,15,7,4,8,11,12,21]):void 0), "import": (() => {
  const id = "src/routes/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/index.tsx" }, { "page": true, "$component": { "src": "src/routes/temp.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './temp-Cb9udCGH.js'
),true              ?__vite__mapDeps([22,1,2,4,20,21]):void 0), "import": (() => {
  const id = "src/routes/temp.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/temp", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/temp.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/billing/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-BK8KsiIf.js'
),true              ?__vite__mapDeps([23,1,10,8,24,9,19,20,25]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id]/billing/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id/billing/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-CTh-1idP.js'
),true              ?__vite__mapDeps([26,1,8,10,20,9,24,19,27]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id]/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/keys/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-Csf4l2g3.js'
),true              ?__vite__mapDeps([28,1,10,20,8,24,9,19,29]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id]/keys/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id/keys/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/members/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-B0oUN2Cl.js'
),true              ?__vite__mapDeps([30,1,10,8,31,20,32,9,19,33]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id]/members/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id/members/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/settings/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-cOtPZBOd.js'
),true              ?__vite__mapDeps([34,1,10,8,9,19,35]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id]/settings/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id/settings/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id].tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './_id_-DqqDJ3c1.js'
),true              ?__vite__mapDeps([36,1,24,10,9,19,11,37]):void 0), "import": (() => {
  const id = "src/routes/workspace/[id].tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace/:id", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id].tsx" }, { "page": true, "$component": { "src": "src/routes/workspace.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './workspace-BklVPHwD.js'
),true              ?__vite__mapDeps([38,1,10,20,8,31,32,9,19,2,11,39]):void 0), "import": (() => {
  const id = "src/routes/workspace.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/workspace", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx" }, { "page": true, "$component": { "src": "src/routes/zen/index.tsx?pick=default&pick=$css", "build": () => __vitePreload(() => import(
  /* @vite-ignore */
  './index-C2IOc4vl.js'
),true              ?__vite__mapDeps([40,1,10,2,18,19,9,7,4,8,11,12,15,41]):void 0), "import": (() => {
  const id = "src/routes/zen/index.tsx?pick=default&pick=$css";
  return import(
    /* @vite-ignore */
    globalThis.MANIFEST["client"].inputs[id].output.path
  );
}) }, "path": "/zen/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/index.tsx" }];

const pageRoutes = defineRoutes(fileRoutes.filter(o => o.page));
function defineRoutes(fileRoutes) {
  function processRoute(routes, route, id, full) {
    const parentRoute = Object.values(routes).find(o => {
      return id.startsWith(o.id + "/");
    });
    if (!parentRoute) {
      routes.push({
        ...route,
        id,
        path: id.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/")
      });
      return routes;
    }
    processRoute(parentRoute.children || (parentRoute.children = []), route, id.slice(parentRoute.id.length));
    return routes;
  }
  return fileRoutes.sort((a, b) => a.path.length - b.path.length).reduce((prevRoutes, route) => {
    return processRoute(prevRoutes, route, route.path, route.path);
  }, []);
}
function containsHTTP(route) {
  return route["$HEAD"] || route["$GET"] || route["$POST"] || route["$PUT"] || route["$PATCH"] || route["$DELETE"];
}
createRouter({
  routes: fileRoutes.reduce((memo, route) => {
    if (!containsHTTP(route)) return memo;
    let path = route.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (_, m) => `**:${m}`).split("/").map(s => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
    if (/:[^/]*\?/g.test(path)) {
      throw new Error(`Optional parameters are not supported in API routes: ${path}`);
    }
    if (memo[path]) {
      throw new Error(`Duplicate API routes for "${path}" found at "${memo[path].route.path}" and "${route.path}"`);
    }
    memo[path] = {
      route
    };
    return memo;
  }, {})
});

function createRoutes() {
  function createRoute(route) {
    return {
      ...route,
      ...route.$$route ? route.$$route.require().route : void 0,
      info: {
        ...route.$$route ? route.$$route.require().route.info : {},
        filesystem: true
      },
      component: route.$component && lazyRoute(route.$component, globalThis.MANIFEST["client"], globalThis.MANIFEST["ssr"]),
      children: route.children ? route.children.map(createRoute) : void 0
    };
  }
  const routes2 = pageRoutes.map(createRoute);
  return routes2;
}
let routes;
const FileRoutes = () => routes || (routes = createRoutes());

function App() {
  return createComponent(Router, {
    explicitLinks: true,
    root: (props) => createComponent(MetaProvider, {
      get children() {
        return [createComponent(Title, {
          children: "opencode"
        }), createComponent(Meta, {
          name: "description",
          content: "OpenCode - The AI coding agent built for the terminal."
        }), createComponent(Suspense, {
          get children() {
            return props.children;
          }
        })];
      }
    }),
    get children() {
      return createComponent(FileRoutes, {});
    }
  });
}

var _tmpl$ = /* @__PURE__ */ template(`<span style=font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%>`);
const ErrorBoundary = (props) => {
  const message = "Error | Uncaught Client Exception";
  return createComponent(ErrorBoundary$1, {
    fallback: (error) => {
      console.error(error);
      return [(() => {
        var _el$ = getNextElement(_tmpl$);
        insert$1(_el$, message);
        return _el$;
      })(), createComponent(HttpStatusCode, {
        code: 500
      })];
    },
    get children() {
      return props.children;
    }
  });
};

function mount(fn, el) {
  return hydrate(fn, el);
}

function Dummy(props) {
  return props.children;
}
function StartClient() {
  return createComponent(Dummy, {
    get children() {
      return createComponent(Dummy, {
        get children() {
          return createComponent(ErrorBoundary, {
            get children() {
              return createComponent(App, {});
            }
          });
        }
      });
    }
  });
}

mount(() => createComponent(StartClient, {}), document.getElementById("app"));

const client = undefined;

export { client as default };
