import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
/* empty css               */
import { g as getLastSeenWorkspaceID } from "./common-BXueZKJz.js";
import { r as redirect } from "./response-BxH_sred.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./identifier-6oJPF80e.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./auth.withActor-DFuDq4tF.js";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "./billing-Df5jiiZg.js";
import "stripe";
import "./billing.sql-DzjsSlDR.js";
import "./fn-DkMgaEh2.js";
import "./user-CGLpw6vc.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "./query-BtW4eurP.js";
import "solid-js";
import "./action-CvAvsrvz.js";
const checkLoggedIn_query = createServerReference(async () => {
  const workspaceID = await getLastSeenWorkspaceID();
  if (workspaceID) throw redirect(`/workspace/${workspaceID}`);
}, "src_routes_zen_index_tsx--checkLoggedIn_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/zen/index.tsx?pick=default&pick=%24css&tsr-directive-use-server=");
export {
  checkLoggedIn_query
};
