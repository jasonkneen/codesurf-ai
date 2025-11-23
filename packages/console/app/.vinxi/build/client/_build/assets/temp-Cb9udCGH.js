import { D as onMount, i as getNextElement, v as getNextMarker, l as insert, b as createComponent, w as setAttribute, t as template, f as onCleanup } from './web-B4FMlVCr.js';
/* empty css               */
import { T as Title } from './index-BZyZejwR.js';
import { l as logoLight, a as logoDark } from './logo-ornate-dark-BX3xCqAP.js';
import { I as IconCopy, a as IconCheck } from './icon-phIboNhp.js';

const IMG_SPLASH = "/_build/assets/screenshot-splash-maVcFZZe.png";

var _tmpl$ = /* @__PURE__ */ template(`<div data-component=copy-status><!$><!/><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<main data-page=home><!$><!/><div data-component=content><section data-component=top><img data-slot="logo light"alt="opencode logo light"><img data-slot="logo dark"alt="opencode logo dark"><h1 data-slot=title>The AI coding agent built for the terminal</h1><div data-slot=login><a href=/auth>opencode zen</a></div></section><section data-component=cta><div data-slot=left><a href=/docs>Get Started</a></div><div data-slot=center><a href=/auth>opencode zen</a></div><div data-slot=right><button data-copy data-slot=command><span><span>curl -fsSL </span><span data-slot=protocol>https://</span><span data-slot=highlight>opencode.ai/install</span><span> | bash</span></span><!$><!/></button></div></section><section data-component=features><ul data-slot=list><li><strong>Native TUI</strong> A responsive, native, themeable terminal UI</li><li><strong>LSP enabled</strong> Automatically loads the right LSPs for the LLM</li><li><strong>opencode zen</strong> A <a href=/docs/zen>curated list of models</a> provided by opencode <label>New</label></li><li><strong>Multi-session</strong> Start multiple agents in parallel on the same project</li><li><strong>Shareable links</strong> Share a link to any sessions for reference or to debug</li><li><strong>Claude Pro</strong> Log in with Anthropic to use your Claude Pro or Max account</li><li><strong>Use any model</strong> Supports 75+ LLM providers through <a href=https://models.dev>Models.dev</a>, including local models</li></ul></section><section data-component=install><div data-component=method><h3 data-component=title>npm</h3><button data-copy data-slot=button><span>npm install -g <strong>opencode-ai</strong></span><!$><!/></button></div><div data-component=method><h3 data-component=title>bun</h3><button data-copy data-slot=button><span>bun install -g <strong>opencode-ai</strong></span><!$><!/></button></div><div data-component=method><h3 data-component=title>homebrew</h3><button data-copy data-slot=button><span>brew install <strong>opencode</strong></span><!$><!/></button></div><div data-component=method><h3 data-component=title>paru</h3><button data-copy data-slot=button><span>paru -S <strong>opencode-bin</strong></span><!$><!/></button></div></section><section data-component=screenshots><figure><figcaption>opencode TUI with the tokyonight theme</figcaption><a href=/docs/cli><img alt="opencode TUI with tokyonight theme"></a></figure></section><footer data-component=footer><div data-slot=cell><a href=https://x.com/opencode>X.com</a></div><div data-slot=cell><a href=https://github.com/sst/opencode>GitHub</a></div><div data-slot=cell><a href=https://opencode.ai/discord>Discord</a></div></footer></div><div data-component=legal><span>©2025 <a href=https://anoma.ly>Anomaly`);
function CopyStatus() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    insert(_el$, createComponent(IconCopy, {
      "data-slot": "copy"
    }), _el$3, _co$);
    insert(_el$, createComponent(IconCheck, {
      "data-slot": "check"
    }), _el$5, _co$2);
    return _el$;
  })();
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
  return (() => {
    var _el$6 = getNextElement(_tmpl$2), _el$48 = _el$6.firstChild, [_el$49, _co$8] = getNextMarker(_el$48.nextSibling), _el$7 = _el$49.nextSibling, _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$8.nextSibling, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild, _el$15 = _el$14.nextSibling, [_el$16, _co$3] = getNextMarker(_el$15.nextSibling), _el$17 = _el$1.nextSibling, _el$18 = _el$17.nextSibling, _el$19 = _el$18.firstChild, _el$20 = _el$19.firstChild, _el$21 = _el$20.nextSibling, _el$22 = _el$21.firstChild, _el$23 = _el$22.nextSibling, [_el$24, _co$4] = getNextMarker(_el$23.nextSibling), _el$25 = _el$19.nextSibling, _el$26 = _el$25.firstChild, _el$27 = _el$26.nextSibling, _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling, [_el$30, _co$5] = getNextMarker(_el$29.nextSibling), _el$31 = _el$25.nextSibling, _el$32 = _el$31.firstChild, _el$33 = _el$32.nextSibling, _el$34 = _el$33.firstChild, _el$35 = _el$34.nextSibling, [_el$36, _co$6] = getNextMarker(_el$35.nextSibling), _el$37 = _el$31.nextSibling, _el$38 = _el$37.firstChild, _el$39 = _el$38.nextSibling, _el$40 = _el$39.firstChild, _el$41 = _el$40.nextSibling, [_el$42, _co$7] = getNextMarker(_el$41.nextSibling), _el$43 = _el$18.nextSibling, _el$44 = _el$43.firstChild, _el$45 = _el$44.firstChild, _el$46 = _el$45.nextSibling, _el$47 = _el$46.firstChild;
    insert(_el$6, createComponent(Title, {
      children: "opencode | AI coding agent built for the terminal"
    }), _el$49, _co$8);
    setAttribute(_el$9, "src", logoLight);
    setAttribute(_el$0, "src", logoDark);
    insert(_el$13, createComponent(CopyStatus, {}), _el$16, _co$3);
    insert(_el$21, createComponent(CopyStatus, {}), _el$24, _co$4);
    insert(_el$27, createComponent(CopyStatus, {}), _el$30, _co$5);
    insert(_el$33, createComponent(CopyStatus, {}), _el$36, _co$6);
    insert(_el$39, createComponent(CopyStatus, {}), _el$42, _co$7);
    setAttribute(_el$47, "src", IMG_SPLASH);
    return _el$6;
  })();
}

export { Home as default };
