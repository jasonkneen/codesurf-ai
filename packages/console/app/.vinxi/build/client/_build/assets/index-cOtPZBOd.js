import { h as delegateEvents, A as createEffect, i as getNextElement, t as template, v as getNextMarker, l as insert, b as createComponent, r as runHydrationEvents, w as setAttribute, I as use, S as Show, m as memo, y as createRenderEffect, z as setProperty, J as className } from './web-B4FMlVCr.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { q as query, u as useParams } from './query-C7ETZYOA.js';
import { b as action, u as useSubmission } from './action-BpQ-vK1N.js';

const root = "_root_1mnc1_1";
const styles = {
	root: root
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div data-slot=value-with-action><p data-slot=current-value></p><button data-color=primary>Edit`), _tmpl$2 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Settings</h2><p>Update your workspace name and preferences.</p></div><div data-slot=section-content><div data-slot=setting><p>Workspace name</p><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<form method=post data-slot=create-form><div data-slot=input-container><input required data-component=input name=name type=text placeholder="Workspace name"><input type=hidden name=workspaceID><button type=submit data-color=primary></button><button type=reset data-color=ghost>Cancel</button></div><!$><!/>`), _tmpl$4 = /* @__PURE__ */ template(`<div data-slot=form-error>`);
const getWorkspaceInfo_query = createServerReference(() => {
}, "src_routes_workspace_id_settings_settings-section_tsx--getWorkspaceInfo_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx?tsr-directive-use-server=");
const getWorkspaceInfo = query(getWorkspaceInfo_query, "workspace.get");
const updateWorkspace_action = createServerReference(() => {
}, "src_routes_workspace_id_settings_settings-section_tsx--updateWorkspace_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx?tsr-directive-use-server=");
const updateWorkspace = action(updateWorkspace_action, "workspace.update");
function SettingsSection() {
  const params = useParams();
  const workspaceInfo = createAsync(() => getWorkspaceInfo(params.id));
  const submission = useSubmission(updateWorkspace);
  const [store, setStore] = createStore({
    show: false
  });
  let input;
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      hide();
    }
  });
  function show() {
    while (true) {
      submission.clear();
      if (!submission.result) break;
    }
    setStore("show", true);
    input.focus();
  }
  function hide() {
    setStore("show", false);
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$9 = _el$5.nextSibling, [_el$0, _co$] = getNextMarker(_el$9.nextSibling);
    insert(_el$4, createComponent(Show, {
      get when() {
        return !store.show;
      },
      get fallback() {
        return (() => {
          var _el$1 = getNextElement(_tmpl$3), _el$10 = _el$1.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling, _el$15 = _el$10.nextSibling, [_el$16, _co$2] = getNextMarker(_el$15.nextSibling);
          setAttribute(_el$1, "action", updateWorkspace);
          use((r) => input = r, _el$11);
          insert(_el$13, () => submission.pending ? "Updating..." : "Save");
          _el$14.$$click = () => hide();
          insert(_el$1, createComponent(Show, {
            get when() {
              return memo(() => !!submission.result)() && submission.result.error;
            },
            children: (err) => (() => {
              var _el$17 = getNextElement(_tmpl$4);
              insert(_el$17, err);
              return _el$17;
            })()
          }), _el$16, _co$2);
          createRenderEffect(() => setProperty(_el$13, "disabled", submission.pending));
          createRenderEffect(() => setProperty(_el$11, "value", workspaceInfo()?.name ?? "Default"));
          createRenderEffect(() => setProperty(_el$12, "value", params.id));
          runHydrationEvents();
          return _el$1;
        })();
      },
      get children() {
        var _el$6 = getNextElement(_tmpl$$1), _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling;
        insert(_el$7, () => workspaceInfo()?.name);
        _el$8.$$click = () => show();
        runHydrationEvents();
        return _el$6;
      }
    }), _el$0, _co$);
    createRenderEffect(() => className(_el$, styles.root));
    return _el$;
  })();
}
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div data-page=workspace-[id]><div data-slot=sections>`);
function index() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(SettingsSection, {}));
    return _el$;
  })();
}

export { index as default };
