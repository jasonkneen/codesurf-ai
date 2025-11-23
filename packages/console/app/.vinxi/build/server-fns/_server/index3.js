import { D as Database } from "./assets/workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./assets/user.sql-BlLepWby.js";
import { j as json } from "./assets/response-BxH_sred.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "node:async_hooks";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
async function GET(evt) {
  return json({
    data: await Database.use(async (tx) => {
      const result = await tx.$count(UserTable);
      return result;
    })
  });
}
export {
  GET
};
