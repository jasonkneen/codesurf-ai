// Browser stub for server-side SDK. Prevents child_process usage.
export type ServerOptions = {}
export type OpencodeOptions = {}
export async function createOpencode(_options?: OpencodeOptions) {
  throw new Error("createOpencode is not available in the browser")
}
export async function createOpencodeServer(_options?: ServerOptions) {
  throw new Error("createOpencodeServer is not available in the browser")
}
export function createOpencodeTui() {
  throw new Error("createOpencodeTui is not available in the browser")
}
