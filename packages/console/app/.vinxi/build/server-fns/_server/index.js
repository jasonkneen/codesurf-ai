import { g as getLastSeenWorkspaceID } from "./assets/common-BXueZKJz.js";
import { r as redirect } from "./assets/response-BxH_sred.js";
import "./assets/server-fns-runtime-DkWzG_ke.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/identifier-6oJPF80e.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./assets/auth.withActor-DFuDq4tF.js";
import "./assets/auth-8FTU0poZ.js";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/auth.session-CdqTMWZ2.js";
import "./assets/billing-Df5jiiZg.js";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CGLpw6vc.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-DC5Qo9OP.js";
import "./assets/key.sql-CUty1lC_.js";
import "./assets/query-BtW4eurP.js";
import "solid-js";
import "./assets/action-CvAvsrvz.js";
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
