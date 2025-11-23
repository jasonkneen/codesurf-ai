import { z } from "zod";
import { f as fn } from "./fn-DkMgaEh2.js";
import { A as Actor, I as Identifier } from "./key.sql-B-kRFiGf.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { B as BillingTable } from "./billing.sql-DzjsSlDR.js";
import { K as Key } from "./key-BYGv1-7M.js";
import { eq, sql } from "drizzle-orm";
var Workspace;
((Workspace2) => {
  Workspace2.create = fn(z.object({
    name: z.string().min(1)
  }), async ({
    name
  }) => {
    const account = Actor.assert("account");
    const workspaceID = Identifier.create("workspace");
    const userID = Identifier.create("user");
    await Database.transaction(async (tx) => {
      await tx.insert(WorkspaceTable).values({
        id: workspaceID,
        name
      });
      await tx.insert(UserTable).values({
        workspaceID,
        id: userID,
        accountID: account.properties.accountID,
        name: "",
        role: "admin"
      });
      await tx.insert(BillingTable).values({
        workspaceID,
        id: Identifier.create("billing"),
        balance: 0
      });
    });
    await Actor.provide("system", {
      workspaceID
    }, () => Key.create({
      userID,
      name: "Default API Key"
    }));
    return workspaceID;
  });
  Workspace2.update = fn(z.object({
    name: z.string().min(1).max(255)
  }), async ({
    name
  }) => {
    Actor.assertAdmin();
    const workspaceID = Actor.workspace();
    return await Database.use((tx) => tx.update(WorkspaceTable).set({
      name
    }).where(eq(WorkspaceTable.id, workspaceID)));
  });
  Workspace2.remove = fn(z.void(), async () => {
    await Database.use((tx) => tx.update(WorkspaceTable).set({
      timeDeleted: sql`now()`
    }).where(eq(WorkspaceTable.id, Actor.workspace())));
  });
})(Workspace || (Workspace = {}));
export {
  Workspace as W
};
