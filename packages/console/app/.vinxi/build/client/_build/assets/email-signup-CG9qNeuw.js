import { i as getNextElement, t as template, v as getNextMarker, w as setAttribute, l as insert, b as createComponent, S as Show, y as createRenderEffect, z as setProperty } from './web-B4FMlVCr.js';
import { a as createServerReference } from './server-runtime-BVQMvLQK.js';
import { b as action, u as useSubmission } from './action-BpQ-vK1N.js';

const HttpHeader = (_props) => null;

const dock = "/_build/assets/dock-DjAVB4vb.png";

var _tmpl$ = /* @__PURE__ */ template(`<div style=color:#03B000;margin-top:24px>Almost done, check your inbox and confirm your email address`), _tmpl$2 = /* @__PURE__ */ template(`<div style=color:#FF408F;margin-top:24px>`), _tmpl$3 = /* @__PURE__ */ template(`<section data-component=email><div data-slot=dock><img alt></div><div data-slot=section-title><h3>OpenCode will be available on desktop soon</h3><p>Join the waitlist for early access.</p></div><form data-slot=form method=post><input type=email name=email placeholder="Email address"required><button type=submit>Subscribe</button></form><!$><!/><!$><!/>`);
const emailSignup_action = createServerReference(() => {
}, "src_component_email-signup_tsx--emailSignup_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/component/email-signup.tsx?tsr-directive-use-server=");
const emailSignup = action(emailSignup_action);
function EmailSignup() {
  const submission = useSubmission(emailSignup);
  return (() => {
    var _el$ = getNextElement(_tmpl$3), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$0 = _el$5.nextSibling, [_el$1, _co$] = getNextMarker(_el$0.nextSibling), _el$10 = _el$1.nextSibling, [_el$11, _co$2] = getNextMarker(_el$10.nextSibling);
    setAttribute(_el$3, "src", dock);
    setAttribute(_el$5, "action", emailSignup);
    insert(_el$, createComponent(Show, {
      get when() {
        return submission.result;
      },
      get children() {
        return getNextElement(_tmpl$);
      }
    }), _el$1, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return submission.error;
      },
      get children() {
        var _el$9 = getNextElement(_tmpl$2);
        insert(_el$9, () => submission.error);
        return _el$9;
      }
    }), _el$11, _co$2);
    createRenderEffect(() => setProperty(_el$7, "disabled", submission.pending));
    return _el$;
  })();
}

export { EmailSignup as E, HttpHeader as H };
