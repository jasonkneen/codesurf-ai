import { h as delegateEvents, A as createEffect, i as getNextElement, t as template, v as getNextMarker, l as insert, b as createComponent, w as setAttribute, I as use, S as Show, m as memo, y as createRenderEffect, z as setProperty, r as runHydrationEvents, L as For, e as createSignal, J as className } from './web-B4FMlVCr.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { a as IconCheck, I as IconCopy } from './icon-phIboNhp.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { a as formatDateForTable, b as formatDateUTC } from './common-DDAj15d0.js';
import { q as query, u as useParams } from './query-C7ETZYOA.js';
import { b as action, u as useSubmission } from './action-BpQ-vK1N.js';

const root = "_root_gwojo_1";
const styles = {
	root: root
};

var _tmpl$$1 = /* @__PURE__ */ template(`<form method=post data-slot=create-form><div data-slot=input-container><input data-component=input name=name type=text placeholder="Enter key name"><!$><!/></div><input type=hidden name=workspaceID><div data-slot=form-actions><button type=reset data-color=ghost>Cancel</button><button type=submit data-color=primary>`), _tmpl$2 = /* @__PURE__ */ template(`<table data-slot=api-keys-table-element><thead><tr><th>Name</th><th>Key</th><th>Created By</th><th>Last Used</th><th></th></tr></thead><tbody>`), _tmpl$3 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>API Keys</h2><div data-slot=title-row><p>Manage your API keys for accessing opencode services.</p><button data-color=primary>Create API Key</button></div></div><!$><!/><div data-slot=api-keys-table>`), _tmpl$4 = /* @__PURE__ */ template(`<div data-slot=form-error>`), _tmpl$5 = /* @__PURE__ */ template(`<div data-component=empty-state><p>Create an opencode Gateway API key`), _tmpl$6 = /* @__PURE__ */ template(`<button data-color=ghost title="Copy API key"><span></span><!$><!/>`), _tmpl$7 = /* @__PURE__ */ template(`<tr><td data-slot=key-name></td><td data-slot=key-value></td><td data-slot=key-user-email></td><td data-slot=key-last-used></td><td data-slot=key-actions><form method=post><input type=hidden name=id><input type=hidden name=workspaceID><button data-color=ghost>Delete`), _tmpl$8 = /* @__PURE__ */ template(`<span>`);
const removeKey_action = createServerReference(() => {
}, "src_routes_workspace_id_keys_key-section_tsx--removeKey_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const removeKey = action(removeKey_action, "key.remove");
const createKey_action = createServerReference(() => {
}, "src_routes_workspace_id_keys_key-section_tsx--createKey_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const createKey = action(createKey_action, "key.create");
const listKeys_query = createServerReference(() => {
}, "src_routes_workspace_id_keys_key-section_tsx--listKeys_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const listKeys = query(listKeys_query, "key.list");
function KeySection() {
  const params = useParams();
  const keys = createAsync(() => listKeys(params.id));
  const submission = useSubmission(createKey);
  const [store, setStore] = createStore({
    show: false
  });
  let input;
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      setStore("show", false);
    }
  });
  function show() {
    while (true) {
      submission.clear();
      if (!submission.result) break;
    }
    setStore("show", true);
    setTimeout(() => input?.focus(), 0);
  }
  function hide() {
    setStore("show", false);
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$3), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$18 = _el$2.nextSibling, [_el$19, _co$2] = getNextMarker(_el$18.nextSibling), _el$14 = _el$19.nextSibling;
    _el$6.$$click = () => show();
    insert(_el$, createComponent(Show, {
      get when() {
        return store.show;
      },
      get children() {
        var _el$7 = getNextElement(_tmpl$$1), _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, [_el$1, _co$] = getNextMarker(_el$0.nextSibling), _el$10 = _el$8.nextSibling, _el$11 = _el$10.nextSibling, _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling;
        setAttribute(_el$7, "action", createKey);
        use((r) => input = r, _el$9);
        insert(_el$8, createComponent(Show, {
          get when() {
            return memo(() => !!submission.result)() && submission.result.error;
          },
          children: (err) => (() => {
            var _el$20 = getNextElement(_tmpl$4);
            insert(_el$20, err);
            return _el$20;
          })()
        }), _el$1, _co$);
        _el$12.$$click = () => hide();
        insert(_el$13, () => submission.pending ? "Creating..." : "Create");
        createRenderEffect(() => setProperty(_el$13, "disabled", submission.pending));
        createRenderEffect(() => setProperty(_el$10, "value", params.id));
        runHydrationEvents();
        return _el$7;
      }
    }), _el$19, _co$2);
    insert(_el$14, createComponent(Show, {
      get when() {
        return keys()?.length;
      },
      get fallback() {
        return getNextElement(_tmpl$5);
      },
      get children() {
        var _el$15 = getNextElement(_tmpl$2), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling;
        insert(_el$17, createComponent(For, {
          get each() {
            return keys();
          },
          children: (key) => {
            const [copied, setCopied] = createSignal(false);
            return (() => {
              var _el$22 = getNextElement(_tmpl$7), _el$23 = _el$22.firstChild, _el$24 = _el$23.nextSibling, _el$29 = _el$24.nextSibling, _el$30 = _el$29.nextSibling, _el$31 = _el$30.nextSibling, _el$32 = _el$31.firstChild, _el$33 = _el$32.firstChild, _el$34 = _el$33.nextSibling;
              insert(_el$23, () => key.name);
              insert(_el$24, createComponent(Show, {
                get when() {
                  return key.key;
                },
                get fallback() {
                  return (() => {
                    var _el$35 = getNextElement(_tmpl$8);
                    insert(_el$35, () => key.keyDisplay);
                    return _el$35;
                  })();
                },
                get children() {
                  var _el$25 = getNextElement(_tmpl$6), _el$26 = _el$25.firstChild, _el$27 = _el$26.nextSibling, [_el$28, _co$3] = getNextMarker(_el$27.nextSibling);
                  _el$25.$$click = async () => {
                    await navigator.clipboard.writeText(key.key);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1e3);
                  };
                  insert(_el$26, () => key.keyDisplay);
                  insert(_el$25, createComponent(Show, {
                    get when() {
                      return copied();
                    },
                    get fallback() {
                      return createComponent(IconCopy, {
                        style: {
                          width: "14px",
                          height: "14px"
                        }
                      });
                    },
                    get children() {
                      return createComponent(IconCheck, {
                        style: {
                          width: "14px",
                          height: "14px"
                        }
                      });
                    }
                  }), _el$28, _co$3);
                  createRenderEffect(() => setProperty(_el$25, "disabled", copied()));
                  runHydrationEvents();
                  return _el$25;
                }
              }));
              insert(_el$29, () => key.email);
              insert(_el$30, (() => {
                var _c$ = memo(() => !!key.timeUsed);
                return () => _c$() ? formatDateForTable(key.timeUsed) : "-";
              })());
              setAttribute(_el$32, "action", removeKey);
              createRenderEffect(() => setAttribute(_el$30, "title", key.timeUsed ? formatDateUTC(key.timeUsed) : void 0));
              createRenderEffect(() => setProperty(_el$33, "value", key.id));
              createRenderEffect(() => setProperty(_el$34, "value", params.id));
              return _el$22;
            })();
          }
        }));
        return _el$15;
      }
    }));
    createRenderEffect(() => className(_el$, styles.root));
    runHydrationEvents();
    return _el$;
  })();
}
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div data-page=workspace-[id]><div data-slot=sections>`);
function index() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(KeySection, {}));
    return _el$;
  })();
}

export { index as default };
