import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { c as createServerReference } from "./assets/server-fns-runtime-CTvv0t23.js";
import { createEffect, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { w as withActor } from "./assets/auth.withActor-DRWYYQUC.js";
import { W as Workspace } from "./assets/workspace-dvo9tpIk.js";
import { D as Database, W as WorkspaceTable } from "./assets/workspace.sql-DMfPBlPl.js";
import { w as useParams, q as query } from "./assets/query-D38s0pjD.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { u as useSubmission, b as action } from "./assets/action-COIyZVod.js";
import { j as json } from "./assets/response-BxH_sred.js";
import { eq } from "drizzle-orm";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/key.sql-B-kRFiGf.js";
import "ulid";
import "zod";
import "drizzle-orm/mysql-core";
import "./assets/auth-CDjCjQcN.js";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/fn-DkMgaEh2.js";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/key-BYGv1-7M.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
const root = "_root_1mnc1_1";
const styles = {
  root
};
var _tmpl$$1 = ["<div", ' data-slot="value-with-action"><p data-slot="current-value">', '</p><button data-color="primary">Edit</button></div>'], _tmpl$2 = ["<section", '><div data-slot="section-title"><h2>Settings</h2><p>Update your workspace name and preferences.</p></div><div data-slot="section-content"><div data-slot="setting"><p>Workspace name</p><!--$-->', "<!--/--></div></div></section>"], _tmpl$3 = ["<form", ' method="post" data-slot="create-form"><div data-slot="input-container"><input required data-component="input" name="name" type="text" placeholder="Workspace name"', '><input type="hidden" name="workspaceID"', '><button type="submit" data-color="primary"', ">", '</button><button type="reset" data-color="ghost">Cancel</button></div><!--$-->', "<!--/--></form>"], _tmpl$4 = ["<div", ' data-slot="form-error">', "</div>"];
const getWorkspaceInfo_query = createServerReference(async (workspaceID) => {
  return withActor(() => Database.use((tx) => tx.select({
    id: WorkspaceTable.id,
    name: WorkspaceTable.name,
    slug: WorkspaceTable.slug
  }).from(WorkspaceTable).where(eq(WorkspaceTable.id, workspaceID)).then((rows) => rows[0] || null)), workspaceID);
}, "src_routes_workspace_id_settings_settings-section_tsx--getWorkspaceInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx?tsr-directive-use-server=");
const getWorkspaceInfo = query(getWorkspaceInfo_query, "workspace.get");
const updateWorkspace_action = createServerReference(async (form) => {
  const name = form.get("name")?.toString().trim();
  if (!name) return {
    error: "Workspace name is required."
  };
  if (name.length > 255) return {
    error: "Name must be 255 characters or less."
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required."
  };
  return json(await withActor(() => Workspace.update({
    name
  }).then(() => ({
    error: void 0
  })).catch((e) => ({
    error: e.message
  })), workspaceID));
}, "src_routes_workspace_id_settings_settings-section_tsx--updateWorkspace_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx?tsr-directive-use-server=");
const updateWorkspace = action(updateWorkspace_action, "workspace.update");
function SettingsSection() {
  const params = useParams();
  const workspaceInfo = createAsync(() => getWorkspaceInfo(params.id));
  const submission = useSubmission(updateWorkspace);
  const [store, setStore] = createStore({
    show: false
  });
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      hide();
    }
  });
  function hide() {
    setStore("show", false);
  }
  return ssr(_tmpl$2, ssrHydrationKey() + ssrAttribute("class", escape(styles.root, true), false), escape(createComponent(Show, {
    get when() {
      return !store.show;
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("action", escape(updateWorkspace, true), false), ssrAttribute("value", escape(workspaceInfo()?.name, true) ?? "Default", false), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Updating..." : "Save", escape(createComponent(Show, {
        get when() {
          return submission.result && submission.result.error;
        },
        children: (err) => ssr(_tmpl$4, ssrHydrationKey(), escape(err()))
      })));
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), escape(workspaceInfo()?.name));
    }
  })));
}
var _tmpl$ = ["<div", ' data-page="workspace-[id]"><div data-slot="sections">', "</div></div>"];
function index() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(SettingsSection, {})));
}
export {
  index as default
};
