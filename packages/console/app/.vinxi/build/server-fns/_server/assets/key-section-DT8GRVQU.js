import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { K as Key } from "./key-DC5Qo9OP.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import { j as json } from "./response-BxH_sred.js";
import { q as query } from "./query-BtW4eurP.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "zod";
import "./fn-DkMgaEh2.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./key.sql-CUty1lC_.js";
import "./user.sql-BlLepWby.js";
import "./auth-8FTU0poZ.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "ulid";
import "solid-js";
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
const listKeys_query = createServerReference(async (workspaceID) => {
  return withActor(() => Key.list(), workspaceID);
}, "src_routes_workspace_id_keys_key-section_tsx--listKeys_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/keys/key-section.tsx?tsr-directive-use-server=");
const listKeys = query(listKeys_query, "key.list");
export {
  createKey_action,
  listKeys_query,
  removeKey_action
};
