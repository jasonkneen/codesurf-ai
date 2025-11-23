import { z } from "zod";
import { getTableColumns, and, eq, isNull, sql } from "drizzle-orm";
import { f as fn } from "./fn-DkMgaEh2.js";
import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { U as UserTable, a as UserRole } from "./user.sql-BlLepWby.js";
import { A as Actor, I as Identifier, K as KeyTable } from "./key.sql-B-kRFiGf.js";
import { render } from "@jsx-email/render";
import { A as AWS } from "./aws-DbqHRm5C.js";
import { A as AuthTable, K as Key } from "./key-BYGv1-7M.js";
var User;
((User2) => {
  const assertNotSelf = (id) => {
    if (Actor.userID() !== id) return;
    throw new Error(`Expected not self actor, got self actor`);
  };
  User2.list = fn(z.void(), () => Database.use((tx) => tx.select({
    ...getTableColumns(UserTable),
    authEmail: AuthTable.subject
  }).from(UserTable).leftJoin(AuthTable, and(eq(UserTable.accountID, AuthTable.accountID), eq(AuthTable.provider, "email"))).where(and(eq(UserTable.workspaceID, Actor.workspace()), isNull(UserTable.timeDeleted)))));
  User2.fromID = fn(z.string(), (id) => Database.use((tx) => tx.select().from(UserTable).where(and(eq(UserTable.workspaceID, Actor.workspace()), eq(UserTable.id, id), isNull(UserTable.timeDeleted))).then((rows) => rows[0])));
  User2.getAuthEmail = fn(z.string(), (id) => Database.use((tx) => tx.select({
    email: AuthTable.subject
  }).from(UserTable).leftJoin(AuthTable, and(eq(UserTable.accountID, AuthTable.accountID), eq(AuthTable.provider, "email"))).where(and(eq(UserTable.workspaceID, Actor.workspace()), eq(UserTable.id, id))).then((rows) => rows[0]?.email)));
  User2.invite = fn(z.object({
    email: z.string(),
    role: z.enum(UserRole),
    monthlyLimit: z.number().nullable().optional()
  }), async ({
    email,
    role,
    monthlyLimit
  }) => {
    Actor.assertAdmin();
    const workspaceID = Actor.workspace();
    const accountID = await Database.use((tx) => tx.select({
      accountID: AuthTable.accountID
    }).from(AuthTable).where(and(eq(AuthTable.provider, "email"), eq(AuthTable.subject, email))).then((rows) => rows[0]?.accountID));
    await Database.use((tx) => tx.insert(UserTable).values({
      id: Identifier.create("user"),
      name: "",
      ...accountID ? {
        accountID
      } : {
        email
      },
      workspaceID,
      role,
      monthlyLimit
    }).onDuplicateKeyUpdate({
      set: {
        role,
        monthlyLimit,
        timeDeleted: null
      }
    }));
    if (accountID) {
      await Database.use(async (tx) => {
        const user = await tx.select().from(UserTable).where(and(eq(UserTable.workspaceID, workspaceID), eq(UserTable.accountID, accountID))).then((rows) => rows[0]);
        const key = await tx.select().from(KeyTable).where(and(eq(KeyTable.workspaceID, workspaceID), eq(KeyTable.userID, user.id))).then((rows) => rows[0]);
        if (key) return;
        await Key.create({
          userID: user.id,
          name: "Default API Key"
        });
      });
    }
    try {
      const emailInfo = await Database.use((tx) => tx.select({
        inviterEmail: AuthTable.subject,
        workspaceName: WorkspaceTable.name
      }).from(UserTable).innerJoin(AuthTable, and(eq(UserTable.accountID, AuthTable.accountID), eq(AuthTable.provider, "email"))).innerJoin(WorkspaceTable, eq(WorkspaceTable.id, workspaceID)).where(and(eq(UserTable.workspaceID, workspaceID), eq(UserTable.id, Actor.assert("user").properties.userID))).then((rows) => rows[0]));
      const {
        InviteEmail
      } = await import("./InviteEmail-DD_h6rFd.js");
      await AWS.sendEmail({
        to: email,
        subject: `You've been invited to join the ${emailInfo.workspaceName} workspace on OpenCode`,
        body: render(
          // @ts-ignore
          InviteEmail({
            inviter: emailInfo.inviterEmail,
            assetsUrl: `https://opencode.ai/email`,
            workspaceID,
            workspaceName: emailInfo.workspaceName
          })
        )
      });
    } catch (e) {
      console.error(e);
    }
  });
  User2.joinInvitedWorkspaces = fn(z.void(), async () => {
    const account = Actor.assert("account");
    const invitations = await Database.use(async (tx) => {
      const invitations2 = await tx.select({
        id: UserTable.id,
        workspaceID: UserTable.workspaceID
      }).from(UserTable).where(eq(UserTable.email, account.properties.email));
      await tx.update(UserTable).set({
        accountID: account.properties.accountID,
        email: null
      }).where(eq(UserTable.email, account.properties.email));
      return invitations2;
    });
    await Promise.all(invitations.map((invite2) => Actor.provide("system", {
      workspaceID: invite2.workspaceID
    }, () => Key.create({
      userID: invite2.id,
      name: "Default API Key"
    }))));
  });
  User2.update = fn(z.object({
    id: z.string(),
    role: z.enum(UserRole),
    monthlyLimit: z.number().nullable()
  }), async ({
    id,
    role,
    monthlyLimit
  }) => {
    Actor.assertAdmin();
    if (role === "member") assertNotSelf(id);
    return await Database.use((tx) => tx.update(UserTable).set({
      role,
      monthlyLimit
    }).where(and(eq(UserTable.id, id), eq(UserTable.workspaceID, Actor.workspace()))));
  });
  User2.remove = fn(z.string(), async (id) => {
    Actor.assertAdmin();
    assertNotSelf(id);
    return await Database.use((tx) => tx.update(UserTable).set({
      timeDeleted: sql`now()`
    }).where(and(eq(UserTable.id, id), eq(UserTable.workspaceID, Actor.workspace()))));
  });
})(User || (User = {}));
export {
  User as U
};
