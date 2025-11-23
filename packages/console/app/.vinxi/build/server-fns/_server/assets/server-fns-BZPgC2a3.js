import { d as defineMiddleware, g as getCookie, s as setCookie, a as getFetchEvent, m as mergeResponseHeaders, b as setResponseStatus, c as setHeader, e as cloneEvent, p as parseCookies } from "./fetchEvent-4t5qANvA.js";
import { parseSetCookie } from "cookie-es";
import { fromJSON, crossSerializeStream, getCrossReferenceHeader } from "seroval";
import { CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin } from "seroval-plugins/web";
import { lazy, createComponent, sharedConfig } from "solid-js";
import { ssrElement, escape, mergeProps, ssr, getRequestEvent, isServer, renderToString } from "solid-js/web";
import { provideRequestEvent } from "solid-js/web/storage";
import { eventHandler } from "h3";
import "node:async_hooks";
import { createRouter } from "radix3";
const middleware = defineMiddleware({
  onBeforeResponse() {
  }
});
const genericMessage = "Invariant Violation";
const {
  setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  }
} = Object;
class InvariantError extends Error {
  framesToPop = 1;
  name = genericMessage;
  constructor(message = genericMessage) {
    super(typeof message === "number" ? `${genericMessage}: ${message} (see https://github.com/apollographql/invariant-packages)` : message);
    setPrototypeOf(this, InvariantError.prototype);
  }
}
function invariant(condition, message) {
  if (!condition) {
    throw new InvariantError(message);
  }
}
const fileRoutes = [{ "page": true, "$component": { "src": "src/routes/[...404].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../_...404_.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...404_.js"
) }, "path": "/*404", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/[...404].tsx" }, { "page": false, "$POST": { "src": "src/routes/api/enterprise.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../enterprise.js"
), "import": () => import(
  /* @vite-ignore */
  "../enterprise.js"
) }, "path": "/api/enterprise", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/api/enterprise.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/authorize.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../authorize.js"
), "import": () => import(
  /* @vite-ignore */
  "../authorize.js"
) }, "$HEAD": { "src": "src/routes/auth/authorize.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../authorize.js"
), "import": () => import(
  /* @vite-ignore */
  "../authorize.js"
) }, "path": "/auth/authorize", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/authorize.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/callback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../callback.js"
), "import": () => import(
  /* @vite-ignore */
  "../callback.js"
) }, "$HEAD": { "src": "src/routes/auth/callback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../callback.js"
), "import": () => import(
  /* @vite-ignore */
  "../callback.js"
) }, "path": "/auth/callback", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/callback.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index.js"
), "import": () => import(
  /* @vite-ignore */
  "../index.js"
) }, "$HEAD": { "src": "src/routes/auth/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index.js"
), "import": () => import(
  /* @vite-ignore */
  "../index.js"
) }, "path": "/auth/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/index.ts" }, { "page": true, "$component": { "src": "src/routes/brand/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index2.js"
), "import": () => import(
  /* @vite-ignore */
  "../index2.js"
) }, "path": "/brand/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/brand/index.tsx" }, { "page": false, "$GET": { "src": "src/routes/debug/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index3.js"
), "import": () => import(
  /* @vite-ignore */
  "../index3.js"
) }, "$HEAD": { "src": "src/routes/debug/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index3.js"
), "import": () => import(
  /* @vite-ignore */
  "../index3.js"
) }, "path": "/debug/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/debug/index.ts" }, { "page": false, "$GET": { "src": "src/routes/desktop-feedback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../desktop-feedback.js"
), "import": () => import(
  /* @vite-ignore */
  "../desktop-feedback.js"
) }, "$HEAD": { "src": "src/routes/desktop-feedback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../desktop-feedback.js"
), "import": () => import(
  /* @vite-ignore */
  "../desktop-feedback.js"
) }, "path": "/desktop-feedback", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/desktop-feedback.ts" }, { "page": false, "$GET": { "src": "src/routes/discord.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../discord.js"
), "import": () => import(
  /* @vite-ignore */
  "../discord.js"
) }, "$HEAD": { "src": "src/routes/discord.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../discord.js"
), "import": () => import(
  /* @vite-ignore */
  "../discord.js"
) }, "path": "/discord", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/discord.ts" }, { "page": false, "$DELETE": { "src": "src/routes/docs/[...path].ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "../_...path_.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_.js"
) }, "$GET": { "src": "src/routes/docs/[...path].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../_...path_2.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_2.js"
) }, "$HEAD": { "src": "src/routes/docs/[...path].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../_...path_2.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_2.js"
) }, "$OPTIONS": { "src": "src/routes/docs/[...path].ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "../_...path_3.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_3.js"
) }, "$PATCH": { "src": "src/routes/docs/[...path].ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "../_...path_4.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_4.js"
) }, "$POST": { "src": "src/routes/docs/[...path].ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../_...path_5.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_5.js"
) }, "$PUT": { "src": "src/routes/docs/[...path].ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "../_...path_6.js"
), "import": () => import(
  /* @vite-ignore */
  "../_...path_6.js"
) }, "path": "/docs/*path", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/docs/[...path].ts" }, { "page": false, "$DELETE": { "src": "src/routes/docs/index.ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "../index4.js"
), "import": () => import(
  /* @vite-ignore */
  "../index4.js"
) }, "$GET": { "src": "src/routes/docs/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index5.js"
), "import": () => import(
  /* @vite-ignore */
  "../index5.js"
) }, "$HEAD": { "src": "src/routes/docs/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../index5.js"
), "import": () => import(
  /* @vite-ignore */
  "../index5.js"
) }, "$OPTIONS": { "src": "src/routes/docs/index.ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "../index6.js"
), "import": () => import(
  /* @vite-ignore */
  "../index6.js"
) }, "$PATCH": { "src": "src/routes/docs/index.ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "../index7.js"
), "import": () => import(
  /* @vite-ignore */
  "../index7.js"
) }, "$POST": { "src": "src/routes/docs/index.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../index8.js"
), "import": () => import(
  /* @vite-ignore */
  "../index8.js"
) }, "$PUT": { "src": "src/routes/docs/index.ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "../index9.js"
), "import": () => import(
  /* @vite-ignore */
  "../index9.js"
) }, "path": "/docs/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/docs/index.ts" }, { "page": true, "$component": { "src": "src/routes/enterprise/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index10.js"
), "import": () => import(
  /* @vite-ignore */
  "../index10.js"
) }, "path": "/enterprise/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/enterprise/index.tsx" }, { "page": true, "$component": { "src": "src/routes/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index11.js"
), "import": () => import(
  /* @vite-ignore */
  "../index11.js"
) }, "path": "/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/index.tsx" }, { "page": false, "$DELETE": { "src": "src/routes/s/[id].ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "../_id_.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_.js"
) }, "$GET": { "src": "src/routes/s/[id].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../_id_2.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_2.js"
) }, "$HEAD": { "src": "src/routes/s/[id].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../_id_2.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_2.js"
) }, "$OPTIONS": { "src": "src/routes/s/[id].ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "../_id_3.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_3.js"
) }, "$PATCH": { "src": "src/routes/s/[id].ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "../_id_4.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_4.js"
) }, "$POST": { "src": "src/routes/s/[id].ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../_id_5.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_5.js"
) }, "$PUT": { "src": "src/routes/s/[id].ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "../_id_6.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_6.js"
) }, "path": "/s/:id", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/s/[id].ts" }, { "page": false, "$POST": { "src": "src/routes/stripe/webhook.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../webhook.js"
), "import": () => import(
  /* @vite-ignore */
  "../webhook.js"
) }, "path": "/stripe/webhook", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/stripe/webhook.ts" }, { "page": true, "$component": { "src": "src/routes/temp.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../temp.js"
), "import": () => import(
  /* @vite-ignore */
  "../temp.js"
) }, "path": "/temp", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/temp.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/billing/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index12.js"
), "import": () => import(
  /* @vite-ignore */
  "../index12.js"
) }, "path": "/workspace/:id/billing/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index13.js"
), "import": () => import(
  /* @vite-ignore */
  "../index13.js"
) }, "path": "/workspace/:id/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/keys/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index14.js"
), "import": () => import(
  /* @vite-ignore */
  "../index14.js"
) }, "path": "/workspace/:id/keys/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/members/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index15.js"
), "import": () => import(
  /* @vite-ignore */
  "../index15.js"
) }, "path": "/workspace/:id/members/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/settings/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index16.js"
), "import": () => import(
  /* @vite-ignore */
  "../index16.js"
) }, "path": "/workspace/:id/settings/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../_id_7.js"
), "import": () => import(
  /* @vite-ignore */
  "../_id_7.js"
) }, "path": "/workspace/:id", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id].tsx" }, { "page": true, "$component": { "src": "src/routes/workspace.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../workspace.js"
), "import": () => import(
  /* @vite-ignore */
  "../workspace.js"
) }, "path": "/workspace", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx" }, { "page": true, "$component": { "src": "src/routes/zen/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "../index17.js"
), "import": () => import(
  /* @vite-ignore */
  "../index17.js"
) }, "path": "/zen/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/index.tsx" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/chat/completions.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../completions.js"
), "import": () => import(
  /* @vite-ignore */
  "../completions.js"
) }, "path": "/zen/v1/chat/completions", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/chat/completions.ts" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/messages.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../messages.js"
), "import": () => import(
  /* @vite-ignore */
  "../messages.js"
) }, "path": "/zen/v1/messages", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/messages.ts" }, { "page": false, "$GET": { "src": "src/routes/zen/v1/models.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../models.js"
), "import": () => import(
  /* @vite-ignore */
  "../models.js"
) }, "$HEAD": { "src": "src/routes/zen/v1/models.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "../models.js"
), "import": () => import(
  /* @vite-ignore */
  "../models.js"
) }, "$OPTIONS": { "src": "src/routes/zen/v1/models.ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "../models2.js"
), "import": () => import(
  /* @vite-ignore */
  "../models2.js"
) }, "path": "/zen/v1/models", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/models.ts" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/responses.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "../responses.js"
), "import": () => import(
  /* @vite-ignore */
  "../responses.js"
) }, "path": "/zen/v1/responses", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/responses.ts" }];
const pageRoutes = defineRoutes(fileRoutes.filter((o) => o.page));
function defineRoutes(fileRoutes2) {
  function processRoute(routes2, route, id, full) {
    const parentRoute = Object.values(routes2).find((o) => {
      return id.startsWith(o.id + "/");
    });
    if (!parentRoute) {
      routes2.push({
        ...route,
        id,
        path: id.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/")
      });
      return routes2;
    }
    processRoute(parentRoute.children || (parentRoute.children = []), route, id.slice(parentRoute.id.length));
    return routes2;
  }
  return fileRoutes2.sort((a, b) => a.path.length - b.path.length).reduce((prevRoutes, route) => {
    return processRoute(prevRoutes, route, route.path, route.path);
  }, []);
}
function containsHTTP(route) {
  return route["$HEAD"] || route["$GET"] || route["$POST"] || route["$PUT"] || route["$PATCH"] || route["$DELETE"];
}
createRouter({
  routes: fileRoutes.reduce((memo, route) => {
    if (!containsHTTP(route)) return memo;
    let path = route.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (_, m) => `**:${m}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
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
function preloadStyles(styles) {
  styles.forEach((style) => {
    if (!style.attrs.href) {
      return;
    }
    let element = document.head.querySelector(`link[href="${style.attrs.href}"]`);
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", "preload");
      element.setAttribute("as", "style");
      element.setAttribute("href", style.attrs.href);
      document.head.appendChild(element);
    }
  });
}
var _tmpl$ = " ";
const assetMap = {
  style: (props) => ssrElement("style", props.attrs, () => props.children, true),
  link: (props) => ssrElement("link", props.attrs, void 0, true),
  script: (props) => {
    return props.attrs.src ? ssrElement("script", mergeProps(() => props.attrs, {
      get id() {
        return props.key;
      }
    }), () => ssr(_tmpl$), true) : null;
  },
  noscript: (props) => ssrElement("noscript", props.attrs, () => escape(props.children), true)
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
const FileRoutes = isServer ? () => getRequestEvent().routes : () => routes || (routes = createRoutes());
function initFromFlash(ctx) {
  const flash = getCookie(ctx.nativeEvent, "flash");
  if (!flash) return;
  try {
    let param = JSON.parse(flash);
    if (!param || !param.result) return;
    const input = [...param.input.slice(0, -1), new Map(param.input[param.input.length - 1])];
    const result = param.error ? new Error(param.result) : param.result;
    return {
      input,
      url: param.url,
      pending: false,
      result: param.thrown ? void 0 : result,
      error: param.thrown ? result : void 0
    };
  } catch (e) {
    console.error(e);
  } finally {
    setCookie(ctx.nativeEvent, "flash", "", {
      maxAge: 0
    });
  }
}
async function createPageEvent(ctx) {
  const clientManifest = globalThis.MANIFEST["client"];
  globalThis.MANIFEST["ssr"];
  ctx.response.headers.set("Content-Type", "text/html");
  const pageEvent = Object.assign(ctx, {
    manifest: await clientManifest.json(),
    assets: [...await clientManifest.inputs[clientManifest.handler].assets(), ...[], ...[]],
    router: {
      submission: initFromFlash(ctx)
    },
    routes: createRoutes(),
    // prevUrl: prevPath || "",
    // mutation: mutation,
    // $type: FETCH_EVENT,
    complete: false,
    $islands: /* @__PURE__ */ new Set()
  });
  return pageEvent;
}
const validRedirectStatuses = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function getExpectedRedirectStatus(response) {
  if (response.status && validRedirectStatuses.has(response.status)) {
    return response.status;
  }
  return 302;
}
const serverFnManifest = { "src_routes_workspace_tsx--getUserEmail_query": {
  functionName: "getUserEmail_query",
  importer: () => import("./workspace-DCn4KZB5.js")
}, "src_routes_zen_index_tsx--checkLoggedIn_query": {
  functionName: "checkLoggedIn_query",
  importer: () => import("./index-LBh_SG4A.js")
}, "src_routes_user-menu_tsx--logout_action": {
  functionName: "logout_action",
  importer: () => import("./user-menu-Ck6NkIuX.js")
}, "src_routes_workspace-picker_tsx--getWorkspaces_query": {
  functionName: "getWorkspaces_query",
  importer: () => import("./workspace-picker-CQD-YCYW.js")
}, "src_routes_workspace-picker_tsx--createWorkspace_action": {
  functionName: "createWorkspace_action",
  importer: () => import("./workspace-picker-CQD-YCYW.js")
}, "src_routes_workspace_id_billing_monthly-limit-section_tsx--setMonthlyLimit_action": {
  functionName: "setMonthlyLimit_action",
  importer: () => import("./monthly-limit-section-CMfNAdyz.js")
}, "src_routes_workspace_id_billing_billing-section_tsx--createSessionUrl_action": {
  functionName: "createSessionUrl_action",
  importer: () => import("./billing-section-BvGA5bVz.js")
}, "src_routes_workspace_id_billing_payment-section_tsx--getPaymentsInfo_query": {
  functionName: "getPaymentsInfo_query",
  importer: () => import("./payment-section-B-bJwWYT.js")
}, "src_routes_workspace_id_billing_payment-section_tsx--downloadReceipt_action": {
  functionName: "downloadReceipt_action",
  importer: () => import("./payment-section-B-bJwWYT.js")
}, "src_routes_workspace_id_billing_reload-section_tsx--reload_action": {
  functionName: "reload_action",
  importer: () => import("./reload-section-BwzSSCLn.js")
}, "src_routes_workspace_id_billing_reload-section_tsx--setReload_action": {
  functionName: "setReload_action",
  importer: () => import("./reload-section-BwzSSCLn.js")
}, "src_routes_workspace_common_tsx--getLastSeenWorkspaceID_1": {
  functionName: "getLastSeenWorkspaceID_1",
  importer: () => import("./common-DWM-Gsmc.js")
}, "src_routes_workspace_common_tsx--querySessionInfo_query": {
  functionName: "querySessionInfo_query",
  importer: () => import("./common-DWM-Gsmc.js")
}, "src_routes_workspace_common_tsx--createCheckoutUrl_action": {
  functionName: "createCheckoutUrl_action",
  importer: () => import("./common-DWM-Gsmc.js")
}, "src_routes_workspace_common_tsx--queryBillingInfo_query": {
  functionName: "queryBillingInfo_query",
  importer: () => import("./common-DWM-Gsmc.js")
}, "src_routes_workspace_id_settings_settings-section_tsx--getWorkspaceInfo_query": {
  functionName: "getWorkspaceInfo_query",
  importer: () => import("./settings-section-Dgi31JMR.js")
}, "src_routes_workspace_id_settings_settings-section_tsx--updateWorkspace_action": {
  functionName: "updateWorkspace_action",
  importer: () => import("./settings-section-Dgi31JMR.js")
}, "src_routes_workspace_id_new-user-section_tsx--getUsageInfo_query": {
  functionName: "getUsageInfo_query",
  importer: () => import("./new-user-section-DQOOjMgV.js")
}, "src_routes_workspace_id_new-user-section_tsx--listKeys_query": {
  functionName: "listKeys_query",
  importer: () => import("./new-user-section-DQOOjMgV.js")
}, "src_routes_workspace_id_usage-section_tsx--getUsageInfo_query": {
  functionName: "getUsageInfo_query",
  importer: () => import("./usage-section-B5yzvv6p.js")
}, "src_routes_workspace_id_provider-section_tsx--removeProvider_action": {
  functionName: "removeProvider_action",
  importer: () => import("./provider-section-hXd3ICr5.js")
}, "src_routes_workspace_id_provider-section_tsx--saveProvider_action": {
  functionName: "saveProvider_action",
  importer: () => import("./provider-section-hXd3ICr5.js")
}, "src_routes_workspace_id_provider-section_tsx--listProviders_query": {
  functionName: "listProviders_query",
  importer: () => import("./provider-section-hXd3ICr5.js")
}, "src_routes_workspace_id_model-section_tsx--getModelsInfo_query": {
  functionName: "getModelsInfo_query",
  importer: () => import("./model-section-DqENGSLU.js")
}, "src_routes_workspace_id_model-section_tsx--updateModel_action": {
  functionName: "updateModel_action",
  importer: () => import("./model-section-DqENGSLU.js")
}, "src_routes_workspace_id_keys_key-section_tsx--removeKey_action": {
  functionName: "removeKey_action",
  importer: () => import("./key-section-DT8GRVQU.js")
}, "src_routes_workspace_id_keys_key-section_tsx--createKey_action": {
  functionName: "createKey_action",
  importer: () => import("./key-section-DT8GRVQU.js")
}, "src_routes_workspace_id_keys_key-section_tsx--listKeys_query": {
  functionName: "listKeys_query",
  importer: () => import("./key-section-DT8GRVQU.js")
}, "src_component_email-signup_tsx--emailSignup_action": {
  functionName: "emailSignup_action",
  importer: () => import("./email-signup-DbZ5l1hp.js")
}, "src_routes_workspace_id_members_member-section_tsx--listMembers_query": {
  functionName: "listMembers_query",
  importer: () => import("./member-section-DbigfiFW.js")
}, "src_routes_workspace_id_members_member-section_tsx--inviteMember_action": {
  functionName: "inviteMember_action",
  importer: () => import("./member-section-DbigfiFW.js")
}, "src_routes_workspace_id_members_member-section_tsx--removeMember_action": {
  functionName: "removeMember_action",
  importer: () => import("./member-section-DbigfiFW.js")
}, "src_routes_workspace_id_members_member-section_tsx--updateMember_action": {
  functionName: "updateMember_action",
  importer: () => import("./member-section-DbigfiFW.js")
}, "src_lib_github_ts--github_query": {
  functionName: "github_query",
  importer: () => import("./github-BEZ_Nv1N.js")
} };
function createChunk(data) {
  const encodeData = new TextEncoder().encode(data);
  const bytes = encodeData.length;
  const baseHex = bytes.toString(16);
  const totalHex = "00000000".substring(0, 8 - baseHex.length) + baseHex;
  const head = new TextEncoder().encode(`;0x${totalHex};`);
  const chunk = new Uint8Array(12 + bytes);
  chunk.set(head);
  chunk.set(encodeData, 12);
  return chunk;
}
function serializeToStream(id, value) {
  return new ReadableStream({
    start(controller) {
      crossSerializeStream(value, {
        scopeId: id,
        plugins: [CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin],
        onSerialize(data, initial) {
          controller.enqueue(createChunk(initial ? `(${getCrossReferenceHeader(id)},${data})` : data));
        },
        onDone() {
          controller.close();
        },
        onError(error) {
          controller.error(error);
        }
      });
    }
  });
}
async function handleServerFunction(h3Event) {
  const event = getFetchEvent(h3Event);
  const request = event.request;
  const serverReference = request.headers.get("X-Server-Id");
  const instance = request.headers.get("X-Server-Instance");
  const singleFlight = request.headers.has("X-Single-Flight");
  const url = new URL(request.url);
  let functionId, name;
  if (serverReference) {
    invariant(typeof serverReference === "string", "Invalid server function");
    [functionId, name] = serverReference.split("#");
  } else {
    functionId = url.searchParams.get("id");
    name = url.searchParams.get("name");
    if (!functionId || !name) {
      return new Response(null, {
        status: 404
      });
    }
  }
  const serverFnInfo = serverFnManifest[functionId];
  let fnModule;
  if (!serverFnInfo) {
    return new Response(null, {
      status: 404
    });
  }
  {
    fnModule = await serverFnInfo.importer();
  }
  const serverFunction = fnModule[serverFnInfo.functionName];
  let parsed = [];
  if (!instance || h3Event.method === "GET") {
    const args = url.searchParams.get("args");
    if (args) {
      const json = JSON.parse(args);
      (json.t ? fromJSON(json, {
        plugins: [CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin]
      }) : json).forEach((arg) => parsed.push(arg));
    }
  }
  if (h3Event.method === "POST") {
    const contentType = request.headers.get("content-type");
    const h3Request = h3Event.node.req;
    const isReadableStream = h3Request instanceof ReadableStream;
    const hasReadableStream = h3Request.body instanceof ReadableStream;
    const isH3EventBodyStreamLocked = isReadableStream && h3Request.locked || hasReadableStream && h3Request.body.locked;
    const requestBody = isReadableStream ? h3Request : h3Request.body;
    if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
      parsed.push(await (isH3EventBodyStreamLocked ? request : new Request(request, {
        ...request,
        body: requestBody
      })).formData());
    } else if (contentType?.startsWith("application/json")) {
      const tmpReq = isH3EventBodyStreamLocked ? request : new Request(request, {
        ...request,
        body: requestBody
      });
      parsed = fromJSON(await tmpReq.json(), {
        plugins: [CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin]
      });
    }
  }
  try {
    let result = await provideRequestEvent(event, async () => {
      sharedConfig.context = {
        event
      };
      event.locals.serverFunctionMeta = {
        id: functionId + "#" + name
      };
      return serverFunction(...parsed);
    });
    if (singleFlight && instance) {
      result = await handleSingleFlight(event, result);
    }
    if (result instanceof Response) {
      if (result.headers && result.headers.has("X-Content-Raw")) return result;
      if (instance) {
        if (result.headers) mergeResponseHeaders(h3Event, result.headers);
        if (result.status && (result.status < 300 || result.status >= 400)) setResponseStatus(h3Event, result.status);
        if (result.customBody) {
          result = await result.customBody();
        } else if (result.body == void 0) result = null;
      }
    }
    if (!instance) return handleNoJS(result, request, parsed);
    setHeader(h3Event, "content-type", "text/javascript");
    return serializeToStream(instance, result);
  } catch (x) {
    if (x instanceof Response) {
      if (singleFlight && instance) {
        x = await handleSingleFlight(event, x);
      }
      if (x.headers) mergeResponseHeaders(h3Event, x.headers);
      if (x.status && (!instance || x.status < 300 || x.status >= 400)) setResponseStatus(h3Event, x.status);
      if (x.customBody) {
        x = x.customBody();
      } else if (x.body == void 0) x = null;
      setHeader(h3Event, "X-Error", "true");
    } else if (instance) {
      const error = x instanceof Error ? x.message : typeof x === "string" ? x : "true";
      setHeader(h3Event, "X-Error", error.replace(/[\r\n]+/g, ""));
    } else {
      x = handleNoJS(x, request, parsed, true);
    }
    if (instance) {
      setHeader(h3Event, "content-type", "text/javascript");
      return serializeToStream(instance, x);
    }
    return x;
  }
}
function handleNoJS(result, request, parsed, thrown) {
  const url = new URL(request.url);
  const isError = result instanceof Error;
  let statusCode = 302;
  let headers;
  if (result instanceof Response) {
    headers = new Headers(result.headers);
    if (result.headers.has("Location")) {
      headers.set(`Location`, new URL(result.headers.get("Location"), url.origin + "").toString());
      statusCode = getExpectedRedirectStatus(result);
    }
  } else headers = new Headers({
    Location: new URL(request.headers.get("referer")).toString()
  });
  if (result) {
    headers.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({
      url: url.pathname + url.search,
      result: isError ? result.message : result,
      thrown,
      error: isError,
      input: [...parsed.slice(0, -1), [...parsed[parsed.length - 1].entries()]]
    }))}; Secure; HttpOnly;`);
  }
  return new Response(null, {
    status: statusCode,
    headers
  });
}
let App;
function createSingleFlightHeaders(sourceEvent) {
  const headers = new Headers(sourceEvent.request.headers);
  const cookies = parseCookies(sourceEvent.nativeEvent);
  const SetCookies = sourceEvent.response.headers.getSetCookie();
  headers.delete("cookie");
  let useH3Internals = false;
  if (sourceEvent.nativeEvent.node?.req) {
    useH3Internals = true;
    sourceEvent.nativeEvent.node.req.headers.cookie = "";
  }
  SetCookies.forEach((cookie) => {
    if (!cookie) return;
    const {
      maxAge,
      expires,
      name,
      value
    } = parseSetCookie(cookie);
    if (maxAge != null && maxAge <= 0) {
      delete cookies[name];
      return;
    }
    if (expires != null && expires.getTime() <= Date.now()) {
      delete cookies[name];
      return;
    }
    cookies[name] = value;
  });
  Object.entries(cookies).forEach(([key, value]) => {
    headers.append("cookie", `${key}=${value}`);
    useH3Internals && (sourceEvent.nativeEvent.node.req.headers.cookie += `${key}=${value};`);
  });
  return headers;
}
async function handleSingleFlight(sourceEvent, result) {
  let revalidate;
  let url = new URL(sourceEvent.request.headers.get("referer")).toString();
  if (result instanceof Response) {
    if (result.headers.has("X-Revalidate")) revalidate = result.headers.get("X-Revalidate").split(",");
    if (result.headers.has("Location")) url = new URL(result.headers.get("Location"), new URL(sourceEvent.request.url).origin + "").toString();
  }
  const event = cloneEvent(sourceEvent);
  event.request = new Request(url, {
    headers: createSingleFlightHeaders(sourceEvent)
  });
  return await provideRequestEvent(event, async () => {
    await createPageEvent(event);
    App || (App = (await import("./app-B2hNnMsZ.js")).default);
    event.router.dataOnly = revalidate || true;
    event.router.previousUrl = sourceEvent.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = event;
        App();
      });
    } catch (e) {
      console.log(e);
    }
    const body = event.router.data;
    if (!body) return result;
    let containsKey = false;
    for (const key in body) {
      if (body[key] === void 0) delete body[key];
      else containsKey = true;
    }
    if (!containsKey) return result;
    if (!(result instanceof Response)) {
      body["_$value"] = result;
      result = new Response(null, {
        status: 200
      });
    } else if (result.customBody) {
      body["_$value"] = result.customBody();
    }
    result.customBody = () => body;
    result.headers.set("X-Single-Flight", "true");
    return result;
  });
}
const handler = eventHandler(handleServerFunction);
const serverFns = eventHandler({ onRequest: middleware.onRequest, onBeforeResponse: middleware.onBeforeResponse, handler, websocket: handler.__websocket__ });
export {
  FileRoutes as F,
  serverFns as s
};
