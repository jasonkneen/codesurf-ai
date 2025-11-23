import { mysqlTable, text, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { t as timestamps, w as workspaceColumns, b as workspaceIndexes } from "./workspace.sql-DMfPBlPl.js";
const ProviderTable = mysqlTable("provider", {
  ...workspaceColumns,
  ...timestamps,
  provider: varchar("provider", {
    length: 64
  }).notNull(),
  credentials: text("credentials").notNull()
}, (table) => [...workspaceIndexes(table), uniqueIndex("workspace_provider").on(table.workspaceID, table.provider)]);
export {
  ProviderTable as P
};
