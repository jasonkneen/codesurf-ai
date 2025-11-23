import { h as handler } from "./assets/handler-DNTa5nk1.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "node:async_hooks";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./assets/key.sql-B-kRFiGf.js";
import "ulid";
import "zod";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/billing-arqj744p.js";
import "stripe";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CzX0rSuB.js";
import "./assets/user.sql-BlLepWby.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-BYGv1-7M.js";
import "./assets/model-DEAhOJ5e.js";
import "./assets/provider.sql-BbW43-0P.js";
function POST(input) {
  return handler(input, {
    format: "openai",
    parseApiKey: (headers) => headers.get("authorization")?.split(" ")[1]
  });
}
export {
  POST
};
