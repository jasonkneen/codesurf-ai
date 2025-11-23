import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "cloudflare:workers";
const emailSignup_action = createServerReference(async (formData) => {
  const emailAddress = formData.get("email");
  const listId = "8b9bb82c-9d5f-11f0-975f-0df6fd1e4945";
  const response = await fetch(`https://api.emailoctopus.com/lists/${listId}/contacts`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${Resource.EMAILOCTOPUS_API_KEY.value}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email_address: emailAddress
    })
  });
  console.log(response);
  return true;
}, "src_component_email-signup_tsx--emailSignup_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/component/email-signup.tsx?tsr-directive-use-server=");
export {
  emailSignup_action
};
