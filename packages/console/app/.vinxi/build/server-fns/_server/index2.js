import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from "solid-js/web";
import { T as Title, L as Link, M as Meta } from "./assets/index-DaW7GtZQ.js";
import { H as Header, F as Footer, L as Legal } from "./assets/legal-DqlkVGvI.js";
import { c as config } from "./assets/config-DvKqrD3y.js";
import "solid-js";
import "./assets/logo-ornate-dark-DH7mkrML.js";
import "solid-js/store";
import "./assets/query-BtW4eurP.js";
import "./assets/createAsync-NuC5SOD6.js";
import "./assets/components-Dn0kODL0.js";
import "./assets/server-fns-runtime-DkWzG_ke.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
const previewLogoLight = "/_server/assets/preview-opencode-logo-light-B5i-Y4z2.png";
const previewLogoDark = "/_server/assets/preview-opencode-logo-dark-ZBwNGoYp.png";
const previewWordmarkLight = "/_server/assets/preview-opencode-wordmark-light-nzmKQT2r.png";
const previewWordmarkDark = "/_server/assets/preview-opencode-wordmark-dark-tZ1Y3VXe.png";
const previewWordmarkSimpleLight = "/_server/assets/preview-opencode-wordmark-simple-light-JrIbT-1j.png";
const previewWordmarkSimpleDark = "/_server/assets/preview-opencode-wordmark-simple-dark-B7-F9tPh.png";
var _tmpl$ = ["<main", ' data-page="enterprise"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div data-component="container"><!--$-->', '<!--/--><div data-component="content"><section data-component="brand-content"><h1>Brand guidelines</h1><p>Resources and assets to help you work with the OpenCode brand.</p><button data-component="download-button">Download all assets<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><div data-component="brand-grid"><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div><div><img', ' alt="OpenCode brand guidelines"><div data-component="actions"><button>PNG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><button>SVG<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9583 10.6247L10 14.583L6.04167 10.6247M10 2.08301V13.958M16.25 17.9163H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button></div></div></div></section></div><!--$-->', "<!--/--></div><!--$-->", "<!--/--></main>"];
function Brand() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Title, {
    children: "OpenCode | Brand"
  })), escape(createComponent(Link, {
    rel: "canonical",
    get href() {
      return `${config.baseUrl}/brand`;
    }
  })), escape(createComponent(Meta, {
    name: "description",
    content: "OpenCode brand guidelines"
  })), escape(createComponent(Header, {})), ssrAttribute("src", escape(previewLogoLight, true), false), ssrAttribute("src", escape(previewLogoDark, true), false), ssrAttribute("src", escape(previewWordmarkLight, true), false), ssrAttribute("src", escape(previewWordmarkDark, true), false), ssrAttribute("src", escape(previewWordmarkSimpleLight, true), false), ssrAttribute("src", escape(previewWordmarkSimpleDark, true), false), escape(createComponent(Footer, {})), escape(createComponent(Legal, {})));
}
export {
  Brand as default
};
