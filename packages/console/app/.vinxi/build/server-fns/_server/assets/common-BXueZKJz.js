import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { B as Billing } from "./billing-Df5jiiZg.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { q as query } from "./query-BtW4eurP.js";
import { j as json } from "./response-BxH_sred.js";
import { a as action } from "./action-CvAvsrvz.js";
import { eq, and, isNull, desc } from "drizzle-orm";
function formatDateForTable(date) {
  const options = {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };
  return date.toLocaleDateString(void 0, options).replace(",", ",");
}
function formatDateUTC(date) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    timeZone: "UTC"
  };
  return date.toLocaleDateString("en-US", options);
}
function formatBalance(amount) {
  const balance = ((amount ?? 0) / 1e8).toFixed(2);
  return balance === "-0.00" ? "0.00" : balance;
}
const getLastSeenWorkspaceID_1 = createServerReference(async function getLastSeenWorkspaceID2() {
  return withActor(async () => {
    const actor = Actor.assert("account");
    return Database.use(async (tx) => tx.select({
      id: WorkspaceTable.id
    }).from(UserTable).innerJoin(WorkspaceTable, eq(UserTable.workspaceID, WorkspaceTable.id)).where(and(eq(UserTable.accountID, actor.properties.accountID), isNull(UserTable.timeDeleted), isNull(WorkspaceTable.timeDeleted))).orderBy(desc(UserTable.timeSeen)).limit(1).then((x) => x[0]?.id));
  });
}, "src_routes_workspace_common_tsx--getLastSeenWorkspaceID_1", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const getLastSeenWorkspaceID = getLastSeenWorkspaceID_1;
const querySessionInfo_query = createServerReference(async (workspaceID) => {
  return withActor(() => {
    return {
      isAdmin: Actor.userRole() === "admin",
      isBeta: Resource.App.stage === "production" ? workspaceID === "wrk_01K46JDFR0E75SG2Q8K172KF3Y" : true
    };
  }, workspaceID);
}, "src_routes_workspace_common_tsx--querySessionInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const querySessionInfo = query(querySessionInfo_query, "session.get");
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
const createCheckoutUrl = action(createCheckoutUrl_action, "checkoutUrl");
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
const queryBillingInfo = query(queryBillingInfo_query, "billing.get");
export {
  formatDateUTC as a,
  formatDateForTable as b,
  createCheckoutUrl as c,
  querySessionInfo as d,
  formatBalance as f,
  getLastSeenWorkspaceID as g,
  queryBillingInfo as q
};
