import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { t as timestamps, w as workspaceColumns, b as workspaceIndexes, D as Database } from "./workspace.sql-DMfPBlPl.js";
import { mysqlTable, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { A as Actor, I as Identifier } from "./key.sql-B-kRFiGf.js";
import { f as fn } from "./fn-DkMgaEh2.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
const ModelTable = mysqlTable("model", {
  ...workspaceColumns,
  ...timestamps,
  model: varchar("model", {
    length: 64
  }).notNull()
}, (table) => [...workspaceIndexes(table), uniqueIndex("model_workspace_model").on(table.workspaceID, table.model)]);
var ZenData;
((ZenData2) => {
  const FormatSchema = z.enum(["anthropic", "openai", "oa-compat"]);
  const ModelCostSchema = z.object({
    input: z.number(),
    output: z.number(),
    cacheRead: z.number().optional(),
    cacheWrite5m: z.number().optional(),
    cacheWrite1h: z.number().optional()
  });
  const ModelSchema = z.object({
    name: z.string(),
    cost: ModelCostSchema,
    cost200K: ModelCostSchema.optional(),
    allowAnonymous: z.boolean().optional(),
    rateLimit: z.number().optional(),
    fallbackProvider: z.string().optional(),
    providers: z.array(z.object({
      id: z.string(),
      model: z.string(),
      weight: z.number().optional(),
      disabled: z.boolean().optional()
    }))
  });
  const ProviderSchema = z.object({
    api: z.string(),
    apiKey: z.string(),
    format: FormatSchema,
    headerMappings: z.record(z.string(), z.string()).optional()
  });
  const ModelsSchema = z.object({
    models: z.record(z.string(), ModelSchema),
    providers: z.record(z.string(), ProviderSchema)
  });
  ZenData2.validate = fn(ModelsSchema, (input) => {
    return input;
  });
  ZenData2.list = fn(z.void(), () => {
    const json = JSON.parse(Resource.ZEN_MODELS1.value + Resource.ZEN_MODELS2.value);
    return ModelsSchema.parse(json);
  });
})(ZenData || (ZenData = {}));
var Model;
((Model2) => {
  Model2.enable = fn(z.object({
    model: z.string()
  }), ({
    model
  }) => {
    Actor.assertAdmin();
    return Database.use((db) => db.delete(ModelTable).where(and(eq(ModelTable.workspaceID, Actor.workspace()), eq(ModelTable.model, model))));
  });
  Model2.disable = fn(z.object({
    model: z.string()
  }), ({
    model
  }) => {
    Actor.assertAdmin();
    return Database.use((db) => db.insert(ModelTable).values({
      id: Identifier.create("model"),
      workspaceID: Actor.workspace(),
      model
    }).onDuplicateKeyUpdate({
      set: {
        timeDeleted: null
      }
    }));
  });
  Model2.listDisabled = fn(z.void(), () => {
    return Database.use((db) => db.select({
      model: ModelTable.model
    }).from(ModelTable).where(eq(ModelTable.workspaceID, Actor.workspace())).then((rows) => rows.map((row) => row.model)));
  });
  Model2.isDisabled = fn(z.object({
    model: z.string()
  }), ({
    model
  }) => {
    return Database.use(async (db) => {
      const result = await db.select().from(ModelTable).where(and(eq(ModelTable.workspaceID, Actor.workspace()), eq(ModelTable.model, model))).limit(1);
      return result.length > 0;
    });
  });
})(Model || (Model = {}));
export {
  Model as M,
  ZenData as Z,
  ModelTable as a
};
