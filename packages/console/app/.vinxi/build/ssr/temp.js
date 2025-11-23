import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from "solid-js/web";
/* empty css                      */
import { T as Title } from "./assets/index-D2bc-ZG5.js";
import { onMount, onCleanup } from "solid-js";
import { l as logoLight, a as logoDark } from "./assets/logo-ornate-dark-DH7mkrML.js";
import { I as IconCopy, a as IconCheck } from "./assets/icon-CHGNImcU.js";
const IMG_SPLASH = "/_build/assets/screenshot-splash-maVcFZZe.png";
var _tmpl$ = ["<div", ' data-component="copy-status"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<main", ' data-page="home"><!--$-->', '<!--/--><div data-component="content"><section data-component="top"><img data-slot="logo light"', ' alt="opencode logo light"><img data-slot="logo dark"', ' alt="opencode logo dark"><h1 data-slot="title">The AI coding agent built for the terminal</h1><div data-slot="login"><a href="/auth">opencode zen</a></div></section><section data-component="cta"><div data-slot="left"><a href="/docs">Get Started</a></div><div data-slot="center"><a href="/auth">opencode zen</a></div><div data-slot="right"><button data-copy data-slot="command"><span><span>curl -fsSL </span><span data-slot="protocol">https://</span><span data-slot="highlight">opencode.ai/install</span><span> | bash</span></span><!--$-->', '<!--/--></button></div></section><section data-component="features"><ul data-slot="list"><li><strong>Native TUI</strong> A responsive, native, themeable terminal UI</li><li><strong>LSP enabled</strong> Automatically loads the right LSPs for the LLM</li><li><strong>opencode zen</strong> A <a href="/docs/zen">curated list of models</a> provided by opencode <label>New</label></li><li><strong>Multi-session</strong> Start multiple agents in parallel on the same project</li><li><strong>Shareable links</strong> Share a link to any sessions for reference or to debug</li><li><strong>Claude Pro</strong> Log in with Anthropic to use your Claude Pro or Max account</li><li><strong>Use any model</strong> Supports 75+ LLM providers through <a href="https://models.dev">Models.dev</a>, including local models</li></ul></section><section data-component="install"><div data-component="method"><h3 data-component="title">npm</h3><button data-copy data-slot="button"><span>npm install -g <strong>opencode-ai</strong></span><!--$-->', '<!--/--></button></div><div data-component="method"><h3 data-component="title">bun</h3><button data-copy data-slot="button"><span>bun install -g <strong>opencode-ai</strong></span><!--$-->', '<!--/--></button></div><div data-component="method"><h3 data-component="title">homebrew</h3><button data-copy data-slot="button"><span>brew install <strong>opencode</strong></span><!--$-->', '<!--/--></button></div><div data-component="method"><h3 data-component="title">paru</h3><button data-copy data-slot="button"><span>paru -S <strong>opencode-bin</strong></span><!--$-->', '<!--/--></button></div></section><section data-component="screenshots"><figure><figcaption>opencode TUI with the tokyonight theme</figcaption><a href="/docs/cli"><img', ' alt="opencode TUI with tokyonight theme"></a></figure></section><footer data-component="footer"><div data-slot="cell"><a href="https://x.com/opencode">X.com</a></div><div data-slot="cell"><a href="https://github.com/sst/opencode">GitHub</a></div><div data-slot="cell"><a href="https://opencode.ai/discord">Discord</a></div></footer></div><div data-component="legal"><span>©2025 <a href="https://anoma.ly">Anomaly</a></span></div></main>'];
function CopyStatus() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(IconCopy, {
    "data-slot": "copy"
  })), escape(createComponent(IconCheck, {
    "data-slot": "check"
  })));
}
function Home() {
  onMount(() => {
    const commands = document.querySelectorAll("[data-copy]");
    for (const button of commands) {
      const callback = () => {
        const text = button.textContent;
        if (text) {
          navigator.clipboard.writeText(text);
          button.setAttribute("data-copied", "");
          setTimeout(() => {
            button.removeAttribute("data-copied");
          }, 1500);
        }
      };
      button.addEventListener("click", callback);
      onCleanup(() => {
        button.removeEventListener("click", callback);
      });
    }
  });
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Title, {
    children: "opencode | AI coding agent built for the terminal"
  })), ssrAttribute("src", escape(logoLight, true), false), ssrAttribute("src", escape(logoDark, true), false), escape(createComponent(CopyStatus, {})), escape(createComponent(CopyStatus, {})), escape(createComponent(CopyStatus, {})), escape(createComponent(CopyStatus, {})), escape(createComponent(CopyStatus, {})), ssrAttribute("src", escape(IMG_SPLASH, true), false));
}
export {
  Home as default
};
