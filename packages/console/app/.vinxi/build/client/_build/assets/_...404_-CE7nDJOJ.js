import { i as getNextElement, v as getNextMarker, l as insert, b as createComponent, w as setAttribute, t as template } from './web-B4FMlVCr.js';
import { T as Title } from './index-BZyZejwR.js';
import { H as HttpStatusCode } from './HttpStatusCode-B9tIHqYd.js';
import { l as logoLight, a as logoDark } from './logo-ornate-dark-BX3xCqAP.js';

var _tmpl$ = /* @__PURE__ */ template(`<main data-page=not-found><!$><!/><!$><!/><div data-component=content><section data-component=top><a href=/ data-slot=logo-link><img data-slot="logo light"alt="opencode logo light"><img data-slot="logo dark"alt="opencode logo dark"></a><h1 data-slot=title>404 - Page Not Found</h1></section><section data-component=actions><div data-slot=action><a href=/>Home</a></div><div data-slot=action><a href=/docs>Docs</a></div><div data-slot=action><a href=https://github.com/sst/opencode>GitHub</a></div><div data-slot=action><a href=/discord>Discord`);
function NotFound() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$7 = _el$.firstChild, [_el$8, _co$] = getNextMarker(_el$7.nextSibling), _el$9 = _el$8.nextSibling, [_el$0, _co$2] = getNextMarker(_el$9.nextSibling), _el$2 = _el$0.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling;
    insert(_el$, createComponent(Title, {
      children: "Not Found | opencode"
    }), _el$8, _co$);
    insert(_el$, createComponent(HttpStatusCode, {
      code: 404
    }), _el$0, _co$2);
    setAttribute(_el$5, "src", logoLight);
    setAttribute(_el$6, "src", logoDark);
    return _el$;
  })();
}

export { NotFound as default };
