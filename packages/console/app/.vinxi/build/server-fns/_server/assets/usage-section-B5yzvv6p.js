import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { B as Billing } from "./billing-Df5jiiZg.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "stripe";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./billing.sql-DzjsSlDR.js";
import "./identifier-6oJPF80e.js";
import "ulid";
import "zod";
import "./fn-DkMgaEh2.js";
import "./user-CGLpw6vc.js";
import "./user.sql-BlLepWby.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "./auth-8FTU0poZ.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "./response-BxH_sred.js";
const getUsageInfo_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return await Billing.usages();
  }, workspaceID);
}, "src_routes_workspace_id_usage-section_tsx--getUsageInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/usage-section.tsx?tsr-directive-use-server=");
export {
  getUsageInfo_query
};
