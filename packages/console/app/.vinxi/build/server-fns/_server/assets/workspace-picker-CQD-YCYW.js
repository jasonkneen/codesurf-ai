import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { W as Workspace } from "./workspace-BWclAWDk.js";
/* empty css                          */
import { eq, and, isNull } from "drizzle-orm";
import { r as redirect } from "./response-BxH_sred.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./auth-8FTU0poZ.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "ulid";
import "zod";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "./fn-DkMgaEh2.js";
import "./billing.sql-DzjsSlDR.js";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
const getWorkspaces_query = createServerReference(async () => {
  return withActor(async () => {
    return Database.transaction((tx) => tx.select({
      id: WorkspaceTable.id,
      name: WorkspaceTable.name,
      slug: WorkspaceTable.slug
    }).from(UserTable).innerJoin(WorkspaceTable, eq(UserTable.workspaceID, WorkspaceTable.id)).where(and(eq(UserTable.accountID, Actor.account()), isNull(WorkspaceTable.timeDeleted), isNull(UserTable.timeDeleted))));
  });
}, "src_routes_workspace-picker_tsx--getWorkspaces_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace-picker.tsx?tsr-directive-use-server=");
const createWorkspace_action = createServerReference(async (form) => {
  const name = form.get("workspaceName");
  if (name?.trim()) {
    return withActor(async () => {
      const workspaceID = await Workspace.create({
        name: name.trim()
      });
      return redirect(`/workspace/${workspaceID}`);
    });
  }
}, "src_routes_workspace-picker_tsx--createWorkspace_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace-picker.tsx?tsr-directive-use-server=");
export {
  createWorkspace_action,
  getWorkspaces_query
};
