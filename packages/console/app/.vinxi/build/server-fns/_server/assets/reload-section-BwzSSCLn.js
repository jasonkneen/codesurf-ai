import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { B as Billing } from "./billing-Df5jiiZg.js";
import { D as Database } from "./workspace.sql-DMfPBlPl.js";
import { B as BillingTable } from "./billing.sql-DzjsSlDR.js";
import { q as queryBillingInfo } from "./common-BXueZKJz.js";
import { j as json } from "./response-BxH_sred.js";
import { eq } from "drizzle-orm";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./identifier-6oJPF80e.js";
import "ulid";
import "zod";
import "./auth-8FTU0poZ.js";
import "./user.sql-BlLepWby.js";
import "drizzle-orm/mysql-core";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "stripe";
import "./fn-DkMgaEh2.js";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./user-CGLpw6vc.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "./query-BtW4eurP.js";
import "solid-js";
import "./action-CvAvsrvz.js";
const reload_action = createServerReference(async (form) => {
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => Billing.reload(), workspaceID), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_reload-section_tsx--reload_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx?tsr-directive-use-server=");
const setReload_action = createServerReference(async (form) => {
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  const reloadValue = form.get("reload")?.toString() === "true";
  const amountStr = form.get("reloadAmount")?.toString();
  const triggerStr = form.get("reloadTrigger")?.toString();
  const reloadAmount = amountStr && amountStr.trim() !== "" ? parseInt(amountStr) : null;
  const reloadTrigger = triggerStr && triggerStr.trim() !== "" ? parseInt(triggerStr) : null;
  if (reloadValue) {
    if (reloadAmount === null || reloadAmount < Billing.RELOAD_AMOUNT_MIN) return {
      error: `Reload amount must be at least $${Billing.RELOAD_AMOUNT_MIN}`
    };
    if (reloadTrigger === null || reloadTrigger < Billing.RELOAD_TRIGGER_MIN) return {
      error: `Balance trigger must be at least $${Billing.RELOAD_TRIGGER_MIN}`
    };
  }
  return json(await Database.use((tx) => tx.update(BillingTable).set({
    reload: reloadValue,
    ...reloadAmount !== null ? {
      reloadAmount
    } : {},
    ...reloadTrigger !== null ? {
      reloadTrigger
    } : {},
    ...reloadValue ? {
      reloadError: null,
      timeReloadError: null
    } : {}
  }).where(eq(BillingTable.workspaceID, workspaceID))), {
    revalidate: queryBillingInfo.key
  });
}, "src_routes_workspace_id_billing_reload-section_tsx--setReload_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx?tsr-directive-use-server=");
export {
  reload_action,
  setReload_action
};
