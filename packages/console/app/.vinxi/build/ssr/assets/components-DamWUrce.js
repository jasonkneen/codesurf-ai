import { ssrElement, mergeProps as mergeProps$1 } from "solid-js/web";
import { mergeProps, splitProps, createMemo } from "solid-js";
import { o as useResolvedPath, p as useHref, t as useLocation, v as normalizePath } from "./query-D38s0pjD.js";
function A(props) {
  props = mergeProps({
    inactiveClass: "inactive",
    activeClass: "active"
  }, props);
  const [, rest] = splitProps(props, ["href", "state", "class", "activeClass", "inactiveClass", "end"]);
  const to = useResolvedPath(() => props.href);
  const href = useHref(to);
  const location = useLocation();
  const isActive = createMemo(() => {
    const to_ = to();
    if (to_ === void 0) return [false, false];
    const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
    const loc = decodeURI(normalizePath(location.pathname).toLowerCase());
    return [props.end ? path === loc : loc.startsWith(path + "/") || loc === path, path === loc];
  });
  return ssrElement("a", mergeProps$1(rest, {
    get href() {
      return href() || props.href;
    },
    get state() {
      return JSON.stringify(props.state);
    },
    get classList() {
      return {
        ...props.class && {
          [props.class]: true
        },
        [props.inactiveClass]: !isActive()[0],
        [props.activeClass]: isActive()[0],
        ...rest.classList
      };
    },
    link: true,
    get ["aria-current"]() {
      return isActive()[1] ? "page" : void 0;
    }
  }), void 0, true);
}
export {
  A
};
