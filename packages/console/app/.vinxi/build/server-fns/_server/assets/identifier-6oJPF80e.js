import { C as Context } from "./workspace.sql-DMfPBlPl.js";
import { ulid } from "ulid";
import { z } from "zod";
var Log;
((Log2) => {
  const ctx = Context.create();
  function create(tags) {
    tags = tags || {};
    const result = {
      info(message, extra) {
        const prefix = Object.entries({
          ...use().tags,
          ...tags,
          ...extra
        }).map(([key, value]) => `${key}=${value}`).join(" ");
        console.log(prefix, message);
        return result;
      },
      tag(key, value) {
        if (tags) tags[key] = value;
        return result;
      },
      clone() {
        return Log2.create({
          ...tags
        });
      }
    };
    return result;
  }
  Log2.create = create;
  function provide(tags, cb) {
    const existing = use();
    return ctx.provide({
      tags: {
        ...existing.tags,
        ...tags
      }
    }, cb);
  }
  Log2.provide = provide;
  function use() {
    try {
      return ctx.use();
    } catch (e) {
      return {
        tags: {}
      };
    }
  }
})(Log || (Log = {}));
var Actor;
((Actor2) => {
  const ctx = Context.create();
  Actor2.use = ctx.use;
  const log = Log.create().tag("namespace", "actor");
  function provide(type, properties, cb) {
    return ctx.provide({
      type,
      properties
    }, () => {
      return Log.provide({
        ...properties
      }, () => {
        log.info("provided");
        return cb();
      });
    });
  }
  Actor2.provide = provide;
  function assert(type) {
    const actor = (0, Actor2.use)();
    if (actor.type !== type) {
      throw new Error(`Expected actor type ${type}, got ${actor.type}`);
    }
    return actor;
  }
  Actor2.assert = assert;
  Actor2.assertAdmin = () => {
    if (userRole() === "admin") return;
    throw new Error(`Action not allowed. Ask your workspace admin to perform this action.`);
  };
  function workspace() {
    const actor = (0, Actor2.use)();
    if ("workspaceID" in actor.properties) {
      return actor.properties.workspaceID;
    }
    throw new Error(`actor of type "${actor.type}" is not associated with a workspace`);
  }
  Actor2.workspace = workspace;
  function account() {
    const actor = (0, Actor2.use)();
    if ("accountID" in actor.properties) {
      return actor.properties.accountID;
    }
    throw new Error(`actor of type "${actor.type}" is not associated with an account`);
  }
  Actor2.account = account;
  function userID() {
    return Actor2.assert("user").properties.userID;
  }
  Actor2.userID = userID;
  function userRole() {
    return Actor2.assert("user").properties.role;
  }
  Actor2.userRole = userRole;
})(Actor || (Actor = {}));
var Identifier;
((Identifier2) => {
  const prefixes = {
    account: "acc",
    auth: "aut",
    billing: "bil",
    key: "key",
    model: "mod",
    payment: "pay",
    provider: "prv",
    usage: "usg",
    user: "usr",
    workspace: "wrk"
  };
  function create(prefix, given) {
    if (given) {
      if (given.startsWith(prefixes[prefix])) return given;
      throw new Error(`ID ${given} does not start with ${prefixes[prefix]}`);
    }
    return [prefixes[prefix], ulid()].join("_");
  }
  Identifier2.create = create;
  function schema(prefix) {
    return z.string().startsWith(prefixes[prefix]);
  }
  Identifier2.schema = schema;
})(Identifier || (Identifier = {}));
export {
  Actor as A,
  Identifier as I
};
