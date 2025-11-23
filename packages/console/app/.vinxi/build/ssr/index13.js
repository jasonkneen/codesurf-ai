import { createComponent, ssr, ssrHydrationKey, ssrAttribute, escape } from "solid-js/web";
import { createSignal, createMemo, Show, For, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { c as createServerReference } from "./assets/server-fns-runtime-CTvv0t23.js";
import { a as IconCheck, I as IconCopy, d as IconStealth, e as IconXai, f as IconAlibaba, g as IconZai, h as IconMoonshotAI, i as IconAnthropic, j as IconOpenAI, k as IconLogo } from "./assets/icon-CHGNImcU.js";
import { K as Key } from "./assets/key-BYGv1-7M.js";
import { B as Billing } from "./assets/billing-arqj744p.js";
import { w as withActor } from "./assets/auth.withActor-DRWYYQUC.js";
import { w as useParams, q as query } from "./assets/query-D38s0pjD.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { a as formatDateUTC, b as formatDateForTable, d as querySessionInfo, f as formatBalance, q as queryBillingInfo, c as createCheckoutUrl } from "./assets/common-B0MbuYas.js";
import { M as Model, Z as ZenData } from "./assets/model-DEAhOJ5e.js";
import { b as action, u as useSubmission, c as useAction } from "./assets/action-COIyZVod.js";
import { j as json } from "./assets/response-BxH_sred.js";
import { z } from "zod";
import { f as fn } from "./assets/fn-DkMgaEh2.js";
import { A as Actor, I as Identifier } from "./assets/key.sql-B-kRFiGf.js";
import { D as Database } from "./assets/workspace.sql-DMfPBlPl.js";
import { P as ProviderTable } from "./assets/provider.sql-BbW43-0P.js";
import { and, eq, isNull } from "drizzle-orm";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/user.sql-BlLepWby.js";
import "drizzle-orm/mysql-core";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/user-CzX0rSuB.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/auth-CDjCjQcN.js";
import "@openauthjs/openauth/client";
import "ulid";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
const root$2 = "_root_875c5_1";
const styles$3 = {
  root: root$2
};
var _tmpl$$4 = ["<div", ' data-slot="key-display"><div data-slot="key-container"><code data-slot="key-value">', '</code><button data-color="primary"', ' title="Copy API key">', "</button></div></div>"], _tmpl$2$4 = ["<div", `><div data-component="feature-grid"><div data-slot="feature"><h3>Tested & Verified Models</h3><p>We've benchmarked and tested models specifically for coding agents to ensure the best performance.</p></div><div data-slot="feature"><h3>Highest Quality</h3><p>Access models configured for optimal performance - no downgrades or routing to cheaper providers.</p></div><div data-slot="feature"><h3>No Lock-in</h3><p>Use Zen with any coding agent, and continue using other providers with opencode whenever you want.</p></div></div><div data-component="api-key-highlight">`, '</div><div data-component="next-steps"><ol><li>Enable billing</li><li>Run <code>opencode auth login</code> and select opencode</li><li>Paste your API key</li><li>Start opencode and run <code>/models</code> to select a model</li></ol></div></div>'];
const getUsageInfo_query$1 = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return await Billing.usages();
  }, workspaceID);
}, "src_routes_workspace_id_new-user-section_tsx--getUsageInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/new-user-section.tsx?tsr-directive-use-server=");
const getUsageInfo$1 = query(getUsageInfo_query$1, "usage.list");
const listKeys_query = createServerReference(async (workspaceID) => {
  return withActor(() => Key.list(), workspaceID);
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
      return ssr(_tmpl$2$4, ssrHydrationKey() + ssrAttribute("class", escape(styles$3.root, true), false), escape(createComponent(Show, {
        get when() {
          return defaultKey();
        },
        get children() {
          return ssr(_tmpl$$4, ssrHydrationKey(), escape(defaultKey()?.masked), ssrAttribute("disabled", copiedKey(), true), escape(createComponent(Show, {
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
          })));
        }
      })));
    }
  });
}
const root$1 = "_root_aw29e_1";
const styles$2 = {
  root: root$1
};
var _tmpl$$3 = ["<table", ' data-slot="usage-table-element"><thead><tr><th>Date</th><th>Model</th><th>Input</th><th>Output</th><th>Cost</th></tr></thead><tbody>', "</tbody></table>"], _tmpl$2$3 = ["<section", '><div data-slot="section-title"><h2>Usage History</h2><p>Recent API usage and costs.</p></div><div data-slot="usage-table">', "</div></section>"], _tmpl$3$3 = ["<div", ' data-component="empty-state"><p>Make your first API call to get started.</p></div>'], _tmpl$4$2 = ["<tr", '><td data-slot="usage-date"', ">", '</td><td data-slot="usage-model">', '</td><td data-slot="usage-tokens">', '</td><td data-slot="usage-tokens">', '</td><td data-slot="usage-cost">$<!--$-->', "<!--/--></td></tr>"];
const getUsageInfo_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return await Billing.usages();
  }, workspaceID);
}, "src_routes_workspace_id_usage-section_tsx--getUsageInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/usage-section.tsx?tsr-directive-use-server=");
const getUsageInfo = query(getUsageInfo_query, "usage.list");
function UsageSection() {
  const params = useParams();
  const usage = createAsync(() => getUsageInfo(params.id));
  return ssr(_tmpl$2$3, ssrHydrationKey() + ssrAttribute("class", escape(styles$2.root, true), false), escape(createComponent(Show, {
    get when() {
      return usage() && usage().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$3$3, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$$3, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return usage();
        },
        children: (usage2) => {
          const date = createMemo(() => new Date(usage2.timeCreated));
          return ssr(_tmpl$4$2, ssrHydrationKey(), ssrAttribute("title", escape(formatDateUTC(date()), true), false), escape(formatDateForTable(date())), escape(usage2.model), escape(usage2.inputTokens), escape(usage2.outputTokens), escape(((usage2.cost ?? 0) / 1e8).toFixed(4)));
        }
      })));
    }
  })));
}
const styles$1 = {};
var _tmpl$$2 = ["<div", ' data-slot="models-table"><table data-slot="models-table-element"><thead><tr><th>Model</th><th></th><th>Enabled</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$2$2 = ["<section", '><div data-slot="section-title"><h2>Models</h2><p>Manage which models workspace members can access. <a href="/docs/zen#pricing ">Learn more</a>.</p></div><div data-slot="models-list">', "</div></section>"], _tmpl$3$2 = ["<tr", ' data-slot="model-row"', '><td data-slot="model-name"><div><!--$-->', "<!--/--><span>", '</span></div></td><td data-slot="model-lab">', '</td><td data-slot="model-toggle"><form', ' method="post"><input type="hidden" name="model"', '><input type="hidden" name="workspaceID"', '><input type="hidden" name="enabled"', '><label data-slot="model-toggle-label"><input type="checkbox"', "", "><span></span></label></form></td></tr>"];
const getModelLab = (modelId) => {
  if (modelId.startsWith("claude")) return "Anthropic";
  if (modelId.startsWith("gpt")) return "OpenAI";
  if (modelId.startsWith("kimi")) return "Moonshot AI";
  if (modelId.startsWith("glm")) return "Z.ai";
  if (modelId.startsWith("qwen")) return "Alibaba";
  if (modelId.startsWith("grok")) return "xAI";
  return "Stealth";
};
const getModelsInfo_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return {
      all: Object.entries(ZenData.list().models).filter(([id, _model]) => !["claude-3-5-haiku"].includes(id)).filter(([id, _model]) => !id.startsWith("alpha-")).sort(([_idA, modelA], [_idB, modelB]) => modelA.name.localeCompare(modelB.name)).map(([id, model]) => ({
        id,
        name: model.name
      })),
      disabled: await Model.listDisabled()
    };
  }, workspaceID);
}, "src_routes_workspace_id_model-section_tsx--getModelsInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/model-section.tsx?tsr-directive-use-server=");
const getModelsInfo = query(getModelsInfo_query, "model.info");
const updateModel_action = createServerReference(async (form) => {
  const model = form.get("model")?.toString();
  if (!model) return {
    error: "Model is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  const enabled = form.get("enabled")?.toString() === "true";
  return json(withActor(async () => {
    if (enabled) {
      await Model.disable({
        model
      });
    } else {
      await Model.enable({
        model
      });
    }
  }, workspaceID), {
    revalidate: getModelsInfo.key
  });
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
  return ssr(_tmpl$2$2, ssrHydrationKey() + ssrAttribute("class", escape(styles$1.root, true), false), escape(createComponent(Show, {
    get when() {
      return modelsInfo();
    },
    get children() {
      return ssr(_tmpl$$2, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return modelsWithLab();
        },
        children: ({
          id,
          name,
          lab
        }) => {
          const isEnabled = createMemo(() => !modelsInfo().disabled.includes(id));
          return ssr(_tmpl$3$2, ssrHydrationKey(), ssrAttribute("data-disabled", !isEnabled(), false), (() => {
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
          })(), escape(name), escape(lab), ssrAttribute("action", escape(updateModel, true), false), ssrAttribute("value", escape(id, true), false), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("value", escape(isEnabled().toString(), true), false), ssrAttribute("checked", isEnabled(), true), ssrAttribute("disabled", !userInfo()?.isAdmin, true));
        }
      })));
    }
  })));
}
var Provider;
((Provider2) => {
  Provider2.list = fn(z.void(), () => Database.use((tx) => tx.select().from(ProviderTable).where(and(eq(ProviderTable.workspaceID, Actor.workspace()), isNull(ProviderTable.timeDeleted)))));
  Provider2.create = fn(z.object({
    provider: z.string().min(1).max(64),
    credentials: z.string()
  }), async ({
    provider,
    credentials
  }) => {
    Actor.assertAdmin();
    return Database.use((tx) => tx.insert(ProviderTable).values({
      id: Identifier.create("provider"),
      workspaceID: Actor.workspace(),
      provider,
      credentials
    }).onDuplicateKeyUpdate({
      set: {
        credentials,
        timeDeleted: null
      }
    }));
  });
  Provider2.remove = fn(z.object({
    provider: z.string()
  }), async ({
    provider
  }) => {
    Actor.assertAdmin();
    return Database.transaction((tx) => tx.delete(ProviderTable).where(and(eq(ProviderTable.provider, provider), eq(ProviderTable.workspaceID, Actor.workspace()))));
  });
})(Provider || (Provider = {}));
const root = "_root_oyy9u_1";
const styles = {
  root
};
var _tmpl$$1 = ["<form", ' id="', '"', ' method="post" data-slot="edit-form"><div data-slot="input-wrapper"><input name="credentials" type="text" placeholder="', '" autocomplete="off" data-form-type="other" data-lpignore="true"><!--$-->', '<!--/--></div><input type="hidden" name="provider"', '><input type="hidden" name="workspaceID"', "></form>"], _tmpl$2$1 = ["<button", ' type="reset" data-color="ghost">Cancel</button>'], _tmpl$3$1 = ["<div", ' data-slot="form-actions"><button type="submit" data-color="ghost"', ' form="', '">', "</button><!--$-->", "<!--/--></div>"], _tmpl$4$1 = ["<tr", ' data-slot="provider-row"><td data-slot="provider-name">', '</td><td data-slot="provider-key">', '</td><td data-slot="provider-action">', "</td></tr>"], _tmpl$5 = ["<span", ">", "</span>"], _tmpl$6 = ["<div", ' data-slot="form-error">', "</div>"], _tmpl$7 = ["<div", ' data-slot="configured-actions"><button data-color="ghost">Edit</button><form', ' method="post" data-slot="delete-form"><input type="hidden" name="provider"', '><input type="hidden" name="workspaceID"', '><button data-color="ghost" type="submit"', ">Delete</button></form></div>"], _tmpl$8 = ["<button", ' data-color="ghost">Configure</button>'], _tmpl$9 = ["<section", '><div data-slot="section-title"><h2>Bring Your Own Key</h2><p>Configure your own API keys from AI providers.</p></div><div data-slot="providers-table"><table data-slot="providers-table-element"><thead><tr><th>Provider</th><th>API Key</th><th></th></tr></thead><tbody>', "</tbody></table></div></section>"];
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
const removeProvider_action = createServerReference(async (form) => {
  const provider = form.get("provider")?.toString();
  if (!provider) return {
    error: "Provider is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Provider.remove({
    provider
  }), workspaceID), {
    revalidate: listProviders.key
  });
}, "src_routes_workspace_id_provider-section_tsx--removeProvider_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const removeProvider = action(removeProvider_action, "provider.remove");
const saveProvider_action = createServerReference(async (form) => {
  const provider = form.get("provider")?.toString();
  const credentials = form.get("credentials")?.toString();
  if (!provider) return {
    error: "Provider is required"
  };
  if (!credentials) return {
    error: "API key is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Provider.create({
    provider,
    credentials
  }).then(() => ({
    error: void 0
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: listProviders.key
  });
}, "src_routes_workspace_id_provider-section_tsx--saveProvider_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const saveProvider = action(saveProvider_action, "provider.save");
const listProviders_query = createServerReference(async (workspaceID) => {
  return withActor(() => Provider.list(), workspaceID);
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
  const providerData = () => providers()?.find((p) => p.provider === props.provider.key);
  createEffect(() => {
    if (!saveSubmission.pending && saveSubmission.result && !saveSubmission.result.error) {
      hide();
    }
  });
  function hide() {
    setStore("editing", false);
  }
  return ssr(_tmpl$4$1, ssrHydrationKey(), escape(props.provider.name), escape(createComponent(Show, {
    get when() {
      return store.editing;
    },
    get fallback() {
      return ssr(_tmpl$5, ssrHydrationKey(), providerData() ? escape(maskCredentials(providerData().credentials)) : "-");
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), `provider-form-${escape(props.provider.key, true)}`, ssrAttribute("action", escape(saveProvider, true), false), `Enter ${escape(props.provider.name, true)} API key (${escape(props.provider.prefix, true)}...)`, escape(createComponent(Show, {
        get when() {
          return saveSubmission.result && saveSubmission.result.error;
        },
        children: (err) => ssr(_tmpl$6, ssrHydrationKey(), escape(err()))
      })), ssrAttribute("value", escape(props.provider.key, true), false), ssrAttribute("value", escape(params.id, true), false));
    }
  })), escape(createComponent(Show, {
    get when() {
      return store.editing;
    },
    get fallback() {
      return createComponent(Show, {
        get when() {
          return !!providerData();
        },
        get fallback() {
          return ssr(_tmpl$8, ssrHydrationKey());
        },
        get children() {
          return ssr(_tmpl$7, ssrHydrationKey(), ssrAttribute("action", escape(removeProvider, true), false), ssrAttribute("value", escape(props.provider.key, true), false), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", removeSubmission.pending, true));
        }
      });
    },
    get children() {
      return ssr(_tmpl$3$1, ssrHydrationKey(), ssrAttribute("disabled", saveSubmission.pending, true), `provider-form-${escape(props.provider.key, true)}`, saveSubmission.pending ? "Saving..." : "Save", escape(createComponent(Show, {
        get when() {
          return !saveSubmission.pending;
        },
        get children() {
          return ssr(_tmpl$2$1, ssrHydrationKey());
        }
      })));
    }
  })));
}
function ProviderSection() {
  return ssr(_tmpl$9, ssrHydrationKey() + ssrAttribute("class", escape(styles.root, true), false), escape(createComponent(For, {
    each: PROVIDERS,
    children: (provider) => createComponent(ProviderRow, {
      provider
    })
  })));
}
var _tmpl$ = ["<span", ' data-slot="balance">Current balance <b>$<!--$-->', "<!--/--></b></span>"], _tmpl$2 = ["<span", ' data-slot="billing-info">', "</span>"], _tmpl$3 = ["<div", ' data-page="workspace-[id]"><section data-component="header-section"><!--$-->', '<!--/--><p><span>Reliable optimized models for coding agents. <a target="_blank" href="/docs/zen">Learn more</a>.</span><!--$-->', '<!--/--></p></section><div data-slot="sections"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$4 = ["<button", ' data-color="primary" data-size="sm"', ">", "</button>"];
function index() {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  const billingInfo = createAsync(() => queryBillingInfo(params.id));
  useAction(createCheckoutUrl);
  const checkoutSubmission = useSubmission(createCheckoutUrl);
  const [store, setStore] = createStore({
    checkoutRedirecting: false
  });
  const balance = createMemo(() => formatBalance(billingInfo()?.balance ?? 0));
  return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(IconLogo, {})), escape(createComponent(Show, {
    get when() {
      return userInfo()?.isAdmin;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return billingInfo()?.reload;
        },
        get fallback() {
          return ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("disabled", checkoutSubmission.pending || store.checkoutRedirecting, true), checkoutSubmission.pending || store.checkoutRedirecting ? "Loading..." : "Enable billing");
        },
        get children() {
          return ssr(_tmpl$, ssrHydrationKey(), escape(balance()));
        }
      })));
    }
  })), escape(createComponent(NewUserSection, {})), escape(createComponent(ModelSection, {})), escape(createComponent(Show, {
    get when() {
      return userInfo()?.isAdmin;
    },
    get children() {
      return createComponent(ProviderSection, {});
    }
  })), escape(createComponent(UsageSection, {})));
}
export {
  index as default
};
