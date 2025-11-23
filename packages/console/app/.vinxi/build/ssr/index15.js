import { createComponent, ssr, ssrHydrationKey, ssrAttribute, escape } from "solid-js/web";
import { c as createServerReference } from "./assets/server-fns-runtime-CTvv0t23.js";
import { createSignal, createEffect, Show, For } from "solid-js";
import { w as withActor } from "./assets/auth.withActor-DRWYYQUC.js";
import { createStore } from "solid-js/store";
import { A as Actor } from "./assets/key.sql-B-kRFiGf.js";
import { U as User } from "./assets/user-CzX0rSuB.js";
import { D as Dropdown } from "./assets/dropdown-DRE_kzvJ.js";
import { w as useParams, q as query } from "./assets/query-D38s0pjD.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { u as useSubmission, b as action } from "./assets/action-COIyZVod.js";
import { j as json } from "./assets/response-BxH_sred.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/auth-CDjCjQcN.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "ulid";
import "zod";
import "./assets/fn-DkMgaEh2.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-BYGv1-7M.js";
import "./assets/icon-CHGNImcU.js";
const root = "_root_jntnv_1";
const styles = {
  root
};
var _tmpl$$2 = ["<button", ' data-slot="role-item"', ' type="button"><div><strong>', "</strong><p>", "</p></div></button>"];
function RoleDropdown(props) {
  const [open, setOpen] = createSignal(false);
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
      return props.options.map((option) => ssr(_tmpl$$2, ssrHydrationKey(), ssrAttribute("data-selected", escape(props.value, true) === escape(option.value, true), false), escape(option.value), escape(option.description)));
    }
  });
}
var _tmpl$$1 = ["<input", ' data-component="input" type="number"', ' placeholder="No limit" min="0">'], _tmpl$2 = ["<button", ' type="button" data-color="ghost">Cancel</button>'], _tmpl$3 = ["<form", ' method="post" data-slot="inline-edit-form"><input type="hidden" name="id"', '><input type="hidden" name="workspaceID"', '><input type="hidden" name="role"', '><input type="hidden" name="limit"', '><button type="submit" data-color="ghost"', ">", "</button><!--$-->", "<!--/--></form>"], _tmpl$4 = ["<td", ' data-slot="member-actions">', "</td>"], _tmpl$5 = ["<tr", '><td data-slot="member-email">', '</td><td data-slot="member-role">', '</td><td data-slot="member-usage">', '</td><td data-slot="member-joined">', "</td><!--$-->", "<!--/--></tr>"], _tmpl$6 = ["<span", ">", "</span>"], _tmpl$7 = ["<button", ' data-color="ghost">Edit</button>'], _tmpl$8 = ["<form", ' method="post"><input type="hidden" name="id"', '><input type="hidden" name="workspaceID"', '><button data-color="ghost">Delete</button></form>'], _tmpl$9 = ["<button", ' data-color="primary">Invite Member</button>'], _tmpl$0 = ["<form", ' method="post" data-slot="create-form"><div data-slot="input-row"><div data-slot="input-field"><p>Invitee</p><input data-component="input" name="email" type="text" placeholder="Enter email"></div><div data-slot="input-field"><p>Role</p><!--$-->', '<!--/--></div><div data-slot="input-field"><p>Monthly spending limit</p><input data-component="input" name="limit" type="number" placeholder="No limit"', ' min="0"></div></div><!--$-->', '<!--/--><input type="hidden" name="role"', '><input type="hidden" name="workspaceID"', '><div data-slot="form-actions"><button type="reset" data-color="ghost">Cancel</button><button type="submit" data-color="primary"', ">", "</button></div></form>"], _tmpl$1 = ["<th", "></th>"], _tmpl$10 = ["<section", '><div data-slot="section-title"><h2>Members</h2><div data-slot="title-row"><p>Manage workspace members and their permissions.</p><!--$-->', '<!--/--></div></div><div data-slot="beta-notice">Workspaces are free for teams during the beta. <a href="/docs/zen/#for-teams" target="_blank" rel="noopener noreferrer">Learn more</a>.</div><!--$-->', '<!--/--><div data-slot="members-table"><table data-slot="members-table-element"><thead><tr><th>Email</th><th>Role</th><th>Month limit</th><th></th><!--$-->', "<!--/--></tr></thead><tbody>", "</tbody></table></div></section>"], _tmpl$11 = ["<div", ' data-slot="form-error">', "</div>"];
const listMembers_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    return {
      members: await User.list(),
      actorID: Actor.userID(),
      actorRole: Actor.userRole()
    };
  }, workspaceID);
}, "src_routes_workspace_id_members_member-section_tsx--listMembers_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const listMembers = query(listMembers_query, "member.list");
const inviteMember_action = createServerReference(async (form) => {
  const email = form.get("email")?.toString().trim();
  if (!email) return {
    error: "Email is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  const role = form.get("role")?.toString();
  if (!role) return {
    error: "Role is required"
  };
  const limit = form.get("limit")?.toString();
  const monthlyLimit = limit && limit.trim() !== "" ? parseInt(limit) : null;
  if (monthlyLimit !== null && monthlyLimit < 0) return {
    error: "Set a valid monthly limit"
  };
  return json(await withActor(() => User.invite({
    email,
    role,
    monthlyLimit
  }).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: listMembers.key
  });
}, "src_routes_workspace_id_members_member-section_tsx--inviteMember_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const inviteMember = action(inviteMember_action, "member.create");
const removeMember_action = createServerReference(async (form) => {
  const id = form.get("id")?.toString();
  if (!id) return {
    error: "ID is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  return json(await withActor(() => User.remove(id).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: listMembers.key
  });
}, "src_routes_workspace_id_members_member-section_tsx--removeMember_action", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace/[id]/members/member-section.tsx?tsr-directive-use-server=");
const removeMember = action(removeMember_action, "member.remove");
const updateMember_action = createServerReference(async (form) => {
  const id = form.get("id")?.toString();
  if (!id) return {
    error: "ID is required"
  };
  const workspaceID = form.get("workspaceID")?.toString();
  if (!workspaceID) return {
    error: "Workspace ID is required"
  };
  const role = form.get("role")?.toString();
  if (!role) return {
    error: "Role is required"
  };
  const limit = form.get("limit")?.toString();
  const monthlyLimit = limit && limit.trim() !== "" ? parseInt(limit) : null;
  if (monthlyLimit !== null && monthlyLimit < 0) return {
    error: "Set a valid monthly limit"
  };
  return json(await withActor(() => User.update({
    id,
    role,
    monthlyLimit
  }).then((data) => ({
    error: void 0,
    data
  })).catch((e) => ({
    error: e.message
  })), workspaceID), {
    revalidate: listMembers.key
  });
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
  return ssr(_tmpl$5, ssrHydrationKey(), escape(props.member.authEmail) ?? escape(props.member.email), escape(createComponent(Show, {
    get when() {
      return store.editing && !isCurrentUser();
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey(), escape(props.member.role));
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
  })), escape(createComponent(Show, {
    get when() {
      return store.editing;
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey(), escape(getUsageDisplay()));
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("value", escape(store.limit, true), false));
    }
  })), props.member.timeSeen ? "" : "invited", escape(createComponent(Show, {
    get when() {
      return isAdmin();
    },
    get children() {
      return ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return store.editing;
        },
        get fallback() {
          return [ssr(_tmpl$7, ssrHydrationKey()), createComponent(Show, {
            get when() {
              return !isCurrentUser();
            },
            get children() {
              return ssr(_tmpl$8, ssrHydrationKey() + ssrAttribute("action", escape(removeMember, true), false), ssrAttribute("value", escape(props.member.id, true), false), ssrAttribute("value", escape(props.workspaceID, true), false));
            }
          })];
        },
        get children() {
          return ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("action", escape(updateMember, true), false), ssrAttribute("value", escape(props.member.id, true), false), ssrAttribute("value", escape(props.workspaceID, true), false), ssrAttribute("value", escape(store.selectedRole, true), false), ssrAttribute("value", escape(store.limit, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Saving..." : "Save", escape(createComponent(Show, {
            get when() {
              return !submission.pending;
            },
            get children() {
              return ssr(_tmpl$2, ssrHydrationKey());
            }
          })));
        }
      })));
    }
  })));
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
  createEffect(() => {
    if (!submission.pending && submission.result && !submission.result.error) {
      setStore("show", false);
    }
  });
  return ssr(_tmpl$10, ssrHydrationKey() + ssrAttribute("class", escape(styles.root, true), false), escape(createComponent(Show, {
    get when() {
      return data()?.actorRole === "admin";
    },
    get children() {
      return ssr(_tmpl$9, ssrHydrationKey());
    }
  })), escape(createComponent(Show, {
    get when() {
      return store.show;
    },
    get children() {
      return ssr(_tmpl$0, ssrHydrationKey() + ssrAttribute("action", escape(inviteMember, true), false), escape(createComponent(RoleDropdown, {
        get value() {
          return store.selectedRole;
        },
        options: roleOptions,
        onChange: (value) => setStore("selectedRole", value)
      })), ssrAttribute("value", escape(store.limit, true), false), escape(createComponent(Show, {
        get when() {
          return submission.result && submission.result.error;
        },
        children: (err) => ssr(_tmpl$11, ssrHydrationKey(), escape(err()))
      })), ssrAttribute("value", escape(store.selectedRole, true), false), ssrAttribute("value", escape(params.id, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Inviting..." : "Invite");
    }
  })), escape(createComponent(Show, {
    get when() {
      return data()?.actorRole === "admin";
    },
    get children() {
      return ssr(_tmpl$1, ssrHydrationKey());
    }
  })), escape(createComponent(Show, {
    get when() {
      return data() && data().members.length > 0;
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
  })));
}
var _tmpl$ = ["<div", ' data-page="workspace-[id]"><div data-slot="sections">', "</div></div>"];
function index() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(MemberSection, {})));
}
export {
  index as default
};
