import { g as getLastSeenWorkspaceID } from "./assets/common-B0MbuYas.js";
import { r as redirect } from "./assets/response-BxH_sred.js";
import "./assets/server-fns-runtime-CTvv0t23.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/key.sql-B-kRFiGf.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./assets/auth.withActor-DRWYYQUC.js";
import "./assets/auth-CDjCjQcN.js";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/billing-arqj744p.js";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CzX0rSuB.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-BYGv1-7M.js";
import "./assets/query-D38s0pjD.js";
import "solid-js";
import "./assets/action-COIyZVod.js";
async function GET(input) {
  try {
    const workspaceID = await getLastSeenWorkspaceID();
    return redirect(`/workspace/${workspaceID}`);
  } catch {
    return redirect("/auth/authorize");
  }
}
export {
  GET
};
