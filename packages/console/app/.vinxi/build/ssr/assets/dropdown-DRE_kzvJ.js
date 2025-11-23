import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createEffect, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { l as IconChevron } from "./icon-CHGNImcU.js";
var _tmpl$ = ["<div", ' data-slot="dropdown"', ">", "</div>"], _tmpl$2 = ["<div", ' data-component="dropdown"', '><button data-slot="trigger" type="button"><!--$-->', "<!--/--><!--$-->", "<!--/--></button><!--$-->", "<!--/--></div>"], _tmpl$3 = ["<span", ">", "</span>"], _tmpl$4 = ["<button", ' data-slot="item"', ">", "</button>"];
function Dropdown(props) {
  const [store, setStore] = createStore({
    isOpen: props.open ?? false
  });
  createEffect(() => {
    if (props.open !== void 0) {
      setStore("isOpen", props.open);
    }
  });
  createEffect(() => {
    const handleClickOutside = (event) => {
    };
    document.addEventListener("click", handleClickOutside);
    onCleanup(() => document.removeEventListener("click", handleClickOutside));
  });
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("class", escape(props.class, true), false), typeof props.trigger === "string" ? ssr(_tmpl$3, ssrHydrationKey(), escape(props.trigger)) : escape(props.trigger), escape(createComponent(IconChevron, {
    "data-slot": "chevron"
  })), escape(createComponent(Show, {
    get when() {
      return store.isOpen;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("data-align", escape(props.align, true) ?? "left", false), escape(props.children));
    }
  })));
}
function DropdownItem(props) {
  return ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("data-selected", escape(props.selected, true) ?? escape(false, true), false) + ssrAttribute("type", escape(props.type, true) ?? "button", false), escape(props.children));
}
export {
  Dropdown as D,
  DropdownItem as a
};
