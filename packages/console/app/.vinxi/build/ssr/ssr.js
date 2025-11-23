import { d as defineMiddleware, g as getCookie, s as setCookie, a as getFetchEvent, b as sendRedirect, c as setResponseStatus, e as setHeader } from "./assets/fetchEvent-C7Qu-2QC.js";
import { ssrElement, escape, mergeProps, ssr as ssr$1, getRequestEvent, isServer, renderToString, renderToStream, createComponent as createComponent$1, delegateEvents, ssrHydrationKey, useAssets, NoHydration, Hydration, ssrAttribute, HydrationScript } from "solid-js/web";
import { lazy, createComponent, sharedConfig, children, createMemo, getOwner, untrack, Show, on, createRoot, createSignal, onCleanup, Suspense, catchError, ErrorBoundary as ErrorBoundary$1 } from "solid-js";
import { provideRequestEvent } from "solid-js/web/storage";
import { createRouter as createRouter$1 } from "radix3";
import { eventHandler } from "h3";
import { M as MetaProvider, T as Title, a as Meta } from "./assets/index-D2bc-ZG5.js";
import { c as createBranches, a as createRouterContext, R as RouterContextObj, g as getIntent, b as createRouteContext, d as getRouteMatches, e as RouteContextObj, s as setInPreloadFn, m as mockBase, f as createBeforeLeave, k as keepDepth, h as saveCurrentDepth, n as notifyIfNotBlocked } from "./assets/query-D38s0pjD.js";
import { a as actions } from "./assets/action-COIyZVod.js";
import { H as HttpStatusCode } from "./assets/HttpStatusCode-YGbmY4bv.js";
import "node:async_hooks";
import "unctx";
const middleware = defineMiddleware({
  onBeforeResponse() {
  }
});
const fileRoutes = [{ "page": true, "$component": { "src": "src/routes/[...404].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./_...404_.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...404_.js"
) }, "path": "/*404", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/[...404].tsx" }, { "page": false, "$POST": { "src": "src/routes/api/enterprise.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./enterprise.js"
), "import": () => import(
  /* @vite-ignore */
  "./enterprise.js"
) }, "path": "/api/enterprise", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/api/enterprise.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/authorize.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./authorize.js"
), "import": () => import(
  /* @vite-ignore */
  "./authorize.js"
) }, "$HEAD": { "src": "src/routes/auth/authorize.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./authorize.js"
), "import": () => import(
  /* @vite-ignore */
  "./authorize.js"
) }, "path": "/auth/authorize", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/authorize.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/callback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./callback.js"
), "import": () => import(
  /* @vite-ignore */
  "./callback.js"
) }, "$HEAD": { "src": "src/routes/auth/callback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./callback.js"
), "import": () => import(
  /* @vite-ignore */
  "./callback.js"
) }, "path": "/auth/callback", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/callback.ts" }, { "page": false, "$GET": { "src": "src/routes/auth/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index.js"
), "import": () => import(
  /* @vite-ignore */
  "./index.js"
) }, "$HEAD": { "src": "src/routes/auth/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index.js"
), "import": () => import(
  /* @vite-ignore */
  "./index.js"
) }, "path": "/auth/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/auth/index.ts" }, { "page": true, "$component": { "src": "src/routes/brand/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index2.js"
), "import": () => import(
  /* @vite-ignore */
  "./index2.js"
) }, "path": "/brand/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/brand/index.tsx" }, { "page": false, "$GET": { "src": "src/routes/debug/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index3.js"
), "import": () => import(
  /* @vite-ignore */
  "./index3.js"
) }, "$HEAD": { "src": "src/routes/debug/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index3.js"
), "import": () => import(
  /* @vite-ignore */
  "./index3.js"
) }, "path": "/debug/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/debug/index.ts" }, { "page": false, "$GET": { "src": "src/routes/desktop-feedback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./desktop-feedback.js"
), "import": () => import(
  /* @vite-ignore */
  "./desktop-feedback.js"
) }, "$HEAD": { "src": "src/routes/desktop-feedback.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./desktop-feedback.js"
), "import": () => import(
  /* @vite-ignore */
  "./desktop-feedback.js"
) }, "path": "/desktop-feedback", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/desktop-feedback.ts" }, { "page": false, "$GET": { "src": "src/routes/discord.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./discord.js"
), "import": () => import(
  /* @vite-ignore */
  "./discord.js"
) }, "$HEAD": { "src": "src/routes/discord.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./discord.js"
), "import": () => import(
  /* @vite-ignore */
  "./discord.js"
) }, "path": "/discord", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/discord.ts" }, { "page": false, "$DELETE": { "src": "src/routes/docs/[...path].ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "./_...path_.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_.js"
) }, "$GET": { "src": "src/routes/docs/[...path].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./_...path_2.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_2.js"
) }, "$HEAD": { "src": "src/routes/docs/[...path].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./_...path_2.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_2.js"
) }, "$OPTIONS": { "src": "src/routes/docs/[...path].ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "./_...path_3.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_3.js"
) }, "$PATCH": { "src": "src/routes/docs/[...path].ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "./_...path_4.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_4.js"
) }, "$POST": { "src": "src/routes/docs/[...path].ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./_...path_5.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_5.js"
) }, "$PUT": { "src": "src/routes/docs/[...path].ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "./_...path_6.js"
), "import": () => import(
  /* @vite-ignore */
  "./_...path_6.js"
) }, "path": "/docs/*path", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/docs/[...path].ts" }, { "page": false, "$DELETE": { "src": "src/routes/docs/index.ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "./index4.js"
), "import": () => import(
  /* @vite-ignore */
  "./index4.js"
) }, "$GET": { "src": "src/routes/docs/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index5.js"
), "import": () => import(
  /* @vite-ignore */
  "./index5.js"
) }, "$HEAD": { "src": "src/routes/docs/index.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./index5.js"
), "import": () => import(
  /* @vite-ignore */
  "./index5.js"
) }, "$OPTIONS": { "src": "src/routes/docs/index.ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "./index6.js"
), "import": () => import(
  /* @vite-ignore */
  "./index6.js"
) }, "$PATCH": { "src": "src/routes/docs/index.ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "./index7.js"
), "import": () => import(
  /* @vite-ignore */
  "./index7.js"
) }, "$POST": { "src": "src/routes/docs/index.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./index8.js"
), "import": () => import(
  /* @vite-ignore */
  "./index8.js"
) }, "$PUT": { "src": "src/routes/docs/index.ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "./index9.js"
), "import": () => import(
  /* @vite-ignore */
  "./index9.js"
) }, "path": "/docs/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/docs/index.ts" }, { "page": true, "$component": { "src": "src/routes/enterprise/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index10.js"
), "import": () => import(
  /* @vite-ignore */
  "./index10.js"
) }, "path": "/enterprise/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/enterprise/index.tsx" }, { "page": true, "$component": { "src": "src/routes/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index11.js"
), "import": () => import(
  /* @vite-ignore */
  "./index11.js"
) }, "path": "/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/index.tsx" }, { "page": false, "$DELETE": { "src": "src/routes/s/[id].ts?pick=DELETE", "build": () => import(
  /* @vite-ignore */
  "./_id_.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_.js"
) }, "$GET": { "src": "src/routes/s/[id].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./_id_2.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_2.js"
) }, "$HEAD": { "src": "src/routes/s/[id].ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./_id_2.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_2.js"
) }, "$OPTIONS": { "src": "src/routes/s/[id].ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "./_id_3.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_3.js"
) }, "$PATCH": { "src": "src/routes/s/[id].ts?pick=PATCH", "build": () => import(
  /* @vite-ignore */
  "./_id_4.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_4.js"
) }, "$POST": { "src": "src/routes/s/[id].ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./_id_5.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_5.js"
) }, "$PUT": { "src": "src/routes/s/[id].ts?pick=PUT", "build": () => import(
  /* @vite-ignore */
  "./_id_6.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_6.js"
) }, "path": "/s/:id", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/s/[id].ts" }, { "page": false, "$POST": { "src": "src/routes/stripe/webhook.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./webhook.js"
), "import": () => import(
  /* @vite-ignore */
  "./webhook.js"
) }, "path": "/stripe/webhook", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/stripe/webhook.ts" }, { "page": true, "$component": { "src": "src/routes/temp.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./temp.js"
), "import": () => import(
  /* @vite-ignore */
  "./temp.js"
) }, "path": "/temp", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/temp.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/billing/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index12.js"
), "import": () => import(
  /* @vite-ignore */
  "./index12.js"
) }, "path": "/workspace/:id/billing/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index13.js"
), "import": () => import(
  /* @vite-ignore */
  "./index13.js"
) }, "path": "/workspace/:id/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/keys/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index14.js"
), "import": () => import(
  /* @vite-ignore */
  "./index14.js"
) }, "path": "/workspace/:id/keys/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/members/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index15.js"
), "import": () => import(
  /* @vite-ignore */
  "./index15.js"
) }, "path": "/workspace/:id/members/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id]/settings/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index16.js"
), "import": () => import(
  /* @vite-ignore */
  "./index16.js"
) }, "path": "/workspace/:id/settings/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/index.tsx" }, { "page": true, "$component": { "src": "src/routes/workspace/[id].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./_id_7.js"
), "import": () => import(
  /* @vite-ignore */
  "./_id_7.js"
) }, "path": "/workspace/:id", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id].tsx" }, { "page": true, "$component": { "src": "src/routes/workspace.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./workspace.js"
), "import": () => import(
  /* @vite-ignore */
  "./workspace.js"
) }, "path": "/workspace", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx" }, { "page": true, "$component": { "src": "src/routes/zen/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  "./index17.js"
), "import": () => import(
  /* @vite-ignore */
  "./index17.js"
) }, "path": "/zen/", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/index.tsx" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/chat/completions.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./completions.js"
), "import": () => import(
  /* @vite-ignore */
  "./completions.js"
) }, "path": "/zen/v1/chat/completions", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/chat/completions.ts" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/messages.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./messages.js"
), "import": () => import(
  /* @vite-ignore */
  "./messages.js"
) }, "path": "/zen/v1/messages", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/messages.ts" }, { "page": false, "$GET": { "src": "src/routes/zen/v1/models.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./models.js"
), "import": () => import(
  /* @vite-ignore */
  "./models.js"
) }, "$HEAD": { "src": "src/routes/zen/v1/models.ts?pick=GET", "build": () => import(
  /* @vite-ignore */
  "./models.js"
), "import": () => import(
  /* @vite-ignore */
  "./models.js"
) }, "$OPTIONS": { "src": "src/routes/zen/v1/models.ts?pick=OPTIONS", "build": () => import(
  /* @vite-ignore */
  "./models2.js"
), "import": () => import(
  /* @vite-ignore */
  "./models2.js"
) }, "path": "/zen/v1/models", "filePath": "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/v1/models.ts" }, { "page": false, "$POST": { "src": "src/routes/zen/v1/responses.ts?pick=POST", "build": () => import(
  /* @vite-ignore */
  "./responses.js"
), "import": () => import(
  /* @vite-ignore */
  "./responses.js"
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
function matchAPIRoute(path, method) {
  const match = router.lookup(path);
  if (match && match.route) {
    const route = match.route;
    const handler2 = method === "HEAD" ? route.$HEAD || route.$GET : route[`$${method}`];
    if (handler2 === void 0) return;
    const isPage = route.page === true && route.$component !== void 0;
    return {
      handler: handler2,
      params: match.params,
      isPage
    };
  }
  return void 0;
}
function containsHTTP(route) {
  return route["$HEAD"] || route["$GET"] || route["$POST"] || route["$PUT"] || route["$PATCH"] || route["$DELETE"];
}
const router = createRouter$1({
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
var _tmpl$$3 = " ";
const assetMap = {
  style: (props) => ssrElement("style", props.attrs, () => props.children, true),
  link: (props) => ssrElement("link", props.attrs, void 0, true),
  script: (props) => {
    return props.attrs.src ? ssrElement("script", mergeProps(() => props.attrs, {
      get id() {
        return props.key;
      }
    }), () => ssr$1(_tmpl$$3), true) : null;
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
    children: children2
  } = asset;
  return assetMap[tag]({
    attrs: {
      ...attrs,
      nonce
    },
    key,
    children: children2
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
function createBaseHandler(fn, createPageEvent2, options = {}, routerLoad) {
  return eventHandler({
    handler: (e) => {
      const event = getFetchEvent(e);
      return provideRequestEvent(event, async () => {
        const match = matchAPIRoute(new URL(event.request.url).pathname, event.request.method);
        if (match) {
          const mod = await match.handler.import();
          const fn2 = event.request.method === "HEAD" ? mod["HEAD"] || mod["GET"] : mod[event.request.method];
          event.params = match.params || {};
          sharedConfig.context = {
            event
          };
          const res = await fn2(event);
          if (res !== void 0) return res;
          if (event.request.method !== "GET") {
            throw new Error(`API handler for ${event.request.method} "${event.request.url}" did not return a response.`);
          }
          if (!match.isPage) return;
        }
        const context = await createPageEvent2(event);
        const resolvedOptions = typeof options == "function" ? await options(context) : {
          ...options
        };
        const mode = resolvedOptions.mode || "stream";
        if (resolvedOptions.nonce) context.nonce = resolvedOptions.nonce;
        if (mode === "sync" || false) {
          const html = renderToString(() => {
            sharedConfig.context.event = context;
            return fn(context);
          }, resolvedOptions);
          context.complete = true;
          if (context.response && context.response.headers.get("Location")) {
            const status = getExpectedRedirectStatus(context.response);
            return sendRedirect(e, context.response.headers.get("Location"), status);
          }
          return html;
        }
        if (resolvedOptions.onCompleteAll) {
          const og = resolvedOptions.onCompleteAll;
          resolvedOptions.onCompleteAll = (options2) => {
            handleStreamCompleteRedirect(context)(options2);
            og(options2);
          };
        } else resolvedOptions.onCompleteAll = handleStreamCompleteRedirect(context);
        if (resolvedOptions.onCompleteShell) {
          const og = resolvedOptions.onCompleteShell;
          resolvedOptions.onCompleteShell = (options2) => {
            handleShellCompleteRedirect(context, e)();
            og(options2);
          };
        } else resolvedOptions.onCompleteShell = handleShellCompleteRedirect(context, e);
        const stream = renderToStream(() => {
          sharedConfig.context.event = context;
          return fn(context);
        }, resolvedOptions);
        if (context.response && context.response.headers.get("Location")) {
          const status = getExpectedRedirectStatus(context.response);
          return sendRedirect(e, context.response.headers.get("Location"), status);
        }
        if (mode === "async") return stream;
        const {
          writable,
          readable
        } = new TransformStream();
        stream.pipeTo(writable);
        return readable;
      });
    }
  });
}
function handleShellCompleteRedirect(context, e) {
  return () => {
    if (context.response && context.response.headers.get("Location")) {
      const status = getExpectedRedirectStatus(context.response);
      setResponseStatus(e, status);
      setHeader(e, "Location", context.response.headers.get("Location"));
    }
  };
}
function handleStreamCompleteRedirect(context) {
  return ({
    write
  }) => {
    context.complete = true;
    const to = context.response && context.response.headers.get("Location");
    to && write(`<script>window.location="${to}"<\/script>`);
  };
}
function createHandler(fn, options, routerLoad) {
  return createBaseHandler(fn, createPageEvent, options);
}
const createRouterComponent = (router2) => (props) => {
  const {
    base
  } = props;
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), props.base || ""));
  let context;
  const routerState = createRouterContext(router2, branches, () => context, {
    base,
    singleFlight: props.singleFlight,
    transformUrl: props.transformUrl
  });
  router2.create && router2.create(routerState);
  return createComponent$1(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return createComponent$1(Root, {
        routerState,
        get root() {
          return props.root;
        },
        get preload() {
          return props.rootPreload || props.rootLoad;
        },
        get children() {
          return [(context = getOwner()) && null, createComponent$1(Routes, {
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
  return createComponent$1(Show, {
    get when() {
      return props.root;
    },
    keyed: true,
    get fallback() {
      return props.children;
    },
    children: (Root2) => createComponent$1(Root2, {
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
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      dataOnly(e, props.routerState, props.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = props.routerState.matches().map(({
      route,
      path,
      params
    }) => ({
      path: route.originalPath,
      pattern: route.pattern,
      match: path,
      params,
      info: route.info
    }))));
  }
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
  return () => createComponent$1(Show, {
    get when() {
      return child();
    },
    keyed: true,
    children: (child2) => createComponent$1(RouteContextObj.Provider, {
      value: child2,
      get children() {
        return child2.outlet();
      }
    })
  });
};
function dataOnly(event, routerState, branches) {
  const url = new URL(event.request.url);
  const prevMatches = getRouteMatches(branches, new URL(event.router.previousUrl || event.request.url).pathname);
  const matches = getRouteMatches(branches, url.pathname);
  for (let match = 0; match < matches.length; match++) {
    if (!prevMatches[match] || matches[match].route !== prevMatches[match].route) event.router.dataOnly = true;
    const {
      route,
      params
    } = matches[match];
    route.preload && route.preload({
      params,
      location: routerState.location,
      intent: "preload"
    });
  }
}
function intercept([value, setValue], get, set) {
  return [value, set ? (v) => setValue(set(v)) : setValue];
}
function createRouter(config) {
  let ignore = false;
  const wrap = (value) => typeof value === "string" ? {
    value
  } : value;
  const signal = intercept(createSignal(wrap(config.get()), {
    equals: (a, b) => a.value === b.value && a.state === b.state
  }), void 0, (next) => {
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
function bindEvent(target, type, handler2) {
  target.addEventListener(type, handler2);
  return () => target.removeEventListener(type, handler2);
}
function scrollToHash(hash, fallbackTop) {
  const el = hash && document.getElementById(hash);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}
function getPath(url) {
  const u = new URL(url);
  return u.pathname + u.search;
}
function StaticRouter(props) {
  let e;
  const obj = {
    value: props.url || (e = getRequestEvent()) && getPath(e.request.url) || ""
  };
  return createRouterComponent({
    signal: [() => obj, (next) => Object.assign(obj, next)]
  })(props);
}
function setupNativeEvents(preload = true, explicitLinks = false, actionBase = "/_server", transformUrl) {
  return (router2) => {
    const basePath = router2.base.path();
    const navigateFromRoute = router2.navigatorFactory(router2.base);
    let preloadTimeout;
    let lastElement;
    function isSvg(el) {
      return el.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function handleAnchor(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find((el) => el instanceof Node && el.nodeName.toUpperCase() === "A");
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
      const to = router2.parsePath(url.pathname + url.search + url.hash);
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(to, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state ? JSON.parse(state) : void 0
      });
    }
    function handleAnchorPreload(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      router2.preloadRoute(url, a.getAttribute("preload") !== "false");
    }
    function handleAnchorMove(evt) {
      clearTimeout(preloadTimeout);
      const res = handleAnchor(evt);
      if (!res) return lastElement = null;
      const [a, url] = res;
      if (lastElement === a) return;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      preloadTimeout = setTimeout(() => {
        router2.preloadRoute(url, a.getAttribute("preload") !== "false");
        lastElement = a;
      }, 20);
    }
    function handleFormSubmit(evt) {
      if (evt.defaultPrevented) return;
      let actionRef = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : evt.target.getAttribute("action");
      if (!actionRef) return;
      if (!actionRef.startsWith("https://action/")) {
        const url = new URL(actionRef, mockBase);
        actionRef = router2.parsePath(url.pathname + url.search);
        if (!actionRef.startsWith(actionBase)) return;
      }
      if (evt.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const handler2 = actions.get(actionRef);
      if (handler2) {
        evt.preventDefault();
        const data = new FormData(evt.target, evt.submitter);
        handler2.call({
          r: router2,
          f: evt.target
        }, evt.target.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
      }
    }
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
  if (isServer) return StaticRouter(props);
  const getSource = () => {
    const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
    const state = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: url + window.location.hash,
      state
    };
  };
  const beforeLeave = createBeforeLeave();
  return createRouter({
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
    init: (notify) => bindEvent(window, "popstate", notifyIfNotBlocked(notify, (delta) => {
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
      go: (delta) => window.history.go(delta),
      beforeLeave
    }
  })(props);
}
function App() {
  return createComponent$1(Router, {
    explicitLinks: true,
    root: (props) => createComponent$1(MetaProvider, {
      get children() {
        return [createComponent$1(Title, {
          children: "opencode"
        }), createComponent$1(Meta, {
          name: "description",
          content: "OpenCode - The AI coding agent built for the terminal."
        }), createComponent$1(Suspense, {
          get children() {
            return props.children;
          }
        })];
      }
    }),
    get children() {
      return createComponent$1(FileRoutes, {});
    }
  });
}
var _tmpl$$2 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], _tmpl$2$2 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const ErrorBoundary = (props) => {
  const message = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary$1, {
    fallback: (error) => {
      console.error(error);
      return [ssr$1(_tmpl$$2, ssrHydrationKey(), escape(message)), createComponent$1(HttpStatusCode, {
        code: 500
      })];
    },
    get children() {
      return props.children;
    }
  });
};
const TopErrorBoundary = (props) => {
  let isError = false;
  const res = catchError(() => props.children, (err) => {
    console.error(err);
    isError = !!err;
  });
  return isError ? [ssr$1(_tmpl$2$2, ssrHydrationKey()), createComponent$1(HttpStatusCode, {
    code: 500
  })] : res;
};
var _tmpl$$1 = ["<script", ">", "<\/script>"], _tmpl$2$1 = ["<script", ' type="module"', " async", "><\/script>"], _tmpl$3 = ["<script", ' type="module" async', "><\/script>"];
const docType = ssr$1("<!DOCTYPE html>");
function matchRoute(matches, routes2, matched = []) {
  for (let i = 0; i < routes2.length; i++) {
    const segment = routes2[i];
    if (segment.path !== matches[0].path) continue;
    let next = [...matched, segment];
    if (segment.children) {
      const nextMatches = matches.slice(1);
      if (nextMatches.length === 0) continue;
      next = matchRoute(nextMatches, segment.children, next);
      if (!next) continue;
    }
    return next;
  }
}
function StartServer(props) {
  const context = getRequestEvent();
  const nonce = context.nonce;
  let assets = [];
  Promise.resolve().then(async () => {
    let assetPromises = [];
    if (context.router && context.router.matches) {
      const matches = [...context.router.matches];
      while (matches.length && (!matches[0].info || !matches[0].info.filesystem)) matches.shift();
      const matched = matches.length && matchRoute(matches, context.routes);
      if (matched) {
        const inputs = globalThis.MANIFEST["client"].inputs;
        for (let i = 0; i < matched.length; i++) {
          const segment = matched[i];
          const part = inputs[segment["$component"].src];
          assetPromises.push(part.assets());
        }
      }
    }
    assets = await Promise.all(assetPromises).then((a) => (
      // dedupe assets
      [...new Map(a.flat().map((item) => [item.attrs.key, item])).values()].filter((asset) => asset.attrs.rel === "modulepreload" && !context.assets.find((a2) => a2.attrs.key === asset.attrs.key))
    ));
  });
  useAssets(() => assets.length ? assets.map((m) => renderAsset(m)) : void 0);
  return createComponent$1(NoHydration, {
    get children() {
      return [docType, createComponent$1(TopErrorBoundary, {
        get children() {
          return createComponent$1(props.document, {
            get assets() {
              return [createComponent$1(HydrationScript, {}), context.assets.map((m) => renderAsset(m, nonce))];
            },
            get scripts() {
              return nonce ? [ssr$1(_tmpl$$1, ssrHydrationKey() + ssrAttribute("nonce", escape(nonce, true), false), `window.manifest = ${JSON.stringify(context.manifest)}`), ssr$1(_tmpl$2$1, ssrHydrationKey(), ssrAttribute("nonce", escape(nonce, true), false), ssrAttribute("src", escape(globalThis.MANIFEST["client"].inputs[globalThis.MANIFEST["client"].handler].output.path, true), false))] : [ssr$1(_tmpl$$1, ssrHydrationKey(), `window.manifest = ${JSON.stringify(context.manifest)}`), ssr$1(_tmpl$3, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST["client"].inputs[globalThis.MANIFEST["client"].handler].output.path, true), false))];
            },
            get children() {
              return createComponent$1(Hydration, {
                get children() {
                  return createComponent$1(ErrorBoundary, {
                    get children() {
                      return createComponent$1(App, {});
                    }
                  });
                }
              });
            }
          });
        }
      })];
    }
  });
}
var _tmpl$ = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.svg"><meta property="og:image" content="/social-share.png"><meta property="twitter:image" content="/social-share.png">', "</head>"], _tmpl$2 = ["<html", ' lang="en">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const handler = createHandler(() => createComponent$1(StartServer, {
  document: ({
    assets,
    children: children2,
    scripts
  }) => ssr$1(_tmpl$2, ssrHydrationKey(), createComponent$1(NoHydration, {
    get children() {
      return ssr$1(_tmpl$, escape(assets));
    }
  }), escape(children2), escape(scripts))
}), {
  mode: "async"
});
const ssr = eventHandler({ onRequest: middleware.onRequest, onBeforeResponse: middleware.onBeforeResponse, handler, websocket: handler.__websocket__ });
export {
  ssr as default
};
