import { drizzle } from "drizzle-orm/planetscale-serverless";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { Client } from "@planetscale/database";
import { AsyncLocalStorage } from "node:async_hooks";
import { timestamp, varchar, mysqlTable, uniqueIndex, primaryKey } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
var Context;
((Context2) => {
  class NotFound extends Error {
  }
  Context2.NotFound = NotFound;
  function create() {
    const storage = new AsyncLocalStorage();
    return {
      use() {
        const result = storage.getStore();
        if (!result) {
          throw new NotFound();
        }
        return result;
      },
      provide(value, fn) {
        return storage.run(value, fn);
      }
    };
  }
  Context2.create = create;
})(Context || (Context = {}));
function memo(fn, cleanup) {
  let value;
  let loaded = false;
  const result = () => {
    if (loaded) return value;
    loaded = true;
    value = fn();
    return value;
  };
  result.reset = async () => {
    loaded = false;
    value = void 0;
  };
  return result;
}
var Database;
((Database2) => {
  const client = memo(() => {
    const result = new Client({
      host: Resource.Database.host,
      username: Resource.Database.username,
      password: Resource.Database.password
    });
    const db = drizzle(result, {});
    return db;
  });
  const TransactionContext = Context.create();
  async function use(callback) {
    try {
      const {
        tx
      } = TransactionContext.use();
      return tx.transaction(callback);
    } catch (err) {
      if (err instanceof Context.NotFound) {
        const effects = [];
        const result = await TransactionContext.provide({
          effects,
          tx: client()
        }, () => callback(client()));
        await Promise.all(effects.map((x) => x()));
        return result;
      }
      throw err;
    }
  }
  Database2.use = use;
  async function fn(callback) {
    return (input) => use(async (tx) => callback(input, tx));
  }
  Database2.fn = fn;
  async function effect(effect2) {
    try {
      const {
        effects
      } = TransactionContext.use();
      effects.push(effect2);
    } catch {
      await effect2();
    }
  }
  Database2.effect = effect;
  async function transaction(callback, config) {
    try {
      const {
        tx
      } = TransactionContext.use();
      return callback(tx);
    } catch (err) {
      if (err instanceof Context.NotFound) {
        const effects = [];
        const result = await client().transaction(async (tx) => {
          return TransactionContext.provide({
            tx,
            effects
          }, () => callback(tx));
        }, config);
        await Promise.all(effects.map((x) => x()));
        return result;
      }
      throw err;
    }
  }
  Database2.transaction = transaction;
})(Database || (Database = {}));
const ulid = (name) => varchar(name, {
  length: 30
});
const workspaceColumns = {
  get id() {
    return ulid("id").notNull();
  },
  get workspaceID() {
    return ulid("workspace_id").notNull();
  }
};
const id = () => ulid("id").notNull();
const utc = (name) => timestamp(name, {
  fsp: 3
});
const timestamps = {
  timeCreated: utc("time_created").notNull().defaultNow(),
  timeUpdated: utc("time_updated").notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  timeDeleted: utc("time_deleted")
};
const WorkspaceTable = mysqlTable("workspace", {
  id: ulid("id").notNull().primaryKey(),
  slug: varchar("slug", {
    length: 255
  }),
  name: varchar("name", {
    length: 255
  }).notNull(),
  ...timestamps
}, (table) => [uniqueIndex("slug").on(table.slug)]);
function workspaceIndexes(table) {
  return [primaryKey({
    columns: [table.workspaceID, table.id]
  })];
}
export {
  Context as C,
  Database as D,
  WorkspaceTable as W,
  ulid as a,
  workspaceIndexes as b,
  id as i,
  timestamps as t,
  utc as u,
  workspaceColumns as w
};
