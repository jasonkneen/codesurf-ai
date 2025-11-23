import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { c as createServerReference } from "./assets/server-fns-runtime-DkWzG_ke.js";
import { createEffect, Show, createMemo, Switch, Match, For } from "solid-js";
import { createStore } from "solid-js/store";
import { w as withActor } from "./assets/auth.withActor-DFuDq4tF.js";
import { B as Billing } from "./assets/billing-Df5jiiZg.js";
import { q as queryBillingInfo, f as formatBalance, c as createCheckoutUrl, a as formatDateUTC, b as formatDateForTable, d as querySessionInfo } from "./assets/common-BXueZKJz.js";
import { f as useParams, q as query } from "./assets/query-BtW4eurP.js";
import { u as useSubmission, a as action, b as useAction } from "./assets/action-CvAvsrvz.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { j as json } from "./assets/response-BxH_sred.js";
import { b as IconStripe, c as IconCreditCard } from "./assets/icon-CHGNImcU.js";
import { D as Database } from "./assets/workspace.sql-DMfPBlPl.js";
import { B as BillingTable } from "./assets/billing.sql-DzjsSlDR.js";
import { eq } from "drizzle-orm";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/identifier-6oJPF80e.js";
import "ulid";
import "zod";
import "./assets/auth-8FTU0poZ.js";
import "./assets/user.sql-BlLepWby.js";
import "drizzle-orm/mysql-core";
import "@openauthjs/openauth/client";
import "./assets/auth.session-CdqTMWZ2.js";
import "stripe";
import "./assets/fn-DkMgaEh2.js";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/user-CGLpw6vc.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-DC5Qo9OP.js";
import "./assets/key.sql-CUty1lC_.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
const root$3 = "_root_al9io_1";
const styles$3 = {
  root: root$3
};
var _tmpl$$4 = ["<button", ' data-color="primary">', "</button>"], _tmpl$2$3 = ["<p", ' data-slot="usage-status">Current usage for <!--$-->', "<!--/--> is $<!--$-->", "<!--/-->.</p>"], _tmpl$3$2 = ["<section", '><div data-slot="section-title"><h2>Monthly Limit</h2><p>Set a monthly usage limit for your account.</p></div><div data-slot="section-content"><div data-slot="balance"><div data-slot="amount"><!--$-->', '<!--/--><span data-slot="value">', "</span></div><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div></section>"], _tmpl$4$2 = ["<span", ' data-slot="currency">$</span>'], _tmpl$5$2 = ["<form", ' method="post" data-slot="create-form"><div data-slot="input-container"><input required data-component="input" name="limit" type="number" placeholder="50"><!--$-->', '<!--/--></div><input type="hidden" name="workspaceID"', '><div data-slot="form-actions"><button type="reset" data-color="ghost">Cancel</button><button type="submit" data-color="primary"', ">", "</button></div></form>"], _tmpl$6$2 = ["<div", ' data-slot="form-error">', "</div>"], _tmpl$7$1 = ["<p", ' data-slot="usage-status">No usage limit set.</p>'];
const setMonthlyLimit_action = createServerReference(async (form) => {
  const limit = form.get("limit")?.toString();
  if (!limit) return {
    error: "Limit is required."
  };
  const numericLimit = parseInt(limit);
  if (numericLimit < 0) return {
    error: "Set a valid monthly limit."
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required."
  };
  return json(await withActor(() => Billing.setMonthlyLimit(numericLimit).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_monthly-limit-section_tsx--setMonthlyLimit_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/monthly-limit-section.tsx?tsr-directive-use-server=");
const setMonthlyLimit = action(setMonthlyLimit_action, "billing.setMonthlyLimit");
function MonthlyLimitSection() {
  const params = useParams();
  const submission = useSubmission(setMonthlyLimit);
  const [store, setStore] = createStore({
    show: false
  });
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      hide();
    }
  });
  function hide() {
    setStore("show", false);
  }
  return ssr(_tmpl$3$2, ssrHydrationKey() + ssrAttribute("class", escape(styles$3.root, true), false), billingInfo()?.monthlyLimit ? _tmpl$4$2[0] + ssrHydrationKey() + _tmpl$4$2[1] : escape(null), escape(billingInfo()?.monthlyLimit) ?? "-", escape(createComponent(Show, {
    get when() {
      return !store.show;
    },
    get fallback() {
      return ssr(_tmpl$5$2, ssrHydrationKey() + ssrAttribute("action", escape(setMonthlyLimit, true), false), escape(createComponent(Show, {
        get when() {
          return submission.result && submission.result.error;
        },
        children: (err) => ssr(_tmpl$6$2, ssrHydrationKey(), escape(err()))
      })), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Setting..." : "Set");
    },
    get children() {
      return ssr(_tmpl$$4, ssrHydrationKey(), billingInfo()?.monthlyLimit ? "Edit Limit" : "Set Limit");
    }
  })), escape(createComponent(Show, {
    get when() {
      return billingInfo()?.monthlyLimit;
    },
    get fallback() {
      return ssr(_tmpl$7$1, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$2$3, ssrHydrationKey(), escape((/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        month: "long",
        timeZone: "UTC"
      })), (() => {
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
        return escape(((billingInfo()?.monthlyUsage ?? 0) / 1e8).toFixed(2));
      })());
    }
  })));
}
const root$2 = "_root_al2hq_1";
const styles$2 = {
  root: root$2
};
var _tmpl$$3 = ["<button", ' data-color="primary">Add Balance</button>'], _tmpl$2$2 = ["<span", ' data-slot="secret">••••</span>'], _tmpl$3$1 = ["<span", ' data-slot="number">', "</span>"], _tmpl$4$1 = ["<span", ' data-slot="type">Linked to Stripe</span>'], _tmpl$5$1 = ["<div", ' data-slot="balance-right-section"><!--$-->', '<!--/--><div data-slot="credit-card"><div data-slot="card-icon">', '</div><div data-slot="card-details">', '</div><button data-color="ghost"', ">", "</button></div></div>"], _tmpl$6$1 = ["<button", ' data-slot="enable-billing-button" data-color="primary"', ">", "</button>"], _tmpl$7 = ["<section", '><div data-slot="section-title"><h2>Billing</h2><p>Manage payments methods. <a href="mailto:contact@anoma.ly">Contact us</a> if you have any questions.</p></div><div data-slot="section-content"><div data-slot="balance-display"><div data-slot="balance-amount"><span data-slot="balance-value">$<!--$-->', '<!--/--></span><span data-slot="balance-label">Current Balance</span></div><!--$-->', "<!--/--></div><!--$-->", "<!--/--></div></section>"], _tmpl$8 = ["<div", ' data-slot="add-balance-form-container"><div data-slot="add-balance-form"><label>Add $</label><input data-component="input" type="number"', ' step="1"', ' placeholder="Enter amount"><div data-slot="form-actions"><button data-color="ghost" type="button">Cancel</button><button data-color="primary" type="button"', ">", "</button></div></div><!--$-->", "<!--/--></div>"], _tmpl$9 = ["<div", ' data-slot="form-error">', "</div>"], _tmpl$0 = ["<span", ' data-slot="number">----</span>'];
const createSessionUrl_action = createServerReference(async (workspaceID, returnUrl) => {
  return json(await withActor(() => Billing.generateSessionUrl({
    returnUrl
  }).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message,
    data: void 0
  })), workspaceID), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_billing-section_tsx--createSessionUrl_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/billing-section.tsx?tsr-directive-use-server=");
const createSessionUrl = action(createSessionUrl_action, "sessionUrl");
function BillingSection() {
  const params = useParams();
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  useAction(createCheckoutUrl);
  const checkoutSubmission = useSubmission(createCheckoutUrl);
  useAction(createSessionUrl);
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
  return ssr(_tmpl$7, ssrHydrationKey() + ssrAttribute("class", escape(styles$2.root, true), false), escape(balance()), escape(createComponent(Show, {
    get when() {
      return billingInfo()?.customerID;
    },
    get children() {
      return ssr(_tmpl$5$1, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return !store.showAddBalanceForm;
        },
        get fallback() {
          return ssr(_tmpl$8, ssrHydrationKey(), ssrAttribute("min", escape(billingInfo()?.reloadAmountMin.toString(), true), false), ssrAttribute("value", escape(store.addBalanceAmount, true), false), ssrAttribute("disabled", !store.addBalanceAmount || checkoutSubmission.pending || store.checkoutRedirecting, true), checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Add", escape(createComponent(Show, {
            get when() {
              return checkoutSubmission.result && checkoutSubmission.result.error;
            },
            children: (err) => ssr(_tmpl$9, ssrHydrationKey(), escape(err()))
          })));
        },
        get children() {
          return ssr(_tmpl$$3, ssrHydrationKey());
        }
      })), escape(createComponent(Switch, {
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
      })), escape(createComponent(Switch, {
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
                  return ssr(_tmpl$0, ssrHydrationKey());
                },
                get children() {
                  return [ssr(_tmpl$2$2, ssrHydrationKey()), ssr(_tmpl$3$1, ssrHydrationKey(), escape(billingInfo()?.paymentMethodLast4))];
                }
              });
            }
          }), createComponent(Match, {
            get when() {
              return billingInfo()?.paymentMethodType === "link";
            },
            get children() {
              return ssr(_tmpl$4$1, ssrHydrationKey());
            }
          })];
        }
      })), ssrAttribute("disabled", sessionSubmission.pending || store.sessionRedirecting, true), sessionSubmission.pending || store.sessionRedirecting ? "Loading..." : "Manage");
    }
  })), escape(createComponent(Show, {
    get when() {
      return !billingInfo()?.customerID;
    },
    get children() {
      return ssr(_tmpl$6$1, ssrHydrationKey(), ssrAttribute("disabled", checkoutSubmission.pending || store.checkoutRedirecting, true), checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Enable Billing");
    }
  })));
}
const root$1 = "_root_1pw8w_1";
const styles$1 = {
  root: root$1
};
var _tmpl$$2 = ["<p", ">Auto reload is <b>enabled</b>. We'll reload <b>$<!--$-->", "<!--/--></b> (+$1.23 processing fee) when balance reaches <b>$<!--$-->", "<!--/--></b>.</p>"], _tmpl$2$1 = ["<form", ' method="post" data-slot="create-form"><div data-slot="form-field"><label><span data-slot="field-label">Enable Auto Reload</span><div data-slot="toggle-container"><label data-slot="model-toggle-label"><input type="checkbox" name="reload" value="true"', '><span></span></label></div></label></div><div data-slot="input-row"><div data-slot="input-field"><p>Reload $</p><input data-component="input" name="reloadAmount" type="number"', ' step="1"', "", '></div><div data-slot="input-field"><p>When balance reaches $</p><input data-component="input" name="reloadTrigger" type="number"', ' step="1"', "", "></div></div><!--$-->", '<!--/--><input type="hidden" name="workspaceID"', '><div data-slot="form-actions"><button type="button" data-color="ghost">Cancel</button><button type="submit" data-color="primary"', ">", "</button></div></form>"], _tmpl$3 = ["<div", ' data-slot="section-content"><div data-slot="reload-error"><p>Reload failed at <!--$-->', "<!--/-->. Reason: <!--$-->", "<!--/-->. Please update your payment method and try again.</p><form", ' method="post" data-slot="create-form"><input type="hidden" name="workspaceID"', '><button data-color="ghost" type="submit"', ">", "</button></form></div></div>"], _tmpl$4 = ["<section", '><div data-slot="section-title"><h2>Auto Reload</h2><div data-slot="title-row"><!--$-->', '<!--/--><button data-color="primary" type="button">', "</button></div></div><!--$-->", "<!--/--><!--$-->", "<!--/--></section>"], _tmpl$5 = ["<p", ">Auto reload is <b>disabled</b>. Enable to automatically reload when balance is low.</p>"], _tmpl$6 = ["<div", ' data-slot="form-error">', "</div>"];
const reload_action = createServerReference(async (form) => {
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Billing.reload(), workspaceID), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_reload-section_tsx--reload_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx?tsr-directive-use-server=");
const reload = action(reload_action, "billing.reload");
const setReload_action = createServerReference(async (form) => {
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  const reloadValue = form.get("reload")?.toString() === "true";
  const amountStr = form.get("reloadAmount")?.toString();
  const triggerStr = form.get("reloadTrigger")?.toString();
  const reloadAmount = amountStr && amountStr.trim() !== "" ? parseInt(amountStr) : null;
  const reloadTrigger = triggerStr && triggerStr.trim() !== "" ? parseInt(triggerStr) : null;
  if (reloadValue) {
    if (reloadAmount === null || reloadAmount < Billing.RELOAD_AMOUNT_MIN) return {
      error: `Reload amount must be at least $${Billing.RELOAD_AMOUNT_MIN}`
    };
    if (reloadTrigger === null || reloadTrigger < Billing.RELOAD_TRIGGER_MIN) return {
      error: `Balance trigger must be at least $${Billing.RELOAD_TRIGGER_MIN}`
    };
  }
  return json(await Database.use((tx) => tx.update(BillingTable).set({
    reload: reloadValue,
    ...reloadAmount !== null ? {
      reloadAmount
    } : {},
    ...reloadTrigger !== null ? {
      reloadTrigger
    } : {},
    ...reloadValue ? {
      reloadError: null,
      timeReloadError: null
    } : {}
  }).where(eq(BillingTable.workspaceID, workspaceID))), {
    revalidate: queryBillingInfo.key
  });
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
  return ssr(_tmpl$4, ssrHydrationKey() + ssrAttribute("class", escape(styles$1.root, true), false), escape(createComponent(Show, {
    get when() {
      return billingInfo()?.reload;
    },
    get fallback() {
      return ssr(_tmpl$5, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$$2, ssrHydrationKey(), escape(billingInfo()?.reloadAmount), escape(billingInfo()?.reloadTrigger));
    }
  })), billingInfo()?.reload ? "Edit" : "Enable", escape(createComponent(Show, {
    get when() {
      return store.show;
    },
    get children() {
      return ssr(_tmpl$2$1, ssrHydrationKey() + ssrAttribute("action", escape(setReload, true), false), ssrAttribute("checked", store.reload, true), ssrAttribute("min", escape(billingInfo()?.reloadAmountMin.toString(), true), false), ssrAttribute("value", escape(store.reloadAmount, true), false) + ssrAttribute("placeholder", escape(billingInfo()?.reloadAmount.toString(), true), false), ssrAttribute("disabled", !store.reload, true), ssrAttribute("min", escape(billingInfo()?.reloadTriggerMin.toString(), true), false), ssrAttribute("value", escape(store.reloadTrigger, true), false) + ssrAttribute("placeholder", escape(billingInfo()?.reloadTrigger.toString(), true), false), ssrAttribute("disabled", !store.reload, true), escape(createComponent(Show, {
        get when() {
          return setReloadSubmission.result && setReloadSubmission.result.error;
        },
        children: (err) => ssr(_tmpl$6, ssrHydrationKey(), escape(err()))
      })), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", setReloadSubmission.pending, true), setReloadSubmission.pending ? "Saving..." : "Save");
    }
  })), escape(createComponent(Show, {
    get when() {
      return billingInfo()?.reload && billingInfo()?.reloadError;
    },
    get children() {
      return ssr(_tmpl$3, ssrHydrationKey(), escape(billingInfo()?.timeReloadError.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      })), escape(billingInfo()?.reloadError?.replace(/\.$/, "")), ssrAttribute("action", escape(reload, true), false), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", reloadSubmission.pending, true), reloadSubmission.pending ? "Retrying..." : "Retry");
    }
  })));
}
const root = "_root_1frja_1";
const styles = {
  root
};
var _tmpl$$1 = ["<section", '><div data-slot="section-title"><h2>Payments History</h2><p>Recent payment transactions.</p></div><div data-slot="payments-table"><table data-slot="payments-table-element"><thead><tr><th>Date</th><th>Payment ID</th><th>Amount</th><th>Receipt</th></tr></thead><tbody>', "</tbody></table></div></section>"], _tmpl$2 = ["<tr", '><td data-slot="payment-date"', ">", '</td><td data-slot="payment-id">', '</td><td data-slot="payment-amount"', ">$<!--$-->", '<!--/--></td><td data-slot="payment-receipt"><button data-slot="receipt-button">View</button></td></tr>'];
const getPaymentsInfo_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return await Billing.payments();
  }, workspaceID);
}, "src_routes_workspace_id_billing_payment-section_tsx--getPaymentsInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/payment-section.tsx?tsr-directive-use-server=");
const getPaymentsInfo = query(getPaymentsInfo_query, "payment.list");
const downloadReceipt_action = createServerReference(async (workspaceID, paymentID) => {
  return withActor(() => Billing.generateReceiptUrl({
    paymentID
  }), workspaceID);
}, "src_routes_workspace_id_billing_payment-section_tsx--downloadReceipt_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/payment-section.tsx?tsr-directive-use-server=");
const downloadReceipt = action(downloadReceipt_action, "receipt.download");
function PaymentSection() {
  const params = useParams();
  const payments = createAsync(() => getPaymentsInfo(params.id));
  useAction(downloadReceipt);
  return createComponent(Show, {
    get when() {
      return payments() && payments().length > 0;
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey() + ssrAttribute("class", escape(styles.root, true), false), escape(createComponent(For, {
        get each() {
          return payments();
        },
        children: (payment) => {
          const date = new Date(payment.timeCreated);
          return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("title", escape(formatDateUTC(date), true), false), escape(formatDateForTable(date)), escape(payment.id), ssrAttribute("data-refunded", !!payment.timeRefunded, false), escape(((payment.amount ?? 0) / 1e8).toFixed(2)));
        }
      })));
    }
  });
}
var _tmpl$ = ["<div", ' data-page="workspace-[id]"><div data-slot="sections">', "</div></div>"];
function index() {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
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
  })));
}
export {
  index as default
};
