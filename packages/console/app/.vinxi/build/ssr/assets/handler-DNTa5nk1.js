import { D as Database, W as WorkspaceTable } from "./workspace.sql-DMfPBlPl.js";
import { K as KeyTable, I as Identifier, A as Actor } from "./key.sql-B-kRFiGf.js";
import { B as BillingTable, U as UsageTable } from "./billing.sql-DzjsSlDR.js";
import { c as centsToMicroCents, B as Billing } from "./billing-arqj744p.js";
import { Z as ZenData, a as ModelTable } from "./model-DEAhOJ5e.js";
import { U as UserTable } from "./user.sql-BlLepWby.js";
import { P as ProviderTable } from "./provider.sql-BbW43-0P.js";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { eq, and, isNull, sql, lt, or } from "drizzle-orm";
const logger = {
  metric: (values) => {
    console.log(`_metric:${JSON.stringify(values)}`);
  },
  log: console.log,
  debug: (message) => {
    if (Resource.App.stage === "production") return;
    console.debug(message);
  }
};
class AuthError extends Error {
}
class CreditsError extends Error {
}
class MonthlyLimitError extends Error {
}
class UserLimitError extends Error {
}
class ModelError extends Error {
}
class RateLimitError extends Error {
}
const anthropicHelper = {
  format: "anthropic",
  modifyUrl: (providerApi) => providerApi + "/messages",
  modifyHeaders: (headers, body, apiKey) => {
    headers.set("x-api-key", apiKey);
    headers.set("anthropic-version", headers.get("anthropic-version") ?? "2023-06-01");
    if (body.model.startsWith("claude-sonnet-")) {
      headers.set("anthropic-beta", "context-1m-2025-08-07");
    }
  },
  modifyBody: (body) => {
    return {
      ...body,
      service_tier: "standard_only"
    };
  },
  createUsageParser: () => {
    let usage;
    return {
      parse: (chunk) => {
        const data = chunk.split("\n")[1];
        if (!data.startsWith("data: ")) return;
        let json;
        try {
          json = JSON.parse(data.slice(6));
        } catch (e) {
          return;
        }
        const usageUpdate = json.usage ?? json.message?.usage;
        if (!usageUpdate) return;
        usage = {
          ...usage,
          ...usageUpdate,
          cache_creation: {
            ...usage?.cache_creation,
            ...usageUpdate.cache_creation
          },
          server_tool_use: {
            ...usage?.server_tool_use,
            ...usageUpdate.server_tool_use
          }
        };
      },
      retrieve: () => usage
    };
  },
  normalizeUsage: (usage) => ({
    inputTokens: usage.input_tokens ?? 0,
    outputTokens: usage.output_tokens ?? 0,
    reasoningTokens: void 0,
    cacheReadTokens: usage.cache_read_input_tokens ?? void 0,
    cacheWrite5mTokens: usage.cache_creation?.ephemeral_5m_input_tokens ?? void 0,
    cacheWrite1hTokens: usage.cache_creation?.ephemeral_1h_input_tokens ?? void 0
  })
};
function fromAnthropicRequest(body) {
  if (!body || typeof body !== "object") return body;
  const msgs = [];
  const sys = Array.isArray(body.system) ? body.system : void 0;
  if (sys && sys.length > 0) {
    for (const s of sys) {
      if (!s) continue;
      if (s.type !== "text") continue;
      if (typeof s.text !== "string") continue;
      if (s.text.length === 0) continue;
      msgs.push({
        role: "system",
        content: s.text
      });
    }
  }
  const toImg = (src) => {
    if (!src || typeof src !== "object") return void 0;
    if (src.type === "url" && typeof src.url === "string") return {
      type: "image_url",
      image_url: {
        url: src.url
      }
    };
    if (src.type === "base64" && typeof src.media_type === "string" && typeof src.data === "string") return {
      type: "image_url",
      image_url: {
        url: `data:${src.media_type};base64,${src.data}`
      }
    };
    return void 0;
  };
  const inMsgs = Array.isArray(body.messages) ? body.messages : [];
  for (const m of inMsgs) {
    if (!m || !m.role) continue;
    if (m.role === "user") {
      const partsIn = Array.isArray(m.content) ? m.content : [];
      const partsOut = [];
      for (const p of partsIn) {
        if (!p || !p.type) continue;
        if (p.type === "text" && typeof p.text === "string") partsOut.push({
          type: "text",
          text: p.text
        });
        if (p.type === "image") {
          const ip = toImg(p.source);
          if (ip) partsOut.push(ip);
        }
        if (p.type === "tool_result") {
          const id = p.tool_use_id;
          const content = typeof p.content === "string" ? p.content : JSON.stringify(p.content);
          msgs.push({
            role: "tool",
            tool_call_id: id,
            content
          });
        }
      }
      if (partsOut.length > 0) {
        if (partsOut.length === 1 && partsOut[0].type === "text") msgs.push({
          role: "user",
          content: partsOut[0].text
        });
        else msgs.push({
          role: "user",
          content: partsOut
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const partsIn = Array.isArray(m.content) ? m.content : [];
      const texts = [];
      const tcs = [];
      for (const p of partsIn) {
        if (!p || !p.type) continue;
        if (p.type === "text" && typeof p.text === "string") texts.push(p.text);
        if (p.type === "tool_use") {
          const name = p.name;
          const id = p.id;
          const inp = p.input;
          const input = (() => {
            if (typeof inp === "string") return inp;
            try {
              return JSON.stringify(inp ?? {});
            } catch {
              return String(inp ?? "");
            }
          })();
          tcs.push({
            id,
            type: "function",
            function: {
              name,
              arguments: input
            }
          });
        }
      }
      const out = {
        role: "assistant",
        content: texts.join("")
      };
      if (tcs.length > 0) out.tool_calls = tcs;
      msgs.push(out);
      continue;
    }
  }
  const tools = Array.isArray(body.tools) ? body.tools.filter((t) => t && typeof t === "object" && "input_schema" in t).map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema
    }
  })) : void 0;
  const tcin = body.tool_choice;
  const tc = (() => {
    if (!tcin) return void 0;
    if (tcin.type === "auto") return "auto";
    if (tcin.type === "any") return "required";
    if (tcin.type === "tool" && typeof tcin.name === "string") return {
      type: "function",
      function: {
        name: tcin.name
      }
    };
    return void 0;
  })();
  const stop = (() => {
    const v = body.stop_sequences;
    if (!v) return void 0;
    if (Array.isArray(v)) return v.length === 1 ? v[0] : v;
    if (typeof v === "string") return v;
    return void 0;
  })();
  return {
    model: body.model,
    max_tokens: body.max_tokens,
    temperature: body.temperature,
    top_p: body.top_p,
    stop,
    messages: msgs,
    stream: !!body.stream,
    tools,
    tool_choice: tc
  };
}
function toAnthropicRequest(body) {
  if (!body || typeof body !== "object") return body;
  const sysIn = Array.isArray(body.messages) ? body.messages.filter((m) => m && m.role === "system") : [];
  let ccCount = 0;
  const cc = () => {
    ccCount++;
    return ccCount <= 4 ? {
      cache_control: {
        type: "ephemeral"
      }
    } : {};
  };
  const system = sysIn.filter((m) => typeof m.content === "string" && m.content.length > 0).map((m) => ({
    type: "text",
    text: m.content,
    ...cc()
  }));
  const msgsIn = Array.isArray(body.messages) ? body.messages : [];
  const msgsOut = [];
  const toSrc = (p) => {
    if (!p || typeof p !== "object") return void 0;
    if (p.type === "image_url" && p.image_url) {
      const u = p.image_url.url ?? p.image_url;
      if (typeof u === "string" && u.startsWith("data:")) {
        const m = u.match(/^data:([^;]+);base64,(.*)$/);
        if (m) return {
          type: "base64",
          media_type: m[1],
          data: m[2]
        };
      }
      if (typeof u === "string") return {
        type: "url",
        url: u
      };
    }
    return void 0;
  };
  for (const m of msgsIn) {
    if (!m || !m.role) continue;
    if (m.role === "user") {
      if (typeof m.content === "string") {
        msgsOut.push({
          role: "user",
          content: [{
            type: "text",
            text: m.content,
            ...cc()
          }]
        });
      } else if (Array.isArray(m.content)) {
        const parts = [];
        for (const p of m.content) {
          if (!p || !p.type) continue;
          if (p.type === "text" && typeof p.text === "string") parts.push({
            type: "text",
            text: p.text,
            ...cc()
          });
          if (p.type === "image_url") {
            const s = toSrc(p);
            if (s) parts.push({
              type: "image",
              source: s,
              ...cc()
            });
          }
        }
        if (parts.length > 0) msgsOut.push({
          role: "user",
          content: parts
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const out = {
        role: "assistant",
        content: []
      };
      if (typeof m.content === "string" && m.content.length > 0) {
        out.content.push({
          type: "text",
          text: m.content,
          ...cc()
        });
      }
      if (Array.isArray(m.tool_calls)) {
        for (const tc of m.tool_calls) {
          if (tc.type === "function" && tc.function) {
            let input;
            const a = tc.function.arguments;
            if (typeof a === "string") {
              try {
                input = JSON.parse(a);
              } catch {
                input = a;
              }
            } else input = a;
            const id = tc.id || `toolu_${Math.random().toString(36).slice(2)}`;
            out.content.push({
              type: "tool_use",
              id,
              name: tc.function.name,
              input,
              ...cc()
            });
          }
        }
      }
      if (out.content.length > 0) msgsOut.push(out);
      continue;
    }
    if (m.role === "tool") {
      msgsOut.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: m.tool_call_id,
          content: m.content,
          ...cc()
        }]
      });
      continue;
    }
  }
  const tools = Array.isArray(body.tools) ? body.tools.filter((t) => t && typeof t === "object" && t.type === "function").map((t) => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters,
    ...cc()
  })) : void 0;
  const tcIn = body.tool_choice;
  const tool_choice = (() => {
    if (!tcIn) return void 0;
    if (tcIn === "auto") return {
      type: "auto"
    };
    if (tcIn === "required") return {
      type: "any"
    };
    if (tcIn.type === "function" && tcIn.function?.name) return {
      type: "tool",
      name: tcIn.function.name
    };
    return void 0;
  })();
  const stop_sequences = (() => {
    const v = body.stop;
    if (!v) return void 0;
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v];
    return void 0;
  })();
  return {
    max_tokens: body.max_tokens ?? 32e3,
    temperature: body.temperature,
    top_p: body.top_p,
    system: system.length > 0 ? system : void 0,
    messages: msgsOut,
    stream: !!body.stream,
    tools,
    tool_choice,
    stop_sequences
  };
}
function fromAnthropicResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (Array.isArray(resp.choices)) return resp;
  const isAnthropic = typeof resp.type === "string" && resp.type === "message";
  if (!isAnthropic) return resp;
  const idIn = resp.id;
  const id = typeof idIn === "string" ? idIn.replace(/^msg_/, "chatcmpl_") : `chatcmpl_${Math.random().toString(36).slice(2)}`;
  const model = resp.model;
  const blocks = Array.isArray(resp.content) ? resp.content : [];
  const text = blocks.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("");
  const tcs = blocks.filter((b) => b && b.type === "tool_use").map((b) => {
    const name = b.name;
    const args = (() => {
      const inp = b.input;
      if (typeof inp === "string") return inp;
      try {
        return JSON.stringify(inp ?? {});
      } catch {
        return String(inp ?? "");
      }
    })();
    const tid = typeof b.id === "string" && b.id.length > 0 ? b.id : `toolu_${Math.random().toString(36).slice(2)}`;
    return {
      id: tid,
      type: "function",
      function: {
        name,
        arguments: args
      }
    };
  });
  const finish = (r) => {
    if (r === "end_turn") return "stop";
    if (r === "tool_use") return "tool_calls";
    if (r === "max_tokens") return "length";
    if (r === "content_filter") return "content_filter";
    return null;
  };
  const u = resp.usage;
  const usage = (() => {
    if (!u) return void 0;
    const pt = typeof u.input_tokens === "number" ? u.input_tokens : void 0;
    const ct = typeof u.output_tokens === "number" ? u.output_tokens : void 0;
    const total = pt != null && ct != null ? pt + ct : void 0;
    const cached = typeof u.cache_read_input_tokens === "number" ? u.cache_read_input_tokens : void 0;
    const details = cached != null ? {
      cached_tokens: cached
    } : void 0;
    return {
      prompt_tokens: pt,
      completion_tokens: ct,
      total_tokens: total,
      ...details ? {
        prompt_tokens_details: details
      } : {}
    };
  })();
  return {
    id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1e3),
    model,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        ...text && text.length > 0 ? {
          content: text
        } : {},
        ...tcs.length > 0 ? {
          tool_calls: tcs
        } : {}
      },
      finish_reason: finish(resp.stop_reason ?? null)
    }],
    ...usage ? {
      usage
    } : {}
  };
}
function toAnthropicResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (!Array.isArray(resp.choices)) return resp;
  const choice = resp.choices[0];
  if (!choice) return resp;
  const message = choice.message;
  if (!message) return resp;
  const content = [];
  if (typeof message.content === "string" && message.content.length > 0) content.push({
    type: "text",
    text: message.content
  });
  if (Array.isArray(message.tool_calls)) {
    for (const tc of message.tool_calls) {
      if (tc.type === "function" && tc.function) {
        let input;
        try {
          input = JSON.parse(tc.function.arguments);
        } catch {
          input = tc.function.arguments;
        }
        content.push({
          type: "tool_use",
          id: tc.id,
          name: tc.function.name,
          input
        });
      }
    }
  }
  const stop_reason = (() => {
    const r = choice.finish_reason;
    if (r === "stop") return "end_turn";
    if (r === "tool_calls") return "tool_use";
    if (r === "length") return "max_tokens";
    if (r === "content_filter") return "content_filter";
    return null;
  })();
  const usage = (() => {
    const u = resp.usage;
    if (!u) return void 0;
    return {
      input_tokens: u.prompt_tokens,
      output_tokens: u.completion_tokens,
      cache_read_input_tokens: u.prompt_tokens_details?.cached_tokens
    };
  })();
  return {
    id: resp.id,
    type: "message",
    role: "assistant",
    content: content.length > 0 ? content : [{
      type: "text",
      text: ""
    }],
    model: resp.model,
    stop_reason,
    usage
  };
}
function fromAnthropicChunk(chunk) {
  const lines = chunk.split("\n");
  const dataLine = lines.find((l) => l.startsWith("data: "));
  if (!dataLine) return chunk;
  let json;
  try {
    json = JSON.parse(dataLine.slice(6));
  } catch {
    return chunk;
  }
  const out = {
    id: json.id ?? json.message?.id ?? "",
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: json.model ?? json.message?.model ?? "",
    choices: []
  };
  if (json.type === "content_block_start") {
    const cb = json.content_block;
    if (cb?.type === "text") {
      out.choices.push({
        index: json.index ?? 0,
        delta: {
          role: "assistant",
          content: ""
        },
        finish_reason: null
      });
    } else if (cb?.type === "tool_use") {
      out.choices.push({
        index: json.index ?? 0,
        delta: {
          tool_calls: [{
            index: json.index ?? 0,
            id: cb.id,
            type: "function",
            function: {
              name: cb.name,
              arguments: ""
            }
          }]
        },
        finish_reason: null
      });
    }
  }
  if (json.type === "content_block_delta") {
    const d = json.delta;
    if (d?.type === "text_delta") {
      out.choices.push({
        index: json.index ?? 0,
        delta: {
          content: d.text
        },
        finish_reason: null
      });
    } else if (d?.type === "input_json_delta") {
      out.choices.push({
        index: json.index ?? 0,
        delta: {
          tool_calls: [{
            index: json.index ?? 0,
            function: {
              arguments: d.partial_json
            }
          }]
        },
        finish_reason: null
      });
    }
  }
  if (json.type === "message_delta") {
    const d = json.delta;
    const finish_reason = (() => {
      const r = d?.stop_reason;
      if (r === "end_turn") return "stop";
      if (r === "tool_use") return "tool_calls";
      if (r === "max_tokens") return "length";
      if (r === "content_filter") return "content_filter";
      return null;
    })();
    out.choices.push({
      index: 0,
      delta: {},
      finish_reason
    });
  }
  if (json.usage) {
    const u = json.usage;
    out.usage = {
      prompt_tokens: u.input_tokens,
      completion_tokens: u.output_tokens,
      total_tokens: (u.input_tokens || 0) + (u.output_tokens || 0),
      ...u.cache_read_input_tokens ? {
        prompt_tokens_details: {
          cached_tokens: u.cache_read_input_tokens
        }
      } : {}
    };
  }
  return out;
}
function toAnthropicChunk(chunk) {
  if (!chunk.choices || !Array.isArray(chunk.choices) || chunk.choices.length === 0) {
    return JSON.stringify({});
  }
  const choice = chunk.choices[0];
  const delta = choice.delta;
  if (!delta) return JSON.stringify({});
  const result = {};
  if (delta.content) {
    result.type = "content_block_delta";
    result.index = 0;
    result.delta = {
      type: "text_delta",
      text: delta.content
    };
  }
  if (delta.tool_calls) {
    for (const tc of delta.tool_calls) {
      if (tc.function?.name) {
        result.type = "content_block_start";
        result.index = tc.index ?? 0;
        result.content_block = {
          type: "tool_use",
          id: tc.id,
          name: tc.function.name,
          input: {}
        };
      } else if (tc.function?.arguments) {
        result.type = "content_block_delta";
        result.index = tc.index ?? 0;
        result.delta = {
          type: "input_json_delta",
          partial_json: tc.function.arguments
        };
      }
    }
  }
  if (choice.finish_reason) {
    const stop_reason = (() => {
      const r = choice.finish_reason;
      if (r === "stop") return "end_turn";
      if (r === "tool_calls") return "tool_use";
      if (r === "length") return "max_tokens";
      if (r === "content_filter") return "content_filter";
      return null;
    })();
    result.type = "message_delta";
    result.delta = {
      stop_reason,
      stop_sequence: null
    };
  }
  if (chunk.usage) {
    const u = chunk.usage;
    result.usage = {
      input_tokens: u.prompt_tokens,
      output_tokens: u.completion_tokens,
      cache_read_input_tokens: u.prompt_tokens_details?.cached_tokens
    };
  }
  return JSON.stringify(result);
}
const openaiHelper = {
  format: "openai",
  modifyUrl: (providerApi) => providerApi + "/responses",
  modifyHeaders: (headers, body, apiKey) => {
    headers.set("authorization", `Bearer ${apiKey}`);
  },
  modifyBody: (body) => {
    return body;
  },
  createUsageParser: () => {
    let usage;
    return {
      parse: (chunk) => {
        const [event, data] = chunk.split("\n");
        if (event !== "event: response.completed") return;
        if (!data.startsWith("data: ")) return;
        let json;
        try {
          json = JSON.parse(data.slice(6));
        } catch (e) {
          return;
        }
        if (!json.response?.usage) return;
        usage = json.response.usage;
      },
      retrieve: () => usage
    };
  },
  normalizeUsage: (usage) => {
    const inputTokens = usage.input_tokens ?? 0;
    const outputTokens = usage.output_tokens ?? 0;
    const reasoningTokens = usage.output_tokens_details?.reasoning_tokens ?? void 0;
    const cacheReadTokens = usage.input_tokens_details?.cached_tokens ?? void 0;
    return {
      inputTokens: inputTokens - (cacheReadTokens ?? 0),
      outputTokens: outputTokens - (reasoningTokens ?? 0),
      reasoningTokens,
      cacheReadTokens,
      cacheWrite5mTokens: void 0,
      cacheWrite1hTokens: void 0
    };
  }
};
function fromOpenaiRequest(body) {
  if (!body || typeof body !== "object") return body;
  const toImg = (p) => {
    if (!p || typeof p !== "object") return void 0;
    if (p.type === "image_url" && p.image_url) return {
      type: "image_url",
      image_url: p.image_url
    };
    if (p.type === "input_image" && p.image_url) return {
      type: "image_url",
      image_url: p.image_url
    };
    const s = p.source;
    if (!s || typeof s !== "object") return void 0;
    if (s.type === "url" && typeof s.url === "string") return {
      type: "image_url",
      image_url: {
        url: s.url
      }
    };
    if (s.type === "base64" && typeof s.media_type === "string" && typeof s.data === "string") return {
      type: "image_url",
      image_url: {
        url: `data:${s.media_type};base64,${s.data}`
      }
    };
    return void 0;
  };
  const msgs = [];
  const inMsgs = Array.isArray(body.input) ? body.input : Array.isArray(body.messages) ? body.messages : [];
  for (const m of inMsgs) {
    if (!m) continue;
    if (!m.role && m.type) {
      if (m.type === "function_call") {
        const name = m.name;
        const a = m.arguments;
        const args = typeof a === "string" ? a : JSON.stringify(a ?? {});
        msgs.push({
          role: "assistant",
          tool_calls: [{
            id: m.id,
            type: "function",
            function: {
              name,
              arguments: args
            }
          }]
        });
      }
      if (m.type === "function_call_output") {
        const id = m.call_id;
        const out = m.output;
        const content = typeof out === "string" ? out : JSON.stringify(out);
        msgs.push({
          role: "tool",
          tool_call_id: id,
          content
        });
      }
      continue;
    }
    if (m.role === "system" || m.role === "developer") {
      const c = m.content;
      if (typeof c === "string" && c.length > 0) msgs.push({
        role: "system",
        content: c
      });
      if (Array.isArray(c)) {
        const t = c.find((p) => p && typeof p.text === "string");
        if (t && typeof t.text === "string" && t.text.length > 0) msgs.push({
          role: "system",
          content: t.text
        });
      }
      continue;
    }
    if (m.role === "user") {
      const c = m.content;
      if (typeof c === "string") {
        msgs.push({
          role: "user",
          content: c
        });
      } else if (Array.isArray(c)) {
        const parts = [];
        for (const p of c) {
          if (!p || !p.type) continue;
          if ((p.type === "text" || p.type === "input_text") && typeof p.text === "string") parts.push({
            type: "text",
            text: p.text
          });
          const ip = toImg(p);
          if (ip) parts.push(ip);
          if (p.type === "tool_result") {
            const id = p.tool_call_id;
            const content = typeof p.content === "string" ? p.content : JSON.stringify(p.content);
            msgs.push({
              role: "tool",
              tool_call_id: id,
              content
            });
          }
        }
        if (parts.length === 1 && parts[0].type === "text") msgs.push({
          role: "user",
          content: parts[0].text
        });
        else if (parts.length > 0) msgs.push({
          role: "user",
          content: parts
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const c = m.content;
      const out = {
        role: "assistant"
      };
      if (typeof c === "string" && c.length > 0) out.content = c;
      if (Array.isArray(m.tool_calls)) out.tool_calls = m.tool_calls;
      msgs.push(out);
      continue;
    }
    if (m.role === "tool") {
      msgs.push({
        role: "tool",
        tool_call_id: m.tool_call_id,
        content: m.content
      });
      continue;
    }
  }
  const tcIn = body.tool_choice;
  const tc = (() => {
    if (!tcIn) return void 0;
    if (tcIn === "auto") return "auto";
    if (tcIn === "required") return "required";
    if (tcIn.type === "function" && tcIn.function?.name) return {
      type: "function",
      function: {
        name: tcIn.function.name
      }
    };
    return void 0;
  })();
  const stop = (() => {
    const v = body.stop_sequences ?? body.stop;
    if (!v) return void 0;
    if (Array.isArray(v)) return v.length === 1 ? v[0] : v;
    if (typeof v === "string") return v;
    return void 0;
  })();
  return {
    model: body.model,
    max_tokens: body.max_output_tokens ?? body.max_tokens,
    temperature: body.temperature,
    top_p: body.top_p,
    stop,
    messages: msgs,
    stream: !!body.stream,
    tools: Array.isArray(body.tools) ? body.tools : void 0,
    tool_choice: tc
  };
}
function toOpenaiRequest(body) {
  if (!body || typeof body !== "object") return body;
  const msgsIn = Array.isArray(body.messages) ? body.messages : [];
  const input = [];
  const toPart = (p) => {
    if (!p || typeof p !== "object") return void 0;
    if (p.type === "text" && typeof p.text === "string") return {
      type: "input_text",
      text: p.text
    };
    if (p.type === "image_url" && p.image_url) return {
      type: "input_image",
      image_url: p.image_url
    };
    const s = p.source;
    if (!s || typeof s !== "object") return void 0;
    if (s.type === "url" && typeof s.url === "string") return {
      type: "input_image",
      image_url: {
        url: s.url
      }
    };
    if (s.type === "base64" && typeof s.media_type === "string" && typeof s.data === "string") return {
      type: "input_image",
      image_url: {
        url: `data:${s.media_type};base64,${s.data}`
      }
    };
    return void 0;
  };
  for (const m of msgsIn) {
    if (!m || !m.role) continue;
    if (m.role === "system") {
      const c = m.content;
      if (typeof c === "string") input.push({
        role: "system",
        content: c
      });
      continue;
    }
    if (m.role === "user") {
      const c = m.content;
      if (typeof c === "string") {
        input.push({
          role: "user",
          content: [{
            type: "input_text",
            text: c
          }]
        });
      } else if (Array.isArray(c)) {
        const parts = [];
        for (const p of c) {
          const op = toPart(p);
          if (op) parts.push(op);
        }
        if (parts.length > 0) input.push({
          role: "user",
          content: parts
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const c = m.content;
      if (typeof c === "string" && c.length > 0) {
        input.push({
          role: "assistant",
          content: [{
            type: "output_text",
            text: c
          }]
        });
      }
      if (Array.isArray(m.tool_calls)) {
        for (const tc of m.tool_calls) {
          if (tc.type === "function" && tc.function) {
            const name = tc.function.name;
            const a = tc.function.arguments;
            const args = typeof a === "string" ? a : JSON.stringify(a);
            input.push({
              type: "function_call",
              call_id: tc.id,
              name,
              arguments: args
            });
          }
        }
      }
      continue;
    }
    if (m.role === "tool") {
      const out = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
      input.push({
        type: "function_call_output",
        call_id: m.tool_call_id,
        output: out
      });
      continue;
    }
  }
  const stop_sequences = (() => {
    const v = body.stop;
    if (!v) return void 0;
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v];
    return void 0;
  })();
  const tcIn = body.tool_choice;
  const tool_choice = (() => {
    if (!tcIn) return void 0;
    if (tcIn === "auto") return "auto";
    if (tcIn === "required") return "required";
    if (tcIn.type === "function" && tcIn.function?.name) return {
      type: "function",
      function: {
        name: tcIn.function.name
      }
    };
    return void 0;
  })();
  const tools = (() => {
    if (!Array.isArray(body.tools)) return void 0;
    return body.tools.map((tool) => {
      if (tool.type === "function") {
        return {
          type: "function",
          name: tool.function?.name,
          description: tool.function?.description,
          parameters: tool.function?.parameters,
          strict: tool.function?.strict
        };
      }
      return tool;
    });
  })();
  return {
    model: body.model,
    input,
    max_output_tokens: body.max_tokens,
    top_p: body.top_p,
    stop_sequences,
    stream: !!body.stream,
    tools,
    tool_choice,
    include: Array.isArray(body.include) ? body.include : void 0,
    truncation: body.truncation,
    metadata: body.metadata,
    store: body.store,
    user: body.user,
    text: {
      verbosity: body.model === "gpt-5.1-codex" ? "medium" : "low"
    },
    reasoning: {
      effort: "medium"
    }
  };
}
function fromOpenaiResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (Array.isArray(resp.choices)) return resp;
  const r = resp.response ?? resp;
  if (!r || typeof r !== "object") return resp;
  const idIn = r.id;
  const id = typeof idIn === "string" ? idIn.replace(/^resp_/, "chatcmpl_") : `chatcmpl_${Math.random().toString(36).slice(2)}`;
  const model = r.model ?? resp.model;
  const out = Array.isArray(r.output) ? r.output : [];
  const text = out.filter((o) => o && o.type === "message" && Array.isArray(o.content)).flatMap((o) => o.content).filter((p) => p && p.type === "output_text" && typeof p.text === "string").map((p) => p.text).join("");
  const tcs = out.filter((o) => o && o.type === "function_call").map((o) => {
    const name = o.name;
    const a = o.arguments;
    const args = typeof a === "string" ? a : JSON.stringify(a ?? {});
    const tid = typeof o.id === "string" && o.id.length > 0 ? o.id : `toolu_${Math.random().toString(36).slice(2)}`;
    return {
      id: tid,
      type: "function",
      function: {
        name,
        arguments: args
      }
    };
  });
  const finish = (r2) => {
    if (r2 === "stop") return "stop";
    if (r2 === "tool_call" || r2 === "tool_calls") return "tool_calls";
    if (r2 === "length" || r2 === "max_output_tokens") return "length";
    if (r2 === "content_filter") return "content_filter";
    return null;
  };
  const u = r.usage ?? resp.usage;
  const usage = (() => {
    if (!u) return void 0;
    const pt = typeof u.input_tokens === "number" ? u.input_tokens : void 0;
    const ct = typeof u.output_tokens === "number" ? u.output_tokens : void 0;
    const total = pt != null && ct != null ? pt + ct : void 0;
    const cached = u.input_tokens_details?.cached_tokens;
    const details = typeof cached === "number" ? {
      cached_tokens: cached
    } : void 0;
    return {
      prompt_tokens: pt,
      completion_tokens: ct,
      total_tokens: total,
      ...details ? {
        prompt_tokens_details: details
      } : {}
    };
  })();
  return {
    id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1e3),
    model,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        ...text && text.length > 0 ? {
          content: text
        } : {},
        ...tcs.length > 0 ? {
          tool_calls: tcs
        } : {}
      },
      finish_reason: finish(r.stop_reason ?? null)
    }],
    ...usage ? {
      usage
    } : {}
  };
}
function toOpenaiResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (!Array.isArray(resp.choices)) return resp;
  const choice = resp.choices[0];
  if (!choice) return resp;
  const msg = choice.message;
  if (!msg) return resp;
  const outputItems = [];
  if (typeof msg.content === "string" && msg.content.length > 0) {
    outputItems.push({
      id: `msg_${Math.random().toString(36).slice(2)}`,
      type: "message",
      status: "completed",
      role: "assistant",
      content: [{
        type: "output_text",
        text: msg.content,
        annotations: [],
        logprobs: []
      }]
    });
  }
  if (Array.isArray(msg.tool_calls)) {
    for (const tc of msg.tool_calls) {
      if (tc.type === "function" && tc.function) {
        outputItems.push({
          id: tc.id,
          type: "function_call",
          name: tc.function.name,
          call_id: tc.id,
          arguments: tc.function.arguments
        });
      }
    }
  }
  const stop_reason = (() => {
    const r = choice.finish_reason;
    if (r === "stop") return "stop";
    if (r === "tool_calls") return "tool_call";
    if (r === "length") return "max_output_tokens";
    if (r === "content_filter") return "content_filter";
    return null;
  })();
  const usage = (() => {
    const u = resp.usage;
    if (!u) return void 0;
    return {
      input_tokens: u.prompt_tokens,
      output_tokens: u.completion_tokens,
      total_tokens: u.total_tokens,
      ...u.prompt_tokens_details?.cached_tokens ? {
        input_tokens_details: {
          cached_tokens: u.prompt_tokens_details.cached_tokens
        }
      } : {}
    };
  })();
  return {
    id: resp.id?.replace(/^chatcmpl_/, "resp_") ?? `resp_${Math.random().toString(36).slice(2)}`,
    object: "response",
    model: resp.model,
    output: outputItems,
    stop_reason,
    usage
  };
}
function fromOpenaiChunk(chunk) {
  const lines = chunk.split("\n");
  const ev = lines[0];
  const dl = lines[1];
  if (!ev || !dl || !dl.startsWith("data: ")) return chunk;
  let json;
  try {
    json = JSON.parse(dl.slice(6));
  } catch {
    return chunk;
  }
  const respObj = json.response ?? {};
  const out = {
    id: respObj.id ?? json.id ?? "",
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: respObj.model ?? json.model ?? "",
    choices: []
  };
  const e = ev.replace("event: ", "").trim();
  if (e === "response.output_text.delta") {
    const d = json.delta ?? json.text ?? json.output_text_delta;
    if (typeof d === "string" && d.length > 0) out.choices.push({
      index: 0,
      delta: {
        content: d
      },
      finish_reason: null
    });
  }
  if (e === "response.output_item.added" && json.item?.type === "function_call") {
    const name = json.item?.name;
    const id = json.item?.id;
    if (typeof name === "string" && name.length > 0) {
      out.choices.push({
        index: 0,
        delta: {
          tool_calls: [{
            index: 0,
            id,
            type: "function",
            function: {
              name,
              arguments: ""
            }
          }]
        },
        finish_reason: null
      });
    }
  }
  if (e === "response.function_call_arguments.delta") {
    const a = json.delta ?? json.arguments_delta;
    if (typeof a === "string" && a.length > 0) {
      out.choices.push({
        index: 0,
        delta: {
          tool_calls: [{
            index: 0,
            function: {
              arguments: a
            }
          }]
        },
        finish_reason: null
      });
    }
  }
  if (e === "response.completed") {
    const fr = (() => {
      const sr = respObj.stop_reason ?? json.stop_reason;
      if (sr === "stop") return "stop";
      if (sr === "tool_call" || sr === "tool_calls") return "tool_calls";
      if (sr === "length" || sr === "max_output_tokens") return "length";
      if (sr === "content_filter") return "content_filter";
      return null;
    })();
    out.choices.push({
      index: 0,
      delta: {},
      finish_reason: fr
    });
    const u = respObj.usage ?? json.response?.usage;
    if (u) {
      out.usage = {
        prompt_tokens: u.input_tokens,
        completion_tokens: u.output_tokens,
        total_tokens: (u.input_tokens || 0) + (u.output_tokens || 0),
        ...u.input_tokens_details?.cached_tokens ? {
          prompt_tokens_details: {
            cached_tokens: u.input_tokens_details.cached_tokens
          }
        } : {}
      };
    }
  }
  return out;
}
function toOpenaiChunk(chunk) {
  if (!chunk.choices || !Array.isArray(chunk.choices) || chunk.choices.length === 0) {
    return "";
  }
  const choice = chunk.choices[0];
  const d = choice.delta;
  if (!d) return "";
  const id = chunk.id;
  const model = chunk.model;
  if (d.content) {
    const data = {
      id,
      type: "response.output_text.delta",
      delta: d.content,
      response: {
        id,
        model
      }
    };
    return `event: response.output_text.delta
data: ${JSON.stringify(data)}`;
  }
  if (d.tool_calls) {
    for (const tc of d.tool_calls) {
      if (tc.function?.name) {
        const data = {
          type: "response.output_item.added",
          output_index: 0,
          item: {
            id: tc.id,
            type: "function_call",
            name: tc.function.name,
            call_id: tc.id,
            arguments: ""
          }
        };
        return `event: response.output_item.added
data: ${JSON.stringify(data)}`;
      }
      if (tc.function?.arguments) {
        const data = {
          type: "response.function_call_arguments.delta",
          output_index: 0,
          delta: tc.function.arguments
        };
        return `event: response.function_call_arguments.delta
data: ${JSON.stringify(data)}`;
      }
    }
  }
  if (choice.finish_reason) {
    const u = chunk.usage;
    const usage = u ? {
      input_tokens: u.prompt_tokens,
      output_tokens: u.completion_tokens,
      total_tokens: u.total_tokens,
      ...u.prompt_tokens_details?.cached_tokens ? {
        input_tokens_details: {
          cached_tokens: u.prompt_tokens_details.cached_tokens
        }
      } : {}
    } : void 0;
    const data = {
      id,
      type: "response.completed",
      response: {
        id,
        model,
        ...usage ? {
          usage
        } : {}
      }
    };
    return `event: response.completed
data: ${JSON.stringify(data)}`;
  }
  return "";
}
const oaCompatHelper = {
  format: "oa-compat",
  modifyUrl: (providerApi) => providerApi + "/chat/completions",
  modifyHeaders: (headers, body, apiKey) => {
    headers.set("authorization", `Bearer ${apiKey}`);
  },
  modifyBody: (body) => {
    return {
      ...body,
      ...body.stream ? {
        stream_options: {
          include_usage: true
        }
      } : {}
    };
  },
  createUsageParser: () => {
    let usage;
    return {
      parse: (chunk) => {
        if (!chunk.startsWith("data: ")) return;
        let json;
        try {
          json = JSON.parse(chunk.slice(6));
        } catch (e) {
          return;
        }
        if (!json.usage) return;
        usage = json.usage;
      },
      retrieve: () => usage
    };
  },
  normalizeUsage: (usage) => {
    const inputTokens = usage.prompt_tokens ?? 0;
    const outputTokens = usage.completion_tokens ?? 0;
    const reasoningTokens = usage.completion_tokens_details?.reasoning_tokens ?? void 0;
    const cacheReadTokens = usage.cached_tokens ?? usage.prompt_tokens_details?.cached_tokens ?? void 0;
    return {
      inputTokens: inputTokens - (cacheReadTokens ?? 0),
      outputTokens,
      reasoningTokens,
      cacheReadTokens,
      cacheWrite5mTokens: void 0,
      cacheWrite1hTokens: void 0
    };
  }
};
function fromOaCompatibleRequest(body) {
  if (!body || typeof body !== "object") return body;
  const msgsIn = Array.isArray(body.messages) ? body.messages : [];
  const msgsOut = [];
  for (const m of msgsIn) {
    if (!m || !m.role) continue;
    if (m.role === "system") {
      if (typeof m.content === "string" && m.content.length > 0) msgsOut.push({
        role: "system",
        content: m.content
      });
      continue;
    }
    if (m.role === "user") {
      if (typeof m.content === "string") {
        msgsOut.push({
          role: "user",
          content: m.content
        });
      } else if (Array.isArray(m.content)) {
        const parts = [];
        for (const p of m.content) {
          if (!p || !p.type) continue;
          if (p.type === "text" && typeof p.text === "string") parts.push({
            type: "text",
            text: p.text
          });
          if (p.type === "image_url") parts.push({
            type: "image_url",
            image_url: p.image_url
          });
        }
        if (parts.length === 1 && parts[0].type === "text") msgsOut.push({
          role: "user",
          content: parts[0].text
        });
        else if (parts.length > 0) msgsOut.push({
          role: "user",
          content: parts
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const out = {
        role: "assistant"
      };
      if (typeof m.content === "string") out.content = m.content;
      if (Array.isArray(m.tool_calls)) out.tool_calls = m.tool_calls;
      msgsOut.push(out);
      continue;
    }
    if (m.role === "tool") {
      msgsOut.push({
        role: "tool",
        tool_call_id: m.tool_call_id,
        content: m.content
      });
      continue;
    }
  }
  return {
    model: body.model,
    max_tokens: body.max_tokens,
    temperature: body.temperature,
    top_p: body.top_p,
    stop: body.stop,
    messages: msgsOut,
    stream: !!body.stream,
    tools: Array.isArray(body.tools) ? body.tools : void 0,
    tool_choice: body.tool_choice
  };
}
function toOaCompatibleRequest(body) {
  if (!body || typeof body !== "object") return body;
  const msgsIn = Array.isArray(body.messages) ? body.messages : [];
  const msgsOut = [];
  const toImg = (p) => {
    if (!p || typeof p !== "object") return void 0;
    if (p.type === "image_url" && p.image_url) return {
      type: "image_url",
      image_url: p.image_url
    };
    const s = p.source;
    if (!s || typeof s !== "object") return void 0;
    if (s.type === "url" && typeof s.url === "string") return {
      type: "image_url",
      image_url: {
        url: s.url
      }
    };
    if (s.type === "base64" && typeof s.media_type === "string" && typeof s.data === "string") return {
      type: "image_url",
      image_url: {
        url: `data:${s.media_type};base64,${s.data}`
      }
    };
    return void 0;
  };
  for (const m of msgsIn) {
    if (!m || !m.role) continue;
    if (m.role === "system") {
      if (typeof m.content === "string" && m.content.length > 0) msgsOut.push({
        role: "system",
        content: m.content
      });
      continue;
    }
    if (m.role === "user") {
      if (typeof m.content === "string") {
        msgsOut.push({
          role: "user",
          content: m.content
        });
        continue;
      }
      if (Array.isArray(m.content)) {
        const parts = [];
        for (const p of m.content) {
          if (!p || !p.type) continue;
          if (p.type === "text" && typeof p.text === "string") parts.push({
            type: "text",
            text: p.text
          });
          const ip = toImg(p);
          if (ip) parts.push(ip);
        }
        if (parts.length === 1 && parts[0].type === "text") msgsOut.push({
          role: "user",
          content: parts[0].text
        });
        else if (parts.length > 0) msgsOut.push({
          role: "user",
          content: parts
        });
      }
      continue;
    }
    if (m.role === "assistant") {
      const out = {
        role: "assistant"
      };
      if (typeof m.content === "string") out.content = m.content;
      if (Array.isArray(m.tool_calls)) out.tool_calls = m.tool_calls;
      msgsOut.push(out);
      continue;
    }
    if (m.role === "tool") {
      msgsOut.push({
        role: "tool",
        tool_call_id: m.tool_call_id,
        content: m.content
      });
      continue;
    }
  }
  const tools = Array.isArray(body.tools) ? body.tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  })) : void 0;
  return {
    model: body.model,
    max_tokens: body.max_tokens,
    temperature: body.temperature,
    top_p: body.top_p,
    stop: body.stop,
    messages: msgsOut,
    stream: !!body.stream,
    tools,
    tool_choice: body.tool_choice,
    response_format: body.response_format
  };
}
function fromOaCompatibleResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (!Array.isArray(resp.choices)) return resp;
  const choice = resp.choices[0];
  if (!choice) return resp;
  const message = choice.message;
  if (!message) return resp;
  const content = [];
  if (typeof message.content === "string" && message.content.length > 0) {
    content.push({
      type: "text",
      text: message.content
    });
  }
  if (Array.isArray(message.tool_calls)) {
    for (const toolCall of message.tool_calls) {
      if (toolCall.type === "function" && toolCall.function) {
        let input;
        try {
          input = JSON.parse(toolCall.function.arguments);
        } catch {
          input = toolCall.function.arguments;
        }
        content.push({
          type: "tool_use",
          id: toolCall.id,
          name: toolCall.function.name,
          input
        });
      }
    }
  }
  const stopReason = (() => {
    const reason = choice.finish_reason;
    if (reason === "stop") return "stop";
    if (reason === "tool_calls") return "tool_calls";
    if (reason === "length") return "length";
    if (reason === "content_filter") return "content_filter";
    return null;
  })();
  const usage = (() => {
    const u = resp.usage;
    if (!u) return void 0;
    return {
      prompt_tokens: u.prompt_tokens,
      completion_tokens: u.completion_tokens,
      total_tokens: u.total_tokens,
      ...u.prompt_tokens_details?.cached_tokens ? {
        prompt_tokens_details: {
          cached_tokens: u.prompt_tokens_details.cached_tokens
        }
      } : {}
    };
  })();
  return {
    id: resp.id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1e3),
    model: resp.model,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        ...content.length > 0 && content.some((c) => c.type === "text") ? {
          content: content.filter((c) => c.type === "text").map((c) => c.text).join("")
        } : {},
        ...content.length > 0 && content.some((c) => c.type === "tool_use") ? {
          tool_calls: content.filter((c) => c.type === "tool_use").map((c) => ({
            id: c.id,
            type: "function",
            function: {
              name: c.name,
              arguments: typeof c.input === "string" ? c.input : JSON.stringify(c.input)
            }
          }))
        } : {}
      },
      finish_reason: stopReason
    }],
    ...usage ? {
      usage
    } : {}
  };
}
function toOaCompatibleResponse(resp) {
  if (!resp || typeof resp !== "object") return resp;
  if (Array.isArray(resp.choices)) return resp;
  const isAnthropic = typeof resp.type === "string" && resp.type === "message";
  if (!isAnthropic) return resp;
  const idIn = resp.id;
  const id = typeof idIn === "string" ? idIn.replace(/^msg_/, "chatcmpl_") : `chatcmpl_${Math.random().toString(36).slice(2)}`;
  const model = resp.model;
  const blocks = Array.isArray(resp.content) ? resp.content : [];
  const text = blocks.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("");
  const tcs = blocks.filter((b) => b && b.type === "tool_use").map((b) => {
    const name = b.name;
    const args = (() => {
      const inp = b.input;
      if (typeof inp === "string") return inp;
      try {
        return JSON.stringify(inp ?? {});
      } catch {
        return String(inp ?? "");
      }
    })();
    const tid = typeof b.id === "string" && b.id.length > 0 ? b.id : `toolu_${Math.random().toString(36).slice(2)}`;
    return {
      id: tid,
      type: "function",
      function: {
        name,
        arguments: args
      }
    };
  });
  const finish = (r) => {
    if (r === "end_turn") return "stop";
    if (r === "tool_use") return "tool_calls";
    if (r === "max_tokens") return "length";
    if (r === "content_filter") return "content_filter";
    return null;
  };
  const u = resp.usage;
  const usage = (() => {
    if (!u) return void 0;
    const pt = typeof u.input_tokens === "number" ? u.input_tokens : void 0;
    const ct = typeof u.output_tokens === "number" ? u.output_tokens : void 0;
    const total = pt != null && ct != null ? pt + ct : void 0;
    const cached = typeof u.cache_read_input_tokens === "number" ? u.cache_read_input_tokens : void 0;
    const details = cached != null ? {
      cached_tokens: cached
    } : void 0;
    return {
      prompt_tokens: pt,
      completion_tokens: ct,
      total_tokens: total,
      ...details ? {
        prompt_tokens_details: details
      } : {}
    };
  })();
  return {
    id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1e3),
    model,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        ...text && text.length > 0 ? {
          content: text
        } : {},
        ...tcs.length > 0 ? {
          tool_calls: tcs
        } : {}
      },
      finish_reason: finish(resp.stop_reason ?? null)
    }],
    ...usage ? {
      usage
    } : {}
  };
}
function fromOaCompatibleChunk(chunk) {
  if (!chunk.startsWith("data: ")) return chunk;
  let json;
  try {
    json = JSON.parse(chunk.slice(6));
  } catch {
    return chunk;
  }
  if (!json.choices || !Array.isArray(json.choices) || json.choices.length === 0) {
    return chunk;
  }
  const choice = json.choices[0];
  const delta = choice.delta;
  if (!delta) return chunk;
  const result = {
    id: json.id ?? "",
    object: "chat.completion.chunk",
    created: json.created ?? Math.floor(Date.now() / 1e3),
    model: json.model ?? "",
    choices: []
  };
  if (delta.content) {
    result.choices.push({
      index: choice.index ?? 0,
      delta: {
        content: delta.content
      },
      finish_reason: null
    });
  }
  if (delta.tool_calls) {
    for (const toolCall of delta.tool_calls) {
      result.choices.push({
        index: choice.index ?? 0,
        delta: {
          tool_calls: [{
            index: toolCall.index ?? 0,
            id: toolCall.id,
            type: toolCall.type ?? "function",
            function: toolCall.function
          }]
        },
        finish_reason: null
      });
    }
  }
  if (choice.finish_reason) {
    result.choices.push({
      index: choice.index ?? 0,
      delta: {},
      finish_reason: choice.finish_reason
    });
  }
  if (json.usage) {
    const usage = json.usage;
    result.usage = {
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      ...usage.prompt_tokens_details?.cached_tokens ? {
        prompt_tokens_details: {
          cached_tokens: usage.prompt_tokens_details.cached_tokens
        }
      } : {}
    };
  }
  return result;
}
function toOaCompatibleChunk(chunk) {
  const result = {
    id: chunk.id,
    object: "chat.completion.chunk",
    created: chunk.created,
    model: chunk.model,
    choices: []
  };
  if (!chunk.choices || chunk.choices.length === 0) {
    return `data: ${JSON.stringify(result)}`;
  }
  const choice = chunk.choices[0];
  const delta = choice.delta;
  if (delta?.role) {
    result.choices.push({
      index: choice.index,
      delta: {
        role: delta.role
      },
      finish_reason: null
    });
  }
  if (delta?.content) {
    result.choices.push({
      index: choice.index,
      delta: {
        content: delta.content
      },
      finish_reason: null
    });
  }
  if (delta?.tool_calls) {
    for (const tc of delta.tool_calls) {
      result.choices.push({
        index: choice.index,
        delta: {
          tool_calls: [{
            index: tc.index,
            id: tc.id,
            type: tc.type,
            function: tc.function
          }]
        },
        finish_reason: null
      });
    }
  }
  if (choice.finish_reason) {
    result.choices.push({
      index: choice.index,
      delta: {},
      finish_reason: choice.finish_reason
    });
  }
  if (chunk.usage) {
    result.usage = {
      prompt_tokens: chunk.usage.prompt_tokens,
      completion_tokens: chunk.usage.completion_tokens,
      total_tokens: chunk.usage.total_tokens,
      ...chunk.usage.prompt_tokens_details?.cached_tokens ? {
        prompt_tokens_details: {
          cached_tokens: chunk.usage.prompt_tokens_details.cached_tokens
        }
      } : {}
    };
  }
  return `data: ${JSON.stringify(result)}`;
}
function createBodyConverter(from, to) {
  return (body) => {
    if (from === to) return body;
    let raw;
    if (from === "anthropic") raw = fromAnthropicRequest(body);
    else if (from === "openai") raw = fromOpenaiRequest(body);
    else raw = fromOaCompatibleRequest(body);
    if (to === "anthropic") return toAnthropicRequest(raw);
    if (to === "openai") return toOpenaiRequest(raw);
    if (to === "oa-compat") return toOaCompatibleRequest(raw);
  };
}
function createStreamPartConverter(from, to) {
  return (part) => {
    if (from === to) return part;
    let raw;
    if (from === "anthropic") raw = fromAnthropicChunk(part);
    else if (from === "openai") raw = fromOpenaiChunk(part);
    else raw = fromOaCompatibleChunk(part);
    if (typeof raw === "string") return raw;
    if (to === "anthropic") return toAnthropicChunk(raw);
    if (to === "openai") return toOpenaiChunk(raw);
    if (to === "oa-compat") return toOaCompatibleChunk(raw);
  };
}
function createResponseConverter(from, to) {
  return (response) => {
    if (from === to) return response;
    let raw;
    if (from === "anthropic") raw = fromAnthropicResponse(response);
    else if (from === "openai") raw = fromOpenaiResponse(response);
    else raw = fromOaCompatibleResponse(response);
    if (to === "anthropic") return toAnthropicResponse(raw);
    if (to === "openai") return toOpenaiResponse(raw);
    if (to === "oa-compat") return toOaCompatibleResponse(raw);
  };
}
function createRateLimiter(model, limit, ip) {
  if (!limit) return;
  const now = Date.now();
  const currKey = `usage:${ip}:${model}:${buildYYYYMMDDHH(now)}`;
  const prevKey = `usage:${ip}:${model}:${buildYYYYMMDDHH(now - 36e5)}`;
  let currRate;
  let prevRate;
  return {
    track: async () => {
      await Resource.GatewayKv.put(currKey, currRate + 1, {
        expirationTtl: 3600
      });
    },
    check: async () => {
      const values = await Resource.GatewayKv.get([currKey, prevKey]);
      const prevValue = values?.get(prevKey);
      const currValue = values?.get(currKey);
      prevRate = prevValue ? parseInt(prevValue) : 0;
      currRate = currValue ? parseInt(currValue) : 0;
      logger.debug(`rate limit ${model} prev/curr: ${prevRate}/${currRate}`);
      if (prevRate + currRate >= limit) throw new RateLimitError(`Rate limit exceeded. Please try again later.`);
    }
  };
}
function buildYYYYMMDDHH(timestamp) {
  return new Date(timestamp).toISOString().replace(/[^0-9]/g, "").substring(0, 10);
}
async function handler(input, opts) {
  const MAX_RETRIES = 3;
  const FREE_WORKSPACES = [
    "wrk_01K46JDFR0E75SG2Q8K172KF3Y",
    // frank
    "wrk_01K6W1A3VE0KMNVSCQT43BG2SX"
    // opencode bench
  ];
  try {
    const body = await input.request.json();
    const ip = input.request.headers.get("x-real-ip") ?? "";
    logger.metric({
      is_tream: !!body.stream,
      session: input.request.headers.get("x-opencode-session"),
      request: input.request.headers.get("x-opencode-request")
    });
    const zenData = ZenData.list();
    const modelInfo = validateModel(zenData, body.model);
    const rateLimiter = createRateLimiter(modelInfo.id, modelInfo.rateLimit, ip);
    await rateLimiter?.check();
    const retriableRequest = async (retry = {
      excludeProviders: [],
      retryCount: 0
    }) => {
      const providerInfo2 = selectProvider(zenData, modelInfo, ip, retry);
      const authInfo2 = await authenticate(modelInfo, providerInfo2);
      validateBilling(authInfo2, modelInfo);
      validateModelSettings(authInfo2);
      updateProviderKey(authInfo2, providerInfo2);
      logger.metric({
        provider: providerInfo2.id
      });
      const startTimestamp2 = Date.now();
      const reqUrl = providerInfo2.modifyUrl(providerInfo2.api);
      const reqBody = JSON.stringify(providerInfo2.modifyBody({
        ...createBodyConverter(opts.format, providerInfo2.format)(body),
        model: providerInfo2.model
      }));
      logger.debug("REQUEST URL: " + reqUrl);
      logger.debug("REQUEST: " + reqBody.substring(0, 300) + "...");
      const res2 = await fetch(reqUrl, {
        method: "POST",
        headers: (() => {
          const headers = new Headers(input.request.headers);
          providerInfo2.modifyHeaders(headers, body, providerInfo2.apiKey);
          Object.entries(providerInfo2.headerMappings ?? {}).forEach(([k, v]) => {
            headers.set(k, headers.get(v));
          });
          headers.delete("host");
          headers.delete("content-length");
          headers.delete("x-opencode-request");
          headers.delete("x-opencode-session");
          return headers;
        })(),
        body: reqBody
      });
      if (res2.status !== 200 && modelInfo.fallbackProvider && providerInfo2.id !== modelInfo.fallbackProvider) {
        return retriableRequest({
          excludeProviders: [...retry.excludeProviders, providerInfo2.id],
          retryCount: retry.retryCount + 1
        });
      }
      return {
        providerInfo: providerInfo2,
        authInfo: authInfo2,
        res: res2,
        startTimestamp: startTimestamp2
      };
    };
    const {
      providerInfo,
      authInfo,
      res,
      startTimestamp
    } = await retriableRequest();
    const resHeaders = new Headers();
    const keepHeaders = ["content-type", "cache-control"];
    for (const [k, v] of res.headers.entries()) {
      if (keepHeaders.includes(k.toLowerCase())) {
        resHeaders.set(k, v);
      }
    }
    logger.debug("STATUS: " + res.status + " " + res.statusText);
    if (!body.stream) {
      const responseConverter = createResponseConverter(providerInfo.format, opts.format);
      const json = await res.json();
      const body2 = JSON.stringify(responseConverter(json));
      logger.metric({
        response_length: body2.length
      });
      logger.debug("RESPONSE: " + body2);
      await rateLimiter?.track();
      await trackUsage(authInfo, modelInfo, providerInfo, json.usage);
      await reload(authInfo);
      return new Response(body2, {
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders
      });
    }
    const streamConverter = createStreamPartConverter(providerInfo.format, opts.format);
    const usageParser = providerInfo.createUsageParser();
    const stream = new ReadableStream({
      start(c) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";
        let responseLength = 0;
        function pump() {
          return reader?.read().then(async ({
            done,
            value
          }) => {
            if (done) {
              logger.metric({
                response_length: responseLength,
                "timestamp.last_byte": Date.now()
              });
              await rateLimiter?.track();
              const usage = usageParser.retrieve();
              if (usage) {
                await trackUsage(authInfo, modelInfo, providerInfo, usage);
                await reload(authInfo);
              }
              c.close();
              return;
            }
            if (responseLength === 0) {
              const now = Date.now();
              logger.metric({
                time_to_first_byte: now - startTimestamp,
                "timestamp.first_byte": now
              });
            }
            responseLength += value.length;
            buffer += decoder.decode(value, {
              stream: true
            });
            const parts = buffer.split("\n\n");
            buffer = parts.pop() ?? "";
            for (let part of parts) {
              logger.debug("PART: " + part);
              part = part.trim();
              usageParser.parse(part);
              if (providerInfo.format !== opts.format) {
                part = streamConverter(part);
                c.enqueue(encoder.encode(part + "\n\n"));
              }
            }
            if (providerInfo.format === opts.format) {
              c.enqueue(value);
            }
            return pump();
          }) || Promise.resolve();
        }
        return pump();
      }
    });
    return new Response(stream, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders
    });
  } catch (error) {
    logger.metric({
      "error.type": error.constructor.name,
      "error.message": error.message
    });
    if (error instanceof AuthError || error instanceof CreditsError || error instanceof MonthlyLimitError || error instanceof UserLimitError || error instanceof ModelError) return new Response(JSON.stringify({
      type: "error",
      error: {
        type: error.constructor.name,
        message: error.message
      }
    }), {
      status: 401
    });
    if (error instanceof RateLimitError) return new Response(JSON.stringify({
      type: "error",
      error: {
        type: error.constructor.name,
        message: error.message
      }
    }), {
      status: 429
    });
    return new Response(JSON.stringify({
      type: "error",
      error: {
        type: "error",
        message: error.message
      }
    }), {
      status: 500
    });
  }
  function validateModel(zenData, reqModel) {
    if (!(reqModel in zenData.models)) {
      throw new ModelError(`Model ${reqModel} not supported`);
    }
    const modelId = reqModel;
    const modelData = zenData.models[modelId];
    logger.metric({
      model: modelId
    });
    return {
      id: modelId,
      ...modelData
    };
  }
  function selectProvider(zenData, modelInfo, ip, retry) {
    const provider = (() => {
      if (retry.retryCount === MAX_RETRIES) {
        return modelInfo.providers.find((provider2) => provider2.id === modelInfo.fallbackProvider);
      }
      const providers = modelInfo.providers.filter((provider2) => !provider2.disabled).filter((provider2) => !retry.excludeProviders.includes(provider2.id)).flatMap((provider2) => Array(provider2.weight ?? 1).fill(provider2));
      const lastChars = ip.slice(-2);
      const index = parseInt(lastChars, 16) % providers.length;
      return providers[index || 0];
    })();
    if (!provider) throw new ModelError("No provider available");
    if (!(provider.id in zenData.providers)) throw new ModelError(`Provider ${provider.id} not supported`);
    return {
      ...provider,
      ...zenData.providers[provider.id],
      ...(() => {
        const format = zenData.providers[provider.id].format;
        if (format === "anthropic") return anthropicHelper;
        if (format === "openai") return openaiHelper;
        return oaCompatHelper;
      })()
    };
  }
  async function authenticate(modelInfo, providerInfo) {
    const apiKey = opts.parseApiKey(input.request.headers);
    if (!apiKey || apiKey === "public") {
      if (modelInfo.allowAnonymous) return;
      throw new AuthError("Missing API key.");
    }
    const data = await Database.use((tx) => tx.select({
      apiKey: KeyTable.id,
      workspaceID: KeyTable.workspaceID,
      billing: {
        balance: BillingTable.balance,
        paymentMethodID: BillingTable.paymentMethodID,
        monthlyLimit: BillingTable.monthlyLimit,
        monthlyUsage: BillingTable.monthlyUsage,
        timeMonthlyUsageUpdated: BillingTable.timeMonthlyUsageUpdated,
        reloadTrigger: BillingTable.reloadTrigger
      },
      user: {
        id: UserTable.id,
        monthlyLimit: UserTable.monthlyLimit,
        monthlyUsage: UserTable.monthlyUsage,
        timeMonthlyUsageUpdated: UserTable.timeMonthlyUsageUpdated
      },
      provider: {
        credentials: ProviderTable.credentials
      },
      timeDisabled: ModelTable.timeCreated
    }).from(KeyTable).innerJoin(WorkspaceTable, eq(WorkspaceTable.id, KeyTable.workspaceID)).innerJoin(BillingTable, eq(BillingTable.workspaceID, KeyTable.workspaceID)).innerJoin(UserTable, and(eq(UserTable.workspaceID, KeyTable.workspaceID), eq(UserTable.id, KeyTable.userID))).leftJoin(ModelTable, and(eq(ModelTable.workspaceID, KeyTable.workspaceID), eq(ModelTable.model, modelInfo.id))).leftJoin(ProviderTable, and(eq(ProviderTable.workspaceID, KeyTable.workspaceID), eq(ProviderTable.provider, providerInfo.id))).where(and(eq(KeyTable.key, apiKey), isNull(KeyTable.timeDeleted))).then((rows) => rows[0]));
    if (!data) throw new AuthError("Invalid API key.");
    logger.metric({
      api_key: data.apiKey,
      workspace: data.workspaceID
    });
    return {
      apiKeyId: data.apiKey,
      workspaceID: data.workspaceID,
      billing: data.billing,
      user: data.user,
      provider: data.provider,
      isFree: FREE_WORKSPACES.includes(data.workspaceID),
      isDisabled: !!data.timeDisabled
    };
  }
  function validateBilling(authInfo, modelInfo) {
    if (!authInfo) return;
    if (authInfo.provider?.credentials) return;
    if (authInfo.isFree) return;
    if (modelInfo.allowAnonymous) return;
    const billing = authInfo.billing;
    if (!billing.paymentMethodID) throw new CreditsError(`No payment method. Add a payment method here: https://opencode.ai/workspace/${authInfo.workspaceID}/billing`);
    if (billing.balance <= 0) throw new CreditsError(`Insufficient balance. Manage your billing here: https://opencode.ai/workspace/${authInfo.workspaceID}/billing`);
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();
    if (billing.monthlyLimit && billing.monthlyUsage && billing.timeMonthlyUsageUpdated && billing.monthlyUsage >= centsToMicroCents(billing.monthlyLimit * 100)) {
      const dateYear = billing.timeMonthlyUsageUpdated.getUTCFullYear();
      const dateMonth = billing.timeMonthlyUsageUpdated.getUTCMonth();
      if (currentYear === dateYear && currentMonth === dateMonth) throw new MonthlyLimitError(`Your workspace has reached its monthly spending limit of $${billing.monthlyLimit}. Manage your limits here: https://opencode.ai/workspace/${authInfo.workspaceID}/billing`);
    }
    if (authInfo.user.monthlyLimit && authInfo.user.monthlyUsage && authInfo.user.timeMonthlyUsageUpdated && authInfo.user.monthlyUsage >= centsToMicroCents(authInfo.user.monthlyLimit * 100)) {
      const dateYear = authInfo.user.timeMonthlyUsageUpdated.getUTCFullYear();
      const dateMonth = authInfo.user.timeMonthlyUsageUpdated.getUTCMonth();
      if (currentYear === dateYear && currentMonth === dateMonth) throw new UserLimitError(`You have reached your monthly spending limit of $${authInfo.user.monthlyLimit}. Manage your limits here: https://opencode.ai/workspace/${authInfo.workspaceID}/members`);
    }
  }
  function validateModelSettings(authInfo) {
    if (!authInfo) return;
    if (authInfo.isDisabled) throw new ModelError("Model is disabled");
  }
  function updateProviderKey(authInfo, providerInfo) {
    if (!authInfo) return;
    if (!authInfo.provider?.credentials) return;
    providerInfo.apiKey = authInfo.provider.credentials;
  }
  async function trackUsage(authInfo, modelInfo, providerInfo, usage) {
    const {
      inputTokens,
      outputTokens,
      reasoningTokens,
      cacheReadTokens,
      cacheWrite5mTokens,
      cacheWrite1hTokens
    } = providerInfo.normalizeUsage(usage);
    const modelCost = modelInfo.cost200K && inputTokens + (cacheReadTokens ?? 0) + (cacheWrite5mTokens ?? 0) + (cacheWrite1hTokens ?? 0) > 2e5 ? modelInfo.cost200K : modelInfo.cost;
    const inputCost = modelCost.input * inputTokens * 100;
    const outputCost = modelCost.output * outputTokens * 100;
    const reasoningCost = (() => {
      if (!reasoningTokens) return void 0;
      return modelCost.output * reasoningTokens * 100;
    })();
    const cacheReadCost = (() => {
      if (!cacheReadTokens) return void 0;
      if (!modelCost.cacheRead) return void 0;
      return modelCost.cacheRead * cacheReadTokens * 100;
    })();
    const cacheWrite5mCost = (() => {
      if (!cacheWrite5mTokens) return void 0;
      if (!modelCost.cacheWrite5m) return void 0;
      return modelCost.cacheWrite5m * cacheWrite5mTokens * 100;
    })();
    const cacheWrite1hCost = (() => {
      if (!cacheWrite1hTokens) return void 0;
      if (!modelCost.cacheWrite1h) return void 0;
      return modelCost.cacheWrite1h * cacheWrite1hTokens * 100;
    })();
    const totalCostInCent = inputCost + outputCost + (reasoningCost ?? 0) + (cacheReadCost ?? 0) + (cacheWrite5mCost ?? 0) + (cacheWrite1hCost ?? 0);
    logger.metric({
      "tokens.input": inputTokens,
      "tokens.output": outputTokens,
      "tokens.reasoning": reasoningTokens,
      "tokens.cache_read": cacheReadTokens,
      "tokens.cache_write_5m": cacheWrite5mTokens,
      "tokens.cache_write_1h": cacheWrite1hTokens,
      "cost.input": Math.round(inputCost),
      "cost.output": Math.round(outputCost),
      "cost.reasoning": reasoningCost ? Math.round(reasoningCost) : void 0,
      "cost.cache_read": cacheReadCost ? Math.round(cacheReadCost) : void 0,
      "cost.cache_write_5m": cacheWrite5mCost ? Math.round(cacheWrite5mCost) : void 0,
      "cost.cache_write_1h": cacheWrite1hCost ? Math.round(cacheWrite1hCost) : void 0,
      "cost.total": Math.round(totalCostInCent)
    });
    if (!authInfo) return;
    const cost = authInfo.isFree || authInfo.provider?.credentials ? 0 : centsToMicroCents(totalCostInCent);
    await Database.transaction(async (tx) => {
      await tx.insert(UsageTable).values({
        workspaceID: authInfo.workspaceID,
        id: Identifier.create("usage"),
        model: modelInfo.id,
        provider: providerInfo.id,
        inputTokens,
        outputTokens,
        reasoningTokens,
        cacheReadTokens,
        cacheWrite5mTokens,
        cacheWrite1hTokens,
        cost,
        keyID: authInfo.apiKeyId
      });
      await tx.update(BillingTable).set({
        balance: sql`${BillingTable.balance} - ${cost}`,
        monthlyUsage: sql`
              CASE
                WHEN MONTH(${BillingTable.timeMonthlyUsageUpdated}) = MONTH(now()) AND YEAR(${BillingTable.timeMonthlyUsageUpdated}) = YEAR(now()) THEN ${BillingTable.monthlyUsage} + ${cost}
                ELSE ${cost}
              END
            `,
        timeMonthlyUsageUpdated: sql`now()`
      }).where(eq(BillingTable.workspaceID, authInfo.workspaceID));
      await tx.update(UserTable).set({
        monthlyUsage: sql`
              CASE
                WHEN MONTH(${UserTable.timeMonthlyUsageUpdated}) = MONTH(now()) AND YEAR(${UserTable.timeMonthlyUsageUpdated}) = YEAR(now()) THEN ${UserTable.monthlyUsage} + ${cost}
                ELSE ${cost}
              END
            `,
        timeMonthlyUsageUpdated: sql`now()`
      }).where(and(eq(UserTable.workspaceID, authInfo.workspaceID), eq(UserTable.id, authInfo.user.id)));
    });
    await Database.use((tx) => tx.update(KeyTable).set({
      timeUsed: sql`now()`
    }).where(eq(KeyTable.id, authInfo.apiKeyId)));
  }
  async function reload(authInfo) {
    if (!authInfo) return;
    if (authInfo.isFree) return;
    if (authInfo.provider?.credentials) return;
    const lock = await Database.use((tx) => tx.update(BillingTable).set({
      timeReloadLockedTill: sql`now() + interval 1 minute`
    }).where(and(eq(BillingTable.workspaceID, authInfo.workspaceID), eq(BillingTable.reload, true), lt(BillingTable.balance, centsToMicroCents((authInfo.billing.reloadTrigger ?? Billing.RELOAD_TRIGGER) * 100)), or(isNull(BillingTable.timeReloadLockedTill), lt(BillingTable.timeReloadLockedTill, sql`now()`)))));
    if (lock.rowsAffected === 0) return;
    await Actor.provide("system", {
      workspaceID: authInfo.workspaceID
    }, async () => {
      await Billing.reload();
    });
  }
}
export {
  handler as h
};
