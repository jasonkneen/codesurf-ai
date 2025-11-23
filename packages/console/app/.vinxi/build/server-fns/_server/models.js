import { D as Database, W as WorkspaceTable } from "./assets/workspace.sql-DMfPBlPl.js";
import { K as KeyTable } from "./assets/key.sql-CUty1lC_.js";
import { Z as ZenData, a as ModelTable } from "./assets/model-DAa-Ndfm.js";
import { eq, and, isNull } from "drizzle-orm";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "node:async_hooks";
import "drizzle-orm/mysql-core";
import "zod";
import "./assets/identifier-6oJPF80e.js";
import "ulid";
import "./assets/fn-DkMgaEh2.js";
async function GET(input) {
  const zenData = ZenData.list();
  const disabledModels = await authenticate();
  return new Response(JSON.stringify({
    object: "list",
    data: Object.entries(zenData.models).filter(([id]) => !disabledModels.includes(id)).map(([id, _model]) => ({
      id,
      object: "model",
      created: Math.floor(Date.now() / 1e3),
      owned_by: "opencode"
    }))
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
  async function authenticate() {
    const apiKey = input.request.headers.get("authorization")?.split(" ")[1];
    if (!apiKey) return [];
    const disabledModels2 = await Database.use((tx) => tx.select({
      model: ModelTable.model
    }).from(KeyTable).innerJoin(WorkspaceTable, eq(WorkspaceTable.id, KeyTable.workspaceID)).leftJoin(ModelTable, and(eq(ModelTable.workspaceID, KeyTable.workspaceID), isNull(ModelTable.timeDeleted))).where(and(eq(KeyTable.key, apiKey), isNull(KeyTable.timeDeleted))).then((rows) => rows.map((row) => row.model)));
    return disabledModels2;
  }
}
export {
  GET
};
