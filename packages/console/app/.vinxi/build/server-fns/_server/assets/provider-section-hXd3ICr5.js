import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { P as Provider } from "./provider-DCyJyO97.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
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
import "./identifier-6oJPF80e.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "./provider.sql-BbW43-0P.js";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "solid-js";
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
const listProviders_query = createServerReference(async (workspaceID) => {
  return withActor(() => Provider.list(), workspaceID);
}, "src_routes_workspace_id_provider-section_tsx--listProviders_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/provider-section.tsx?tsr-directive-use-server=");
const listProviders = query(listProviders_query, "provider.list");
export {
  listProviders_query,
  removeProvider_action,
  saveProvider_action
};
