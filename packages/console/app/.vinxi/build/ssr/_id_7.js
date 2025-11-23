import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { Show } from "solid-js";
import { d as querySessionInfo } from "./assets/common-B0MbuYas.js";
import { w as useParams } from "./assets/query-D38s0pjD.js";
import { c as createAsync } from "./assets/createAsync-NuC5SOD6.js";
import { A } from "./assets/components-DamWUrce.js";
import "./assets/server-fns-runtime-CTvv0t23.js";
import "solid-js/web/storage";
import "./assets/fetchEvent-C7Qu-2QC.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "./assets/key.sql-B-kRFiGf.js";
import "./assets/workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "ulid";
import "zod";
import "./assets/auth.withActor-DRWYYQUC.js";
import "./assets/auth-CDjCjQcN.js";
import "./assets/user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./assets/response-BxH_sred.js";
import "./assets/billing-arqj744p.js";
import "stripe";
import "./assets/billing.sql-DzjsSlDR.js";
import "./assets/fn-DkMgaEh2.js";
import "./assets/user-CzX0rSuB.js";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-BYGv1-7M.js";
import "./assets/action-COIyZVod.js";
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
