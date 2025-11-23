import { A as createEffect, y as createRenderEffect, a as createMemo, B as useContext, C as createContext, e as createSignal, D as onMount, f as onCleanup, o as on, k as mergeProps, F as createComputed, b as createComponent, G as createUniqueId, H as splitProps, S as Show, m as memo, i as getNextElement, v as getNextMarker, l as insert, w as setAttribute, t as template, h as delegateEvents, r as runHydrationEvents } from './web-B4FMlVCr.js';
/* empty css               */
import { T as Title, L as Link, a as Meta } from './index-BZyZejwR.js';
import { H as HttpHeader, E as EmailSignup } from './email-signup-CG9qNeuw.js';
import { I as IconCopy, a as IconCheck } from './icon-phIboNhp.js';
import { a as asArray, b as access, t as tryOnCleanup, i as isString, c as isNumber, f as focusWithoutScrolling, s as scrollIntoView, d as callHandler, g as getFocusableTreeWalker, m as mergeDefaultProps, e as isAppleDevice, h as isMac, j as createControllableSignal, k as createControllableArraySignal, l as getDocument, n as addItemToArray, o as filterNonNullable, p as handleDiffArray, _ as __export, P as Polymorphic, q as src_default, r as mergeRefs, u as combineStyle, v as composeEventHandlers, w as isWebKit, F as Faq } from './faq-2C9dHwiF.js';
import { c as config, g as github, H as Header, F as Footer, L as Legal } from './legal-DluzAPvH.js';
import { c as createAsync } from './server-runtime-BVQMvLQK.js';
import { A } from './components-D9Uvz6lf.js';
import './action-BpQ-vK1N.js';
import './query-C7ETZYOA.js';
import './logo-ornate-dark-BX3xCqAP.js';
import './store-CSXr9rVx.js';

function makeEventListener(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return tryOnCleanup(target.removeEventListener.bind(target, type, handler, options));
}
function createEventListener(targets, type, handler, options) {
  const attachListeners = () => {
    asArray(access(targets)).forEach(el => {
      if (el) asArray(access(type)).forEach(type => makeEventListener(el, type, handler, options));
    });
  };
  // if the target is an accessor the listeners will be added on the first effect (onMount)
  // so that when passed a jsx ref it will be availabe
  if (typeof targets === "function") createEffect(attachListeners);
  // if the target prop is NOT an accessor, the event listeners can be added right away
  else createRenderEffect(attachListeners);
}
// // /* TypeCheck */
// const mouseHandler = (e: MouseEvent) => {};
// const touchHandler = (e: TouchEvent) => {};
// const el = document.createElement("div");
// // dom events
// createEventListener(window as Window | undefined, "mousemove", mouseHandler);
// createEventListener(document, "touchstart", touchHandler);
// createEventListener(el, "mousemove", mouseHandler);
// createEventListener(() => el, "touchstart", touchHandler);
// const mouseSignal = createEventSignal(window, "mousemove");
// const touchSignal = createEventSignal(() => document, "touchstart");
// // custom events
// createEventListener<{ test: MouseEvent }>(window, "test", mouseHandler);
// createEventListener<{ test: Event; custom: MouseEvent }, "custom">(
//   () => el,
//   "custom",
//   mouseHandler
// );
// createEventListener<{ test: Event }>(new EventTarget(), "test", () => console.log("test"));
// const testSignal = createEventSignal<{ test: MouseEvent }>(window, "test");
// const customSignal = createEventSignal<{ test: Event; custom: MouseEvent }, "custom">(
//   () => document,
//   "custom"
// );
// // directive
// eventListener(el, () => ["mousemove", mouseHandler, { passive: true }]);
// eventListener(el, () => ["custom", e => {}]);

const video = "/_build/assets/opencode-min-Chv3y3qO.mp4";

const videoPoster = "/_build/assets/opencode-poster-CbUiDHgA.png";

var TabsKeyboardDelegate = class {
  collection;
  direction;
  orientation;
  constructor(collection, direction, orientation) {
    this.collection = collection;
    this.direction = direction;
    this.orientation = orientation;
  }
  flipDirection() {
    return this.direction() === "rtl" && this.orientation() === "horizontal";
  }
  getKeyLeftOf(key) {
    if (this.flipDirection()) {
      return this.getNextKey(key);
    }
    if (this.orientation() === "horizontal") {
      return this.getPreviousKey(key);
    }
    return void 0;
  }
  getKeyRightOf(key) {
    if (this.flipDirection()) {
      return this.getPreviousKey(key);
    }
    if (this.orientation() === "horizontal") {
      return this.getNextKey(key);
    }
    return void 0;
  }
  getKeyAbove(key) {
    if (this.orientation() === "vertical") {
      return this.getPreviousKey(key);
    }
    return void 0;
  }
  getKeyBelow(key) {
    if (this.orientation() === "vertical") {
      return this.getNextKey(key);
    }
    return void 0;
  }
  getFirstKey() {
    let key = this.collection().getFirstKey();
    if (key == null) {
      return;
    }
    const item = this.collection().getItem(key);
    if (item?.disabled) {
      key = this.getNextKey(key);
    }
    return key;
  }
  getLastKey() {
    let key = this.collection().getLastKey();
    if (key == null) {
      return;
    }
    const item = this.collection().getItem(key);
    if (item?.disabled) {
      key = this.getPreviousKey(key);
    }
    return key;
  }
  getNextKey(key) {
    let nextKey = key;
    let nextItem;
    do {
      nextKey = this.collection().getKeyAfter(nextKey) ?? this.collection().getFirstKey();
      if (nextKey == null) {
        return;
      }
      nextItem = this.collection().getItem(nextKey);
      if (nextItem == null) {
        return;
      }
    } while (nextItem.disabled);
    return nextKey;
  }
  getPreviousKey(key) {
    let previousKey = key;
    let previousItem;
    do {
      previousKey = this.collection().getKeyBefore(previousKey) ?? this.collection().getLastKey();
      if (previousKey == null) {
        return;
      }
      previousItem = this.collection().getItem(previousKey);
      if (previousItem == null) {
        return;
      }
    } while (previousItem.disabled);
    return previousKey;
  }
};

function buildNodes(params) {
  let index = params.startIndex ?? 0;
  const level = params.startLevel ?? 0;
  const nodes = [];
  const getKey = (data) => {
    if (data == null) {
      return "";
    }
    const _getKey = params.getKey ?? "key";
    const dataKey = isString(_getKey) ? data[_getKey] : _getKey(data);
    return dataKey != null ? String(dataKey) : "";
  };
  const getTextValue = (data) => {
    if (data == null) {
      return "";
    }
    const _getTextValue = params.getTextValue ?? "textValue";
    const dataTextValue = isString(_getTextValue) ? data[_getTextValue] : _getTextValue(data);
    return dataTextValue != null ? String(dataTextValue) : "";
  };
  const getDisabled = (data) => {
    if (data == null) {
      return false;
    }
    const _getDisabled = params.getDisabled ?? "disabled";
    return (isString(_getDisabled) ? data[_getDisabled] : _getDisabled(data)) ?? false;
  };
  const getSectionChildren = (data) => {
    if (data == null) {
      return void 0;
    }
    if (isString(params.getSectionChildren)) {
      return data[params.getSectionChildren];
    }
    return params.getSectionChildren?.(data);
  };
  for (const data of params.dataSource) {
    if (isString(data) || isNumber(data)) {
      nodes.push({
        type: "item",
        rawValue: data,
        key: String(data),
        textValue: String(data),
        disabled: getDisabled(data),
        level,
        index
      });
      index++;
      continue;
    }
    if (getSectionChildren(data) != null) {
      nodes.push({
        type: "section",
        rawValue: data,
        key: "",
        // not applicable here
        textValue: "",
        // not applicable here
        disabled: false,
        // not applicable here
        level,
        index
      });
      index++;
      const sectionChildren = getSectionChildren(data) ?? [];
      if (sectionChildren.length > 0) {
        const childNodes = buildNodes({
          dataSource: sectionChildren,
          getKey: params.getKey,
          getTextValue: params.getTextValue,
          getDisabled: params.getDisabled,
          getSectionChildren: params.getSectionChildren,
          startIndex: index,
          startLevel: level + 1
        });
        nodes.push(...childNodes);
        index += childNodes.length;
      }
    } else {
      nodes.push({
        type: "item",
        rawValue: data,
        key: getKey(data),
        textValue: getTextValue(data),
        disabled: getDisabled(data),
        level,
        index
      });
      index++;
    }
  }
  return nodes;
}
function createCollection(props, deps = []) {
  return createMemo(() => {
    const nodes = buildNodes({
      dataSource: access(props.dataSource),
      getKey: access(props.getKey),
      getTextValue: access(props.getTextValue),
      getDisabled: access(props.getDisabled),
      getSectionChildren: access(props.getSectionChildren)
    });
    for (let i = 0; i < deps.length; i++) deps[i]();
    return props.factory(nodes);
  });
}

var RTL_SCRIPTS = /* @__PURE__ */ new Set(["Avst", "Arab", "Armi", "Syrc", "Samr", "Mand", "Thaa", "Mend", "Nkoo", "Adlm", "Rohg", "Hebr"]);
var RTL_LANGS = /* @__PURE__ */ new Set(["ae", "ar", "arc", "bcc", "bqi", "ckb", "dv", "fa", "glk", "he", "ku", "mzn", "nqo", "pnb", "ps", "sd", "ug", "ur", "yi"]);
function isRTL(locale) {
  if (Intl.Locale) {
    const script = new Intl.Locale(locale).maximize().script ?? "";
    return RTL_SCRIPTS.has(script);
  }
  const lang = locale.split("-")[0];
  return RTL_LANGS.has(lang);
}
function getReadingDirection(locale) {
  return isRTL(locale) ? "rtl" : "ltr";
}
function getDefaultLocale() {
  let locale = typeof navigator !== "undefined" && // @ts-ignore
  (navigator.language || navigator.userLanguage) || "en-US";
  try {
    Intl.DateTimeFormat.supportedLocalesOf([locale]);
  } catch (_err) {
    locale = "en-US";
  }
  return {
    locale,
    direction: getReadingDirection(locale)
  };
}
var currentLocale = getDefaultLocale();
var listeners = /* @__PURE__ */ new Set();
function updateLocale() {
  currentLocale = getDefaultLocale();
  for (const listener of listeners) {
    listener(currentLocale);
  }
}
function createDefaultLocale() {
  const [defaultClientLocale, setDefaultClientLocale] = createSignal(currentLocale);
  const defaultLocale = createMemo(() => defaultClientLocale());
  onMount(() => {
    if (listeners.size === 0) {
      window.addEventListener("languagechange", updateLocale);
    }
    listeners.add(setDefaultClientLocale);
    onCleanup(() => {
      listeners.delete(setDefaultClientLocale);
      if (listeners.size === 0) {
        window.removeEventListener("languagechange", updateLocale);
      }
    });
  });
  return {
    locale: () => defaultLocale().locale,
    direction: () => defaultLocale().direction
  };
}
var I18nContext = createContext();
function useLocale() {
  const defaultLocale = createDefaultLocale();
  const context = useContext(I18nContext);
  return context || defaultLocale;
}

var Selection = class _Selection extends Set {
  anchorKey;
  currentKey;
  constructor(keys, anchorKey, currentKey) {
    super(keys);
    if (keys instanceof _Selection) {
      this.anchorKey = anchorKey || keys.anchorKey;
      this.currentKey = currentKey || keys.currentKey;
    } else {
      this.anchorKey = anchorKey;
      this.currentKey = currentKey;
    }
  }
};
function createControllableSelectionSignal(props) {
  const [_value, setValue] = createControllableSignal(props);
  const value = () => _value() ?? new Selection();
  return [value, setValue];
}
function isNonContiguousSelectionModifier(e) {
  return isAppleDevice() ? e.altKey : e.ctrlKey;
}
function isCtrlKeyPressed(e) {
  if (isMac()) {
    return e.metaKey;
  }
  return e.ctrlKey;
}
function convertSelection(selection) {
  return new Selection(selection);
}
function isSameSelection(setA, setB) {
  if (setA.size !== setB.size) {
    return false;
  }
  for (const item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }
  return true;
}
function createMultipleSelectionState(props) {
  const mergedProps = mergeDefaultProps({
    selectionMode: "none",
    selectionBehavior: "toggle"
  }, props);
  const [isFocused, setFocused] = createSignal(false);
  const [focusedKey, setFocusedKey] = createSignal();
  const selectedKeysProp = createMemo(() => {
    const selection = access(mergedProps.selectedKeys);
    if (selection != null) {
      return convertSelection(selection);
    }
    return selection;
  });
  const defaultSelectedKeys = createMemo(() => {
    const defaultSelection = access(mergedProps.defaultSelectedKeys);
    if (defaultSelection != null) {
      return convertSelection(defaultSelection);
    }
    return new Selection();
  });
  const [selectedKeys, _setSelectedKeys] = createControllableSelectionSignal({
    value: selectedKeysProp,
    defaultValue: defaultSelectedKeys,
    onChange: (value) => mergedProps.onSelectionChange?.(value)
  });
  const [selectionBehavior, setSelectionBehavior] = createSignal(access(mergedProps.selectionBehavior));
  const selectionMode = () => access(mergedProps.selectionMode);
  const disallowEmptySelection = () => access(mergedProps.disallowEmptySelection) ?? false;
  const setSelectedKeys = (keys) => {
    if (access(mergedProps.allowDuplicateSelectionEvents) || !isSameSelection(keys, selectedKeys())) {
      _setSelectedKeys(keys);
    }
  };
  createEffect(() => {
    const selection = selectedKeys();
    if (access(mergedProps.selectionBehavior) === "replace" && selectionBehavior() === "toggle" && typeof selection === "object" && selection.size === 0) {
      setSelectionBehavior("replace");
    }
  });
  createEffect(() => {
    setSelectionBehavior(access(mergedProps.selectionBehavior) ?? "toggle");
  });
  return {
    selectionMode,
    disallowEmptySelection,
    selectionBehavior,
    setSelectionBehavior,
    isFocused,
    setFocused,
    focusedKey,
    setFocusedKey,
    selectedKeys,
    setSelectedKeys
  };
}
function createTypeSelect(props) {
  const [search, setSearch] = createSignal("");
  const [timeoutId, setTimeoutId] = createSignal(-1);
  const onKeyDown = (e) => {
    if (access(props.isDisabled)) {
      return;
    }
    const delegate = access(props.keyboardDelegate);
    const manager = access(props.selectionManager);
    if (!delegate.getKeyForSearch) {
      return;
    }
    const character = getStringForKey(e.key);
    if (!character || e.ctrlKey || e.metaKey) {
      return;
    }
    if (character === " " && search().trim().length > 0) {
      e.preventDefault();
      e.stopPropagation();
    }
    let newSearch = setSearch((prev) => prev + character);
    let key = delegate.getKeyForSearch(newSearch, manager.focusedKey()) ?? delegate.getKeyForSearch(newSearch);
    if (key == null && isAllSameLetter(newSearch)) {
      newSearch = newSearch[0];
      key = delegate.getKeyForSearch(newSearch, manager.focusedKey()) ?? delegate.getKeyForSearch(newSearch);
    }
    if (key != null) {
      manager.setFocusedKey(key);
      props.onTypeSelect?.(key);
    }
    clearTimeout(timeoutId());
    setTimeoutId(window.setTimeout(() => setSearch(""), 500));
  };
  return {
    typeSelectHandlers: {
      onKeyDown
    }
  };
}
function getStringForKey(key) {
  if (key.length === 1 || !/^[A-Z]/i.test(key)) {
    return key;
  }
  return "";
}
function isAllSameLetter(search) {
  return search.split("").every((letter) => letter === search[0]);
}
function createSelectableCollection(props, ref, scrollRef) {
  const defaultProps = {
    selectOnFocus: () => access(props.selectionManager).selectionBehavior() === "replace"
  };
  const mergedProps = mergeProps(defaultProps, props);
  const finalScrollRef = () => ref();
  const {
    direction
  } = useLocale();
  let scrollPos = {
    top: 0,
    left: 0
  };
  createEventListener(() => !access(mergedProps.isVirtualized) ? finalScrollRef() : void 0, "scroll", () => {
    const scrollEl = finalScrollRef();
    if (!scrollEl) {
      return;
    }
    scrollPos = {
      top: scrollEl.scrollTop,
      left: scrollEl.scrollLeft
    };
  });
  const {
    typeSelectHandlers
  } = createTypeSelect({
    isDisabled: () => access(mergedProps.disallowTypeAhead),
    keyboardDelegate: () => access(mergedProps.keyboardDelegate),
    selectionManager: () => access(mergedProps.selectionManager)
  });
  const orientation = () => access(mergedProps.orientation) ?? "vertical";
  const onKeyDown = (e) => {
    callHandler(e, typeSelectHandlers.onKeyDown);
    if (e.altKey && e.key === "Tab") {
      e.preventDefault();
    }
    const refEl = ref();
    if (!refEl?.contains(e.target)) {
      return;
    }
    const manager = access(mergedProps.selectionManager);
    const selectOnFocus = access(mergedProps.selectOnFocus);
    const navigateToKey = (key) => {
      if (key != null) {
        manager.setFocusedKey(key);
        if (e.shiftKey && manager.selectionMode() === "multiple") {
          manager.extendSelection(key);
        } else if (selectOnFocus && !isNonContiguousSelectionModifier(e)) {
          manager.replaceSelection(key);
        }
      }
    };
    const delegate = access(mergedProps.keyboardDelegate);
    const shouldFocusWrap = access(mergedProps.shouldFocusWrap);
    const focusedKey = manager.focusedKey();
    switch (e.key) {
      case (orientation() === "vertical" ? "ArrowDown" : "ArrowRight"): {
        if (delegate.getKeyBelow) {
          e.preventDefault();
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyBelow(focusedKey);
          } else {
            nextKey = delegate.getFirstKey?.();
          }
          if (nextKey == null && shouldFocusWrap) {
            nextKey = delegate.getFirstKey?.(focusedKey);
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case (orientation() === "vertical" ? "ArrowUp" : "ArrowLeft"): {
        if (delegate.getKeyAbove) {
          e.preventDefault();
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyAbove(focusedKey);
          } else {
            nextKey = delegate.getLastKey?.();
          }
          if (nextKey == null && shouldFocusWrap) {
            nextKey = delegate.getLastKey?.(focusedKey);
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case (orientation() === "vertical" ? "ArrowLeft" : "ArrowUp"): {
        if (delegate.getKeyLeftOf) {
          e.preventDefault();
          const isRTL = direction() === "rtl";
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyLeftOf(focusedKey);
          } else {
            nextKey = isRTL ? delegate.getFirstKey?.() : delegate.getLastKey?.();
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case (orientation() === "vertical" ? "ArrowRight" : "ArrowDown"): {
        if (delegate.getKeyRightOf) {
          e.preventDefault();
          const isRTL = direction() === "rtl";
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyRightOf(focusedKey);
          } else {
            nextKey = isRTL ? delegate.getLastKey?.() : delegate.getFirstKey?.();
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case "Home":
        if (delegate.getFirstKey) {
          e.preventDefault();
          const firstKey = delegate.getFirstKey(focusedKey, isCtrlKeyPressed(e));
          if (firstKey != null) {
            manager.setFocusedKey(firstKey);
            if (isCtrlKeyPressed(e) && e.shiftKey && manager.selectionMode() === "multiple") {
              manager.extendSelection(firstKey);
            } else if (selectOnFocus) {
              manager.replaceSelection(firstKey);
            }
          }
        }
        break;
      case "End":
        if (delegate.getLastKey) {
          e.preventDefault();
          const lastKey = delegate.getLastKey(focusedKey, isCtrlKeyPressed(e));
          if (lastKey != null) {
            manager.setFocusedKey(lastKey);
            if (isCtrlKeyPressed(e) && e.shiftKey && manager.selectionMode() === "multiple") {
              manager.extendSelection(lastKey);
            } else if (selectOnFocus) {
              manager.replaceSelection(lastKey);
            }
          }
        }
        break;
      case "PageDown":
        if (delegate.getKeyPageBelow && focusedKey != null) {
          e.preventDefault();
          const nextKey = delegate.getKeyPageBelow(focusedKey);
          navigateToKey(nextKey);
        }
        break;
      case "PageUp":
        if (delegate.getKeyPageAbove && focusedKey != null) {
          e.preventDefault();
          const nextKey = delegate.getKeyPageAbove(focusedKey);
          navigateToKey(nextKey);
        }
        break;
      case "a":
        if (isCtrlKeyPressed(e) && manager.selectionMode() === "multiple" && access(mergedProps.disallowSelectAll) !== true) {
          e.preventDefault();
          manager.selectAll();
        }
        break;
      case "Escape":
        if (!e.defaultPrevented) {
          e.preventDefault();
          if (!access(mergedProps.disallowEmptySelection)) {
            manager.clearSelection();
          }
        }
        break;
      case "Tab": {
        if (!access(mergedProps.allowsTabNavigation)) {
          if (e.shiftKey) {
            refEl.focus();
          } else {
            const walker = getFocusableTreeWalker(refEl, {
              tabbable: true
            });
            let next;
            let last;
            do {
              last = walker.lastChild();
              if (last) {
                next = last;
              }
            } while (last);
            if (next && !next.contains(document.activeElement)) {
              focusWithoutScrolling(next);
            }
          }
          break;
        }
      }
    }
  };
  const onFocusIn = (e) => {
    const manager = access(mergedProps.selectionManager);
    const delegate = access(mergedProps.keyboardDelegate);
    const selectOnFocus = access(mergedProps.selectOnFocus);
    if (manager.isFocused()) {
      if (!e.currentTarget.contains(e.target)) {
        manager.setFocused(false);
      }
      return;
    }
    if (!e.currentTarget.contains(e.target)) {
      return;
    }
    manager.setFocused(true);
    if (manager.focusedKey() == null) {
      const navigateToFirstKey = (key) => {
        if (key == null) {
          return;
        }
        manager.setFocusedKey(key);
        if (selectOnFocus) {
          manager.replaceSelection(key);
        }
      };
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && e.currentTarget.compareDocumentPosition(relatedTarget) & Node.DOCUMENT_POSITION_FOLLOWING) {
        navigateToFirstKey(manager.lastSelectedKey() ?? delegate.getLastKey?.());
      } else {
        navigateToFirstKey(manager.firstSelectedKey() ?? delegate.getFirstKey?.());
      }
    } else if (!access(mergedProps.isVirtualized)) {
      const scrollEl = finalScrollRef();
      if (scrollEl) {
        scrollEl.scrollTop = scrollPos.top;
        scrollEl.scrollLeft = scrollPos.left;
        const element = scrollEl.querySelector(`[data-key="${manager.focusedKey()}"]`);
        if (element) {
          focusWithoutScrolling(element);
          scrollIntoView(scrollEl, element);
        }
      }
    }
  };
  const onFocusOut = (e) => {
    const manager = access(mergedProps.selectionManager);
    if (!e.currentTarget.contains(e.relatedTarget)) {
      manager.setFocused(false);
    }
  };
  const onMouseDown = (e) => {
    if (finalScrollRef() === e.target) {
      e.preventDefault();
    }
  };
  const tryAutoFocus = () => {
    const autoFocus = access(mergedProps.autoFocus);
    if (!autoFocus) {
      return;
    }
    const manager = access(mergedProps.selectionManager);
    const delegate = access(mergedProps.keyboardDelegate);
    let focusedKey;
    if (autoFocus === "first") {
      focusedKey = delegate.getFirstKey?.();
    }
    if (autoFocus === "last") {
      focusedKey = delegate.getLastKey?.();
    }
    const selectedKeys = manager.selectedKeys();
    if (selectedKeys.size) {
      focusedKey = selectedKeys.values().next().value;
    }
    manager.setFocused(true);
    manager.setFocusedKey(focusedKey);
    const refEl = ref();
    if (refEl && focusedKey == null && !access(mergedProps.shouldUseVirtualFocus)) {
      focusWithoutScrolling(refEl);
    }
  };
  onMount(() => {
    if (mergedProps.deferAutoFocus) {
      setTimeout(tryAutoFocus, 0);
    } else {
      tryAutoFocus();
    }
  });
  createEffect(on([finalScrollRef, () => access(mergedProps.isVirtualized), () => access(mergedProps.selectionManager).focusedKey()], (newValue) => {
    const [scrollEl, isVirtualized, focusedKey] = newValue;
    if (isVirtualized) {
      focusedKey && mergedProps.scrollToKey?.(focusedKey);
    } else {
      if (focusedKey && scrollEl) {
        const element = scrollEl.querySelector(`[data-key="${focusedKey}"]`);
        if (element) {
          scrollIntoView(scrollEl, element);
        }
      }
    }
  }));
  const tabIndex = createMemo(() => {
    if (access(mergedProps.shouldUseVirtualFocus)) {
      return void 0;
    }
    return access(mergedProps.selectionManager).focusedKey() == null ? 0 : -1;
  });
  return {
    tabIndex,
    onKeyDown,
    onMouseDown,
    onFocusIn,
    onFocusOut
  };
}
function createSelectableItem(props, ref) {
  const manager = () => access(props.selectionManager);
  const key = () => access(props.key);
  const shouldUseVirtualFocus = () => access(props.shouldUseVirtualFocus);
  const onSelect = (e) => {
    if (manager().selectionMode() === "none") {
      return;
    }
    if (manager().selectionMode() === "single") {
      if (manager().isSelected(key()) && !manager().disallowEmptySelection()) {
        manager().toggleSelection(key());
      } else {
        manager().replaceSelection(key());
      }
    } else if (e?.shiftKey) {
      manager().extendSelection(key());
    } else if (manager().selectionBehavior() === "toggle" || isCtrlKeyPressed(e) || "pointerType" in e && e.pointerType === "touch") {
      manager().toggleSelection(key());
    } else {
      manager().replaceSelection(key());
    }
  };
  const isSelected = () => manager().isSelected(key());
  const isDisabled = () => access(props.disabled) || manager().isDisabled(key());
  const allowsSelection = () => !isDisabled() && manager().canSelectItem(key());
  let pointerDownType = null;
  const onPointerDown = (e) => {
    if (!allowsSelection()) {
      return;
    }
    pointerDownType = e.pointerType;
    if (e.pointerType === "mouse" && e.button === 0 && !access(props.shouldSelectOnPressUp)) {
      onSelect(e);
    }
  };
  const onPointerUp = (e) => {
    if (!allowsSelection()) {
      return;
    }
    if (e.pointerType === "mouse" && e.button === 0 && access(props.shouldSelectOnPressUp) && access(props.allowsDifferentPressOrigin)) {
      onSelect(e);
    }
  };
  const onClick = (e) => {
    if (!allowsSelection()) {
      return;
    }
    if (access(props.shouldSelectOnPressUp) && !access(props.allowsDifferentPressOrigin) || pointerDownType !== "mouse") {
      onSelect(e);
    }
  };
  const onKeyDown = (e) => {
    if (!allowsSelection() || !["Enter", " "].includes(e.key)) {
      return;
    }
    if (isNonContiguousSelectionModifier(e)) {
      manager().toggleSelection(key());
    } else {
      onSelect(e);
    }
  };
  const onMouseDown = (e) => {
    if (isDisabled()) {
      e.preventDefault();
    }
  };
  const onFocus = (e) => {
    const refEl = ref();
    if (shouldUseVirtualFocus() || isDisabled() || !refEl) {
      return;
    }
    if (e.target === refEl) {
      manager().setFocusedKey(key());
    }
  };
  const tabIndex = createMemo(() => {
    if (shouldUseVirtualFocus() || isDisabled()) {
      return void 0;
    }
    return key() === manager().focusedKey() ? 0 : -1;
  });
  const dataKey = createMemo(() => {
    return access(props.virtualized) ? void 0 : key();
  });
  createEffect(on([ref, key, shouldUseVirtualFocus, () => manager().focusedKey(), () => manager().isFocused()], ([refEl, key2, shouldUseVirtualFocus2, focusedKey, isFocused]) => {
    if (refEl && key2 === focusedKey && isFocused && !shouldUseVirtualFocus2 && document.activeElement !== refEl) {
      if (props.focus) {
        props.focus();
      } else {
        focusWithoutScrolling(refEl);
      }
    }
  }));
  return {
    isSelected,
    isDisabled,
    allowsSelection,
    tabIndex,
    dataKey,
    onPointerDown,
    onPointerUp,
    onClick,
    onKeyDown,
    onMouseDown,
    onFocus
  };
}
var SelectionManager = class {
  collection;
  state;
  constructor(collection, state) {
    this.collection = collection;
    this.state = state;
  }
  /** The type of selection that is allowed in the collection. */
  selectionMode() {
    return this.state.selectionMode();
  }
  /** Whether the collection allows empty selection. */
  disallowEmptySelection() {
    return this.state.disallowEmptySelection();
  }
  /** The selection behavior for the collection. */
  selectionBehavior() {
    return this.state.selectionBehavior();
  }
  /** Sets the selection behavior for the collection. */
  setSelectionBehavior(selectionBehavior) {
    this.state.setSelectionBehavior(selectionBehavior);
  }
  /** Whether the collection is currently focused. */
  isFocused() {
    return this.state.isFocused();
  }
  /** Sets whether the collection is focused. */
  setFocused(isFocused) {
    this.state.setFocused(isFocused);
  }
  /** The current focused key in the collection. */
  focusedKey() {
    return this.state.focusedKey();
  }
  /** Sets the focused key. */
  setFocusedKey(key) {
    if (key == null || this.collection().getItem(key)) {
      this.state.setFocusedKey(key);
    }
  }
  /** The currently selected keys in the collection. */
  selectedKeys() {
    return this.state.selectedKeys();
  }
  /** Returns whether a key is selected. */
  isSelected(key) {
    if (this.state.selectionMode() === "none") {
      return false;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return false;
    }
    return this.state.selectedKeys().has(retrievedKey);
  }
  /** Whether the selection is empty. */
  isEmpty() {
    return this.state.selectedKeys().size === 0;
  }
  /** Whether all items in the collection are selected. */
  isSelectAll() {
    if (this.isEmpty()) {
      return false;
    }
    const selectedKeys = this.state.selectedKeys();
    return this.getAllSelectableKeys().every((k) => selectedKeys.has(k));
  }
  firstSelectedKey() {
    let first;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection().getItem(key);
      const isItemBeforeFirst = item?.index != null && first?.index != null && item.index < first.index;
      if (!first || isItemBeforeFirst) {
        first = item;
      }
    }
    return first?.key;
  }
  lastSelectedKey() {
    let last;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection().getItem(key);
      const isItemAfterLast = item?.index != null && last?.index != null && item.index > last.index;
      if (!last || isItemAfterLast) {
        last = item;
      }
    }
    return last?.key;
  }
  /** Extends the selection to the given key. */
  extendSelection(toKey) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single") {
      this.replaceSelection(toKey);
      return;
    }
    const retrievedToKey = this.getKey(toKey);
    if (retrievedToKey == null) {
      return;
    }
    const selectedKeys = this.state.selectedKeys();
    const anchorKey = selectedKeys.anchorKey || retrievedToKey;
    const selection = new Selection(selectedKeys, anchorKey, retrievedToKey);
    for (const key of this.getKeyRange(anchorKey, selectedKeys.currentKey || retrievedToKey)) {
      selection.delete(key);
    }
    for (const key of this.getKeyRange(retrievedToKey, anchorKey)) {
      if (this.canSelectItem(key)) {
        selection.add(key);
      }
    }
    this.state.setSelectedKeys(selection);
  }
  getKeyRange(from, to) {
    const fromItem = this.collection().getItem(from);
    const toItem = this.collection().getItem(to);
    if (fromItem && toItem) {
      if (fromItem.index != null && toItem.index != null && fromItem.index <= toItem.index) {
        return this.getKeyRangeInternal(from, to);
      }
      return this.getKeyRangeInternal(to, from);
    }
    return [];
  }
  getKeyRangeInternal(from, to) {
    const keys = [];
    let key = from;
    while (key != null) {
      const item = this.collection().getItem(key);
      if (item && item.type === "item") {
        keys.push(key);
      }
      if (key === to) {
        return keys;
      }
      key = this.collection().getKeyAfter(key);
    }
    return [];
  }
  getKey(key) {
    const item = this.collection().getItem(key);
    if (!item) {
      return key;
    }
    if (!item || item.type !== "item") {
      return null;
    }
    return item.key;
  }
  /** Toggles whether the given key is selected. */
  toggleSelection(key) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single" && !this.isSelected(key)) {
      this.replaceSelection(key);
      return;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return;
    }
    const keys = new Selection(this.state.selectedKeys());
    if (keys.has(retrievedKey)) {
      keys.delete(retrievedKey);
    } else if (this.canSelectItem(retrievedKey)) {
      keys.add(retrievedKey);
      keys.anchorKey = retrievedKey;
      keys.currentKey = retrievedKey;
    }
    if (this.disallowEmptySelection() && keys.size === 0) {
      return;
    }
    this.state.setSelectedKeys(keys);
  }
  /** Replaces the selection with only the given key. */
  replaceSelection(key) {
    if (this.selectionMode() === "none") {
      return;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return;
    }
    const selection = this.canSelectItem(retrievedKey) ? new Selection([retrievedKey], retrievedKey, retrievedKey) : new Selection();
    this.state.setSelectedKeys(selection);
  }
  /** Replaces the selection with the given keys. */
  setSelectedKeys(keys) {
    if (this.selectionMode() === "none") {
      return;
    }
    const selection = new Selection();
    for (const key of keys) {
      const retrievedKey = this.getKey(key);
      if (retrievedKey != null) {
        selection.add(retrievedKey);
        if (this.selectionMode() === "single") {
          break;
        }
      }
    }
    this.state.setSelectedKeys(selection);
  }
  /** Selects all items in the collection. */
  selectAll() {
    if (this.selectionMode() === "multiple") {
      this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()));
    }
  }
  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    const selectedKeys = this.state.selectedKeys();
    if (!this.disallowEmptySelection() && selectedKeys.size > 0) {
      this.state.setSelectedKeys(new Selection());
    }
  }
  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll() {
    if (this.isSelectAll()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }
  select(key, e) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single") {
      if (this.isSelected(key) && !this.disallowEmptySelection()) {
        this.toggleSelection(key);
      } else {
        this.replaceSelection(key);
      }
    } else if (this.selectionBehavior() === "toggle" || e && e.pointerType === "touch") {
      this.toggleSelection(key);
    } else {
      this.replaceSelection(key);
    }
  }
  /** Returns whether the current selection is equal to the given selection. */
  isSelectionEqual(selection) {
    if (selection === this.state.selectedKeys()) {
      return true;
    }
    const selectedKeys = this.selectedKeys();
    if (selection.size !== selectedKeys.size) {
      return false;
    }
    for (const key of selection) {
      if (!selectedKeys.has(key)) {
        return false;
      }
    }
    for (const key of selectedKeys) {
      if (!selection.has(key)) {
        return false;
      }
    }
    return true;
  }
  canSelectItem(key) {
    if (this.state.selectionMode() === "none") {
      return false;
    }
    const item = this.collection().getItem(key);
    return item != null && !item.disabled;
  }
  isDisabled(key) {
    const item = this.collection().getItem(key);
    return !item || item.disabled;
  }
  getAllSelectableKeys() {
    const keys = [];
    const addKeys = (key) => {
      while (key != null) {
        if (this.canSelectItem(key)) {
          const item = this.collection().getItem(key);
          if (!item) {
            continue;
          }
          if (item.type === "item") {
            keys.push(key);
          }
        }
        key = this.collection().getKeyAfter(key);
      }
    };
    addKeys(this.collection().getFirstKey());
    return keys;
  }
};
var ListCollection = class {
  keyMap = /* @__PURE__ */ new Map();
  iterable;
  firstKey;
  lastKey;
  constructor(nodes) {
    this.iterable = nodes;
    for (const node of nodes) {
      this.keyMap.set(node.key, node);
    }
    if (this.keyMap.size === 0) {
      return;
    }
    let last;
    let index = 0;
    for (const [key, node] of this.keyMap) {
      if (last) {
        last.nextKey = key;
        node.prevKey = last.key;
      } else {
        this.firstKey = key;
        node.prevKey = void 0;
      }
      if (node.type === "item") {
        node.index = index++;
      }
      last = node;
      last.nextKey = void 0;
    }
    this.lastKey = last.key;
  }
  *[Symbol.iterator]() {
    yield* this.iterable;
  }
  getSize() {
    return this.keyMap.size;
  }
  getKeys() {
    return this.keyMap.keys();
  }
  getKeyBefore(key) {
    return this.keyMap.get(key)?.prevKey;
  }
  getKeyAfter(key) {
    return this.keyMap.get(key)?.nextKey;
  }
  getFirstKey() {
    return this.firstKey;
  }
  getLastKey() {
    return this.lastKey;
  }
  getItem(key) {
    return this.keyMap.get(key);
  }
  at(idx) {
    const keys = [...this.getKeys()];
    return this.getItem(keys[idx]);
  }
};
function createListState(props) {
  const selectionState = createMultipleSelectionState(props);
  const factory = (nodes) => {
    return props.filter ? new ListCollection(props.filter(nodes)) : new ListCollection(nodes);
  };
  const collection = createCollection({
    dataSource: () => access(props.dataSource),
    getKey: () => access(props.getKey),
    getTextValue: () => access(props.getTextValue),
    getDisabled: () => access(props.getDisabled),
    getSectionChildren: () => access(props.getSectionChildren),
    factory
  }, [() => props.filter]);
  const selectionManager = new SelectionManager(collection, selectionState);
  createComputed(() => {
    const focusedKey = selectionState.focusedKey();
    if (focusedKey != null && !collection().getItem(focusedKey)) {
      selectionState.setFocusedKey(void 0);
    }
  });
  return {
    collection,
    selectionManager: () => selectionManager
  };
}

var DomCollectionContext = createContext();
function useOptionalDomCollectionContext() {
  return useContext(DomCollectionContext);
}
function useDomCollectionContext() {
  const context = useOptionalDomCollectionContext();
  if (context === void 0) {
    throw new Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");
  }
  return context;
}
function isElementPreceding(a, b) {
  return Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
function findDOMIndex(items, item) {
  const itemEl = item.ref();
  if (!itemEl) {
    return -1;
  }
  let length = items.length;
  if (!length) {
    return -1;
  }
  while (length--) {
    const currentItemEl = items[length]?.ref();
    if (!currentItemEl) {
      continue;
    }
    if (isElementPreceding(currentItemEl, itemEl)) {
      return length + 1;
    }
  }
  return 0;
}
function sortBasedOnDOMPosition(items) {
  const pairs = items.map((item, index) => [index, item]);
  let isOrderDifferent = false;
  pairs.sort(([indexA, a], [indexB, b]) => {
    const elementA = a.ref();
    const elementB = b.ref();
    if (elementA === elementB) {
      return 0;
    }
    if (!elementA || !elementB) {
      return 0;
    }
    if (isElementPreceding(elementA, elementB)) {
      if (indexA > indexB) {
        isOrderDifferent = true;
      }
      return -1;
    }
    if (indexA < indexB) {
      isOrderDifferent = true;
    }
    return 1;
  });
  if (isOrderDifferent) {
    return pairs.map(([_, item]) => item);
  }
  return items;
}
function setItemsBasedOnDOMPosition(items, setItems) {
  const sortedItems = sortBasedOnDOMPosition(items);
  if (items !== sortedItems) {
    setItems(sortedItems);
  }
}
function getCommonParent(items) {
  const firstItem = items[0];
  const lastItemEl = items[items.length - 1]?.ref();
  let parentEl = firstItem?.ref()?.parentElement;
  while (parentEl) {
    if (lastItemEl && parentEl.contains(lastItemEl)) {
      return parentEl;
    }
    parentEl = parentEl.parentElement;
  }
  return getDocument(parentEl).body;
}
function createTimeoutObserver(items, setItems) {
  createEffect(() => {
    const timeout = setTimeout(() => {
      setItemsBasedOnDOMPosition(items(), setItems);
    });
    onCleanup(() => clearTimeout(timeout));
  });
}
function createSortBasedOnDOMPosition(items, setItems) {
  if (typeof IntersectionObserver !== "function") {
    createTimeoutObserver(items, setItems);
    return;
  }
  let previousItems = [];
  createEffect(() => {
    const callback = () => {
      const hasPreviousItems = !!previousItems.length;
      previousItems = items();
      if (!hasPreviousItems) {
        return;
      }
      setItemsBasedOnDOMPosition(items(), setItems);
    };
    const root = getCommonParent(items());
    const observer = new IntersectionObserver(callback, {
      root
    });
    for (const item of items()) {
      const itemEl = item.ref();
      if (itemEl) {
        observer.observe(itemEl);
      }
    }
    onCleanup(() => observer.disconnect());
  });
}
function createDomCollection(props = {}) {
  const [items, setItems] = createControllableArraySignal({
    value: () => access(props.items),
    onChange: (value) => props.onItemsChange?.(value)
  });
  createSortBasedOnDOMPosition(items, setItems);
  const registerItem = (item) => {
    setItems((prevItems) => {
      const index = findDOMIndex(prevItems, item);
      return addItemToArray(prevItems, item, index);
    });
    return () => {
      setItems((prevItems) => {
        const nextItems = prevItems.filter((prevItem) => prevItem.ref() !== item.ref());
        if (prevItems.length === nextItems.length) {
          return prevItems;
        }
        return nextItems;
      });
    };
  };
  const DomCollectionProvider = (props2) => {
    return createComponent(DomCollectionContext.Provider, {
      value: {
        registerItem
      },
      get children() {
        return props2.children;
      }
    });
  };
  return {
    DomCollectionProvider
  };
}
function createDomCollectionItem(props) {
  const context = useDomCollectionContext();
  const mergedProps = mergeDefaultProps({
    shouldRegisterItem: true
  }, props);
  createEffect(() => {
    if (!mergedProps.shouldRegisterItem) {
      return;
    }
    const unregister = context.registerItem(mergedProps.getItem());
    onCleanup(unregister);
  });
}

/**
 * Instantiate a new ResizeObserver that automatically get's disposed on cleanup.
 *
 * @param callback handler called once element size changes
 * @param options ResizeObserver options
 * @returns `observe` and `unobserve` functions
 */
function makeResizeObserver(callback, options) {
  const observer = new ResizeObserver(callback);
  onCleanup(observer.disconnect.bind(observer));
  return {
    observe: ref => observer.observe(ref, options),
    unobserve: observer.unobserve.bind(observer)
  };
}
/**
 * Create resize observer instance, listening for changes to size of the reactive {@link targets} array.
 *
 * @param targets Elements to be observed. Can be a reactive signal or store top-level array.
 * @param onResize - Function handler to trigger on element resize
 *
 * @example
 * ```tsx
 * let ref
 * createResizeObserver(() => ref, ({ width, height }, el) => {
 *   if (el === ref) console.log(width, height)
 * });
 * <div ref={ref}/>
 * ```
 */
function createResizeObserver(targets, onResize, options) {
  const previousMap = new WeakMap(),
    {
      observe,
      unobserve
    } = makeResizeObserver(entries => {
      for (const entry of entries) {
        const {
            contentRect,
            target
          } = entry,
          width = Math.round(contentRect.width),
          height = Math.round(contentRect.height),
          previous = previousMap.get(target);
        if (!previous || previous.width !== width || previous.height !== height) {
          onResize(contentRect, target, entry);
          previousMap.set(target, {
            width,
            height
          });
        }
      }
    }, options);
  createEffect(prev => {
    const refs = filterNonNullable(asArray(access(targets)));
    handleDiffArray(refs, prev, observe, unobserve);
    return refs;
  }, []);
}

var tabs_exports = {};
__export(tabs_exports, {
  Content: () => TabsContent,
  Indicator: () => TabsIndicator,
  List: () => TabsList,
  Root: () => TabsRoot,
  Tabs: () => Tabs,
  Trigger: () => TabsTrigger,
  useTabsContext: () => useTabsContext
});
var TabsContext = createContext();
function useTabsContext() {
  const context = useContext(TabsContext);
  if (context === void 0) {
    throw new Error("[kobalte]: `useTabsContext` must be used within a `Tabs` component");
  }
  return context;
}
function TabsContent(props) {
  const [ref, setRef] = createSignal();
  const context = useTabsContext();
  const [local, others] = splitProps(props, ["ref", "id", "value", "forceMount"]);
  const [tabIndex, setTabIndex] = createSignal(0);
  const id = () => local.id ?? context.generateContentId(local.value);
  const isSelected = () => context.listState().selectedKey() === local.value;
  const {
    present
  } = src_default({
    show: () => local.forceMount || isSelected(),
    element: () => ref() ?? null
  });
  createEffect(on([() => ref(), () => present()], ([ref2, isPresent]) => {
    if (ref2 == null || !isPresent) {
      return;
    }
    const updateTabIndex = () => {
      const walker = getFocusableTreeWalker(ref2, {
        tabbable: true
      });
      setTabIndex(walker.nextNode() ? void 0 : 0);
    };
    updateTabIndex();
    const observer = new MutationObserver(updateTabIndex);
    observer.observe(ref2, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["tabindex", "disabled"]
    });
    onCleanup(() => {
      observer.disconnect();
    });
  }));
  createEffect(on([() => local.value, id], ([value, id2]) => {
    context.contentIdsMap().set(value, id2);
  }));
  return createComponent(Show, {
    get when() {
      return present();
    },
    get children() {
      return createComponent(Polymorphic, mergeProps({
        as: "div",
        ref(r$) {
          var _ref$ = mergeRefs(setRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        get id() {
          return id();
        },
        role: "tabpanel",
        get tabIndex() {
          return tabIndex();
        },
        get ["aria-labelledby"]() {
          return context.triggerIdsMap().get(local.value);
        },
        get ["data-orientation"]() {
          return context.orientation();
        },
        get ["data-selected"]() {
          return isSelected() ? "" : void 0;
        }
      }, others));
    }
  });
}
function TabsIndicator(props) {
  const context = useTabsContext();
  const [local, others] = splitProps(props, ["style"]);
  const [style, setStyle] = createSignal({
    width: void 0,
    height: void 0
  });
  const {
    direction
  } = useLocale();
  const computeStyle = () => {
    const selectedTab = context.selectedTab();
    if (selectedTab == null) {
      return;
    }
    const styleObj = {
      transform: void 0,
      width: void 0,
      height: void 0
    };
    const offset = direction() === "rtl" ? -1 * (selectedTab.offsetParent?.offsetWidth - selectedTab.offsetWidth - selectedTab.offsetLeft) : selectedTab.offsetLeft;
    styleObj.transform = context.orientation() === "vertical" ? `translateY(${selectedTab.offsetTop}px)` : `translateX(${offset}px)`;
    if (context.orientation() === "horizontal") {
      styleObj.width = `${selectedTab.offsetWidth}px`;
    } else {
      styleObj.height = `${selectedTab.offsetHeight}px`;
    }
    setStyle(styleObj);
  };
  onMount(() => {
    queueMicrotask(() => {
      computeStyle();
    });
  });
  createEffect(on([context.selectedTab, context.orientation, direction], () => {
    computeStyle();
  }, {
    defer: true
  }));
  const [resizing, setResizing] = createSignal(false);
  let timeout = null;
  let prevTarget = null;
  createResizeObserver(context.selectedTab, (_, t) => {
    if (prevTarget !== t) {
      prevTarget = t;
      return;
    }
    setResizing(true);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      setResizing(false);
    }, 1);
    computeStyle();
  });
  return createComponent(Polymorphic, mergeProps({
    as: "div",
    role: "presentation",
    get style() {
      return combineStyle(style(), local.style);
    },
    get ["data-orientation"]() {
      return context.orientation();
    },
    get ["data-resizing"]() {
      return resizing();
    }
  }, others));
}
function TabsList(props) {
  let ref;
  const context = useTabsContext();
  const [local, others] = splitProps(props, ["ref", "onKeyDown", "onMouseDown", "onFocusIn", "onFocusOut"]);
  const {
    direction
  } = useLocale();
  const delegate = new TabsKeyboardDelegate(() => context.listState().collection(), direction, context.orientation);
  const selectableCollection = createSelectableCollection({
    selectionManager: () => context.listState().selectionManager(),
    keyboardDelegate: () => delegate,
    selectOnFocus: () => context.activationMode() === "automatic",
    shouldFocusWrap: false,
    // handled by the keyboard delegate
    disallowEmptySelection: true
  }, () => ref);
  createEffect(() => {
    if (ref == null) {
      return;
    }
    const selectedTab = ref.querySelector(`[data-key="${context.listState().selectedKey()}"]`);
    if (selectedTab != null) {
      context.setSelectedTab(selectedTab);
    }
  });
  return createComponent(Polymorphic, mergeProps({
    as: "div",
    ref(r$) {
      var _ref$2 = mergeRefs((el) => ref = el, local.ref);
      typeof _ref$2 === "function" && _ref$2(r$);
    },
    role: "tablist",
    get ["aria-orientation"]() {
      return context.orientation();
    },
    get ["data-orientation"]() {
      return context.orientation();
    },
    get onKeyDown() {
      return composeEventHandlers([local.onKeyDown, selectableCollection.onKeyDown]);
    },
    get onMouseDown() {
      return composeEventHandlers([local.onMouseDown, selectableCollection.onMouseDown]);
    },
    get onFocusIn() {
      return composeEventHandlers([local.onFocusIn, selectableCollection.onFocusIn]);
    },
    get onFocusOut() {
      return composeEventHandlers([local.onFocusOut, selectableCollection.onFocusOut]);
    }
  }, others));
}
function createSingleSelectListState(props) {
  const [selectedKey, setSelectedKey] = createControllableSignal({
    value: () => access(props.selectedKey),
    defaultValue: () => access(props.defaultSelectedKey),
    onChange: (value) => props.onSelectionChange?.(value)
  });
  const selectedKeys = createMemo(() => {
    const selection = selectedKey();
    return selection != null ? [selection] : [];
  });
  const [, defaultCreateListStateProps] = splitProps(props, ["onSelectionChange"]);
  const createListStateProps = mergeProps(defaultCreateListStateProps, {
    selectionMode: "single",
    disallowEmptySelection: true,
    allowDuplicateSelectionEvents: true,
    selectedKeys,
    onSelectionChange: (keys) => {
      const key = keys.values().next().value;
      if (key === selectedKey()) {
        props.onSelectionChange?.(key);
      }
      setSelectedKey(key);
    }
  });
  const {
    collection,
    selectionManager
  } = createListState(createListStateProps);
  const selectedItem = createMemo(() => {
    const selection = selectedKey();
    return selection != null ? collection().getItem(selection) : void 0;
  });
  return {
    collection,
    selectionManager,
    selectedKey,
    setSelectedKey,
    selectedItem
  };
}
function TabsRoot(props) {
  const defaultId = `tabs-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps({
    id: defaultId,
    orientation: "horizontal",
    activationMode: "automatic"
  }, props);
  const [local, others] = splitProps(mergedProps, ["value", "defaultValue", "onChange", "orientation", "activationMode", "disabled"]);
  const [items, setItems] = createSignal([]);
  const [selectedTab, setSelectedTab] = createSignal();
  const {
    DomCollectionProvider
  } = createDomCollection({
    items,
    onItemsChange: setItems
  });
  const listState = createSingleSelectListState({
    selectedKey: () => local.value,
    defaultSelectedKey: () => local.defaultValue,
    onSelectionChange: (key) => local.onChange?.(String(key)),
    dataSource: items
  });
  let lastSelectedKey = listState.selectedKey();
  createEffect(on([() => listState.selectionManager(), () => listState.collection(), () => listState.selectedKey()], ([selectionManager, collection, currentSelectedKey]) => {
    let selectedKey = currentSelectedKey;
    if (selectionManager.isEmpty() || selectedKey == null || !collection.getItem(selectedKey)) {
      selectedKey = collection.getFirstKey();
      let selectedItem = selectedKey != null ? collection.getItem(selectedKey) : void 0;
      while (selectedItem?.disabled && selectedItem.key !== collection.getLastKey()) {
        selectedKey = collection.getKeyAfter(selectedItem.key);
        selectedItem = selectedKey != null ? collection.getItem(selectedKey) : void 0;
      }
      if (selectedItem?.disabled && selectedKey === collection.getLastKey()) {
        selectedKey = collection.getFirstKey();
      }
      if (selectedKey != null) {
        selectionManager.setSelectedKeys([selectedKey]);
      }
    }
    if (selectionManager.focusedKey() == null || !selectionManager.isFocused() && selectedKey !== lastSelectedKey) {
      selectionManager.setFocusedKey(selectedKey);
    }
    lastSelectedKey = selectedKey;
  }));
  const triggerIdsMap = /* @__PURE__ */ new Map();
  const contentIdsMap = /* @__PURE__ */ new Map();
  const context = {
    isDisabled: () => local.disabled ?? false,
    orientation: () => local.orientation,
    activationMode: () => local.activationMode,
    triggerIdsMap: () => triggerIdsMap,
    contentIdsMap: () => contentIdsMap,
    listState: () => listState,
    selectedTab,
    setSelectedTab,
    generateTriggerId: (value) => `${others.id}-trigger-${value}`,
    generateContentId: (value) => `${others.id}-content-${value}`
  };
  return createComponent(DomCollectionProvider, {
    get children() {
      return createComponent(TabsContext.Provider, {
        value: context,
        get children() {
          return createComponent(Polymorphic, mergeProps({
            as: "div",
            get ["data-orientation"]() {
              return context.orientation();
            }
          }, others));
        }
      });
    }
  });
}
function TabsTrigger(props) {
  let ref;
  const context = useTabsContext();
  const mergedProps = mergeDefaultProps({
    type: "button"
  }, props);
  const [local, others] = splitProps(mergedProps, ["ref", "id", "value", "disabled", "onPointerDown", "onPointerUp", "onClick", "onKeyDown", "onMouseDown", "onFocus"]);
  const id = () => local.id ?? context.generateTriggerId(local.value);
  const isHighlighted = () => context.listState().selectionManager().focusedKey() === local.value;
  const isDisabled = () => local.disabled || context.isDisabled();
  const contentId = () => context.contentIdsMap().get(local.value);
  createDomCollectionItem({
    getItem: () => ({
      ref: () => ref,
      type: "item",
      key: local.value,
      textValue: "",
      // not applicable here
      disabled: isDisabled()
    })
  });
  const selectableItem = createSelectableItem({
    key: () => local.value,
    selectionManager: () => context.listState().selectionManager(),
    disabled: isDisabled
  }, () => ref);
  const onClick = (e) => {
    if (isWebKit()) {
      focusWithoutScrolling(e.currentTarget);
    }
  };
  createEffect(on([() => local.value, id], ([value, id2]) => {
    context.triggerIdsMap().set(value, id2);
  }));
  return createComponent(Polymorphic, mergeProps({
    as: "button",
    ref(r$) {
      var _ref$3 = mergeRefs((el) => ref = el, local.ref);
      typeof _ref$3 === "function" && _ref$3(r$);
    },
    get id() {
      return id();
    },
    role: "tab",
    get tabIndex() {
      return memo(() => !!!isDisabled())() ? selectableItem.tabIndex() : void 0;
    },
    get disabled() {
      return isDisabled();
    },
    get ["aria-selected"]() {
      return selectableItem.isSelected();
    },
    get ["aria-disabled"]() {
      return isDisabled() || void 0;
    },
    get ["aria-controls"]() {
      return memo(() => !!selectableItem.isSelected())() ? contentId() : void 0;
    },
    get ["data-key"]() {
      return selectableItem.dataKey();
    },
    get ["data-orientation"]() {
      return context.orientation();
    },
    get ["data-selected"]() {
      return selectableItem.isSelected() ? "" : void 0;
    },
    get ["data-highlighted"]() {
      return isHighlighted() ? "" : void 0;
    },
    get ["data-disabled"]() {
      return isDisabled() ? "" : void 0;
    },
    get onPointerDown() {
      return composeEventHandlers([local.onPointerDown, selectableItem.onPointerDown]);
    },
    get onPointerUp() {
      return composeEventHandlers([local.onPointerUp, selectableItem.onPointerUp]);
    },
    get onClick() {
      return composeEventHandlers([local.onClick, selectableItem.onClick, onClick]);
    },
    get onKeyDown() {
      return composeEventHandlers([local.onKeyDown, selectableItem.onKeyDown]);
    },
    get onMouseDown() {
      return composeEventHandlers([local.onMouseDown, selectableItem.onMouseDown]);
    },
    get onFocus() {
      return composeEventHandlers([local.onFocus, selectableItem.onFocus]);
    }
  }, others));
}
var Tabs = Object.assign(TabsRoot, {
  Content: TabsContent,
  Indicator: TabsIndicator,
  List: TabsList,
  Trigger: TabsTrigger
});

var _tmpl$ = /* @__PURE__ */ template(`<div data-component=copy-status><!$><!/><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<button data-copy data-slot=command><span data-slot=command-script><span>curl -fsSL </span><span data-slot=protocol>https://</span><span data-slot=highlight>opencode.ai/install</span><span> | bash</span></span><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<button data-copy data-slot=command><span><span data-slot=protocol>npm i -g </span><span data-slot=highlight>opencode-ai</span></span><!$><!/>`), _tmpl$4 = /* @__PURE__ */ template(`<button data-copy data-slot=command><span><span data-slot=protocol>bun add -g </span><span data-slot=highlight>opencode-ai</span></span><!$><!/>`), _tmpl$5 = /* @__PURE__ */ template(`<button data-copy data-slot=command><span><span data-slot=protocol>brew install </span><span data-slot=highlight>opencode</span></span><!$><!/>`), _tmpl$6 = /* @__PURE__ */ template(`<button data-copy data-slot=command><span><span data-slot=protocol>paru -S </span><span data-slot=highlight>opencode</span></span><!$><!/>`), _tmpl$7 = /* @__PURE__ */ template(`<div data-slot=panels><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/>`), _tmpl$8 = /* @__PURE__ */ template(`<a href=/docs>intro`), _tmpl$9 = /* @__PURE__ */ template(`<a href=/docs/providers/#lm-studio target=_blank>local models`), _tmpl$0 = /* @__PURE__ */ template(`<a href=/docs/share/#privacy>share pages`), _tmpl$1 = /* @__PURE__ */ template(`<a target=_blank>GitHub`), _tmpl$10 = /* @__PURE__ */ template(`<a target=_blank>MIT License`), _tmpl$11 = /* @__PURE__ */ template(`<span>Learn about Zen `), _tmpl$12 = /* @__PURE__ */ template(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6.5 12L17 12M13 16.5L17.5 12L13 7.5"stroke=currentColor stroke-width=1.5 stroke-linecap=square>`), _tmpl$13 = /* @__PURE__ */ template(`<main data-page=opencode><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><div data-component=container><!$><!/><div data-component=content><section data-component=hero><div data-slot=hero-copy><a data-slot=releases target=_blank>What’s new in <!$><!/></a><h1>The AI coding agent built for the terminal</h1><p>OpenCode is fully open source, giving you control and freedom to use any provider, any model, and any editor.</p><a href=/docs><span>Read docs </span><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6.5 12L17 12M13 16.5L17.5 12L13 7.5"stroke=currentColor stroke-width=1.5 stroke-linecap=square></path></svg></a></div><div data-slot=installation></div></section><section data-component=video><video autoplay playsinline loop muted preload=auto>Your browser does not support the video tag.</video></section><section data-component=what><div data-slot=section-title><h3>What is OpenCode?</h3><p>OpenCode is an open source agent that helps you write and run code directly from the terminal.</p></div><ul><li><span>[*]</span><div><strong>Native TUI</strong> A responsive, native, themeable terminal UI</div></li><li><span>[*]</span><div><strong>LSP enabled</strong> Automatically loads the right LSPs for the LLM</div></li><li><span>[*]</span><div><strong>Multi-session</strong> Start multiple agents in parallel on the same project</div></li><li><span>[*]</span><div><strong>Share links</strong> Share a link to any session for reference or to debug</div></li><li><span>[*]</span><div><strong>Claude Pro</strong> Log in with Anthropic to use your Claude Pro or Max account</div></li><li><span>[*]</span><div><strong>Any model</strong> 75+ LLM providers through Models.dev, including local models</div></li><li><span>[*]</span><div><strong>Any editor</strong> OpenCode runs in your terminal, pair it with any IDE</div></li></ul></section><section data-component=growth><div data-slot=section-title><h3>The open source AI coding agent</h3><div><span>[*]</span><p>With over <strong></strong> GitHub stars, <strong></strong> contributors, and almost <strong></strong> commits, OpenCode is used and trusted by over <strong></strong> developers every month.</p></div><div data-component=growth-stats><div data-component=growth-stat><div data-component=stat-illustration><svg width=205 height=264 viewBox="0 0 205 264"fill=none xmlns=http://www.w3.org/2000/svg><g opacity=0.5 clip-path=url(#clip0_236_15902)><mask id=mask0_236_15902 maskUnits=userSpaceOnUse x=0 y=0 width=205 height=264 style=mask-type:alpha><path d="M27.2119 253.122L0 264H205V0L192.109 17.8482L175.297 43.8089L152.877 59.95L137.902 77.6701L126.989 87.3251L118.603 106.449L103.114 123.643L93.359 141.714L84.2883 160.311L78.7262 177.329L67.773 193.997L62.8098 212.068L57.3332 231.191L42.5292 243.824L27.2119 253.122Z"fill=url(#paint0_linear_236_15902)></path></mask><g mask=url(#mask0_236_15902)><path d="M150.932 -135.014L-251.766 267.684M154.115 -131.832L-248.582 270.865M157.295 -128.65L-245.402 274.047M160.479 -125.469L-242.219 277.229M163.662 -122.287L-239.035 280.41M166.842 -119.105L-235.855 283.592M170.025 -115.924L-232.672 286.773M173.205 -112.742L-229.492 289.955M176.385 -109.561L-226.312 293.137M179.568 -106.377L-223.129 296.32M182.752 -103.193L-219.945 299.504M185.936 -100.012L-216.762 302.686M189.119 -96.8301L-213.578 305.867M192.295 -93.6484L-210.402 309.049M195.479 -90.4668L-207.219 312.23M198.662 -87.2852L-204.035 315.412M201.842 -84.1035L-200.855 318.594M205.025 -80.9219L-197.672 321.775M208.209 -77.7383L-194.488 324.959M211.389 -74.5586L-191.309 328.139M214.568 -71.375L-188.129 331.322M217.752 -68.1934L-184.945 334.504M220.936 -65.0117L-181.762 337.686M224.119 -61.8281L-178.578 340.869M227.303 -58.6465L-175.395 344.051M230.482 -55.4668L-172.215 347.23M233.662 -52.2832L-169.035 350.414M236.846 -49.0996L-165.852 353.598M240.025 -45.9199L-162.672 356.777M243.209 -42.7383L-159.488 359.959M246.393 -39.5547L-156.305 363.143M249.572 -36.375L-153.125 366.322M252.756 -33.1934L-149.941 369.504M255.936 -30.0098L-146.762 372.688M259.119 -26.8281L-143.578 375.869M262.303 -23.6465L-140.395 379.051M265.486 -20.4609L-137.211 382.236M268.666 -17.2812L-134.031 385.416M271.85 -14.0996L-130.848 388.598M275.029 -10.918L-127.668 391.779M278.209 -7.73633L-124.488 394.961M281.393 -4.55469L-121.305 398.143M284.576 -1.37305L-118.121 401.324M287.756 1.80859L-114.941 404.506M290.94 4.99023L-111.758 407.688M294.119 8.17383L-108.578 410.871M297.303 11.3574L-105.395 414.055M300.486 14.5391L-102.211 417.236M303.67 17.7207L-99.0273 420.418M306.85 20.9023L-95.8477 423.6M310.033 24.084L-92.6641 426.781M313.213 27.2656L-89.4844 429.963M316.393 30.4473L-86.3047 433.145M319.576 33.6289L-83.1211 436.326M322.76 36.8125L-79.9375 439.51M325.94 39.9941L-76.7578 442.691M329.123 43.1758L-73.5742 445.873M332.307 46.3574L-70.3906 449.055M335.486 49.541L-67.2109 452.238M338.67 52.7227L-64.0273 455.42M341.854 55.9043L-60.8438 458.602M345.033 59.0859L-57.6641 461.783M348.217 62.2676L-54.4805 464.965M351.397 65.4512L-51.3008 468.148M354.576 68.6328L-48.1211 471.33M357.76 71.8145L-44.9375 474.512M360.943 74.9961L-41.7539 477.693M364.123 78.1777L-38.5742 480.875M367.307 81.3594L-35.3906 484.057M370.49 84.541L-32.207 487.238M373.67 87.7246L-29.0273 490.422M376.854 90.9062L-25.8438 493.604M380.033 94.0859L-22.6641 496.783M383.217 97.2695L-19.4805 499.967M386.4 100.453L-16.2969 503.15M389.58 103.633L-13.1172 506.33M392.76 106.816L-9.9375 509.514"stroke=#8E8B8B></path></g><path d="M0 264L27.2119 253.122L42.5292 243.824L57.3332 231.191L62.8098 212.068L67.773 193.997L78.7262 177.329L84.2883 160.311L93.359 141.714L103.114 123.643L118.603 106.449L126.989 87.3251L137.902 77.6701L152.877 59.95L175.297 43.8089L192.109 17.8482L205 0"stroke=#BCBBBB></path></g><defs><linearGradient id=paint0_linear_236_15902 x1=102.5 y1=-34.8571 x2=102.5 y2=264 gradientUnits=userSpaceOnUse><stop stop-color=#565656></stop><stop offset=1 stop-color=#F1F0F0 stop-opacity=0></stop></linearGradient><clipPath id=clip0_236_15902><rect width=205 height=264 fill=white></rect></clipPath></defs></svg></div><span><figure>Fig 1.</figure> <strong></strong> GitHub Stars</span></div><div data-component=growth-stat><div data-component=stat-illustration><svg width=205 height=264 viewBox="0 0 205 264"fill=none xmlns=http://www.w3.org/2000/svg><g opacity=0.5 clip-path=url(#clip0_236_15557)><g clip-path=url(#clip1_236_15557)><rect opacity=0.81 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.46 x=14 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.86 x=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.08 x=42 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.23 x=56 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.9 x=70 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.59 x=84 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.8 x=98 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.21 x=112 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.22 x=126 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.62 x=140 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.41 x=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.22 x=168 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.25 x=182 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.34 x=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.84 y=14 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.79 x=14 y=14 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.49 x=28 y=14 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.49 x=42 y=14 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.05 x=56 y=14 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.59 x=70 y=14 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.44 x=84 y=14 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.21 x=98 y=14 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.53 x=112 y=14 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.81 x=126 y=14 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.24 x=140 y=14 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.61 x=154 y=14 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.14 x=168 y=14 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.26 x=182 y=14 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.8 x=196 y=14 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.02 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.69 x=14 y=28 width=6 height=6 fill=#CFCECD></rect><rect x=28 y=28 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.4 x=42 y=28 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.88 x=56 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.38 x=70 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.38 x=84 y=28 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.78 x=98 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.49 x=112 y=28 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.13 x=126 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.76 x=140 y=28 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.35 x=154 y=28 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.59 x=168 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.34 x=182 y=28 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.3 x=196 y=28 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.6 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.3 x=14 y=42 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.65 x=28 y=42 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.41 x=42 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.84 x=56 y=42 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.33 x=70 y=42 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.81 x=84 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.78 x=98 y=42 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.72 x=112 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.71 x=126 y=42 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.46 x=140 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.06 x=154 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.05 x=168 y=42 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.44 x=182 y=42 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.09 x=196 y=42 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.03 y=56 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.58 x=14 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.24 x=28 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.1 x=42 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.09 x=56 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.3 x=70 y=56 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.6 x=84 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.39 x=98 y=56 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.53 x=112 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.83 x=126 y=56 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.25 x=140 y=56 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.87 x=154 y=56 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.38 x=168 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.19 x=182 y=56 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.89 x=196 y=56 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.98 y=70 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.26 x=14 y=70 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.79 x=28 y=70 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.67 x=56 y=70 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.48 x=70 y=70 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.76 x=84 y=70 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.72 x=98 y=70 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.01 x=112 y=70 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.46 x=126 y=70 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.27 x=140 y=70 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.78 x=154 y=70 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.16 x=168 y=70 width=6 height=6 fill=#CFCECD></rect><rect x=182 y=70 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.86 x=196 y=70 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.18 y=84 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.04 x=14 y=84 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.61 x=28 y=84 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.47 x=42 y=84 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.81 x=56 y=84 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.98 x=70 y=84 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.3 x=84 y=84 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.1 x=98 y=84 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.42 x=112 y=84 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.66 x=126 y=84 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.68 x=140 y=84 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.35 x=154 y=84 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.6 x=168 y=84 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.95 x=182 y=84 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.05 x=196 y=84 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.77 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.06 x=14 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.45 x=28 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.73 x=42 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.21 x=70 y=98 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.18 x=84 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.92 x=98 y=98 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.26 x=112 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.21 x=126 y=98 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.27 x=140 y=98 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.84 x=154 y=98 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.74 x=168 y=98 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.53 x=182 y=98 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.9 x=196 y=98 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.32 y=112 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.75 x=14 y=112 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.69 x=28 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.66 x=42 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.93 x=56 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.32 x=70 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.52 x=84 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.02 x=98 y=112 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.88 x=126 y=112 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.12 x=140 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.93 x=154 y=112 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.79 x=168 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.24 x=182 y=112 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.64 x=196 y=112 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.57 y=126 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.6 x=14 y=126 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.05 x=28 y=126 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.28 x=42 y=126 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.21 x=56 y=126 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.93 x=70 y=126 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.63 x=84 y=126 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.58 x=98 y=126 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.64 x=112 y=126 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.74 x=126 y=126 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.74 x=140 y=126 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.1 x=154 y=126 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.93 x=168 y=126 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.43 x=182 y=126 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.45 x=196 y=126 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.77 y=140 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.78 x=14 y=140 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.18 x=28 y=140 width=6 height=6 fill=#DAD9D9></rect><rect x=42 y=140 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.39 x=56 y=140 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.53 x=70 y=140 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.06 x=84 y=140 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.81 x=98 y=140 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.49 x=112 y=140 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.45 x=126 y=140 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.37 x=140 y=140 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.58 x=154 y=140 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.8 x=168 y=140 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.35 x=182 y=140 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.73 x=196 y=140 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.92 y=154 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.32 x=14 y=154 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.3 x=28 y=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.03 x=42 y=154 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.65 x=56 y=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.66 x=70 y=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.83 x=84 y=154 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.52 x=98 y=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.82 x=112 y=154 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.95 x=126 y=154 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.89 x=140 y=154 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.2 x=154 y=154 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.61 x=168 y=154 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.34 x=196 y=154 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.9 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.99 x=14 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.49 x=28 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.84 x=42 y=168 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.67 x=56 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.92 x=70 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.79 x=84 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.8 x=98 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.74 x=112 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.38 x=126 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.56 x=140 y=168 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.7 x=154 y=168 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.47 x=168 y=168 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.92 x=182 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.19 x=196 y=168 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.12 y=182 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.16 x=14 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.98 x=28 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.6 x=42 y=182 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.15 x=56 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.17 x=70 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.26 x=84 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.3 x=98 y=182 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.12 x=112 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.31 x=126 y=182 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.62 x=140 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.74 x=154 y=182 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.8 x=168 y=182 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.89 x=182 y=182 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.75 x=196 y=182 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.1 y=196 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.11 x=14 y=196 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.79 x=28 y=196 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.69 x=42 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.39 x=56 y=196 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.31 x=70 y=196 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.33 x=84 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.2 x=98 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.21 x=112 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.02 x=126 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.82 x=140 y=196 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.28 x=154 y=196 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.19 x=168 y=196 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.97 x=182 y=196 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.45 x=196 y=196 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.88 y=210 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.58 x=14 y=210 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.53 x=28 y=210 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.89 x=42 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.38 x=56 y=210 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.73 x=70 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.87 x=84 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.35 x=98 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.61 x=112 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.8 x=126 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.87 x=140 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.77 x=154 y=210 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.94 x=168 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.59 x=182 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.37 x=196 y=210 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.7 y=224 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.72 x=14 y=224 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.95 x=28 y=224 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.26 x=42 y=224 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.68 x=56 y=224 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.55 x=70 y=224 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.2 x=84 y=224 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.63 x=98 y=224 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.5 x=112 y=224 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.79 x=126 y=224 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.02 x=140 y=224 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.17 x=154 y=224 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.99 x=168 y=224 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.82 x=182 y=224 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.28 x=196 y=224 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.76 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.39 x=14 y=238 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.14 x=28 y=238 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.17 x=42 y=238 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.37 x=56 y=238 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.13 x=70 y=238 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.35 x=84 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.13 x=98 y=238 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.55 x=112 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.83 x=126 y=238 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.86 x=140 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.63 x=154 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.38 x=168 y=238 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.57 x=182 y=238 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.13 x=196 y=238 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.9 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.63 x=14 y=252 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.23 x=28 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.56 x=42 y=252 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.38 x=56 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.19 x=70 y=252 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.29 x=84 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.78 x=98 y=252 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.14 x=112 y=252 width=6 height=6 fill=#BCBBBB></rect><rect opacity=0.64 x=126 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.27 x=140 y=252 width=6 height=6 fill=#CFCECD></rect><rect opacity=0.85 x=154 y=252 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.02 x=168 y=252 width=6 height=6 fill=#DAD9D9></rect><rect opacity=0.29 x=182 y=252 width=6 height=6 fill=#8E8B8B></rect><rect opacity=0.4 x=196 y=252 width=6 height=6 fill=#8E8B8B></rect></g></g><defs><clipPath id=clip0_236_15557><rect width=205 height=264 fill=white></rect></clipPath><clipPath id=clip1_236_15557><rect width=236 height=264 fill=white transform=translate(-0.164062)></rect></clipPath></defs></svg></div><span><figure>Fig 2.</figure> <strong></strong> Contributors</span></div><div data-component=growth-stat><div data-component=stat-illustration><svg width=205 height=264 viewBox="0 0 205 264"fill=none xmlns=http://www.w3.org/2000/svg><g opacity=0.5><path d="M205 0H203.985V264H205V0Z"fill=#8E8B8B></path><path d="M197.896 34H196.881V264H197.896V34Z"fill=#8E8B8B></path><path d="M189.777 26H188.762V264H189.777V26Z"fill=#8E8B8B></path><path d="M183.688 52H182.673V264H183.688V52Z"fill=#8E8B8B></path><path d="M176.584 0H175.569V264H176.584V0Z"fill=#8E8B8B></path><path d="M169.48 29H168.465V264H169.48V29Z"fill=#8E8B8B></path><path d="M162.376 44H161.361V264H162.376V44Z"fill=#8E8B8B></path><path d="M155.272 65H154.257V264H155.272V65Z"fill=#8E8B8B></path><path d="M149.183 29H148.168V264H149.183V29Z"fill=#8E8B8B></path><path d="M142.079 36H141.064V264H142.079V36Z"fill=#8E8B8B></path><path d="M134.975 48H133.96V264H134.975V48Z"fill=#8E8B8B></path><path d="M127.871 7H126.856V264H127.871V7Z"fill=#8E8B8B></path><path d="M120.767 0H119.752V264H120.767V0Z"fill=#8E8B8B></path><path d="M113.663 14H112.649V264H113.663V14Z"fill=#8E8B8B></path><path d="M106.559 27H105.545V264H106.559V27Z"fill=#8E8B8B></path><path d="M99.4554 70H98.4406V264H99.4554V70Z"fill=#8E8B8B></path><path d="M92.3515 32H91.3366V264H92.3515V32Z"fill=#8E8B8B></path><path d="M85.2475 35H84.2327V264H85.2475V35Z"fill=#8E8B8B></path><path d="M78.1436 36H77.1287V264H78.1436V36Z"fill=#8E8B8B></path><path d="M71.0396 10H70.0248V264H71.0396V10Z"fill=#8E8B8B></path><path d="M63.9356 42H62.9208V264H63.9356V42Z"fill=#8E8B8B></path><path d="M56.8317 43H55.8168V264H56.8317V43Z"fill=#8E8B8B></path><path d="M49.7277 38H48.7129V264H49.7277V38Z"fill=#8E8B8B></path><path d="M42.6238 56H41.6089V264H42.6238V56Z"fill=#8E8B8B></path><path d="M36.5347 36H35.5198V264H36.5347V36Z"fill=#8E8B8B></path><path d="M29.4307 8H28.4158V264H29.4307V8Z"fill=#8E8B8B></path><path d="M22.3267 20H21.3119V264H22.3267V20Z"fill=#8E8B8B></path><path d="M15.2228 1H14.2079V264H15.2228V1Z"fill=#8E8B8B></path><path d="M8.11881 9H7.10396V264H8.11881V9Z"fill=#8E8B8B></path><path d="M1.01485 31H0V264H1.01485V31Z"fill=#8E8B8B></path></g></svg></div><span><figure>Fig 3.</figure> <strong></strong> Monthly Devs</span></div></div></div></section><section data-component=privacy><div data-slot=privacy-title><h3>Built for privacy first</h3><div><span>[*]</span><p>OpenCode does not store any of your code or context data, so that it can operate in privacy sensitive environments. Learn more about <a href="/docs/enterprise/ ">privacy</a>.</p></div></div></section><section data-component=faq><div data-slot=section-title><h3>FAQ</h3></div><ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></section><section data-component=zen-cta><div data-slot=zen-cta-copy><strong>Access reliable optimized models for coding agents</strong><p>Zen gives you access to a handpicked set of AI models that OpenCode has tested and benchmarked specifically for coding agents. No need to worry about inconsistent performance and quality across providers, use validated models that work.</p><div data-slot=model-logos><div><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><mask id=mask0_79_128586 maskUnits=userSpaceOnUse x=1 y=1 width=22 height=22 style=mask-type:luminance><path d="M23 1.5H1V22.2952H23V1.5Z"fill=white></path></mask><g mask=url(#mask0_79_128586)><path d="M9.43799 9.06943V7.09387C9.43799 6.92749 9.50347 6.80267 9.65601 6.71959L13.8206 4.43211C14.3875 4.1202 15.0635 3.9747 15.7611 3.9747C18.3775 3.9747 20.0347 5.9087 20.0347 7.96734C20.0347 8.11288 20.0347 8.27926 20.0128 8.44564L15.6956 6.03335C15.434 5.88785 15.1723 5.88785 14.9107 6.03335L9.43799 9.06943ZM19.1624 16.7637V12.0431C19.1624 11.7519 19.0315 11.544 18.7699 11.3984L13.2972 8.36234L15.0851 7.3849C15.2377 7.30182 15.3686 7.30182 15.5212 7.3849L19.6858 9.67238C20.8851 10.3379 21.6917 11.7519 21.6917 13.1243C21.6917 14.7047 20.7106 16.1604 19.1624 16.7636V16.7637ZM8.15158 12.6047L6.36369 11.6066C6.21114 11.5235 6.14566 11.3986 6.14566 11.2323V6.65735C6.14566 4.43233 7.93355 2.7478 10.3538 2.7478C11.2697 2.7478 12.1199 3.039 12.8396 3.55886L8.54424 5.92959C8.28268 6.07508 8.15181 6.28303 8.15181 6.57427V12.6049L8.15158 12.6047ZM12 14.7258L9.43799 13.3533V10.4421L12 9.06965L14.5618 10.4421V13.3533L12 14.7258ZM13.6461 21.0476C12.7303 21.0476 11.8801 20.7564 11.1604 20.2366L15.4557 17.8658C15.7173 17.7203 15.8482 17.5124 15.8482 17.2211V11.1905L17.658 12.1886C17.8105 12.2717 17.876 12.3965 17.876 12.563V17.1379C17.876 19.3629 16.0662 21.0474 13.6461 21.0474V21.0476ZM8.47863 16.4103L4.314 14.1229C3.11471 13.4573 2.30808 12.0433 2.30808 10.6709C2.30808 9.06965 3.31106 7.6348 4.85903 7.03168V11.773C4.85903 12.0642 4.98995 12.2721 5.25151 12.4177L10.7025 15.4328L8.91464 16.4103C8.76209 16.4934 8.63117 16.4934 8.47863 16.4103ZM8.23892 19.8207C5.77508 19.8207 3.96533 18.0531 3.96533 15.8696C3.96533 15.7032 3.98719 15.5368 4.00886 15.3704L8.30418 17.7412C8.56574 17.8867 8.82752 17.8867 9.08909 17.7412L14.5618 14.726V16.7015C14.5618 16.8679 14.4964 16.9927 14.3438 17.0758L10.1792 19.3633C9.61225 19.6752 8.93631 19.8207 8.23869 19.8207H8.23892ZM13.6461 22.2952C16.2844 22.2952 18.4865 20.5069 18.9882 18.1362C21.4301 17.5331 23 15.3495 23 13.1245C23 11.6688 22.346 10.2548 21.1685 9.23581C21.2775 8.79908 21.343 8.36234 21.343 7.92582C21.343 4.95215 18.8137 2.72691 15.892 2.72691C15.3034 2.72691 14.7365 2.80999 14.1695 2.99726C13.1882 2.08223 11.8364 1.5 10.3538 1.5C7.71557 1.5 5.51352 3.28829 5.01185 5.65902C2.56987 6.26214 1 8.44564 1 10.6707C1 12.1264 1.65404 13.5404 2.83147 14.5594C2.72246 14.9961 2.65702 15.4328 2.65702 15.8694C2.65702 18.8431 5.1863 21.0683 8.108 21.0683C8.69661 21.0683 9.26354 20.9852 9.83046 20.7979C10.8115 21.713 12.1634 22.2952 13.6461 22.2952Z"fill=currentColor></path></g></svg></div><div><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13.7891 3.93164L20.2223 20.0677H23.7502L17.317 3.93164H13.7891Z"fill=currentColor></path><path d="M6.32538 13.6824L8.52662 8.01177L10.7279 13.6824H6.32538ZM6.68225 3.93164L0.25 20.0677H3.84652L5.16202 16.6791H11.8914L13.2067 20.0677H16.8033L10.371 3.93164H6.68225Z"fill=currentColor></path></svg></div><div><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.16861 16.0529L17.2018 9.85156C17.5957 9.54755 18.1586 9.66612 18.3463 10.1384C19.3339 12.6288 18.8926 15.6217 16.9276 17.6766C14.9626 19.7314 12.2285 20.1821 9.72948 19.1557L6.9995 20.4775C10.9151 23.2763 15.6699 22.5841 18.6411 19.4749C20.9979 17.0103 21.7278 13.6508 21.0453 10.6214L21.0515 10.6278C20.0617 6.17736 21.2948 4.39847 23.8207 0.760904C23.8804 0.674655 23.9402 0.588405 24 0.5L20.6762 3.97585V3.96506L9.16658 16.0551"fill=currentColor></path><path d="M7.37742 16.7017C4.67579 14.0395 5.14158 9.91963 7.44676 7.54383C9.15135 5.78544 11.9442 5.06779 14.3821 6.12281L17.0005 4.87559C16.5288 4.52392 15.9242 4.14566 15.2305 3.87986C12.0948 2.54882 8.34069 3.21127 5.79171 5.8386C3.33985 8.36779 2.56881 12.2567 3.89286 15.5751C4.88192 18.0552 3.26056 19.8094 1.62731 21.5801C1.04853 22.2078 0.467774 22.8355 0 23.5L7.3754 16.7037"fill=currentColor></path></svg></div><div><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M12.6043 1.34016C12.9973 2.03016 13.3883 2.72215 13.7783 3.41514C13.7941 3.44286 13.8169 3.46589 13.8445 3.48187C13.8721 3.49786 13.9034 3.50624 13.9353 3.50614H19.4873C19.6612 3.50614 19.8092 3.61614 19.9332 3.83314L21.3872 6.40311C21.5772 6.74011 21.6272 6.88111 21.4112 7.24011C21.1512 7.6701 20.8982 8.1041 20.6512 8.54009L20.2842 9.19809C20.1782 9.39409 20.0612 9.47809 20.2442 9.71008L22.8962 14.347C23.0682 14.648 23.0072 14.841 22.8532 15.117C22.4162 15.902 21.9712 16.681 21.5182 17.457C21.3592 17.729 21.1662 17.832 20.8382 17.827C20.0612 17.811 19.2863 17.817 18.5113 17.843C18.4946 17.8439 18.4785 17.8489 18.4644 17.8576C18.4502 17.8664 18.4385 17.8785 18.4303 17.893C17.5361 19.4773 16.6344 21.0573 15.7253 22.633C15.5563 22.926 15.3453 22.996 15.0003 22.997C14.0033 23 12.9983 23.001 11.9833 22.999C11.8889 22.9987 11.7961 22.9735 11.7145 22.9259C11.6328 22.8783 11.5652 22.8101 11.5184 22.728L10.1834 20.405C10.1756 20.3898 10.1637 20.3771 10.149 20.3684C10.1343 20.3598 10.1174 20.3554 10.1004 20.356H4.98244C4.69744 20.386 4.42944 20.355 4.17745 20.264L2.57447 17.494C2.52706 17.412 2.50193 17.319 2.50158 17.2243C2.50123 17.1296 2.52567 17.0364 2.57247 16.954L3.77945 14.834C3.79665 14.8041 3.80569 14.7701 3.80569 14.7355C3.80569 14.701 3.79665 14.667 3.77945 14.637C3.15073 13.5485 2.52573 12.4579 1.90448 11.3651L1.11449 9.97008C0.954488 9.66008 0.941489 9.47409 1.20949 9.00509C1.67448 8.1921 2.13647 7.38011 2.59647 6.56911C2.72847 6.33512 2.90046 6.23512 3.18046 6.23412C4.04344 6.23048 4.90644 6.23015 5.76943 6.23312C5.79123 6.23295 5.81259 6.22704 5.83138 6.21597C5.85016 6.20491 5.8657 6.1891 5.87643 6.17012L8.68239 1.27516C8.72491 1.2007 8.78631 1.13875 8.86039 1.09556C8.93448 1.05238 9.01863 1.02948 9.10439 1.02917C9.62838 1.02817 10.1574 1.02917 10.6874 1.02317L11.7044 1.00017C12.0453 0.997165 12.4283 1.03217 12.6043 1.34016ZM9.17238 1.74316C9.16185 1.74315 9.15149 1.74592 9.14236 1.75119C9.13323 1.75645 9.12565 1.76403 9.12038 1.77316L6.25442 6.78811C6.24066 6.81174 6.22097 6.83137 6.19729 6.84505C6.17361 6.85873 6.14677 6.86599 6.11942 6.86611H3.25346C3.19746 6.86611 3.18346 6.89111 3.21246 6.94011L9.02239 17.096C9.04739 17.138 9.03539 17.158 8.98839 17.159L6.19342 17.174C6.15256 17.1727 6.11214 17.1828 6.07678 17.2033C6.04141 17.2238 6.01253 17.2539 5.99342 17.29L4.67344 19.6C4.62944 19.678 4.65244 19.718 4.74144 19.718L10.4574 19.726C10.5034 19.726 10.5374 19.746 10.5614 19.787L11.9643 22.241C12.0103 22.322 12.0563 22.323 12.1033 22.241L17.1093 13.481L17.8923 12.0991C17.897 12.0905 17.904 12.0834 17.9125 12.0785C17.9209 12.0735 17.9305 12.0709 17.9403 12.0709C17.9501 12.0709 17.9597 12.0735 17.9681 12.0785C17.9765 12.0834 17.9835 12.0905 17.9883 12.0991L19.4123 14.629C19.4229 14.648 19.4385 14.6637 19.4573 14.6746C19.4761 14.6855 19.4975 14.6912 19.5193 14.691L22.2822 14.671C22.2893 14.6711 22.2963 14.6693 22.3024 14.6658C22.3086 14.6623 22.3137 14.6572 22.3172 14.651C22.3206 14.6449 22.3224 14.638 22.3224 14.631C22.3224 14.624 22.3206 14.6172 22.3172 14.611L19.4173 9.52508C19.4068 9.50809 19.4013 9.48853 19.4013 9.46859C19.4013 9.44864 19.4068 9.42908 19.4173 9.41209L19.7102 8.90509L20.8302 6.92811C20.8542 6.88711 20.8422 6.86611 20.7952 6.86611H9.20038C9.14138 6.86611 9.12738 6.84011 9.15738 6.78911L10.5914 4.28413C10.6021 4.26706 10.6078 4.24731 10.6078 4.22714C10.6078 4.20697 10.6021 4.18721 10.5914 4.17014L9.22538 1.77416C9.22016 1.7647 9.21248 1.75682 9.20315 1.75137C9.19382 1.74591 9.18319 1.74307 9.17238 1.74316ZM15.4623 9.76308C15.5083 9.76308 15.5203 9.78308 15.4963 9.82308L14.6643 11.2881L12.0513 15.873C12.0464 15.8819 12.0392 15.8894 12.0304 15.8945C12.0216 15.8996 12.0115 15.9022 12.0013 15.902C11.9912 15.902 11.9813 15.8993 11.9725 15.8942C11.9637 15.8891 11.9564 15.8818 11.9513 15.873L8.49839 9.84108C8.47839 9.80708 8.48839 9.78908 8.52639 9.78708L8.74239 9.77508L15.4643 9.76308H15.4623Z"fill=currentColor></path></svg></div><div><svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12.6241 11.346L20.3848 3.44816C20.5309 3.29931 20.4487 3 20.2601 3H16.0842C16.0388 3 15.9949 3.01897 15.9594 3.05541L7.59764 11.5629C7.46721 11.6944 7.27446 11.5771 7.27446 11.3666V3.25183C7.27446 3.11242 7.18515 3 7.07594 3H4.19843C4.08932 3 4 3.11242 4 3.25183V20.7482C4 20.8876 4.08932 21 4.19843 21H7.07594C7.18515 21 7.27446 20.8876 7.27446 20.7482V17.1834C7.27446 17.1073 7.30136 17.0344 7.34815 16.987L9.94075 14.3486C10.0031 14.2853 10.0895 14.2757 10.159 14.3232L17.0934 19.5573C18.2289 20.3412 19.4975 20.8226 20.786 20.9652C20.9008 20.9778 21 20.8606 21 20.7133V17.3559C21 17.2276 20.9249 17.1232 20.8243 17.1073C20.0659 16.9853 19.326 16.6845 18.6569 16.222L12.6538 11.764C12.5291 11.6785 12.5135 11.4584 12.6241 11.346Z"fill=currentColor></path></svg></div></div><!$><!/></div></section><!$><!/><!$><!/></div></div><!$><!/>`);
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
  const githubData = createAsync(() => github());
  const release = createMemo(() => githubData()?.release);
  const handleCopyClick = (event) => {
    const button = event.currentTarget;
    const text = button.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      button.setAttribute("data-copied", "");
      setTimeout(() => {
        button.removeAttribute("data-copied");
      }, 1500);
    }
  };
  return (() => {
    var _el$6 = getNextElement(_tmpl$13), _el$115 = _el$6.firstChild, [_el$116, _co$16] = getNextMarker(_el$115.nextSibling), _el$117 = _el$116.nextSibling, [_el$118, _co$17] = getNextMarker(_el$117.nextSibling), _el$119 = _el$118.nextSibling, [_el$120, _co$18] = getNextMarker(_el$119.nextSibling), _el$121 = _el$120.nextSibling, [_el$122, _co$19] = getNextMarker(_el$121.nextSibling), _el$123 = _el$122.nextSibling, [_el$124, _co$20] = getNextMarker(_el$123.nextSibling), _el$125 = _el$124.nextSibling, [_el$126, _co$21] = getNextMarker(_el$125.nextSibling), _el$7 = _el$126.nextSibling, _el$113 = _el$7.firstChild, [_el$114, _co$15] = getNextMarker(_el$113.nextSibling), _el$8 = _el$114.nextSibling, _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, [_el$12, _co$3] = getNextMarker(_el$11.nextSibling), _el$13 = _el$0.nextSibling, _el$45 = _el$9.nextSibling, _el$46 = _el$45.firstChild, _el$47 = _el$45.nextSibling, _el$48 = _el$47.nextSibling, _el$49 = _el$48.firstChild, _el$50 = _el$49.firstChild, _el$51 = _el$50.nextSibling, _el$52 = _el$51.firstChild, _el$53 = _el$52.nextSibling, _el$54 = _el$53.firstChild, _el$55 = _el$54.nextSibling, _el$56 = _el$55.nextSibling, _el$58 = _el$56.nextSibling, _el$59 = _el$58.nextSibling, _el$61 = _el$59.nextSibling, _el$62 = _el$61.nextSibling, _el$64 = _el$62.nextSibling, _el$65 = _el$51.nextSibling, _el$66 = _el$65.firstChild, _el$67 = _el$66.firstChild, _el$68 = _el$67.nextSibling, _el$69 = _el$68.firstChild, _el$70 = _el$69.nextSibling, _el$71 = _el$70.nextSibling, _el$72 = _el$66.nextSibling, _el$73 = _el$72.firstChild, _el$74 = _el$73.nextSibling, _el$75 = _el$74.firstChild, _el$76 = _el$75.nextSibling, _el$77 = _el$76.nextSibling, _el$78 = _el$72.nextSibling, _el$79 = _el$78.firstChild, _el$80 = _el$79.nextSibling, _el$81 = _el$80.firstChild, _el$82 = _el$81.nextSibling, _el$83 = _el$82.nextSibling, _el$84 = _el$48.nextSibling, _el$85 = _el$84.nextSibling, _el$86 = _el$85.firstChild, _el$87 = _el$86.nextSibling, _el$88 = _el$87.firstChild, _el$89 = _el$88.nextSibling, _el$91 = _el$89.nextSibling, _el$93 = _el$91.nextSibling, _el$94 = _el$93.nextSibling, _el$95 = _el$94.nextSibling, _el$97 = _el$95.nextSibling, _el$100 = _el$85.nextSibling, _el$101 = _el$100.firstChild, _el$102 = _el$101.firstChild, _el$103 = _el$102.nextSibling, _el$104 = _el$103.nextSibling, _el$107 = _el$104.nextSibling, [_el$108, _co$12] = getNextMarker(_el$107.nextSibling), _el$109 = _el$100.nextSibling, [_el$110, _co$13] = getNextMarker(_el$109.nextSibling), _el$111 = _el$110.nextSibling, [_el$112, _co$14] = getNextMarker(_el$111.nextSibling), _el$127 = _el$7.nextSibling, [_el$128, _co$22] = getNextMarker(_el$127.nextSibling);
    insert(_el$6, createComponent(HttpHeader, {
      name: "Cache-Control",
      value: "public, max-age=1, s-maxage=3600, stale-while-revalidate=86400"
    }), _el$116, _co$16);
    insert(_el$6, createComponent(Title, {
      children: "OpenCode | The AI coding agent built for the terminal"
    }), _el$118, _co$17);
    insert(_el$6, createComponent(Link, {
      rel: "canonical",
      get href() {
        return config.baseUrl;
      }
    }), _el$120, _co$18);
    insert(_el$6, createComponent(Link, {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon.svg"
    }), _el$122, _co$19);
    insert(_el$6, createComponent(Meta, {
      property: "og:image",
      content: "/social-share.png"
    }), _el$124, _co$20);
    insert(_el$6, createComponent(Meta, {
      name: "twitter:image",
      content: "/social-share.png"
    }), _el$126, _co$21);
    insert(_el$7, createComponent(Header, {}), _el$114, _co$15);
    insert(_el$1, () => release()?.name ?? "the latest release", _el$12, _co$3);
    insert(_el$13, createComponent(Tabs, {
      as: "section",
      "aria-label": "Install options",
      "class": "tabs",
      "data-component": "tabs",
      "data-active": "curl",
      defaultValue: "curl",
      get children() {
        return [createComponent(Tabs.List, {
          "data-slot": "tablist",
          get children() {
            return [createComponent(Tabs.Trigger, {
              value: "curl",
              "data-slot": "tab",
              children: "curl"
            }), createComponent(Tabs.Trigger, {
              value: "npm",
              "data-slot": "tab",
              children: "npm"
            }), createComponent(Tabs.Trigger, {
              value: "bun",
              "data-slot": "tab",
              children: "bun"
            }), createComponent(Tabs.Trigger, {
              value: "brew",
              "data-slot": "tab",
              children: "brew"
            }), createComponent(Tabs.Trigger, {
              value: "paru",
              "data-slot": "tab",
              children: "paru"
            }), createComponent(Tabs.Indicator, {})];
          }
        }), (() => {
          var _el$14 = getNextElement(_tmpl$7), _el$35 = _el$14.firstChild, [_el$36, _co$9] = getNextMarker(_el$35.nextSibling), _el$37 = _el$36.nextSibling, [_el$38, _co$0] = getNextMarker(_el$37.nextSibling), _el$39 = _el$38.nextSibling, [_el$40, _co$1] = getNextMarker(_el$39.nextSibling), _el$41 = _el$40.nextSibling, [_el$42, _co$10] = getNextMarker(_el$41.nextSibling), _el$43 = _el$42.nextSibling, [_el$44, _co$11] = getNextMarker(_el$43.nextSibling);
          insert(_el$14, createComponent(Tabs.Content, {
            as: "pre",
            "data-slot": "panel",
            value: "curl",
            get children() {
              var _el$15 = getNextElement(_tmpl$2), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling, [_el$18, _co$4] = getNextMarker(_el$17.nextSibling);
              _el$15.$$click = handleCopyClick;
              insert(_el$15, createComponent(CopyStatus, {}), _el$18, _co$4);
              runHydrationEvents();
              return _el$15;
            }
          }), _el$36, _co$9);
          insert(_el$14, createComponent(Tabs.Content, {
            as: "pre",
            "data-slot": "panel",
            value: "npm",
            get children() {
              var _el$19 = getNextElement(_tmpl$3), _el$20 = _el$19.firstChild, _el$21 = _el$20.nextSibling, [_el$22, _co$5] = getNextMarker(_el$21.nextSibling);
              _el$19.$$click = handleCopyClick;
              insert(_el$19, createComponent(CopyStatus, {}), _el$22, _co$5);
              runHydrationEvents();
              return _el$19;
            }
          }), _el$38, _co$0);
          insert(_el$14, createComponent(Tabs.Content, {
            as: "pre",
            "data-slot": "panel",
            value: "bun",
            get children() {
              var _el$23 = getNextElement(_tmpl$4), _el$24 = _el$23.firstChild, _el$25 = _el$24.nextSibling, [_el$26, _co$6] = getNextMarker(_el$25.nextSibling);
              _el$23.$$click = handleCopyClick;
              insert(_el$23, createComponent(CopyStatus, {}), _el$26, _co$6);
              runHydrationEvents();
              return _el$23;
            }
          }), _el$40, _co$1);
          insert(_el$14, createComponent(Tabs.Content, {
            as: "pre",
            "data-slot": "panel",
            value: "brew",
            get children() {
              var _el$27 = getNextElement(_tmpl$5), _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling, [_el$30, _co$7] = getNextMarker(_el$29.nextSibling);
              _el$27.$$click = handleCopyClick;
              insert(_el$27, createComponent(CopyStatus, {}), _el$30, _co$7);
              runHydrationEvents();
              return _el$27;
            }
          }), _el$42, _co$10);
          insert(_el$14, createComponent(Tabs.Content, {
            as: "pre",
            "data-slot": "panel",
            value: "paru",
            get children() {
              var _el$31 = getNextElement(_tmpl$6), _el$32 = _el$31.firstChild, _el$33 = _el$32.nextSibling, [_el$34, _co$8] = getNextMarker(_el$33.nextSibling);
              _el$31.$$click = handleCopyClick;
              insert(_el$31, createComponent(CopyStatus, {}), _el$34, _co$8);
              runHydrationEvents();
              return _el$31;
            }
          }), _el$44, _co$11);
          return _el$14;
        })()];
      }
    }));
    setAttribute(_el$46, "src", video);
    setAttribute(_el$46, "poster", videoPoster);
    insert(_el$55, () => config.github.starsFormatted.full);
    insert(_el$58, () => config.stats.contributors);
    insert(_el$61, () => config.stats.commits);
    insert(_el$64, () => config.stats.monthlyUsers);
    insert(_el$71, () => config.github.starsFormatted.compact);
    insert(_el$77, () => config.stats.contributors);
    insert(_el$83, () => config.stats.monthlyUsers);
    insert(_el$88, createComponent(Faq, {
      question: "What is OpenCode?",
      children: "OpenCode is an open source agent that helps you write and run code directly from the terminal. You can pair OpenCode with any AI model, and because it’s terminal-based you can pair it with your preferred code editor."
    }));
    insert(_el$89, createComponent(Faq, {
      question: "How do I use OpenCode?",
      get children() {
        return ["The easiest way to get started is to read the ", getNextElement(_tmpl$8), "."];
      }
    }));
    insert(_el$91, createComponent(Faq, {
      question: "Do I need extra AI subscriptions to use OpenCode?",
      get children() {
        return ["Not necessarily, but probably. You’ll need an AI subscription if you want to connect OpenCode to a paid provider, although you can work with", " ", getNextElement(_tmpl$9), " ", "for free. While we encourage users to use ", createComponent(A, {
          href: "/zen",
          children: "Zen"
        }), ", OpenCode works with all popular providers such as OpenAI, Anthropic, xAI etc."];
      }
    }));
    insert(_el$93, createComponent(Faq, {
      question: "Can I only use OpenCode in the terminal?",
      children: "Yes, for now. We are actively working on a desktop app. Join the waitlist for early access."
    }));
    insert(_el$94, createComponent(Faq, {
      question: "How much does OpenCode cost?",
      get children() {
        return ["OpenCode is 100% free to use. Any additional costs will come from your subscription to a model provider. While OpenCode works with any model provider, we recommend using ", createComponent(A, {
          href: "/zen",
          children: "Zen"
        }), "."];
      }
    }));
    insert(_el$95, createComponent(Faq, {
      question: "What about data and privacy?",
      get children() {
        return ["Your data and information is only stored when you create sharable links in OpenCode. Learn more about", " ", getNextElement(_tmpl$0), "."];
      }
    }));
    insert(_el$97, createComponent(Faq, {
      question: "Is OpenCode open source?",
      get children() {
        return ["Yes, OpenCode is fully open source. The source code is public on", " ", (() => {
          var _el$98 = getNextElement(_tmpl$1);
          createRenderEffect(() => setAttribute(_el$98, "href", config.github.repoUrl));
          return _el$98;
        })(), " ", "under the", " ", (() => {
          var _el$99 = getNextElement(_tmpl$10);
          createRenderEffect(() => setAttribute(_el$99, "href", `${config.github.repoUrl}?tab=MIT-1-ov-file#readme`));
          return _el$99;
        })(), ", meaning anyone can use, modify, or contribute to its development. Anyone from the community can file issues, submit pull requests, and extend functionality."];
      }
    }));
    insert(_el$101, createComponent(A, {
      href: "/zen",
      get children() {
        return [getNextElement(_tmpl$11), getNextElement(_tmpl$12)];
      }
    }), _el$108, _co$12);
    insert(_el$8, createComponent(EmailSignup, {}), _el$110, _co$13);
    insert(_el$8, createComponent(Footer, {}), _el$112, _co$14);
    insert(_el$6, createComponent(Legal, {}), _el$128, _co$22);
    createRenderEffect(() => setAttribute(_el$1, "href", release()?.url ?? `${config.github.repoUrl}/releases`));
    return _el$6;
  })();
}
delegateEvents(["click"]);

export { Home as default };
