import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { getRequestEvent } from "solid-js/web";
import { u as useAuthSession } from "./auth.session-CdqTMWZ2.js";
/* empty css                   */
import { r as redirect } from "./response-BxH_sred.js";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
const logout_action = createServerReference(async () => {
  const auth = await useAuthSession();
  const event = getRequestEvent();
  const current = auth.data.current;
  if (current) await auth.update((val) => {
    delete val.account?.[current];
    const first = Object.keys(val.account ?? {})[0];
    val.current = first;
    event.locals.actor = void 0;
    return val;
  });
  throw redirect("/zen");
}, "src_routes_user-menu_tsx--logout_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/user-menu.tsx?tsr-directive-use-server=");
export {
  logout_action
};
