export namespace Rpc {
  type Definition = {
    [method: string]: (input: any) => any
  }

  export function listen(rpc: Definition) {
    onmessage = async (evt) => {
      const parsed = JSON.parse(evt.data)
      if (parsed.type === "rpc.request") {
        const result = await rpc[parsed.method](parsed.input)
        postMessage(JSON.stringify({ type: "rpc.result", result, id: parsed.id }))
      }
    }
  }

  export function client<T extends Definition>(target: {
    postMessage: (data: string) => void | null
    onmessage: ((this: Worker, ev: MessageEvent<any>) => any) | null
    addEventListener?: (type: string, handler: (ev: MessageEvent<any>) => any) => void
  }) {
    const pending = new Map<number, (result: any) => void>()
    let id = 0
    const handler = async (evt: MessageEvent<any>) => {
      try {
        const parsed = JSON.parse(evt.data)
        if (parsed.type === "rpc.result") {
          const resolve = pending.get(parsed.id)
          if (resolve) {
            resolve(parsed.result)
            pending.delete(parsed.id)
          }
        }
      } catch {
        // Ignore non-JSON messages
      }
    }
    // Use addEventListener if available to not overwrite existing handlers
    if (target.addEventListener) {
      target.addEventListener("message", handler)
    } else {
      target.onmessage = handler
    }
    return {
      call<Method extends keyof T>(method: Method, input: Parameters<T[Method]>[0]): Promise<ReturnType<T[Method]>> {
        const requestId = id++
        return new Promise((resolve) => {
          pending.set(requestId, resolve)
          target.postMessage(JSON.stringify({ type: "rpc.request", method, input, id: requestId }))
        })
      },
    }
  }
}
