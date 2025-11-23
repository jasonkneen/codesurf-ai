import { z } from "zod";
import { f as fn } from "./fn-DkMgaEh2.js";
import { A as Actor, I as Identifier } from "./identifier-6oJPF80e.js";
import { D as Database } from "./workspace.sql-DMfPBlPl.js";
import { P as ProviderTable } from "./provider.sql-BbW43-0P.js";
import { and, eq, isNull } from "drizzle-orm";
var Provider;
((Provider2) => {
  Provider2.list = fn(z.void(), () => Database.use((tx) => tx.select().from(ProviderTable).where(and(eq(ProviderTable.workspaceID, Actor.workspace()), isNull(ProviderTable.timeDeleted)))));
  Provider2.create = fn(z.object({
    provider: z.string().min(1).max(64),
    credentials: z.string()
  }), async ({
    provider,
    credentials
  }) => {
    Actor.assertAdmin();
    return Database.use((tx) => tx.insert(ProviderTable).values({
      id: Identifier.create("provider"),
      workspaceID: Actor.workspace(),
      provider,
      credentials
    }).onDuplicateKeyUpdate({
      set: {
        credentials,
        timeDeleted: null
      }
    }));
  });
  Provider2.remove = fn(z.object({
    provider: z.string()
  }), async ({
    provider
  }) => {
    Actor.assertAdmin();
    return Database.transaction((tx) => tx.delete(ProviderTable).where(and(eq(ProviderTable.provider, provider), eq(ProviderTable.workspaceID, Actor.workspace()))));
  });
})(Provider || (Provider = {}));
export {
  Provider as P
};
