import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
/* empty css                   */
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { U as User } from "./user-CGLpw6vc.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./auth-8FTU0poZ.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "./response-BxH_sred.js";
import "zod";
import "./fn-DkMgaEh2.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "ulid";
const getUserEmail_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    const actor = Actor.assert("user");
    const email = await User.getAuthEmail(actor.properties.userID);
    return email;
  }, workspaceID);
}, "src_routes_workspace_tsx--getUserEmail_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx?pick=default&pick=%24css&tsr-directive-use-server=");
export {
  getUserEmail_query
};
