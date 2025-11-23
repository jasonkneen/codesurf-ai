import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { W as Workspace } from "./workspace-BWclAWDk.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { eq } from "drizzle-orm";
import { j as json } from "./response-BxH_sred.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./identifier-6oJPF80e.js";
import "ulid";
import "zod";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "drizzle-orm/mysql-core";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "./fn-DkMgaEh2.js";
import "./billing.sql-DzjsSlDR.js";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
const getWorkspaceInfo_query = createServerReference(async (workspaceID) => {
  return withActor(() => Database.use((tx) => tx.select({
    id: WorkspaceTable.id,
    name: WorkspaceTable.name,
    slug: WorkspaceTable.slug
  }).from(WorkspaceTable).where(eq(WorkspaceTable.id, workspaceID)).then((rows) => rows[0] || null)), workspaceID);
}, "src_routes_workspace_id_settings_settings-section_tsx--getWorkspaceInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx?tsr-directive-use-server=");
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
export {
  getWorkspaceInfo_query,
  updateWorkspace_action
};
