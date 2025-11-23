import { mysqlTable, bigint, int, mysqlEnum, varchar, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { u as utc, a as ulid, t as timestamps, w as workspaceColumns, b as workspaceIndexes } from "./workspace.sql-DMfPBlPl.js";
const UserRole = ["admin", "member"];
const UserTable = mysqlTable("user", {
  ...workspaceColumns,
  ...timestamps,
  accountID: ulid("account_id"),
  email: varchar("email", {
    length: 255
  }),
  name: varchar("name", {
    length: 255
  }).notNull(),
  timeSeen: utc("time_seen"),
  color: int("color"),
  role: mysqlEnum("role", UserRole).notNull(),
  monthlyLimit: int("monthly_limit"),
  monthlyUsage: bigint("monthly_usage", {
    mode: "number"
  }),
  timeMonthlyUsageUpdated: utc("time_monthly_usage_updated")
}, (table) => [...workspaceIndexes(table), uniqueIndex("user_account_id").on(table.workspaceID, table.accountID), uniqueIndex("user_email").on(table.workspaceID, table.email), index("global_account_id").on(table.accountID), index("global_email").on(table.email)]);
export {
  UserTable as U,
  UserRole as a
};
