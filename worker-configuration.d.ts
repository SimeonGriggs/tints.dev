/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
}

declare module "*.wasm" {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}
