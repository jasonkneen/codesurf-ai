import { h as handler } from "./assets/handler-DHtUrjN7.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "node:async_hooks";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./assets/key.sql-CUty1lC_.js";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/billing-Df5jiiZg.js";
import "stripe";
import "./assets/identifier-6oJPF80e.js";
import "ulid";
import "zod";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CGLpw6vc.js";
import "./assets/user.sql-BlLepWby.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-DC5Qo9OP.js";
import "./assets/model-DAa-Ndfm.js";
import "./assets/provider.sql-BbW43-0P.js";
function POST(input) {
  return handler(input, {
    format: "anthropic",
    parseApiKey: (headers) => headers.get("x-api-key") ?? void 0
  });
}
export {
  POST
};
