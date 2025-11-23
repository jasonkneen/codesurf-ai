import { a as createServerReference } from './server-runtime-BVQMvLQK.js';
import { q as query } from './query-C7ETZYOA.js';
import { b as action } from './action-BpQ-vK1N.js';

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
createServerReference(() => {
}, "src_routes_workspace_common_tsx--getLastSeenWorkspaceID_1", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const querySessionInfo_query = createServerReference(() => {
}, "src_routes_workspace_common_tsx--querySessionInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const querySessionInfo = query(querySessionInfo_query, "session.get");
const createCheckoutUrl_action = createServerReference(() => {
}, "src_routes_workspace_common_tsx--createCheckoutUrl_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const createCheckoutUrl = action(createCheckoutUrl_action, "checkoutUrl");
const queryBillingInfo_query = createServerReference(() => {
}, "src_routes_workspace_common_tsx--queryBillingInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/common.tsx?tsr-directive-use-server=");
const queryBillingInfo = query(queryBillingInfo_query, "billing.get");

export { formatDateForTable as a, formatDateUTC as b, createCheckoutUrl as c, querySessionInfo as d, formatBalance as f, queryBillingInfo as q };
