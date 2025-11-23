import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute, getRequestEvent } from "solid-js/web";
import { c as createServerReference } from "./assets/server-fns-runtime-CTvv0t23.js";
import { m as IconWorkspaceLogo } from "./assets/icon-CHGNImcU.js";
import { Show, createEffect, For } from "solid-js";
import { createStore } from "solid-js/store";
import { w as withActor } from "./assets/auth.withActor-DRWYYQUC.js";
import { A as Actor } from "./assets/key.sql-B-kRFiGf.js";
import { D as Database, W as WorkspaceTable } from "./assets/workspace.sql-DMfPBlPl.js";
import { U as UserTable } from "./assets/user.sql-BlLepWby.js";
import { W as Workspace } from "./assets/workspace-dvo9tpIk.js";
import { D as Dropdown, a as DropdownItem } from "./assets/dropdown-DRE_kzvJ.js";
import { w as useParams, q as query } from "./assets/query-D38s0pjD.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { u as useSubmission, b as action } from "./assets/action-COIyZVod.js";
import { eq, and, isNull } from "drizzle-orm";
import { r as redirect } from "./assets/response-BxH_sred.js";
import { u as useAuthSession } from "./assets/auth-CDjCjQcN.js";
import { U as User } from "./assets/user-CzX0rSuB.js";
import { L as Link } from "./assets/index-D2bc-ZG5.js";
import { A } from "./assets/components-DamWUrce.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "ulid";
import "zod";
import "drizzle-orm/mysql-core";
import "drizzle-orm/planetscale-serverless";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "./assets/fn-DkMgaEh2.js";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/key-BYGv1-7M.js";
import "@openauthjs/openauth/client";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
var _tmpl$$3 = ["<h2", ' data-slot="title">', "</h2>"], _tmpl$2$2 = ["<div", ' data-component="modal" data-slot="overlay"><div data-slot="content"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"];
function Modal(props) {
  return createComponent(Show, {
    get when() {
      return props.open;
    },
    get children() {
      return ssr(_tmpl$2$2, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return props.title;
        },
        get children() {
          return ssr(_tmpl$$3, ssrHydrationKey(), escape(props.title));
        }
      })), escape(props.children));
    }
  });
}
var _tmpl$$2 = ["<button", ' data-slot="create-item" type="button">+ Create New Workspace</button>'], _tmpl$2$1 = ["<form", ' data-slot="create-form"', ' method="post"><div data-slot="create-input-group"><input data-slot="create-input" type="text" name="workspaceName" placeholder="Enter workspace name" required><div data-slot="button-group"><button type="button" data-color="ghost">Cancel</button><button type="submit" data-color="primary"', ">", "</button></div></div></form>"], _tmpl$3 = ["<div", ' data-component="workspace-picker"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"];
const getWorkspaces_query = createServerReference(async () => {
  return withActor(async () => {
    return Database.transaction((tx) => tx.select({
      id: WorkspaceTable.id,
      name: WorkspaceTable.name,
      slug: WorkspaceTable.slug
    }).from(UserTable).innerJoin(WorkspaceTable, eq(UserTable.workspaceID, WorkspaceTable.id)).where(and(eq(UserTable.accountID, Actor.account()), isNull(WorkspaceTable.timeDeleted), isNull(UserTable.timeDeleted))));
  });
}, "src_routes_workspace-picker_tsx--getWorkspaces_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace-picker.tsx?tsr-directive-use-server=");
const getWorkspaces = query(getWorkspaces_query, "workspaces");
const createWorkspace_action = createServerReference(async (form) => {
  const name = form.get("workspaceName");
  if (name?.trim()) {
    return withActor(async () => {
      const workspaceID = await Workspace.create({
        name: name.trim()
      });
      return redirect(`/workspace/${workspaceID}`);
    });
  }
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
  createEffect(() => {
    if (store.showForm && inputRef) ;
  });
  const handleSelectWorkspace = (workspaceID) => {
    if (workspaceID === params.id) return;
    window.location.href = `/workspace/${workspaceID}`;
  };
  createEffect(() => {
    params.id;
    setStore("showForm", false);
  });
  return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(Dropdown, {
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
      }), ssr(_tmpl$$2, ssrHydrationKey())];
    }
  })), escape(createComponent(Modal, {
    get open() {
      return store.showForm;
    },
    onClose: () => setStore("showForm", false),
    title: "Create New Workspace",
    get children() {
      return ssr(_tmpl$2$1, ssrHydrationKey(), ssrAttribute("action", escape(createWorkspace, true), false), ssrAttribute("disabled", submission.pending, true), submission.pending ? "Creating..." : "Create");
    }
  })));
}
var _tmpl$$1 = ["<form", ' method="post"><button type="submit"', ' data-slot="item">Logout</button></form>'], _tmpl$2 = ["<div", ' data-component="user-menu">', "</div>"];
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
const logout = action(logout_action);
function UserMenu(props) {
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Dropdown, {
    get trigger() {
      return props.email ?? "";
    },
    align: "right",
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey() + ssrAttribute("action", escape(logout, true), false), ssrAttribute("formaction", escape(logout, true), false));
    }
  })));
}
var _tmpl$ = ["<main", ' data-page="workspace"><!--$-->', '<!--/--><header data-component="workspace-header"><div data-slot="header-brand"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div data-slot="header-actions">', "</div></header><div>", "</div></main>"];
const getUserEmail_query = createServerReference(async (workspaceID) => {
  return withActor(async () => {
    const actor = Actor.assert("user");
    const email = await User.getAuthEmail(actor.properties.userID);
    return email;
  }, workspaceID);
}, "src_routes_workspace_tsx--getUserEmail_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/routes/workspace.tsx?pick=default&pick=%24css&tsr-directive-use-server=");
const getUserEmail = query(getUserEmail_query, "userEmail");
function WorkspaceLayout(props) {
  const params = useParams();
  const userEmail = createAsync(() => getUserEmail(params.id));
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Link, {
    rel: "icon",
    type: "image/svg+xml",
    href: "/favicon-zen.svg"
  })), escape(createComponent(A, {
    href: "/",
    "data-component": "site-title",
    get children() {
      return createComponent(IconWorkspaceLogo, {});
    }
  })), escape(createComponent(WorkspacePicker, {})), escape(createComponent(UserMenu, {
    get email() {
      return userEmail();
    }
  })), escape(props.children));
}
export {
  WorkspaceLayout as default
};
