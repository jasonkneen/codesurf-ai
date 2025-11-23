import { env } from "cloudflare:workers";
const Resource = new Proxy({}, {
  get(_target, prop) {
    if (prop in env) {
      const value = env[prop];
      return typeof value === "string" ? JSON.parse(value) : value;
    } else if (prop === "App") {
      return JSON.parse(env.SST_RESOURCE_App);
    }
    throw new Error(`"${prop}" is not linked in your sst.config.ts (cloudflare)`);
  }
});
export {
  Resource as R
};
