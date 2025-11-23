import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { Show } from "solid-js";
import { d as querySessionInfo } from "./assets/common-BXueZKJz.js";
import { f as useParams } from "./assets/query-BtW4eurP.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { A } from "./assets/components-Dn0kODL0.js";
import "./assets/server-fns-runtime-DkWzG_ke.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/identifier-6oJPF80e.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./assets/auth.withActor-DFuDq4tF.js";
import "./assets/auth-8FTU0poZ.js";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/auth.session-CdqTMWZ2.js";
import "./assets/response-BxH_sred.js";
import "./assets/billing-Df5jiiZg.js";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CGLpw6vc.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-DC5Qo9OP.js";
import "./assets/key.sql-CUty1lC_.js";
import "./assets/action-CvAvsrvz.js";
var _tmpl$ = ["<main", ' data-page="workspace"><div data-component="workspace-container"><nav data-component="workspace-nav"><nav data-component="nav-desktop"><div data-component="workspace-nav-items"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div></nav><nav data-component="nav-mobile"><div data-component="workspace-nav-items"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div></nav></nav><div data-component="workspace-content">', "</div></div></main>"];
function WorkspaceLayout(props) {
  const params = useParams();
  const userInfo = createAsync(() => querySessionInfo(params.id));
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}`;
    },
    end: true,
    activeClass: "active",
    "data-nav-button": true,
    children: "Zen"
  })), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}/keys`;
    },
    activeClass: "active",
    "data-nav-button": true,
    children: "API Keys"
  })), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}/members`;
    },
    activeClass: "active",
    "data-nav-button": true,
    children: "Members"
  })), escape(createComponent(Show, {
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
  })), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}`;
    },
    end: true,
    activeClass: "active",
    "data-nav-button": true,
    children: "Zen"
  })), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}/keys`;
    },
    activeClass: "active",
    "data-nav-button": true,
    children: "API Keys"
  })), escape(createComponent(A, {
    get href() {
      return `/workspace/${params.id}/members`;
    },
    activeClass: "active",
    "data-nav-button": true,
    children: "Members"
  })), escape(createComponent(Show, {
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
  })), escape(props.children));
}
export {
  WorkspaceLayout as default
};
