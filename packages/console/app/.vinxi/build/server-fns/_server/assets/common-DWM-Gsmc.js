import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { B as Billing } from "./billing-Df5jiiZg.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { eq, and, isNull, desc } from "drizzle-orm";
import { j as json } from "./response-BxH_sred.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "cloudflare:workers";
import "ulid";
import "zod";
import "./auth-8FTU0poZ.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "stripe";
import "./billing.sql-DzjsSlDR.js";
import "drizzle-orm/mysql-core";
import "./fn-DkMgaEh2.js";
import "./user-CGLpw6vc.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
const getLastSeenWorkspaceID_1 = createServerReference(async function getLastSeenWorkspaceID() {
  return withActor(async () => {
    const actor = Actor.assert("account");
    return Database.use(async (tx) => tx.select({
      id: WorkspaceTable.id
    }).from(UserTable).innerJoin(WorkspaceTable, eq(UserTable.workspaceID, WorkspaceTable.id)).where(and(eq(UserTable.accountID, actor.properties.accountID), isNull(UserTable.timeDeleted), isNull(WorkspaceTable.timeDeleted))).orderBy(desc(UserTable.timeSeen)).limit(1).then((x) => x[0]?.id));
  });
}, "src_routes_workspace_common_tsx--getLastSeenWorkspaceID_1", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const querySessionInfo_query = createServerReference(async (workspaceID) => {
  return withActor(() => {
    return {
      isAdmin: Actor.userRole() === "admin",
      isBeta: Resource.App.stage === "production" ? workspaceID === "wrk_01K46JDFR0E75SG2Q8K172KF3Y" : true
    };
  }, workspaceID);
}, "src_routes_workspace_common_tsx--querySessionInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const createCheckoutUrl_action = createServerReference(async (workspaceID, amount, successUrl, cancelUrl) => {
  return json(await withActor(() => Billing.generateCheckoutUrl({
    amount,
    successUrl,
    cancelUrl
  }).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message,
    data: void 0
  })), workspaceID));
}, "src_routes_workspace_common_tsx--createCheckoutUrl_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const queryBillingInfo_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    const billing = await Billing.get();
    return {
      ...billing,
      reloadAmount: billing.reloadAmount ?? Billing.RELOAD_AMOUNT,
      reloadAmountMin: Billing.RELOAD_AMOUNT_MIN,
      reloadTrigger: billing.reloadTrigger ?? Billing.RELOAD_TRIGGER,
      reloadTriggerMin: Billing.RELOAD_TRIGGER_MIN
    };
  }, workspaceID);
}, "src_routes_workspace_common_tsx--queryBillingInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
export {
  createCheckoutUrl_action,
  getLastSeenWorkspaceID_1,
  queryBillingInfo_query,
  querySessionInfo_query
};
