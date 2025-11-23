import { mysqlTable, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { u as utc, a as ulid, t as timestamps, w as workspaceColumns, b as workspaceIndexes } from "./workspace.sql-DMfPBlPl.js";
const KeyTable = mysqlTable("key", {
  ...workspaceColumns,
  ...timestamps,
  name: varchar("name", {
    length: 255
  }).notNull(),
  key: varchar("key", {
    length: 255
  }).notNull(),
  userID: ulid("user_id").notNull(),
  timeUsed: utc("time_used")
}, (table) => [...workspaceIndexes(table), uniqueIndex("global_key").on(table.key)]);
export {
  KeyTable as K
};
