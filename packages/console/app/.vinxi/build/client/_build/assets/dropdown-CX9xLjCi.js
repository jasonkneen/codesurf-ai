import { h as delegateEvents, A as createEffect, f as onCleanup, i as getNextElement, t as template, v as getNextMarker, l as insert, m as memo, b as createComponent, y as createRenderEffect, w as setAttribute, S as Show, J as className, r as runHydrationEvents, x as addEventListener, I as use } from './web-B4FMlVCr.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { m as IconChevron } from './icon-phIboNhp.js';

var _tmpl$ = /* @__PURE__ */ template(`<div data-slot=dropdown>`), _tmpl$2 = /* @__PURE__ */ template(`<div data-component=dropdown><button data-slot=trigger type=button><!$><!/><!$><!/></button><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<span>`), _tmpl$4 = /* @__PURE__ */ template(`<button data-slot=item>`);
function Dropdown(props) {
  const [store, setStore] = createStore({
    isOpen: props.open ?? false
  });
  let dropdownRef;
  createEffect(() => {
    if (props.open !== void 0) {
      setStore("isOpen", props.open);
    }
  });
  createEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setStore("isOpen", false);
        props.onOpenChange?.(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    onCleanup(() => document.removeEventListener("click", handleClickOutside));
  });
  const toggle = () => {
    const newValue = !store.isOpen;
    setStore("isOpen", newValue);
    props.onOpenChange?.(newValue);
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling), _el$8 = _el$2.nextSibling, [_el$9, _co$3] = getNextMarker(_el$8.nextSibling);
    var _ref$ = dropdownRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : dropdownRef = _el$;
    _el$2.$$click = toggle;
    insert(_el$2, (() => {
      var _c$ = memo(() => typeof props.trigger === "string");
      return () => _c$() ? (() => {
        var _el$0 = getNextElement(_tmpl$3);
        insert(_el$0, () => props.trigger);
        return _el$0;
      })() : props.trigger;
    })(), _el$4, _co$);
    insert(_el$2, createComponent(IconChevron, {
      "data-slot": "chevron"
    }), _el$6, _co$2);
    insert(_el$, createComponent(Show, {
      get when() {
        return store.isOpen;
      },
      get children() {
        var _el$7 = getNextElement(_tmpl$);
        insert(_el$7, () => props.children);
        createRenderEffect(() => setAttribute(_el$7, "data-align", props.align ?? "left"));
        return _el$7;
      }
    }), _el$9, _co$3);
    createRenderEffect(() => className(_el$, props.class));
    runHydrationEvents();
    return _el$;
  })();
}
function DropdownItem(props) {
  return (() => {
    var _el$1 = getNextElement(_tmpl$4);
    addEventListener(_el$1, "click", props.onClick, true);
    insert(_el$1, () => props.children);
    createRenderEffect((_p$) => {
      var _v$ = props.selected ?? false, _v$2 = props.type ?? "button";
      _v$ !== _p$.e && setAttribute(_el$1, "data-selected", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$1, "type", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$1;
  })();
}
delegateEvents(["click"]);

export { Dropdown as D, DropdownItem as a };
