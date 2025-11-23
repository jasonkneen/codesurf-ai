import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { B as Billing } from "./billing-Df5jiiZg.js";
import { q as queryBillingInfo } from "./common-BXueZKJz.js";
import { j as json } from "./response-BxH_sred.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./identifier-6oJPF80e.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
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
const setMonthlyLimit_action = createServerReference(async (form) => {
  const limit = form.get("limit")?.toString();
  if (!limit) return {
    error: "Limit is required."
  };
  const numericLimit = parseInt(limit);
  if (numericLimit < 0) return {
    error: "Set a valid monthly limit."
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required."
  };
  return json(await withActor(() => Billing.setMonthlyLimit(numericLimit).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_monthly-limit-section_tsx--setMonthlyLimit_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/monthly-limit-section.tsx?tsr-directive-use-server=");
export {
  setMonthlyLimit_action
};
