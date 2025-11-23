import { A as AuthClient } from "./assets/auth-8FTU0poZ.js";
import { u as useAuthSession } from "./assets/auth.session-CdqTMWZ2.js";
import { r as redirect } from "./assets/response-BxH_sred.js";
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
async function GET(input) {
  const url = new URL(input.request.url);
  const code = url.searchParams.get("code");
  if (!code) throw new Error("No code found");
  const result = await AuthClient.exchange(code, `${url.origin}${url.pathname}`);
  if (result.err) {
    throw new Error(result.err.message);
  }
  const decoded = AuthClient.decode(result.tokens.access, {});
  if (decoded.err) throw new Error(decoded.err.message);
  const session = await useAuthSession();
  const id = decoded.subject.properties.accountID;
  await session.update((value) => {
    return {
      ...value,
      account: {
        [id]: {
          id,
          email: decoded.subject.properties.email
        }
      },
      current: id
    };
  });
  return redirect("/auth");
}
export {
  GET
};
