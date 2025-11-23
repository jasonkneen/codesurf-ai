import { z } from "zod";
import { f as fn } from "./fn-DkMgaEh2.js";
import { A as Actor, I as Identifier } from "./identifier-6oJPF80e.js";
import { a as ulid, t as timestamps, i as id, D as Database } from "./workspace.sql-DMfPBlPl.js";
import { K as KeyTable } from "./key.sql-CUty1lC_.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { mysqlTable, varchar, mysqlEnum, primaryKey, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { and, eq, isNull, sql } from "drizzle-orm";
const AuthProvider = ["email", "github", "google"];
const AuthTable = mysqlTable("auth", {
  id: id(),
  ...timestamps,
  provider: mysqlEnum("provider", AuthProvider).notNull(),
  subject: varchar("subject", {
    length: 255
  }).notNull(),
  accountID: ulid("account_id").notNull()
}, (table) => [primaryKey({
  columns: [table.id]
}), uniqueIndex("provider").on(table.provider, table.subject), index("account_id").on(table.accountID)]);
var Key;
((Key2) => {
  Key2.list = fn(z.void(), async () => {
    const keys = await Database.use((tx) => tx.select({
      id: KeyTable.id,
      name: KeyTable.name,
      key: KeyTable.key,
      timeUsed: KeyTable.timeUsed,
      userID: KeyTable.userID,
      email: AuthTable.subject
    }).from(KeyTable).innerJoin(UserTable, and(eq(KeyTable.userID, UserTable.id), eq(KeyTable.workspaceID, UserTable.workspaceID))).innerJoin(AuthTable, and(eq(UserTable.accountID, AuthTable.accountID), eq(AuthTable.provider, "email"))).where(and(...[eq(KeyTable.workspaceID, Actor.workspace()), isNull(KeyTable.timeDeleted), ...Actor.userRole() === "admin" ? [] : [eq(KeyTable.userID, Actor.userID())]])).orderBy(sql`${KeyTable.name} DESC`));
    return keys.map((key) => ({
      ...key,
      key: key.userID === Actor.userID() ? key.key : void 0,
      keyDisplay: `${key.key.slice(0, 7)}...${key.key.slice(-4)}`
    }));
  });
  Key2.create = fn(z.object({
    userID: z.string(),
    name: z.string().min(1).max(255)
  }), async (input) => {
    const {
      name
    } = input;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let secretKey = "sk-";
    const array = new Uint32Array(64);
    crypto.getRandomValues(array);
    for (let i = 0, l = array.length; i < l; i++) {
      secretKey += chars[array[i] % chars.length];
    }
    const keyID = Identifier.create("key");
    await Database.use((tx) => tx.insert(KeyTable).values({
      id: keyID,
      workspaceID: Actor.workspace(),
      userID: input.userID,
      name,
      key: secretKey,
      timeUsed: null
    }));
    return keyID;
  });
  Key2.remove = fn(z.object({
    id: z.string()
  }), async (input) => {
    await Database.use((tx) => tx.update(KeyTable).set({
      timeDeleted: sql`now()`
    }).where(and(...[eq(KeyTable.id, input.id), eq(KeyTable.workspaceID, Actor.workspace()), ...Actor.userRole() === "admin" ? [] : [eq(KeyTable.userID, Actor.userID())]])));
  });
})(Key || (Key = {}));
export {
  AuthTable as A,
  Key as K
};
