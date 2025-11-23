import { h as delegateEvents, e as createSignal, b as createComponent, m as memo, i as getNextElement, t as template, l as insert, y as createRenderEffect, w as setAttribute, r as runHydrationEvents, A as createEffect, v as getNextMarker, S as Show, I as use, z as setProperty, L as For, J as className } from './web-B4FMlVCr.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { D as Dropdown } from './dropdown-CX9xLjCi.js';
import { q as query, u as useParams } from './query-C7ETZYOA.js';
import { b as action, u as useSubmission } from './action-BpQ-vK1N.js';
import './icon-phIboNhp.js';

const root = "_root_jntnv_1";
const styles = {
	root: root
};

var _tmpl$$2 = /* @__PURE__ */ template(`<button data-slot=role-item type=button><div><strong></strong><p>`);
function RoleDropdown(props) {
  const [open, setOpen] = createSignal(false);
  const handleSelect = (value) => {
    props.onChange(value);
    setOpen(false);
  };
  return createComponent(Dropdown, {
    get trigger() {
      return props.value;
    },
    get open() {
      return open();
    },
    onOpenChange: setOpen,
    "class": "role-dropdown",
    get children() {
      return memo(() => props.options.map((option) => (() => {
        var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
        _el$.$$click = () => handleSelect(option.value);
        insert(_el$3, () => option.value);
        insert(_el$4, () => option.description);
        createRenderEffect(() => setAttribute(_el$, "data-selected", props.value === option.value));
        runHydrationEvents();
        return _el$;
      })()));
    }
  });
}
delegateEvents(["click"]);

var _tmpl$$1 = /* @__PURE__ */ template(`<input data-component=input type=number placeholder="No limit"min=0>`), _tmpl$2 = /* @__PURE__ */ template(`<button type=button data-color=ghost>Cancel`), _tmpl$3 = /* @__PURE__ */ template(`<form method=post data-slot=inline-edit-form><input type=hidden name=id><input type=hidden name=workspaceID><input type=hidden name=role><input type=hidden name=limit><button type=submit data-color=ghost></button><!$><!/>`), _tmpl$4 = /* @__PURE__ */ template(`<td data-slot=member-actions>`), _tmpl$5 = /* @__PURE__ */ template(`<tr><td data-slot=member-email></td><td data-slot=member-role></td><td data-slot=member-usage></td><td data-slot=member-joined></td><!$><!/>`), _tmpl$6 = /* @__PURE__ */ template(`<span>`), _tmpl$7 = /* @__PURE__ */ template(`<button data-color=ghost>Edit`), _tmpl$8 = /* @__PURE__ */ template(`<form method=post><input type=hidden name=id><input type=hidden name=workspaceID><button data-color=ghost>Delete`), _tmpl$9 = /* @__PURE__ */ template(`<button data-color=primary>Invite Member`), _tmpl$0 = /* @__PURE__ */ template(`<form method=post data-slot=create-form><div data-slot=input-row><div data-slot=input-field><p>Invitee</p><input data-component=input name=email type=text placeholder="Enter email"></div><div data-slot=input-field><p>Role</p><!$><!/></div><div data-slot=input-field><p>Monthly spending limit</p><input data-component=input name=limit type=number placeholder="No limit"min=0></div></div><!$><!/><input type=hidden name=role><input type=hidden name=workspaceID><div data-slot=form-actions><button type=reset data-color=ghost>Cancel</button><button type=submit data-color=primary>`), _tmpl$1 = /* @__PURE__ */ template(`<th>`), _tmpl$10 = /* @__PURE__ */ template(`<section><div data-slot=section-title><h2>Members</h2><div data-slot=title-row><p>Manage workspace members and their permissions.</p><!$><!/></div></div><div data-slot=beta-notice>Workspaces are free for teams during the beta. <a href=/docs/zen/#for-teams target=_blank rel="noopener noreferrer">Learn more</a>.</div><!$><!/><div data-slot=members-table><table data-slot=members-table-element><thead><tr><th>Email</th><th>Role</th><th>Month limit</th><th></th><!$><!/></tr></thead><tbody>`), _tmpl$11 = /* @__PURE__ */ template(`<div data-slot=form-error>`);
const listMembers_query = createServerReference(() => {
}, "src_routes_workspace_id_members_member-section_tsx--listMembers_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const listMembers = query(listMembers_query, "member.list");
const inviteMember_action = createServerReference(() => {
}, "src_routes_workspace_id_members_member-section_tsx--inviteMember_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const inviteMember = action(inviteMember_action, "member.create");
const removeMember_action = createServerReference(() => {
}, "src_routes_workspace_id_members_member-section_tsx--removeMember_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const removeMember = action(removeMember_action, "member.remove");
const updateMember_action = createServerReference(() => {
}, "src_routes_workspace_id_members_member-section_tsx--updateMember_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const updateMember = action(updateMember_action, "member.update");
function MemberRow(props) {
  const submission = useSubmission(updateMember);
  const isCurrentUser = () => props.actorID === props.member.id;
  const isAdmin = () => props.actorRole === "admin";
  const [store, setStore] = createStore({
    editing: false,
    selectedRole: props.member.role,
    limit: ""
  });
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      setStore("editing", false);
    }
  });
  function show() {
    while (true) {
      submission.clear();
      if (!submission.result) break;
    }
    setStore("editing", true);
    setStore("selectedRole", props.member.role);
    setStore("limit", props.member.monthlyLimit?.toString() ?? "");
  }
  function hide() {
    setStore("editing", false);
  }
  function getUsageDisplay() {
    const currentUsage = (() => {
      const dateLastUsed = props.member.timeMonthlyUsageUpdated;
      if (!dateLastUsed) return 0;
      const current = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        timeZone: "UTC"
      });
      const lastUsed = dateLastUsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        timeZone: "UTC"
      });
      return current === lastUsed ? props.member.monthlyUsage ?? 0 : 0;
    })();
    const limit = props.member.monthlyLimit ? `$${props.member.monthlyLimit}` : "no limit";
    return `$${(currentUsage / 1e8).toFixed(2)} / ${limit}`;
  }
  return (() => {
    var _el$ = getNextElement(_tmpl$5), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling, _el$6 = _el$4.nextSibling, _el$15 = _el$6.nextSibling, [_el$16, _co$2] = getNextMarker(_el$15.nextSibling);
    insert(_el$2, () => props.member.authEmail ?? props.member.email);
    insert(_el$3, createComponent(Show, {
      get when() {
        return memo(() => !!store.editing)() && !isCurrentUser();
      },
      get fallback() {
        return (() => {
          var _el$17 = getNextElement(_tmpl$6);
          insert(_el$17, () => props.member.role);
          return _el$17;
        })();
      },
      get children() {
        return createComponent(RoleDropdown, {
          get value() {
            return store.selectedRole;
          },
          options: roleOptions,
          onChange: (value) => setStore("selectedRole", value)
        });
      }
    }));
    insert(_el$4, createComponent(Show, {
      get when() {
        return store.editing;
      },
      get fallback() {
        return (() => {
          var _el$18 = getNextElement(_tmpl$6);
          insert(_el$18, getUsageDisplay);
          return _el$18;
        })();
      },
      get children() {
        var _el$5 = getNextElement(_tmpl$$1);
        _el$5.$$input = (e) => setStore("limit", e.currentTarget.value);
        createRenderEffect(() => setProperty(_el$5, "value", store.limit));
        runHydrationEvents();
        return _el$5;
      }
    }));
    insert(_el$6, () => props.member.timeSeen ? "" : "invited");
    insert(_el$, createComponent(Show, {
      get when() {
        return isAdmin();
      },
      get children() {
        var _el$7 = getNextElement(_tmpl$4);
        insert(_el$7, createComponent(Show, {
          get when() {
            return store.editing;
          },
          get fallback() {
            return [(() => {
              var _el$19 = getNextElement(_tmpl$7);
              _el$19.$$click = () => show();
              runHydrationEvents();
              return _el$19;
            })(), createComponent(Show, {
              get when() {
                return !isCurrentUser();
              },
              get children() {
                var _el$20 = getNextElement(_tmpl$8), _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling;
                setAttribute(_el$20, "action", removeMember);
                createRenderEffect(() => setProperty(_el$21, "value", props.member.id));
                createRenderEffect(() => setProperty(_el$22, "value", props.workspaceID));
                return _el$20;
              }
            })];
          },
          get children() {
            var _el$8 = getNextElement(_tmpl$3), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling, _el$11 = _el$10.nextSibling, _el$13 = _el$11.nextSibling, [_el$14, _co$] = getNextMarker(_el$13.nextSibling);
            setAttribute(_el$8, "action", updateMember);
            insert(_el$11, () => submission.pending ? "Saving..." : "Save");
            insert(_el$8, createComponent(Show, {
              get when() {
                return !submission.pending;
              },
              get children() {
                var _el$12 = getNextElement(_tmpl$2);
                _el$12.$$click = () => hide();
                runHydrationEvents();
                return _el$12;
              }
            }), _el$14, _co$);
            createRenderEffect(() => setProperty(_el$11, "disabled", submission.pending));
            createRenderEffect(() => setProperty(_el$9, "value", props.member.id));
            createRenderEffect(() => setProperty(_el$0, "value", props.workspaceID));
            createRenderEffect(() => setProperty(_el$1, "value", store.selectedRole));
            createRenderEffect(() => setProperty(_el$10, "value", store.limit));
            return _el$8;
          }
        }));
        return _el$7;
      }
    }), _el$16, _co$2);
    return _el$;
  })();
}
const roleOptions = [{
  value: "admin",
  description: "Can manage models, members, and billing"
}, {
  value: "member",
  description: "Can only generate API keys for themselves"
}];
function MemberSection() {
  const params = useParams();
  const data = createAsync(() => listMembers(params.id));
  const submission = useSubmission(inviteMember);
  const [store, setStore] = createStore({
    show: false,
    selectedRole: "member",
    limit: ""
  });
  let input;
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      setStore("show", false);
    }
  });
  function show() {
    while (true) {
      submission.clear();
      if (!submission.result) break;
    }
    setStore("show", true);
    setStore("selectedRole", "member");
    setStore("limit", "");
    setTimeout(() => input?.focus(), 0);
  }
  function hide() {
    setStore("show", false);
  }
  return (() => {
    var _el$23 = getNextElement(_tmpl$10), _el$24 = _el$23.firstChild, _el$25 = _el$24.firstChild, _el$26 = _el$25.nextSibling, _el$27 = _el$26.firstChild, _el$29 = _el$27.nextSibling, [_el$30, _co$3] = getNextMarker(_el$29.nextSibling), _el$31 = _el$24.nextSibling, _el$63 = _el$31.nextSibling, [_el$64, _co$7] = getNextMarker(_el$63.nextSibling), _el$51 = _el$64.nextSibling, _el$52 = _el$51.firstChild, _el$53 = _el$52.firstChild, _el$54 = _el$53.firstChild, _el$55 = _el$54.firstChild, _el$56 = _el$55.nextSibling, _el$57 = _el$56.nextSibling, _el$58 = _el$57.nextSibling, _el$60 = _el$58.nextSibling, [_el$61, _co$6] = getNextMarker(_el$60.nextSibling), _el$62 = _el$53.nextSibling;
    insert(_el$26, createComponent(Show, {
      get when() {
        return data()?.actorRole === "admin";
      },
      get children() {
        var _el$28 = getNextElement(_tmpl$9);
        _el$28.$$click = () => show();
        runHydrationEvents();
        return _el$28;
      }
    }), _el$30, _co$3);
    insert(_el$23, createComponent(Show, {
      get when() {
        return store.show;
      },
      get children() {
        var _el$32 = getNextElement(_tmpl$0), _el$33 = _el$32.firstChild, _el$34 = _el$33.firstChild, _el$35 = _el$34.firstChild, _el$36 = _el$35.nextSibling, _el$37 = _el$34.nextSibling, _el$38 = _el$37.firstChild, _el$39 = _el$38.nextSibling, [_el$40, _co$4] = getNextMarker(_el$39.nextSibling), _el$41 = _el$37.nextSibling, _el$42 = _el$41.firstChild, _el$43 = _el$42.nextSibling, _el$49 = _el$33.nextSibling, [_el$50, _co$5] = getNextMarker(_el$49.nextSibling), _el$44 = _el$50.nextSibling, _el$45 = _el$44.nextSibling, _el$46 = _el$45.nextSibling, _el$47 = _el$46.firstChild, _el$48 = _el$47.nextSibling;
        setAttribute(_el$32, "action", inviteMember);
        use((r) => input = r, _el$36);
        insert(_el$37, createComponent(RoleDropdown, {
          get value() {
            return store.selectedRole;
          },
          options: roleOptions,
          onChange: (value) => setStore("selectedRole", value)
        }), _el$40, _co$4);
        _el$43.$$input = (e) => setStore("limit", e.currentTarget.value);
        insert(_el$32, createComponent(Show, {
          get when() {
            return memo(() => !!submission.result)() && submission.result.error;
          },
          children: (err) => (() => {
            var _el$65 = getNextElement(_tmpl$11);
            insert(_el$65, err);
            return _el$65;
          })()
        }), _el$50, _co$5);
        _el$47.$$click = () => hide();
        insert(_el$48, () => submission.pending ? "Inviting..." : "Invite");
        createRenderEffect(() => setProperty(_el$48, "disabled", submission.pending));
        createRenderEffect(() => setProperty(_el$43, "value", store.limit));
        createRenderEffect(() => setProperty(_el$44, "value", store.selectedRole));
        createRenderEffect(() => setProperty(_el$45, "value", params.id));
        runHydrationEvents();
        return _el$32;
      }
    }), _el$64, _co$7);
    insert(_el$54, createComponent(Show, {
      get when() {
        return data()?.actorRole === "admin";
      },
      get children() {
        return getNextElement(_tmpl$1);
      }
    }), _el$61, _co$6);
    insert(_el$62, createComponent(Show, {
      get when() {
        return memo(() => !!data())() && data().members.length > 0;
      },
      get children() {
        return createComponent(For, {
          get each() {
            return data().members;
          },
          children: (member) => createComponent(MemberRow, {
            member,
            get workspaceID() {
              return params.id;
            },
            get actorID() {
              return data().actorID;
            },
            get actorRole() {
              return data().actorRole;
            }
          })
        });
      }
    }));
    createRenderEffect(() => className(_el$23, styles.root));
    return _el$23;
  })();
}
delegateEvents(["input", "click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div data-page=workspace-[id]><div data-slot=sections>`);
function index() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(MemberSection, {}));
    return _el$;
  })();
}

export { index as default };
