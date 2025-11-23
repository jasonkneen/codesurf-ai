import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { c as createServerReference } from "./assets/server-fns-runtime-DkWzG_ke.js";
import { createEffect, Show, For, createSignal } from "solid-js";
import { a as IconCheck, I as IconCopy } from "./assets/icon-CHGNImcU.js";
import { K as Key } from "./assets/key-DC5Qo9OP.js";
import { w as withActor } from "./assets/auth.withActor-DFuDq4tF.js";
import { createStore } from "solid-js/store";
import { a as formatDateUTC, b as formatDateForTable } from "./assets/common-BXueZKJz.js";
import { A as Actor } from "./assets/identifier-6oJPF80e.js";
import { f as useParams, q as query } from "./assets/query-BtW4eurP.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { u as useSubmission, a as action } from "./assets/action-CvAvsrvz.js";
import { j as json } from "./assets/response-BxH_sred.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "zod";
import "./assets/fn-DkMgaEh2.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./assets/key.sql-CUty1lC_.js";
import "./assets/user.sql-BlLepWby.js";
import "./assets/auth-8FTU0poZ.js";
import "@openauthjs/openauth/client";
import "./assets/auth.session-CdqTMWZ2.js";
import "./assets/billing-Df5jiiZg.js";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/user-CGLpw6vc.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "ulid";
const root = "_root_gwojo_1";
const styles = {
  root
};
var _tmpl$$1 = ["<form", ' method="post" data-slot="create-form"><div data-slot="input-container"><input data-component="input" name="name" type="text" placeholder="Enter key name"><!--$-->', '<!--/--></div><input type="hidden" name="workspaceID"', '><div data-slot="form-actions"><button type="reset" data-color="ghost">Cancel</button><button type="submit" data-color="primary"', ">", "</button></div></form>"], _tmpl$2 = ["<table", ' data-slot="api-keys-table-element"><thead><tr><th>Name</th><th>Key</th><th>Created By</th><th>Last Used</th><th></th></tr></thead><tbody>', "</tbody></table>"], _tmpl$3 = ["<section", '><div data-slot="section-title"><h2>API Keys</h2><div data-slot="title-row"><p>Manage your API keys for accessing opencode services.</p><button data-color="primary">Create API Key</button></div></div><!--$-->', '<!--/--><div data-slot="api-keys-table">', "</div></section>"], _tmpl$4 = ["<div", ' data-slot="form-error">', "</div>"], _tmpl$5 = ["<div", ' data-component="empty-state"><p>Create an opencode Gateway API key</p></div>'], _tmpl$6 = ["<button", ' data-color="ghost"', ' title="Copy API key"><span>', "</span><!--$-->", "<!--/--></button>"], _tmpl$7 = ["<tr", '><td data-slot="key-name">', '</td><td data-slot="key-value">', '</td><td data-slot="key-user-email">', '</td><td data-slot="key-last-used"', ">", '</td><td data-slot="key-actions"><form', ' method="post"><input type="hidden" name="id"', '><input type="hidden" name="workspaceID"', '><button data-color="ghost">Delete</button></form></td></tr>'], _tmpl$8 = ["<span", ">", "</span>"];
const removeKey_action = createServerReference(async (form) => {
  const id = form.get("id")?.toString();
  if (!id) return {
    error: "ID is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Key.remove({
    id
  }), workspaceID), {
    revalidate: listKeys.key
  });
}, "src_routes_workspace_id_keys_key-section_tsx--removeKey_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const removeKey = action(removeKey_action, "key.remove");
const createKey_action = createServerReference(async (form) => {
  const name = form.get("name")?.toString().trim();
  if (!name) return {
    error: "Name is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Key.create({
    userID: Actor.assert("user").properties.userID,
    name
  }).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: listKeys.key
  });
}, "src_routes_workspace_id_keys_key-section_tsx--createKey_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const createKey = action(createKey_action, "key.create");
const listKeys_query = createServerReference(async (workspaceID) => {
  return withActor(() => Key.list(), workspaceID);
}, "src_routes_workspace_id_keys_key-section_tsx--listKeys_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const listKeys = query(listKeys_query, "key.list");
function KeySection() {
  const params = useParams();
  const keys = createAsync(() => listKeys(params.id));
  const submission = useSubmission(createKey);
  const [store, setStore] = createStore({
    show: false
  });
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      setStore("show", false);
    }
  });
  return ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("class", escape(styles.root, true), false), escape(createComponent(Show, {
    get when() {
      return store.show;
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey() + ssrAttribute("action", escape(createKey, true), false), escape(createComponent(Show, {
        get when() {
          return submission.result && submission.result.error;
        },
        children: (err) => ssr(_tmpl$4, ssrHydrationKey(), escape(err()))
      })), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Creating..." : "Create");
    }
  })), escape(createComponent(Show, {
    get when() {
      return keys()?.length;
    },
    get fallback() {
      return ssr(_tmpl$5, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return keys();
        },
        children: (key) => {
          const [copied, setCopied] = createSignal(false);
          return ssr(_tmpl$7, ssrHydrationKey(), escape(key.name), escape(createComponent(Show, {
            get when() {
              return key.key;
            },
            get fallback() {
              return ssr(_tmpl$8, ssrHydrationKey(), escape(key.keyDisplay));
            },
            get children() {
              return ssr(_tmpl$6, ssrHydrationKey(), ssrAttribute("disabled", copied(), true), escape(key.keyDisplay), escape(createComponent(Show, {
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
              })));
            }
          })), escape(key.email), ssrAttribute("title", key.timeUsed ? escape(formatDateUTC(key.timeUsed), true) : escape(void 0, true), false), key.timeUsed ? escape(formatDateForTable(key.timeUsed)) : "-", ssrAttribute("action", escape(removeKey, true), false), ssrAttribute("value", escape(key.id, true), false), ssrAttribute("value", escape(params.id, true), false));
        }
      })));
    }
  })));
}
var _tmpl$ = ["<div", ' data-page="workspace-[id]"><div data-slot="sections">', "</div></div>"];
function index() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(KeySection, {})));
}
export {
  index as default
};
