import { isServer, getRequestEvent, ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from "solid-js/web";
import { T as Title } from "./assets/index-DaW7GtZQ.js";
import { onCleanup } from "solid-js";
import { l as logoLight, a as logoDark } from "./assets/logo-ornate-dark-DH7mkrML.js";
const HttpStatusCode = isServer ? (props) => {
  const event = getRequestEvent();
  event.response.status = props.code;
  event.response.statusText = props.text;
  onCleanup(() => !event.nativeEvent.handled && !event.complete && (event.response.status = 200));
  return null;
} : (_props) => null;
var _tmpl$ = ["<main", ' data-page="not-found"><!--$-->', "<!--/--><!--$-->", '<!--/--><div data-component="content"><section data-component="top"><a href="/" data-slot="logo-link"><img data-slot="logo light"', ' alt="opencode logo light"><img data-slot="logo dark"', ' alt="opencode logo dark"></a><h1 data-slot="title">404 - Page Not Found</h1></section><section data-component="actions"><div data-slot="action"><a href="/">Home</a></div><div data-slot="action"><a href="/docs">Docs</a></div><div data-slot="action"><a href="https://github.com/sst/opencode">GitHub</a></div><div data-slot="action"><a href="/discord">Discord</a></div></section></div></main>'];
function NotFound() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Title, {
    children: "Not Found | opencode"
  })), escape(createComponent(HttpStatusCode, {
    code: 404
  })), ssrAttribute("src", escape(logoLight, true), false), ssrAttribute("src", escape(logoDark, true), false));
}
export {
  NotFound as default
};
