import { i as getNextElement, v as getNextMarker, l as insert, b as createComponent, t as template, S as Show } from './web-B4FMlVCr.js';
import { d as querySessionInfo } from './common-DDAj15d0.js';
import { u as useParams } from './query-C7ETZYOA.js';
import { c as createAsync } from './server-runtime-BVQMvLQK.js';
import { A } from './components-D9Uvz6lf.js';
import './action-BpQ-vK1N.js';

var _tmpl$ = /* @__PURE__ */ template(`<main data-page=workspace><div data-component=workspace-container><nav data-component=workspace-nav><nav data-component=nav-desktop><div data-component=workspace-nav-items><!$><!/><!$><!/><!$><!/><!$><!/></div></nav><nav data-component=nav-mobile><div data-component=workspace-nav-items><!$><!/><!$><!/><!$><!/><!$><!/></div></nav></nav><div data-component=workspace-content>`);
function WorkspaceLayout(props) {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, [_el$7, _co$] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$2] = getNextMarker(_el$8.nextSibling), _el$0 = _el$9.nextSibling, [_el$1, _co$3] = getNextMarker(_el$0.nextSibling), _el$10 = _el$1.nextSibling, [_el$11, _co$4] = getNextMarker(_el$10.nextSibling), _el$12 = _el$4.nextSibling, _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild, [_el$15, _co$5] = getNextMarker(_el$14.nextSibling), _el$16 = _el$15.nextSibling, [_el$17, _co$6] = getNextMarker(_el$16.nextSibling), _el$18 = _el$17.nextSibling, [_el$19, _co$7] = getNextMarker(_el$18.nextSibling), _el$20 = _el$19.nextSibling, [_el$21, _co$8] = getNextMarker(_el$20.nextSibling), _el$22 = _el$3.nextSibling;
    insert(_el$5, createComponent(A, {
      get href() {
        return `/workspace/${params.id}`;
      },
      end: true,
      activeClass: "active",
      "data-nav-button": true,
      children: "Zen"
    }), _el$7, _co$);
    insert(_el$5, createComponent(A, {
      get href() {
        return `/workspace/${params.id}/keys`;
      },
      activeClass: "active",
      "data-nav-button": true,
      children: "API Keys"
    }), _el$9, _co$2);
    insert(_el$5, createComponent(A, {
      get href() {
        return `/workspace/${params.id}/members`;
      },
      activeClass: "active",
      "data-nav-button": true,
      children: "Members"
    }), _el$1, _co$3);
    insert(_el$5, createComponent(Show, {
      get when() {
        return userInfo()?.isAdmin;
      },
      get children() {
        return [createComponent(A, {
          get href() {
            return `/workspace/${params.id}/billing`;
          },
          activeClass: "active",
          "data-nav-button": true,
          children: "Billing"
        }), createComponent(A, {
          get href() {
            return `/workspace/${params.id}/settings`;
          },
          activeClass: "active",
          "data-nav-button": true,
          children: "Settings"
        })];
      }
    }), _el$11, _co$4);
    insert(_el$13, createComponent(A, {
      get href() {
        return `/workspace/${params.id}`;
      },
      end: true,
      activeClass: "active",
      "data-nav-button": true,
      children: "Zen"
    }), _el$15, _co$5);
    insert(_el$13, createComponent(A, {
      get href() {
        return `/workspace/${params.id}/keys`;
      },
      activeClass: "active",
      "data-nav-button": true,
      children: "API Keys"
    }), _el$17, _co$6);
    insert(_el$13, createComponent(A, {
      get href() {
        return `/workspace/${params.id}/members`;
      },
      activeClass: "active",
      "data-nav-button": true,
      children: "Members"
    }), _el$19, _co$7);
    insert(_el$13, createComponent(Show, {
      get when() {
        return userInfo()?.isAdmin;
      },
      get children() {
        return [createComponent(A, {
          get href() {
            return `/workspace/${params.id}/billing`;
          },
          activeClass: "active",
          "data-nav-button": true,
          children: "Billing"
        }), createComponent(A, {
          get href() {
            return `/workspace/${params.id}/settings`;
          },
          activeClass: "active",
          "data-nav-button": true,
          children: "Settings"
        })];
      }
    }), _el$21, _co$8);
    insert(_el$22, () => props.children);
    return _el$;
  })();
}

export { WorkspaceLayout as default };
