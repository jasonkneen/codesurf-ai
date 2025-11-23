import { A as AuthClient } from "./assets/auth-8FTU0poZ.js";
import "./assets/server-fns-runtime-DkWzG_ke.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/auth.session-CdqTMWZ2.js";
import "./assets/response-BxH_sred.js";
async function GET(input) {
  const result = await AuthClient.authorize(new URL("./callback", input.request.url).toString(), "code");
  return Response.redirect(result.url, 302);
}
export {
  GET
};
