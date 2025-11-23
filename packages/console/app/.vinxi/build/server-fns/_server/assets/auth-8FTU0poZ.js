import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { getRequestEvent } from "solid-js/web";
import { D as Database } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { createClient } from "@openauthjs/openauth/client";
import { u as useAuthSession } from "./auth.session-CdqTMWZ2.js";
import { r as redirect } from "./response-BxH_sred.js";
import { and, eq, isNull, inArray, sql } from "drizzle-orm";
const AuthClient = createClient({
  clientID: "app",
  issuer: void 0
});
const getActor_1 = createServerReference(async (workspace) => {
  const evt = getRequestEvent();
  if (!evt) throw new Error("No request event");
  if (evt.locals.actor) return evt.locals.actor;
  evt.locals.actor = (async () => {
    const auth = await useAuthSession();
    if (!workspace) {
      const account = auth.data.account ?? {};
      const current = account[auth.data.current ?? ""];
      if (current) {
        return {
          type: "account",
          properties: {
            email: current.email,
            accountID: current.id
          }
        };
      }
      if (Object.keys(account).length > 0) {
        const current2 = Object.values(account)[0];
        await auth.update((val) => ({
          ...val,
          current: current2.id
        }));
        return {
          type: "account",
          properties: {
            email: current2.email,
            accountID: current2.id
          }
        };
      }
      return {
        type: "public",
        properties: {}
      };
    }
    const accounts = Object.keys(auth.data.account ?? {});
    if (accounts.length) {
      const user = await Database.use((tx) => tx.select().from(UserTable).where(and(eq(UserTable.workspaceID, workspace), isNull(UserTable.timeDeleted), inArray(UserTable.accountID, accounts))).limit(1).execute().then((x) => x[0]));
      if (user) {
        await Database.use((tx) => tx.update(UserTable).set({
          timeSeen: sql`now()`
        }).where(and(eq(UserTable.workspaceID, workspace), eq(UserTable.id, user.id))));
        return {
          type: "user",
          properties: {
            userID: user.id,
            workspaceID: user.workspaceID,
            accountID: user.accountID,
            role: user.role
          }
        };
      }
    }
    throw redirect("/auth/authorize");
  })();
  return evt.locals.actor;
}, "src_context_auth_ts--getActor_1", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/context/auth.ts?tsr-directive-use-server=");
const getActor = getActor_1;
export {
  AuthClient as A,
  getActor as g
};
