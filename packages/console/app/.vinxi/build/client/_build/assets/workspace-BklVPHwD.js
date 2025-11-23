import { h as delegateEvents, b as createComponent, i as getNextElement, t as template, v as getNextMarker, x as addEventListener, l as insert, S as Show, r as runHydrationEvents, A as createEffect, L as For, w as setAttribute, I as use, y as createRenderEffect, z as setProperty } from './web-B4FMlVCr.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { l as IconWorkspaceLogo } from './icon-phIboNhp.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { a as DropdownItem, D as Dropdown } from './dropdown-CX9xLjCi.js';
import { q as query, u as useParams } from './query-C7ETZYOA.js';
import { b as action, u as useSubmission } from './action-BpQ-vK1N.js';
import { L as Link } from './index-BZyZejwR.js';
import { A } from './components-D9Uvz6lf.js';

var _tmpl$$3 = /* @__PURE__ */ template(`<h2 data-slot=title>`), _tmpl$2$2 = /* @__PURE__ */ template(`<div data-component=modal data-slot=overlay><div data-slot=content><!$><!/><!$><!/>`);
function Modal(props) {
  return createComponent(Show, {
    get when() {
      return props.open;
    },
    get children() {
      var _el$ = getNextElement(_tmpl$2$2), _el$2 = _el$.firstChild, _el$4 = _el$2.firstChild, [_el$5, _co$] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling);
      addEventListener(_el$, "click", props.onClose, true);
      _el$2.$$click = (e) => e.stopPropagation();
      insert(_el$2, createComponent(Show, {
        get when() {
          return props.title;
        },
        get children() {
          var _el$3 = getNextElement(_tmpl$$3);
          insert(_el$3, () => props.title);
          return _el$3;
        }
      }), _el$5, _co$);
      insert(_el$2, () => props.children, _el$7, _co$2);
      runHydrationEvents();
      return _el$;
    }
  });
}
delegateEvents(["click"]);

var _tmpl$$2 = /* @__PURE__ */ template(`<button data-slot=create-item type=button>+ Create New Workspace`), _tmpl$2$1 = /* @__PURE__ */ template(`<form data-slot=create-form method=post><div data-slot=create-input-group><input data-slot=create-input type=text name=workspaceName placeholder="Enter workspace name"required><div data-slot=button-group><button type=button data-color=ghost>Cancel</button><button type=submit data-color=primary>`), _tmpl$3 = /* @__PURE__ */ template(`<div data-component=workspace-picker><!$><!/><!$><!/>`);
const getWorkspaces_query = createServerReference(() => {
}, "src_routes_workspace-picker_tsx--getWorkspaces_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace-picker.tsx?tsr-directive-use-server=");
const getWorkspaces = query(getWorkspaces_query, "workspaces");
const createWorkspace_action = createServerReference(() => {
}, "src_routes_workspace-picker_tsx--createWorkspace_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace-picker.tsx?tsr-directive-use-server=");
const createWorkspace = action(createWorkspace_action, "createWorkspace");
function WorkspacePicker() {
  const params = useParams();
  const workspaces = createAsync(() => getWorkspaces());
  const submission = useSubmission(createWorkspace);
  const [store, setStore] = createStore({
    showForm: false
  });
  let inputRef;
  const currentWorkspace = () => {
    const ws = workspaces()?.find((w) => w.id === params.id);
    return ws ? ws.name : "Select workspace";
  };
  const handleWorkspaceNew = () => {
    setStore("showForm", true);
  };
  createEffect(() => {
    if (store.showForm && inputRef) {
      setTimeout(() => inputRef?.focus(), 0);
    }
  });
  const handleSelectWorkspace = (workspaceID) => {
    if (workspaceID === params.id) return;
    window.location.href = `/workspace/${workspaceID}`;
  };
  createEffect(() => {
    params.id;
    setStore("showForm", false);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$3), _el$9 = _el$.firstChild, [_el$0, _co$] = getNextMarker(_el$9.nextSibling), _el$1 = _el$0.nextSibling, [_el$10, _co$2] = getNextMarker(_el$1.nextSibling);
    insert(_el$, createComponent(Dropdown, {
      get trigger() {
        return currentWorkspace();
      },
      align: "left",
      get children() {
        return [createComponent(For, {
          get each() {
            return workspaces();
          },
          children: (workspace) => createComponent(DropdownItem, {
            get selected() {
              return workspace.id === params.id;
            },
            onClick: () => handleSelectWorkspace(workspace.id),
            get children() {
              return workspace.name || workspace.slug;
            }
          })
        }), (() => {
          var _el$2 = getNextElement(_tmpl$$2);
          _el$2.$$click = () => handleWorkspaceNew();
          runHydrationEvents();
          return _el$2;
        })()];
      }
    }), _el$0, _co$);
    insert(_el$, createComponent(Modal, {
      get open() {
        return store.showForm;
      },
      onClose: () => setStore("showForm", false),
      title: "Create New Workspace",
      get children() {
        var _el$3 = getNextElement(_tmpl$2$1), _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling;
        setAttribute(_el$3, "action", createWorkspace);
        var _ref$ = inputRef;
        typeof _ref$ === "function" ? use(_ref$, _el$5) : inputRef = _el$5;
        _el$7.$$click = () => setStore("showForm", false);
        insert(_el$8, () => submission.pending ? "Creating..." : "Create");
        createRenderEffect(() => setProperty(_el$8, "disabled", submission.pending));
        runHydrationEvents();
        return _el$3;
      }
    }), _el$10, _co$2);
    return _el$;
  })();
}
delegateEvents(["click"]);

var _tmpl$$1 = /* @__PURE__ */ template(`<form method=post><button type=submit data-slot=item>Logout`), _tmpl$2 = /* @__PURE__ */ template(`<div data-component=user-menu>`);
const logout_action = createServerReference(() => {
}, "src_routes_user-menu_tsx--logout_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/user-menu.tsx?tsr-directive-use-server=");
const logout = action(logout_action);
function UserMenu(props) {
  return (() => {
    var _el$ = getNextElement(_tmpl$2);
    insert(_el$, createComponent(Dropdown, {
      get trigger() {
        return props.email ?? "";
      },
      align: "right",
      get children() {
        var _el$2 = getNextElement(_tmpl$$1), _el$3 = _el$2.firstChild;
        setAttribute(_el$2, "action", logout);
        setAttribute(_el$3, "formaction", logout);
        return _el$2;
      }
    }));
    return _el$;
  })();
}

var _tmpl$ = /* @__PURE__ */ template(`<main data-page=workspace><!$><!/><header data-component=workspace-header><div data-slot=header-brand><!$><!/><!$><!/></div><div data-slot=header-actions></div></header><div>`);
const getUserEmail_query = createServerReference(() => {
}, "src_routes_workspace_tsx--getUserEmail_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx?pick=default&pick=%24css&tsr-directive-use-server=");
const getUserEmail = query(getUserEmail_query, "userEmail");
function WorkspaceLayout(props) {
  const params = useParams();
  const userEmail = createAsync(() => getUserEmail(params.id));
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$0 = _el$.firstChild, [_el$1, _co$3] = getNextMarker(_el$0.nextSibling), _el$2 = _el$1.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, [_el$5, _co$] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling), _el$8 = _el$3.nextSibling, _el$9 = _el$2.nextSibling;
    insert(_el$, createComponent(Link, {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon-zen.svg"
    }), _el$1, _co$3);
    insert(_el$3, createComponent(A, {
      href: "/",
      "data-component": "site-title",
      get children() {
        return createComponent(IconWorkspaceLogo, {});
      }
    }), _el$5, _co$);
    insert(_el$3, createComponent(WorkspacePicker, {}), _el$7, _co$2);
    insert(_el$8, createComponent(UserMenu, {
      get email() {
        return userEmail();
      }
    }));
    insert(_el$9, () => props.children);
    return _el$;
  })();
}

export { WorkspaceLayout as default };
