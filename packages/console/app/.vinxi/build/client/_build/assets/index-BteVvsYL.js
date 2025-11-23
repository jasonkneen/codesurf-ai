import { e as createSignal, i as getNextElement, v as getNextMarker, l as insert, b as createComponent, x as addEventListener, m as memo, y as createRenderEffect, r as runHydrationEvents, t as template, h as delegateEvents, S as Show, z as setProperty } from './web-B4FMlVCr.js';
import { T as Title, L as Link, a as Meta } from './index-BZyZejwR.js';
import { c as config, H as Header, F as Footer, L as Legal } from './legal-DluzAPvH.js';
import { F as Faq } from './faq-2C9dHwiF.js';
import './logo-ornate-dark-BX3xCqAP.js';
import './store-CSXr9rVx.js';
import './query-C7ETZYOA.js';
import './server-runtime-BVQMvLQK.js';
import './components-D9Uvz6lf.js';

var _tmpl$ = /* @__PURE__ */ template(`<div data-component=testimonial><div data-component=quotation><svg width=20 height=17 viewBox="0 0 20 17"fill=none xmlns=http://www.w3.org/2000/svg><path d="M19.4118 0L16.5882 9.20833H20V17H12.2353V10.0938L16 0H19.4118ZM7.17647 0L4.35294 9.20833H7.76471V17H0V10.0938L3.76471 0H7.17647Z"fill=currentColor></path></svg></div>Thanks to OpenCode, we found a way to create software to track all our assets — even the imaginary ones.<div data-component=testimonial-logo><svg width=80 height=79 viewBox="0 0 80 79"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M0 39.3087L10.0579 29.251L15.6862 34.7868L13.7488 36.7248L10.3345 33.2186L8.48897 35.0639L11.8111 38.4781L9.96557 40.4156L6.55181 37.0018L4.06028 39.4928L7.56674 42.9991L5.62884 44.845L0 39.3087Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M17.7182 36.8164L20.2094 39.4003L16.6108 46.9666L22.2393 41.3374L24.3615 43.46L14.2118 53.5179L11.9047 51.1187L15.4112 43.3677L9.78254 49.0888L7.66016 46.9666L17.7182 36.8164Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M42.8139 61.915L45.3055 64.4064L41.6145 71.9731L47.243 66.3441L49.3652 68.4663L39.3077 78.5244L36.9088 76.1252L40.5072 68.374L34.7866 74.0953L32.6641 71.9731L42.8139 61.915Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M16.4258 55.7324L26.4833 45.582L28.6061 47.7042C31.0049 50.1034 32.3892 51.9497 30.1746 54.1642C28.7902 55.548 27.6831 56.0094 26.1145 54.9016L26.0222 54.994C27.2218 56.1941 26.9448 57.1162 25.4688 58.5931L23.9 60.1615C23.4383 60.6232 22.8847 61.2693 22.7927 62.0067L20.6705 59.8845C20.7625 59.146 21.3161 58.5008 21.778 58.1316L23.5307 56.3788C24.269 55.6403 23.715 54.2555 23.254 53.8872L22.8847 53.4256L18.548 57.7623L16.4258 55.7324ZM24.3611 51.9495C25.4689 53.0563 26.4833 53.3332 27.4984 52.3178C28.5134 51.3957 28.2367 50.3802 27.1295 49.1812L24.3611 51.9495Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M33.4952 66.9899C31.096 69.3891 28.8815 68.4659 27.4047 66.9899C26.021 65.6062 25.0978 63.3907 27.4972 60.9003L31.8336 56.6548C34.2333 54.2556 36.4478 55.0864 37.9241 56.5635C39.308 58.0396 40.2311 60.2541 37.8315 62.6531L33.4952 66.9899ZM29.0659 63.5752C28.6048 64.0369 28.6048 64.7753 29.1583 65.3292C29.6196 65.8821 30.4502 65.7897 30.8194 65.4215L36.2633 59.9769C36.7246 59.6076 36.7246 58.7779 36.171 58.3164C35.7097 57.7626 34.8791 57.7626 34.5101 58.2241L29.0659 63.5752Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M78.5267 39.308L68.2845 29.0654L47.5231 49.735L49.6453 51.8572L68.2845 33.2179L74.3746 39.308L47.2461 66.3435L49.3683 68.4657L78.5267 39.308Z"fill=#0083C6></path><path fill-rule=evenodd clip-rule=evenodd d="M49.6443 51.8577L43.3695 45.4902L64.0386 24.8215L53.7969 14.4873L33.0352 35.2482L35.1574 37.3705L53.7969 18.7315L59.7947 24.8215L39.1251 45.4902L47.5221 53.9799L49.6443 51.8577Z"fill=#2D9C5C></path><path fill-rule=evenodd clip-rule=evenodd d="M35.1564 37.3706L28.7896 31.0038L49.5515 10.3347L39.3088 0L10.0586 29.2507L12.1804 31.2804L39.3088 4.24476L45.3066 10.3347L24.6377 31.0038L33.0342 39.4008L35.1564 37.3706Z"fill=#E92A35></path><path fill-rule=evenodd clip-rule=evenodd d="M77.2332 52.4105C76.0336 52.4105 75.111 51.4884 75.111 50.196C75.111 48.9046 76.0336 47.9814 77.2332 47.9814C78.3405 47.9814 79.263 48.9046 79.263 50.196C79.263 51.4884 78.3405 52.4105 77.2332 52.4105ZM77.2332 52.9643C78.7098 52.9643 80.0015 51.6729 80.0015 50.196C80.0015 48.6276 78.7096 47.4287 77.2332 47.4287C75.6644 47.4287 74.4648 48.6278 74.4648 50.196C74.4647 51.6731 75.6643 52.9643 77.2332 52.9643ZM76.1259 51.7653H76.6797V50.3804H77.0485L77.8788 51.7653H78.4332L77.6023 50.3804C78.1558 50.2881 78.4332 50.0122 78.4332 49.5507C78.4332 48.9046 78.0633 48.6276 77.3253 48.6276H76.1257V51.7653H76.1259ZM76.6797 49.0892H77.2332C77.5102 49.0892 77.8788 49.0892 77.8788 49.4586C77.8788 49.9202 77.6023 49.9202 77.2332 49.9202H76.6797V49.0892Z"fill=#0083C6>`), _tmpl$2 = /* @__PURE__ */ template(`<main data-page=enterprise><!$><!/><!$><!/><!$><!/><div data-component=container><!$><!/><div data-component=content><section data-component=enterprise-content><div data-component=enterprise-columns><div data-component=enterprise-column-1><h1>Your code is yours</h1><p>OpenCode operates securely inside your organization with no data or context stored and no licensing restrictions or ownership claims. Start a trial with your team, then deploy it across your organization by integrating it with your SSO and internal AI gateway.</p><p>Let us know and how we can help.</p><!$><!/></div><div data-component=enterprise-column-2><div data-component=enterprise-form><form><div data-component=form-group><label for=name>Full name</label><input id=name type=text required placeholder="Jeff Bezos"></div><div data-component=form-group><label for=role>Role</label><input id=role type=text required placeholder="Executive Chairman"></div><div data-component=form-group><label for=email>Company email</label><input id=email type=email required placeholder=jeff@amazon.com></div><div data-component=form-group><label for=message>What problem are you trying to solve?</label><textarea id=message required rows=5 placeholder="We need help with..."></textarea></div><button type=submit data-component=submit-button></button></form><!$><!/></div></div></div></section><section data-component=faq><div data-slot=section-title><h3>FAQ</h3></div><ul><li></li><li></li><li></li><li></li></ul></section></div><!$><!/></div><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<div data-component=success-message>Message sent, we'll be in touch soon.`);
function Enterprise() {
  const [formData, setFormData] = createSignal({
    name: "",
    role: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const handleInputChange = (field) => (e) => {
    const target = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: target.value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enterprise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData())
      });
      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: "",
          role: "",
          email: "",
          message: ""
        });
        setTimeout(() => setShowSuccess(false), 5e3);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$40 = _el$.firstChild, [_el$41, _co$5] = getNextMarker(_el$40.nextSibling), _el$42 = _el$41.nextSibling, [_el$43, _co$6] = getNextMarker(_el$42.nextSibling), _el$44 = _el$43.nextSibling, [_el$45, _co$7] = getNextMarker(_el$44.nextSibling), _el$2 = _el$45.nextSibling, _el$36 = _el$2.firstChild, [_el$37, _co$3] = getNextMarker(_el$36.nextSibling), _el$3 = _el$37.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$1 = _el$9.nextSibling, [_el$10, _co$] = getNextMarker(_el$1.nextSibling), _el$11 = _el$6.nextSibling, _el$12 = _el$11.firstChild, _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild, _el$16 = _el$15.nextSibling, _el$17 = _el$14.nextSibling, _el$18 = _el$17.firstChild, _el$19 = _el$18.nextSibling, _el$20 = _el$17.nextSibling, _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling, _el$23 = _el$20.nextSibling, _el$24 = _el$23.firstChild, _el$25 = _el$24.nextSibling, _el$26 = _el$23.nextSibling, _el$27 = _el$13.nextSibling, [_el$28, _co$2] = getNextMarker(_el$27.nextSibling), _el$29 = _el$4.nextSibling, _el$30 = _el$29.firstChild, _el$31 = _el$30.nextSibling, _el$32 = _el$31.firstChild, _el$33 = _el$32.nextSibling, _el$34 = _el$33.nextSibling, _el$35 = _el$34.nextSibling, _el$38 = _el$3.nextSibling, [_el$39, _co$4] = getNextMarker(_el$38.nextSibling), _el$46 = _el$2.nextSibling, [_el$47, _co$8] = getNextMarker(_el$46.nextSibling);
    insert(_el$, createComponent(Title, {
      children: "OpenCode | Enterprise solutions for your organisation"
    }), _el$41, _co$5);
    insert(_el$, createComponent(Link, {
      rel: "canonical",
      get href() {
        return `${config.baseUrl}/enterprise`;
      }
    }), _el$43, _co$6);
    insert(_el$, createComponent(Meta, {
      name: "description",
      content: "Contact OpenCode for enterprise solutions"
    }), _el$45, _co$7);
    insert(_el$2, createComponent(Header, {}), _el$37, _co$3);
    insert(_el$6, createComponent(Show, {
      when: false,
      get children() {
        return getNextElement(_tmpl$);
      }
    }), _el$10, _co$);
    _el$13.addEventListener("submit", handleSubmit);
    addEventListener(_el$16, "input", handleInputChange("name"), true);
    addEventListener(_el$19, "input", handleInputChange("role"), true);
    addEventListener(_el$22, "input", handleInputChange("email"), true);
    addEventListener(_el$25, "input", handleInputChange("message"), true);
    insert(_el$26, () => isSubmitting() ? "Sending..." : "Send");
    insert(_el$12, (() => {
      var _c$ = memo(() => !!showSuccess());
      return () => _c$() && getNextElement(_tmpl$3);
    })(), _el$28, _co$2);
    insert(_el$32, createComponent(Faq, {
      question: "What is OpenCode Enterprise?",
      children: "OpenCode Enterprise is for organizations that want to ensure that their code and data never leaves their infrastructure. It can do this by using a centralized config that integrates with your SSO and internal AI gateway."
    }));
    insert(_el$33, createComponent(Faq, {
      question: "How do I get started with OpenCode Enterprise?",
      children: "Simply start with an internal trial with your team. OpenCode by default does not store your code or context data, making it easy to get started. Then contact us to discuss pricing and implementation options."
    }));
    insert(_el$34, createComponent(Faq, {
      question: "How does enterprise pricing work?",
      children: "We offer per-seat enterprise pricing. If you have your own LLM gateway, we do not charge for tokens used. For further details, contact us for a custom quote based on your organization's needs."
    }));
    insert(_el$35, createComponent(Faq, {
      question: "Is my data secure with OpenCode Enterprise?",
      children: "Yes. OpenCode does not store your code or context data. All processing happens locally or through direct API calls to your AI provider. With central config and SSO integration, your data remains secure within your organization's infrastructure."
    }));
    insert(_el$2, createComponent(Footer, {}), _el$39, _co$4);
    insert(_el$, createComponent(Legal, {}), _el$47, _co$8);
    createRenderEffect(() => setProperty(_el$26, "disabled", isSubmitting()));
    createRenderEffect(() => setProperty(_el$16, "value", formData().name));
    createRenderEffect(() => setProperty(_el$19, "value", formData().role));
    createRenderEffect(() => setProperty(_el$22, "value", formData().email));
    createRenderEffect(() => setProperty(_el$25, "value", formData().message));
    runHydrationEvents();
    return _el$;
  })();
}
delegateEvents(["input"]);

export { Enterprise as default };
