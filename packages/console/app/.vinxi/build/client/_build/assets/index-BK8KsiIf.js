import { h as delegateEvents, A as createEffect, i as getNextElement, t as template, v as getNextMarker, l as insert, m as memo, b as createComponent, r as runHydrationEvents, w as setAttribute, I as use, S as Show, y as createRenderEffect, z as setProperty, J as className, a as createMemo, K as Switch, M as Match, L as For } from './web-B4FMlVCr.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { q as queryBillingInfo, c as createCheckoutUrl, f as formatBalance, a as formatDateForTable, b as formatDateUTC, d as querySessionInfo } from './common-DDAj15d0.js';
import { u as useParams, q as query } from './query-C7ETZYOA.js';
import { b as action, u as useSubmission, c as useAction } from './action-BpQ-vK1N.js';
import { b as IconStripe, c as IconCreditCard } from './icon-phIboNhp.js';

const root$3 = "_root_al9io_1";
const styles$3 = {
	root: root$3
};

var _tmpl$$4 = /* @__PURE__ */ template(`<button data-color=primary>`), _tmpl$2$3 = /* @__PURE__ */ template(`<p data-slot=usage-status>Current usage for <!$><!/> is $<!$><!/>.`), _tmpl$3$2 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Monthly Limit</h2><p>Set a monthly usage limit for your account.</p></div><div data-slot=section-content><div data-slot=balance><div data-slot=amount><!$><!/><span data-slot=value></span></div><!$><!/></div><!$><!/>`), _tmpl$4$2 = /* @__PURE__ */ template(`<span data-slot=currency>$`), _tmpl$5$2 = /* @__PURE__ */ template(`<form method=post data-slot=create-form><div data-slot=input-container><input required data-component=input name=limit type=number placeholder=50><!$><!/></div><input type=hidden name=workspaceID><div data-slot=form-actions><button type=reset data-color=ghost>Cancel</button><button type=submit data-color=primary>`), _tmpl$6$2 = /* @__PURE__ */ template(`<div data-slot=form-error>`), _tmpl$7$1 = /* @__PURE__ */ template(`<p data-slot=usage-status>No usage limit set.`);
const setMonthlyLimit_action = createServerReference(() => {
}, "src_routes_workspace_id_billing_monthly-limit-section_tsx--setMonthlyLimit_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/monthly-limit-section.tsx?tsr-directive-use-server=");
const setMonthlyLimit = action(setMonthlyLimit_action, "billing.setMonthlyLimit");
function MonthlyLimitSection() {
  const params = useParams();
  const submission = useSubmission(setMonthlyLimit);
  const [store, setStore] = createStore({
    show: false
  });
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  let input;
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      hide();
    }
  });
  function show() {
    while (true) {
      submission.clear();
      if (!submission.result) break;
    }
    setStore("show", true);
    input.focus();
  }
  function hide() {
    setStore("show", false);
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$3$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$7 = _el$5.firstChild, [_el$8, _co$] = getNextMarker(_el$7.nextSibling), _el$6 = _el$8.nextSibling, _el$0 = _el$5.nextSibling, [_el$1, _co$2] = getNextMarker(_el$0.nextSibling), _el$18 = _el$4.nextSibling, [_el$19, _co$5] = getNextMarker(_el$18.nextSibling);
    insert(_el$5, (() => {
      var _c$ = memo(() => !!billingInfo()?.monthlyLimit);
      return () => _c$() ? getNextElement(_tmpl$4$2) : null;
    })(), _el$8, _co$);
    insert(_el$6, () => billingInfo()?.monthlyLimit ?? "-");
    insert(_el$4, createComponent(Show, {
      get when() {
        return !store.show;
      },
      get fallback() {
        return (() => {
          var _el$21 = getNextElement(_tmpl$5$2), _el$22 = _el$21.firstChild, _el$23 = _el$22.firstChild, _el$24 = _el$23.nextSibling, [_el$25, _co$6] = getNextMarker(_el$24.nextSibling), _el$26 = _el$22.nextSibling, _el$27 = _el$26.nextSibling, _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling;
          setAttribute(_el$21, "action", setMonthlyLimit);
          use((r) => input = r, _el$23);
          insert(_el$22, createComponent(Show, {
            get when() {
              return memo(() => !!submission.result)() && submission.result.error;
            },
            children: (err) => (() => {
              var _el$30 = getNextElement(_tmpl$6$2);
              insert(_el$30, err);
              return _el$30;
            })()
          }), _el$25, _co$6);
          _el$28.$$click = () => hide();
          insert(_el$29, () => submission.pending ? "Setting..." : "Set");
          createRenderEffect(() => setProperty(_el$29, "disabled", submission.pending));
          createRenderEffect(() => setProperty(_el$26, "value", params.id));
          runHydrationEvents();
          return _el$21;
        })();
      },
      get children() {
        var _el$9 = getNextElement(_tmpl$$4);
        _el$9.$$click = () => show();
        insert(_el$9, () => billingInfo()?.monthlyLimit ? "Edit Limit" : "Set Limit");
        runHydrationEvents();
        return _el$9;
      }
    }), _el$1, _co$2);
    insert(_el$3, createComponent(Show, {
      get when() {
        return billingInfo()?.monthlyLimit;
      },
      get fallback() {
        return getNextElement(_tmpl$7$1);
      },
      get children() {
        var _el$10 = getNextElement(_tmpl$2$3), _el$11 = _el$10.firstChild, _el$14 = _el$11.nextSibling, [_el$15, _co$3] = getNextMarker(_el$14.nextSibling), _el$12 = _el$15.nextSibling, _el$16 = _el$12.nextSibling, [_el$17, _co$4] = getNextMarker(_el$16.nextSibling); _el$17.nextSibling;
        insert(_el$10, () => (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          month: "long",
          timeZone: "UTC"
        }), _el$15, _co$3);
        insert(_el$10, () => {
          const dateLastUsed = billingInfo()?.timeMonthlyUsageUpdated;
          if (!dateLastUsed) return "0";
          const current = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            timeZone: "UTC"
          });
          const lastUsed = dateLastUsed.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            timeZone: "UTC"
          });
          if (current !== lastUsed) return "0";
          return ((billingInfo()?.monthlyUsage ?? 0) / 1e8).toFixed(2);
        }, _el$17, _co$4);
        return _el$10;
      }
    }), _el$19, _co$5);
    createRenderEffect(() => className(_el$, styles$3.root));
    return _el$;
  })();
}
delegateEvents(["click"]);

const root$2 = "_root_al2hq_1";
const styles$2 = {
	root: root$2
};

var _tmpl$$3 = /* @__PURE__ */ template(`<button data-color=primary>Add Balance`), _tmpl$2$2 = /* @__PURE__ */ template(`<span data-slot=secret>••••`), _tmpl$3$1 = /* @__PURE__ */ template(`<span data-slot=number>`), _tmpl$4$1 = /* @__PURE__ */ template(`<span data-slot=type>Linked to Stripe`), _tmpl$5$1 = /* @__PURE__ */ template(`<div data-slot=balance-right-section><!$><!/><div data-slot=credit-card><div data-slot=card-icon></div><div data-slot=card-details></div><button data-color=ghost>`), _tmpl$6$1 = /* @__PURE__ */ template(`<button data-slot=enable-billing-button data-color=primary>`), _tmpl$7 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Billing</h2><p>Manage payments methods. <a href=mailto:contact@anoma.ly>Contact us</a> if you have any questions.</p></div><div data-slot=section-content><div data-slot=balance-display><div data-slot=balance-amount><span data-slot=balance-value>$<!$><!/></span><span data-slot=balance-label>Current Balance</span></div><!$><!/></div><!$><!/>`), _tmpl$8 = /* @__PURE__ */ template(`<div data-slot=add-balance-form-container><div data-slot=add-balance-form><label>Add $</label><input data-component=input type=number step=1 placeholder="Enter amount"><div data-slot=form-actions><button data-color=ghost type=button>Cancel</button><button data-color=primary type=button></button></div></div><!$><!/>`), _tmpl$9 = /* @__PURE__ */ template(`<div data-slot=form-error>`), _tmpl$0 = /* @__PURE__ */ template(`<span data-slot=number>----`);
const createSessionUrl_action = createServerReference(() => {
}, "src_routes_workspace_id_billing_billing-section_tsx--createSessionUrl_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/billing-section.tsx?tsr-directive-use-server=");
const createSessionUrl = action(createSessionUrl_action, "sessionUrl");
function BillingSection() {
  const params = useParams();
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  const checkoutAction = useAction(createCheckoutUrl);
  const checkoutSubmission = useSubmission(createCheckoutUrl);
  const sessionAction = useAction(createSessionUrl);
  const sessionSubmission = useSubmission(createSessionUrl);
  const [store, setStore] = createStore({
    showAddBalanceForm: false,
    addBalanceAmount: billingInfo()?.reloadAmount.toString() ?? "",
    checkoutRedirecting: false,
    sessionRedirecting: false
  });
  createEffect(() => {
    const info = billingInfo();
    if (info) {
      setStore("addBalanceAmount", info.reloadAmount.toString());
    }
  });
  const balance = createMemo(() => formatBalance(billingInfo()?.balance ?? 0));
  async function onClickCheckout() {
    const amount = parseInt(store.addBalanceAmount);
    const baseUrl = window.location.href;
    const checkout = await checkoutAction(params.id, amount, baseUrl, baseUrl);
    if (checkout && checkout.data) {
      setStore("checkoutRedirecting", true);
      window.location.href = checkout.data;
    }
  }
  async function onClickSession() {
    const baseUrl = window.location.href;
    const sessionUrl = await sessionAction(params.id, baseUrl);
    if (sessionUrl && sessionUrl.data) {
      setStore("sessionRedirecting", true);
      window.location.href = sessionUrl.data;
    }
  }
  function showAddBalanceForm() {
    while (true) {
      checkoutSubmission.clear();
      if (!checkoutSubmission.result) break;
    }
    setStore({
      showAddBalanceForm: true
    });
  }
  function hideAddBalanceForm() {
    setStore("showAddBalanceForm", false);
    checkoutSubmission.clear();
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$7), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, [_el$9, _co$] = getNextMarker(_el$8.nextSibling), _el$19 = _el$5.nextSibling, [_el$20, _co$3] = getNextMarker(_el$19.nextSibling), _el$22 = _el$4.nextSibling, [_el$23, _co$4] = getNextMarker(_el$22.nextSibling);
    insert(_el$6, balance, _el$9, _co$);
    insert(_el$4, createComponent(Show, {
      get when() {
        return billingInfo()?.customerID;
      },
      get children() {
        var _el$0 = getNextElement(_tmpl$5$1), _el$17 = _el$0.firstChild, [_el$18, _co$2] = getNextMarker(_el$17.nextSibling), _el$10 = _el$18.nextSibling, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$16 = _el$12.nextSibling;
        insert(_el$0, createComponent(Show, {
          get when() {
            return !store.showAddBalanceForm;
          },
          get fallback() {
            return (() => {
              var _el$24 = getNextElement(_tmpl$8), _el$25 = _el$24.firstChild, _el$26 = _el$25.firstChild, _el$27 = _el$26.nextSibling, _el$28 = _el$27.nextSibling, _el$29 = _el$28.firstChild, _el$30 = _el$29.nextSibling, _el$31 = _el$25.nextSibling, [_el$32, _co$5] = getNextMarker(_el$31.nextSibling);
              _el$27.$$input = (e) => {
                setStore("addBalanceAmount", e.currentTarget.value);
                checkoutSubmission.clear();
              };
              _el$29.$$click = () => hideAddBalanceForm();
              _el$30.$$click = onClickCheckout;
              insert(_el$30, () => checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Add");
              insert(_el$24, createComponent(Show, {
                get when() {
                  return memo(() => !!checkoutSubmission.result)() && checkoutSubmission.result.error;
                },
                children: (err) => (() => {
                  var _el$33 = getNextElement(_tmpl$9);
                  insert(_el$33, err);
                  return _el$33;
                })()
              }), _el$32, _co$5);
              createRenderEffect((_p$) => {
                var _v$ = billingInfo()?.reloadAmountMin.toString(), _v$2 = !store.addBalanceAmount || checkoutSubmission.pending || store.checkoutRedirecting;
                _v$ !== _p$.e && setAttribute(_el$27, "min", _p$.e = _v$);
                _v$2 !== _p$.t && setProperty(_el$30, "disabled", _p$.t = _v$2);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              createRenderEffect(() => setProperty(_el$27, "value", store.addBalanceAmount));
              runHydrationEvents();
              return _el$24;
            })();
          },
          get children() {
            var _el$1 = getNextElement(_tmpl$$3);
            _el$1.$$click = () => showAddBalanceForm();
            runHydrationEvents();
            return _el$1;
          }
        }), _el$18, _co$2);
        insert(_el$11, createComponent(Switch, {
          get fallback() {
            return createComponent(IconCreditCard, {
              style: {
                width: "24px",
                height: "24px"
              }
            });
          },
          get children() {
            return createComponent(Match, {
              get when() {
                return billingInfo()?.paymentMethodType === "link";
              },
              get children() {
                return createComponent(IconStripe, {
                  style: {
                    width: "24px",
                    height: "24px"
                  }
                });
              }
            });
          }
        }));
        insert(_el$12, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return billingInfo()?.paymentMethodType === "card";
              },
              get children() {
                return createComponent(Show, {
                  get when() {
                    return billingInfo()?.paymentMethodLast4;
                  },
                  get fallback() {
                    return getNextElement(_tmpl$0);
                  },
                  get children() {
                    return [getNextElement(_tmpl$2$2), (() => {
                      var _el$14 = getNextElement(_tmpl$3$1);
                      insert(_el$14, () => billingInfo()?.paymentMethodLast4);
                      return _el$14;
                    })()];
                  }
                });
              }
            }), createComponent(Match, {
              get when() {
                return billingInfo()?.paymentMethodType === "link";
              },
              get children() {
                return getNextElement(_tmpl$4$1);
              }
            })];
          }
        }));
        _el$16.$$click = onClickSession;
        insert(_el$16, () => sessionSubmission.pending || store.sessionRedirecting ? "Loading..." : "Manage");
        createRenderEffect(() => setProperty(_el$16, "disabled", sessionSubmission.pending || store.sessionRedirecting));
        runHydrationEvents();
        return _el$0;
      }
    }), _el$20, _co$3);
    insert(_el$3, createComponent(Show, {
      get when() {
        return !billingInfo()?.customerID;
      },
      get children() {
        var _el$21 = getNextElement(_tmpl$6$1);
        _el$21.$$click = onClickCheckout;
        insert(_el$21, () => checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Enable Billing");
        createRenderEffect(() => setProperty(_el$21, "disabled", checkoutSubmission.pending || store.checkoutRedirecting));
        runHydrationEvents();
        return _el$21;
      }
    }), _el$23, _co$4);
    createRenderEffect(() => className(_el$, styles$2.root));
    return _el$;
  })();
}
delegateEvents(["click", "input"]);

const root$1 = "_root_1pw8w_1";
const styles$1 = {
	root: root$1
};

var _tmpl$$2 = /* @__PURE__ */ template(`<p>Auto reload is <b>enabled</b>. We'll reload <b>$<!$><!/></b> (+$1.23 processing fee) when balance reaches <b>$<!$><!/></b>.`), _tmpl$2$1 = /* @__PURE__ */ template(`<form method=post data-slot=create-form><div data-slot=form-field><label><span data-slot=field-label>Enable Auto Reload</span><div data-slot=toggle-container><label data-slot=model-toggle-label><input type=checkbox name=reload value=true><span></span></label></div></label></div><div data-slot=input-row><div data-slot=input-field><p>Reload $</p><input data-component=input name=reloadAmount type=number step=1></div><div data-slot=input-field><p>When balance reaches $</p><input data-component=input name=reloadTrigger type=number step=1></div></div><!$><!/><input type=hidden name=workspaceID><div data-slot=form-actions><button type=button data-color=ghost>Cancel</button><button type=submit data-color=primary>`), _tmpl$3 = /* @__PURE__ */ template(`<div data-slot=section-content><div data-slot=reload-error><p>Reload failed at <!$><!/>. Reason: <!$><!/>. Please update your payment method and try again.</p><form method=post data-slot=create-form><input type=hidden name=workspaceID><button data-color=ghost type=submit>`), _tmpl$4 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Auto Reload</h2><div data-slot=title-row><!$><!/><button data-color=primary type=button></button></div></div><!$><!/><!$><!/>`), _tmpl$5 = /* @__PURE__ */ template(`<p>Auto reload is <b>disabled</b>. Enable to automatically reload when balance is low.`), _tmpl$6 = /* @__PURE__ */ template(`<div data-slot=form-error>`);
const reload_action = createServerReference(() => {
}, "src_routes_workspace_id_billing_reload-section_tsx--reload_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx?tsr-directive-use-server=");
const reload = action(reload_action, "billing.reload");
const setReload_action = createServerReference(() => {
}, "src_routes_workspace_id_billing_reload-section_tsx--setReload_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx?tsr-directive-use-server=");
const setReload = action(setReload_action, "billing.setReload");
function ReloadSection() {
  const params = useParams();
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  const setReloadSubmission = useSubmission(setReload);
  const reloadSubmission = useSubmission(reload);
  const [store, setStore] = createStore({
    show: false,
    reload: false,
    reloadAmount: "",
    reloadTrigger: ""
  });
  createEffect(() => {
    if (!setReloadSubmission.pending && setReloadSubmission.result && !setReloadSubmission.result.error) {
      setStore("show", false);
    }
  });
  function show() {
    while (true) {
      setReloadSubmission.clear();
      if (!setReloadSubmission.result) break;
    }
    const info = billingInfo();
    setStore("show", true);
    setStore("reload", info.reload ? true : true);
    setStore("reloadAmount", info.reloadAmount.toString());
    setStore("reloadTrigger", info.reloadTrigger.toString());
  }
  function hide() {
    setStore("show", false);
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$4), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$17 = _el$4.firstChild, [_el$18, _co$3] = getNextMarker(_el$17.nextSibling), _el$16 = _el$18.nextSibling, _el$53 = _el$2.nextSibling, [_el$54, _co$7] = getNextMarker(_el$53.nextSibling), _el$55 = _el$54.nextSibling, [_el$56, _co$8] = getNextMarker(_el$55.nextSibling);
    insert(_el$4, createComponent(Show, {
      get when() {
        return billingInfo()?.reload;
      },
      get fallback() {
        return getNextElement(_tmpl$5);
      },
      get children() {
        var _el$5 = getNextElement(_tmpl$$2), _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling, [_el$10, _co$] = getNextMarker(_el$1.nextSibling), _el$11 = _el$9.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$13.nextSibling, [_el$15, _co$2] = getNextMarker(_el$14.nextSibling);
        insert(_el$9, () => billingInfo()?.reloadAmount, _el$10, _co$);
        insert(_el$12, () => billingInfo()?.reloadTrigger, _el$15, _co$2);
        return _el$5;
      }
    }), _el$18, _co$3);
    _el$16.$$click = () => show();
    insert(_el$16, () => billingInfo()?.reload ? "Edit" : "Enable");
    insert(_el$, createComponent(Show, {
      get when() {
        return store.show;
      },
      get children() {
        var _el$19 = getNextElement(_tmpl$2$1), _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild, _el$22 = _el$21.firstChild, _el$23 = _el$22.nextSibling, _el$24 = _el$23.firstChild, _el$25 = _el$24.firstChild, _el$26 = _el$20.nextSibling, _el$27 = _el$26.firstChild, _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling, _el$30 = _el$27.nextSibling, _el$31 = _el$30.firstChild, _el$32 = _el$31.nextSibling, _el$37 = _el$26.nextSibling, [_el$38, _co$4] = getNextMarker(_el$37.nextSibling), _el$33 = _el$38.nextSibling, _el$34 = _el$33.nextSibling, _el$35 = _el$34.firstChild, _el$36 = _el$35.nextSibling;
        setAttribute(_el$19, "action", setReload);
        _el$25.addEventListener("change", (e) => setStore("reload", e.currentTarget.checked));
        _el$29.$$input = (e) => setStore("reloadAmount", e.currentTarget.value);
        _el$32.$$input = (e) => setStore("reloadTrigger", e.currentTarget.value);
        insert(_el$19, createComponent(Show, {
          get when() {
            return memo(() => !!setReloadSubmission.result)() && setReloadSubmission.result.error;
          },
          children: (err) => (() => {
            var _el$58 = getNextElement(_tmpl$6);
            insert(_el$58, err);
            return _el$58;
          })()
        }), _el$38, _co$4);
        _el$35.$$click = () => hide();
        insert(_el$36, () => setReloadSubmission.pending ? "Saving..." : "Save");
        createRenderEffect((_p$) => {
          var _v$ = billingInfo()?.reloadAmountMin.toString(), _v$2 = billingInfo()?.reloadAmount.toString(), _v$3 = !store.reload, _v$4 = billingInfo()?.reloadTriggerMin.toString(), _v$5 = billingInfo()?.reloadTrigger.toString(), _v$6 = !store.reload, _v$7 = setReloadSubmission.pending;
          _v$ !== _p$.e && setAttribute(_el$29, "min", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$29, "placeholder", _p$.t = _v$2);
          _v$3 !== _p$.a && setProperty(_el$29, "disabled", _p$.a = _v$3);
          _v$4 !== _p$.o && setAttribute(_el$32, "min", _p$.o = _v$4);
          _v$5 !== _p$.i && setAttribute(_el$32, "placeholder", _p$.i = _v$5);
          _v$6 !== _p$.n && setProperty(_el$32, "disabled", _p$.n = _v$6);
          _v$7 !== _p$.s && setProperty(_el$36, "disabled", _p$.s = _v$7);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0
        });
        createRenderEffect(() => setProperty(_el$25, "checked", store.reload));
        createRenderEffect(() => setProperty(_el$29, "value", store.reloadAmount));
        createRenderEffect(() => setProperty(_el$32, "value", store.reloadTrigger));
        createRenderEffect(() => setProperty(_el$33, "value", params.id));
        runHydrationEvents();
        return _el$19;
      }
    }), _el$54, _co$7);
    insert(_el$, createComponent(Show, {
      get when() {
        return memo(() => !!billingInfo()?.reload)() && billingInfo()?.reloadError;
      },
      get children() {
        var _el$39 = getNextElement(_tmpl$3), _el$40 = _el$39.firstChild, _el$41 = _el$40.firstChild, _el$42 = _el$41.firstChild, _el$46 = _el$42.nextSibling, [_el$47, _co$5] = getNextMarker(_el$46.nextSibling), _el$44 = _el$47.nextSibling, _el$48 = _el$44.nextSibling, [_el$49, _co$6] = getNextMarker(_el$48.nextSibling); _el$49.nextSibling; var _el$50 = _el$41.nextSibling, _el$51 = _el$50.firstChild, _el$52 = _el$51.nextSibling;
        insert(_el$41, () => billingInfo()?.timeReloadError.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit"
        }), _el$47, _co$5);
        insert(_el$41, () => billingInfo()?.reloadError?.replace(/\.$/, ""), _el$49, _co$6);
        setAttribute(_el$50, "action", reload);
        insert(_el$52, () => reloadSubmission.pending ? "Retrying..." : "Retry");
        createRenderEffect(() => setProperty(_el$52, "disabled", reloadSubmission.pending));
        createRenderEffect(() => setProperty(_el$51, "value", params.id));
        return _el$39;
      }
    }), _el$56, _co$8);
    createRenderEffect(() => className(_el$, styles$1.root));
    runHydrationEvents();
    return _el$;
  })();
}
delegateEvents(["click", "input"]);

const root = "_root_1frja_1";
const styles = {
	root: root
};

var _tmpl$$1 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Payments History</h2><p>Recent payment transactions.</p></div><div data-slot=payments-table><table data-slot=payments-table-element><thead><tr><th>Date</th><th>Payment ID</th><th>Amount</th><th>Receipt</th></tr></thead><tbody>`), _tmpl$2 = /* @__PURE__ */ template(`<tr><td data-slot=payment-date></td><td data-slot=payment-id></td><td data-slot=payment-amount>$<!$><!/></td><td data-slot=payment-receipt><button data-slot=receipt-button>View`);
const getPaymentsInfo_query = createServerReference(() => {
}, "src_routes_workspace_id_billing_payment-section_tsx--getPaymentsInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/payment-section.tsx?tsr-directive-use-server=");
const getPaymentsInfo = query(getPaymentsInfo_query, "payment.list");
const downloadReceipt_action = createServerReference(() => {
}, "src_routes_workspace_id_billing_payment-section_tsx--downloadReceipt_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/payment-section.tsx?tsr-directive-use-server=");
const downloadReceipt = action(downloadReceipt_action, "receipt.download");
function PaymentSection() {
  const params = useParams();
  const payments = createAsync(() => getPaymentsInfo(params.id));
  const downloadReceiptAction = useAction(downloadReceipt);
  return createComponent(Show, {
    get when() {
      return memo(() => !!payments())() && payments().length > 0;
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling;
      insert(_el$6, createComponent(For, {
        get each() {
          return payments();
        },
        children: (payment) => {
          const date = new Date(payment.timeCreated);
          return (() => {
            var _el$7 = getNextElement(_tmpl$2), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, _el$0 = _el$9.nextSibling, _el$1 = _el$0.firstChild, _el$10 = _el$1.nextSibling, [_el$11, _co$] = getNextMarker(_el$10.nextSibling), _el$12 = _el$0.nextSibling, _el$13 = _el$12.firstChild;
            insert(_el$8, () => formatDateForTable(date));
            insert(_el$9, () => payment.id);
            insert(_el$0, () => ((payment.amount ?? 0) / 1e8).toFixed(2), _el$11, _co$);
            _el$13.$$click = async () => {
              const receiptUrl = await downloadReceiptAction(params.id, payment.paymentID);
              if (receiptUrl) {
                window.open(receiptUrl, "_blank");
              }
            };
            createRenderEffect((_p$) => {
              var _v$ = formatDateUTC(date), _v$2 = !!payment.timeRefunded;
              _v$ !== _p$.e && setAttribute(_el$8, "title", _p$.e = _v$);
              _v$2 !== _p$.t && setAttribute(_el$0, "data-refunded", _p$.t = _v$2);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            runHydrationEvents();
            return _el$7;
          })();
        }
      }));
      createRenderEffect(() => className(_el$, styles.root));
      return _el$;
    }
  });
}
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div data-page=workspace-[id]><div data-slot=sections>`);
function index() {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(Show, {
      get when() {
        return userInfo()?.isAdmin;
      },
      get children() {
        return [createComponent(BillingSection, {}), createComponent(Show, {
          get when() {
            return billingInfo()?.customerID;
          },
          get children() {
            return [createComponent(ReloadSection, {}), createComponent(MonthlyLimitSection, {}), createComponent(PaymentSection, {})];
          }
        })];
      }
    }));
    return _el$;
  })();
}

export { index as default };
