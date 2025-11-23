import { A as Actor } from "./key.sql-B-kRFiGf.js";
import { g as getActor } from "./auth-CDjCjQcN.js";
async function withActor(fn, workspace) {
  const actor = await getActor(workspace);
  return Actor.provide(actor.type, actor.properties, fn);
}
export {
  withActor as w
};
