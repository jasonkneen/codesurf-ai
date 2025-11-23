import { h as delegateEvents, e as createSignal, a as createMemo, b as createComponent, i as getNextElement, t as template, l as insert, S as Show, y as createRenderEffect, z as setProperty, r as runHydrationEvents, J as className, L as For, v as getNextMarker, w as setAttribute, m as memo, A as createEffect, I as use } from './web-B4FMlVCr.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { a as IconCheck, I as IconCopy, d as IconStealth, e as IconXai, f as IconAlibaba, g as IconZai, h as IconMoonshotAI, i as IconAnthropic, j as IconOpenAI, k as IconLogo } from './icon-phIboNhp.js';
import { q as query, u as useParams } from './query-C7ETZYOA.js';
import { a as formatDateForTable, b as formatDateUTC, d as querySessionInfo, c as createCheckoutUrl, q as queryBillingInfo, f as formatBalance } from './common-DDAj15d0.js';
import { b as action, u as useSubmission, c as useAction } from './action-BpQ-vK1N.js';

const root$2 = "_root_875c5_1";
const styles$3 = {
	root: root$2
};

var _tmpl$$4 = /* @__PURE__ */ template(`<div data-slot=key-display><div data-slot=key-container><code data-slot=key-value></code><button data-color=primary title="Copy API key">`), _tmpl$2$4 = /* @__PURE__ */ template(`<div><div data-component=feature-grid><div data-slot=feature><h3>Tested & Verified Models</h3><p>We've benchmarked and tested models specifically for coding agents to ensure the best performance.</p></div><div data-slot=feature><h3>Highest Quality</h3><p>Access models configured for optimal performance - no downgrades or routing to cheaper providers.</p></div><div data-slot=feature><h3>No Lock-in</h3><p>Use Zen with any coding agent, and continue using other providers with opencode whenever you want.</p></div></div><div data-component=api-key-highlight></div><div data-component=next-steps><ol><li>Enable billing</li><li>Run <code>opencode auth login</code> and select opencode</li><li>Paste your API key</li><li>Start opencode and run <code>/models</code> to select a model`);
const getUsageInfo_query$1 = createServerReference(() => {
}, "src_routes_workspace_id_new-user-section_tsx--getUsageInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/new-user-section.tsx?tsr-directive-use-server=");
const getUsageInfo$1 = query(getUsageInfo_query$1, "usage.list");
const listKeys_query = createServerReference(() => {
}, "src_routes_workspace_id_new-user-section_tsx--listKeys_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/new-user-section.tsx?tsr-directive-use-server=");
const listKeys = query(listKeys_query, "key.list");
function NewUserSection() {
  const params = useParams();
  const [copiedKey, setCopiedKey] = createSignal(false);
  const keys = createAsync(() => listKeys(params.id));
  const usage = createAsync(() => getUsageInfo$1(params.id));
  const isNew = createMemo(() => {
    const keysList = keys();
    const usageList = usage();
    return keysList?.length === 1 && (!usageList || usageList.length === 0);
  });
  const defaultKey = createMemo(() => {
    const key = keys()?.at(-1)?.key;
    if (!key) return void 0;
    return {
      actual: key,
      masked: key.slice(0, 8) + "*".repeat(key.length - 12) + key.slice(-4)
    };
  });
  return createComponent(Show, {
    get when() {
      return isNew();
    },
    get children() {
      var _el$ = getNextElement(_tmpl$2$4), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      insert(_el$3, createComponent(Show, {
        get when() {
          return defaultKey();
        },
        get children() {
          var _el$4 = getNextElement(_tmpl$$4), _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling;
          insert(_el$6, () => defaultKey()?.masked);
          _el$7.$$click = async () => {
            await navigator.clipboard.writeText(defaultKey()?.actual ?? "");
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2e3);
          };
          insert(_el$7, createComponent(Show, {
            get when() {
              return copiedKey();
            },
            get fallback() {
              return [createComponent(IconCopy, {
                style: {
                  width: "16px",
                  height: "16px"
                }
              }), " Copy Key"];
            },
            get children() {
              return [createComponent(IconCheck, {
                style: {
                  width: "16px",
                  height: "16px"
                }
              }), " Copied!"];
            }
          }));
          createRenderEffect(() => setProperty(_el$7, "disabled", copiedKey()));
          runHydrationEvents();
          return _el$4;
        }
      }));
      createRenderEffect(() => className(_el$, styles$3.root));
      return _el$;
    }
  });
}
delegateEvents(["click"]);

const root$1 = "_root_aw29e_1";
const styles$2 = {
	root: root$1
};

var _tmpl$$3 = /* @__PURE__ */ template(`<table data-slot=usage-table-element><thead><tr><th>Date</th><th>Model</th><th>Input</th><th>Output</th><th>Cost</th></tr></thead><tbody>`), _tmpl$2$3 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Usage History</h2><p>Recent API usage and costs.</p></div><div data-slot=usage-table>`), _tmpl$3$3 = /* @__PURE__ */ template(`<div data-component=empty-state><p>Make your first API call to get started.`), _tmpl$4$2 = /* @__PURE__ */ template(`<tr><td data-slot=usage-date></td><td data-slot=usage-model></td><td data-slot=usage-tokens></td><td data-slot=usage-tokens></td><td data-slot=usage-cost>$<!$><!/>`);
const getUsageInfo_query = createServerReference(() => {
}, "src_routes_workspace_id_usage-section_tsx--getUsageInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/usage-section.tsx?tsr-directive-use-server=");
const getUsageInfo = query(getUsageInfo_query, "usage.list");
function UsageSection() {
  const params = useParams();
  const usage = createAsync(() => getUsageInfo(params.id));
  return (() => {
    var _el$ = getNextElement(_tmpl$2$3), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$3, createComponent(Show, {
      get when() {
        return memo(() => !!usage())() && usage().length > 0;
      },
      get fallback() {
        return getNextElement(_tmpl$3$3);
      },
      get children() {
        var _el$4 = getNextElement(_tmpl$$3), _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling;
        insert(_el$6, createComponent(For, {
          get each() {
            return usage();
          },
          children: (usage2) => {
            const date = createMemo(() => new Date(usage2.timeCreated));
            return (() => {
              var _el$8 = getNextElement(_tmpl$4$2), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling, _el$11 = _el$10.nextSibling, _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling, [_el$14, _co$] = getNextMarker(_el$13.nextSibling);
              insert(_el$9, () => formatDateForTable(date()));
              insert(_el$0, () => usage2.model);
              insert(_el$1, () => usage2.inputTokens);
              insert(_el$10, () => usage2.outputTokens);
              insert(_el$11, () => ((usage2.cost ?? 0) / 1e8).toFixed(4), _el$14, _co$);
              createRenderEffect(() => setAttribute(_el$9, "title", formatDateUTC(date())));
              return _el$8;
            })();
          }
        }));
        return _el$4;
      }
    }));
    createRenderEffect(() => className(_el$, styles$2.root));
    return _el$;
  })();
}

const styles$1 = {
	
};

var _tmpl$$2 = /* @__PURE__ */ template(`<div data-slot=models-table><table data-slot=models-table-element><thead><tr><th>Model</th><th></th><th>Enabled</th></tr></thead><tbody>`), _tmpl$2$2 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Models</h2><p>Manage which models workspace members can access. <a href="/docs/zen#pricing ">Learn more</a>.</p></div><div data-slot=models-list>`), _tmpl$3$2 = /* @__PURE__ */ template(`<tr data-slot=model-row><td data-slot=model-name><div><!$><!/><span></span></div></td><td data-slot=model-lab></td><td data-slot=model-toggle><form method=post><input type=hidden name=model><input type=hidden name=workspaceID><input type=hidden name=enabled><label data-slot=model-toggle-label><input type=checkbox><span>`);
const getModelLab = (modelId) => {
  if (modelId.startsWith("claude")) return "Anthropic";
  if (modelId.startsWith("gpt")) return "OpenAI";
  if (modelId.startsWith("kimi")) return "Moonshot AI";
  if (modelId.startsWith("glm")) return "Z.ai";
  if (modelId.startsWith("qwen")) return "Alibaba";
  if (modelId.startsWith("grok")) return "xAI";
  return "Stealth";
};
const getModelsInfo_query = createServerReference(() => {
}, "src_routes_workspace_id_model-section_tsx--getModelsInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/model-section.tsx?tsr-directive-use-server=");
const getModelsInfo = query(getModelsInfo_query, "model.info");
const updateModel_action = createServerReference(() => {
}, "src_routes_workspace_id_model-section_tsx--updateModel_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/model-section.tsx?tsr-directive-use-server=");
const updateModel = action(updateModel_action, "model.toggle");
function ModelSection() {
  const params = useParams();
  const modelsInfo = createAsync(() => getModelsInfo(params.id));
  const userInfo = createAsync(() => querySessionInfo(params.id));
  const modelsWithLab = createMemo(() => {
    const info = modelsInfo();
    if (!info) return [];
    return info.all.map((model) => ({
      ...model,
      lab: getModelLab(model.id)
    }));
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$2$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$3, createComponent(Show, {
      get when() {
        return modelsInfo();
      },
      get children() {
        var _el$4 = getNextElement(_tmpl$$2), _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling;
        insert(_el$7, createComponent(For, {
          get each() {
            return modelsWithLab();
          },
          children: ({
            id,
            name,
            lab
          }) => {
            const isEnabled = createMemo(() => !modelsInfo().disabled.includes(id));
            return (() => {
              var _el$8 = getNextElement(_tmpl$3$2), _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$10 = _el$0.firstChild, [_el$11, _co$] = getNextMarker(_el$10.nextSibling), _el$1 = _el$11.nextSibling, _el$12 = _el$9.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild, _el$16 = _el$15.nextSibling, _el$17 = _el$16.nextSibling, _el$18 = _el$17.nextSibling, _el$19 = _el$18.firstChild;
              insert(_el$0, () => {
                switch (lab) {
                  case "OpenAI":
                    return createComponent(IconOpenAI, {
                      width: 16,
                      height: 16
                    });
                  case "Anthropic":
                    return createComponent(IconAnthropic, {
                      width: 16,
                      height: 16
                    });
                  case "Moonshot AI":
                    return createComponent(IconMoonshotAI, {
                      width: 16,
                      height: 16
                    });
                  case "Z.ai":
                    return createComponent(IconZai, {
                      width: 16,
                      height: 16
                    });
                  case "Alibaba":
                    return createComponent(IconAlibaba, {
                      width: 16,
                      height: 16
                    });
                  case "xAI":
                    return createComponent(IconXai, {
                      width: 16,
                      height: 16
                    });
                  default:
                    return createComponent(IconStealth, {
                      width: 16,
                      height: 16
                    });
                }
              }, _el$11, _co$);
              insert(_el$1, name);
              insert(_el$12, lab);
              setAttribute(_el$14, "action", updateModel);
              setProperty(_el$15, "value", id);
              _el$19.addEventListener("change", (e) => {
                const form = e.currentTarget.closest("form");
                if (form) form.requestSubmit();
              });
              createRenderEffect((_p$) => {
                var _v$ = !isEnabled(), _v$2 = !userInfo()?.isAdmin;
                _v$ !== _p$.e && setAttribute(_el$8, "data-disabled", _p$.e = _v$);
                _v$2 !== _p$.t && setProperty(_el$19, "disabled", _p$.t = _v$2);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              createRenderEffect(() => setProperty(_el$16, "value", params.id));
              createRenderEffect(() => setProperty(_el$17, "value", isEnabled().toString()));
              createRenderEffect(() => setProperty(_el$19, "checked", isEnabled()));
              return _el$8;
            })();
          }
        }));
        return _el$4;
      }
    }));
    createRenderEffect(() => className(_el$, styles$1.root));
    return _el$;
  })();
}

const root = "_root_oyy9u_1";
const styles = {
	root: root
};

var _tmpl$$1 = /* @__PURE__ */ template(`<form method=post data-slot=edit-form><div data-slot=input-wrapper><input name=credentials type=text autocomplete=off data-form-type=other data-lpignore=true><!$><!/></div><input type=hidden name=provider><input type=hidden name=workspaceID>`), _tmpl$2$1 = /* @__PURE__ */ template(`<button type=reset data-color=ghost>Cancel`), _tmpl$3$1 = /* @__PURE__ */ template(`<div data-slot=form-actions><button type=submit data-color=ghost></button><!$><!/>`), _tmpl$4$1 = /* @__PURE__ */ template(`<tr data-slot=provider-row><td data-slot=provider-name></td><td data-slot=provider-key></td><td data-slot=provider-action>`), _tmpl$5 = /* @__PURE__ */ template(`<span>`), _tmpl$6 = /* @__PURE__ */ template(`<div data-slot=form-error>`), _tmpl$7 = /* @__PURE__ */ template(`<div data-slot=configured-actions><button data-color=ghost>Edit</button><form method=post data-slot=delete-form><input type=hidden name=provider><input type=hidden name=workspaceID><button data-color=ghost type=submit>Delete`), _tmpl$8 = /* @__PURE__ */ template(`<button data-color=ghost>Configure`), _tmpl$9 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Bring Your Own Key</h2><p>Configure your own API keys from AI providers.</p></div><div data-slot=providers-table><table data-slot=providers-table-element><thead><tr><th>Provider</th><th>API Key</th><th></th></tr></thead><tbody>`);
const PROVIDERS = [{
  name: "OpenAI",
  key: "openai",
  prefix: "sk-"
}, {
  name: "Anthropic",
  key: "anthropic",
  prefix: "sk-ant-"
}];
function maskCredentials(credentials) {
  return `${credentials.slice(0, 8)}...${credentials.slice(-8)}`;
}
const removeProvider_action = createServerReference(() => {
}, "src_routes_workspace_id_provider-section_tsx--removeProvider_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const removeProvider = action(removeProvider_action, "provider.remove");
const saveProvider_action = createServerReference(() => {
}, "src_routes_workspace_id_provider-section_tsx--saveProvider_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const saveProvider = action(saveProvider_action, "provider.save");
const listProviders_query = createServerReference(() => {
}, "src_routes_workspace_id_provider-section_tsx--listProviders_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const listProviders = query(listProviders_query, "provider.list");
function ProviderRow(props) {
  const params = useParams();
  const providers = createAsync(() => listProviders(params.id));
  const saveSubmission = useSubmission(saveProvider, ([fd]) => fd.get("provider")?.toString() === props.provider.key);
  const removeSubmission = useSubmission(removeProvider, ([fd]) => fd.get("provider")?.toString() === props.provider.key);
  const [store, setStore] = createStore({
    editing: false
  });
  let input;
  const providerData = () => providers()?.find((p) => p.provider === props.provider.key);
  createEffect(() => {
    if (!saveSubmission.pending && saveSubmission.result && !saveSubmission.result.error) {
      hide();
    }
  });
  function show() {
    while (true) {
      saveSubmission.clear();
      if (!saveSubmission.result) break;
    }
    setStore("editing", true);
    setTimeout(() => input?.focus(), 0);
  }
  function hide() {
    setStore("editing", false);
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$4$1), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$1 = _el$3.nextSibling;
    insert(_el$2, () => props.provider.name);
    insert(_el$3, createComponent(Show, {
      get when() {
        return store.editing;
      },
      get fallback() {
        return (() => {
          var _el$15 = getNextElement(_tmpl$5);
          insert(_el$15, (() => {
            var _c$ = memo(() => !!providerData());
            return () => _c$() ? maskCredentials(providerData().credentials) : "-";
          })());
          return _el$15;
        })();
      },
      get children() {
        var _el$4 = getNextElement(_tmpl$$1), _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, [_el$8, _co$] = getNextMarker(_el$7.nextSibling), _el$9 = _el$5.nextSibling, _el$0 = _el$9.nextSibling;
        setAttribute(_el$4, "action", saveProvider);
        use((r) => input = r, _el$6);
        insert(_el$5, createComponent(Show, {
          get when() {
            return memo(() => !!saveSubmission.result)() && saveSubmission.result.error;
          },
          children: (err) => (() => {
            var _el$16 = getNextElement(_tmpl$6);
            insert(_el$16, err);
            return _el$16;
          })()
        }), _el$8, _co$);
        createRenderEffect((_p$) => {
          var _v$ = `provider-form-${props.provider.key}`, _v$2 = `Enter ${props.provider.name} API key (${props.provider.prefix}...)`;
          _v$ !== _p$.e && setAttribute(_el$4, "id", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$6, "placeholder", _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        createRenderEffect(() => setProperty(_el$9, "value", props.provider.key));
        createRenderEffect(() => setProperty(_el$0, "value", params.id));
        return _el$4;
      }
    }));
    insert(_el$1, createComponent(Show, {
      get when() {
        return store.editing;
      },
      get fallback() {
        return createComponent(Show, {
          get when() {
            return !!providerData();
          },
          get fallback() {
            return (() => {
              var _el$23 = getNextElement(_tmpl$8);
              _el$23.$$click = () => show();
              runHydrationEvents();
              return _el$23;
            })();
          },
          get children() {
            var _el$17 = getNextElement(_tmpl$7), _el$18 = _el$17.firstChild, _el$19 = _el$18.nextSibling, _el$20 = _el$19.firstChild, _el$21 = _el$20.nextSibling, _el$22 = _el$21.nextSibling;
            _el$18.$$click = () => show();
            setAttribute(_el$19, "action", removeProvider);
            createRenderEffect(() => setProperty(_el$22, "disabled", removeSubmission.pending));
            createRenderEffect(() => setProperty(_el$20, "value", props.provider.key));
            createRenderEffect(() => setProperty(_el$21, "value", params.id));
            runHydrationEvents();
            return _el$17;
          }
        });
      },
      get children() {
        var _el$10 = getNextElement(_tmpl$3$1), _el$11 = _el$10.firstChild, _el$13 = _el$11.nextSibling, [_el$14, _co$2] = getNextMarker(_el$13.nextSibling);
        insert(_el$11, () => saveSubmission.pending ? "Saving..." : "Save");
        insert(_el$10, createComponent(Show, {
          get when() {
            return !saveSubmission.pending;
          },
          get children() {
            var _el$12 = getNextElement(_tmpl$2$1);
            _el$12.$$click = () => hide();
            runHydrationEvents();
            return _el$12;
          }
        }), _el$14, _co$2);
        createRenderEffect((_p$) => {
          var _v$3 = saveSubmission.pending, _v$4 = `provider-form-${props.provider.key}`;
          _v$3 !== _p$.e && setProperty(_el$11, "disabled", _p$.e = _v$3);
          _v$4 !== _p$.t && setAttribute(_el$11, "form", _p$.t = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$10;
      }
    }));
    return _el$;
  })();
}
function ProviderSection() {
  return (() => {
    var _el$24 = getNextElement(_tmpl$9), _el$25 = _el$24.firstChild, _el$26 = _el$25.nextSibling, _el$27 = _el$26.firstChild, _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling;
    insert(_el$29, createComponent(For, {
      each: PROVIDERS,
      children: (provider) => createComponent(ProviderRow, {
        provider
      })
    }));
    createRenderEffect(() => className(_el$24, styles.root));
    return _el$24;
  })();
}
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<span data-slot=balance>Current balance <b>$<!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<span data-slot=billing-info>`), _tmpl$3 = /* @__PURE__ */ template(`<div data-page=workspace-[id]><section data-component=header-section><!$><!/><p><span>Reliable optimized models for coding agents. <a target=_blank href=/docs/zen>Learn more</a>.</span><!$><!/></p></section><div data-slot=sections><!$><!/><!$><!/><!$><!/><!$><!/>`), _tmpl$4 = /* @__PURE__ */ template(`<button data-color=primary data-size=sm>`);
function index() {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  const checkoutAction = useAction(createCheckoutUrl);
  const checkoutSubmission = useSubmission(createCheckoutUrl);
  const [store, setStore] = createStore({
    checkoutRedirecting: false
  });
  const balance = createMemo(() => formatBalance(billingInfo()?.balance ?? 0));
  async function onClickCheckout() {
    const baseUrl = window.location.href;
    const checkout = await checkoutAction(params.id, billingInfo().reloadAmount, baseUrl, baseUrl);
    if (checkout && checkout.data) {
      setStore("checkoutRedirecting", true);
      window.location.href = checkout.data;
    }
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$3), _el$2 = _el$.firstChild, _el$12 = _el$2.firstChild, [_el$13, _co$3] = getNextMarker(_el$12.nextSibling), _el$3 = _el$13.nextSibling, _el$4 = _el$3.firstChild, _el$10 = _el$4.nextSibling, [_el$11, _co$2] = getNextMarker(_el$10.nextSibling), _el$14 = _el$2.nextSibling, _el$15 = _el$14.firstChild, [_el$16, _co$4] = getNextMarker(_el$15.nextSibling), _el$17 = _el$16.nextSibling, [_el$18, _co$5] = getNextMarker(_el$17.nextSibling), _el$19 = _el$18.nextSibling, [_el$20, _co$6] = getNextMarker(_el$19.nextSibling), _el$21 = _el$20.nextSibling, [_el$22, _co$7] = getNextMarker(_el$21.nextSibling);
    insert(_el$2, createComponent(IconLogo, {}), _el$13, _co$3);
    insert(_el$3, createComponent(Show, {
      get when() {
        return userInfo()?.isAdmin;
      },
      get children() {
        var _el$5 = getNextElement(_tmpl$2);
        insert(_el$5, createComponent(Show, {
          get when() {
            return billingInfo()?.reload;
          },
          get fallback() {
            return (() => {
              var _el$23 = getNextElement(_tmpl$4);
              _el$23.$$click = onClickCheckout;
              insert(_el$23, () => checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Enable billing");
              createRenderEffect(() => setProperty(_el$23, "disabled", checkoutSubmission.pending || store.checkoutRedirecting));
              runHydrationEvents();
              return _el$23;
            })();
          },
          get children() {
            var _el$6 = getNextElement(_tmpl$), _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, [_el$1, _co$] = getNextMarker(_el$0.nextSibling);
            insert(_el$8, balance, _el$1, _co$);
            return _el$6;
          }
        }));
        return _el$5;
      }
    }), _el$11, _co$2);
    insert(_el$14, createComponent(NewUserSection, {}), _el$16, _co$4);
    insert(_el$14, createComponent(ModelSection, {}), _el$18, _co$5);
    insert(_el$14, createComponent(Show, {
      get when() {
        return userInfo()?.isAdmin;
      },
      get children() {
        return createComponent(ProviderSection, {});
      }
    }), _el$20, _co$6);
    insert(_el$14, createComponent(UsageSection, {}), _el$22, _co$7);
    return _el$;
  })();
}
delegateEvents(["click"]);

export { index as default };
