import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { M as Model, Z as ZenData } from "./model-DAa-Ndfm.js";
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
import "drizzle-orm";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "./identifier-6oJPF80e.js";
import "ulid";
import "./fn-DkMgaEh2.js";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "solid-js";
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
export {
  getModelsInfo_query,
  updateModel_action
};
