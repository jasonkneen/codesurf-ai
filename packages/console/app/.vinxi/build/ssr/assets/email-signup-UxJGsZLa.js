import { onCleanup, Show } from "solid-js";
import { isServer, getRequestEvent, ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { c as createServerReference } from "./server-fns-runtime-CTvv0t23.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { u as useSubmission, b as action } from "./action-COIyZVod.js";
const HttpHeader = isServer ? (props) => {
  const event = getRequestEvent();
  if (props.append) event.response.headers.append(props.name, props.value);
  else event.response.headers.set(props.name, props.value);
  onCleanup(() => {
    if (event.nativeEvent.handled || event.complete) return;
    const value = event.response.headers.get(props.name);
    if (!value) return;
    if (!value.includes(", ")) {
      if (value === props.value) event.response.headers.delete(props.name);
      return;
    }
    const values = value.split(", ");
    const index = values.indexOf(props.value);
    index !== -1 && values.splice(index, 1);
    if (values.length) event.response.headers.set(props.name, values.join(","));
    else event.response.headers.delete(props.name);
  });
  return null;
} : (_props) => null;
const dock = "/_build/assets/dock-DjAVB4vb.png";
var _tmpl$ = ["<div", ' style="color:#03B000;margin-top:24px;">Almost done, check your inbox and confirm your email address</div>'], _tmpl$2 = ["<div", ' style="color:#FF408F;margin-top:24px;">', "</div>"], _tmpl$3 = ["<section", ' data-component="email"><div data-slot="dock"><img', ' alt></div><div data-slot="section-title"><h3>OpenCode will be available on desktop soon</h3><p>Join the waitlist for early access.</p></div><form data-slot="form"', ' method="post"><input type="email" name="email" placeholder="Email address" required><button type="submit"', ">Subscribe</button></form><!--$-->", "<!--/--><!--$-->", "<!--/--></section>"];
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
const emailSignup = action(emailSignup_action);
function EmailSignup() {
  const submission = useSubmission(emailSignup);
  return ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("src", escape(dock, true), false), ssrAttribute("action", escape(emailSignup, true), false), ssrAttribute("disabled", submission.pending, true), escape(createComponent(Show, {
    get when() {
      return submission.result;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey());
    }
  })), escape(createComponent(Show, {
    get when() {
      return submission.error;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(submission.error));
    }
  })));
}
export {
  EmailSignup as E,
  HttpHeader as H
};
