import { A as Actor } from "./identifier-6oJPF80e.js";
import { g as getActor } from "./auth-8FTU0poZ.js";
async function withActor(fn, workspace) {
  const actor = await getActor(workspace);
  return Actor.provide(actor.type, actor.properties, fn);
}
export {
  withActor as w
};
