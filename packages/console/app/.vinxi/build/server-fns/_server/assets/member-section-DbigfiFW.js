import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { w as withActor } from "./auth.withActor-DFuDq4tF.js";
import { A as Actor } from "./identifier-6oJPF80e.js";
import { U as User } from "./user-CGLpw6vc.js";
import { j as json } from "./response-BxH_sred.js";
import { q as query } from "./query-BtW4eurP.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
import "./auth-8FTU0poZ.js";
import "./workspace.sql-DMfPBlPl.js";
import "drizzle-orm/planetscale-serverless";
import "./resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "@planetscale/database";
import "drizzle-orm/mysql-core";
import "drizzle-orm";
import "./user.sql-BlLepWby.js";
import "@openauthjs/openauth/client";
import "./auth.session-CdqTMWZ2.js";
import "ulid";
import "zod";
import "./fn-DkMgaEh2.js";
import "@jsx-email/render";
import "./aws-DbqHRm5C.js";
import "aws4fetch";
import "./key-DC5Qo9OP.js";
import "./key.sql-CUty1lC_.js";
import "solid-js";
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
export {
  inviteMember_action,
  listMembers_query,
  removeMember_action,
  updateMember_action
};
