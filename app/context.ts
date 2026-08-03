import { createContext } from "react-router";

export type CloudflareContext = {
  env: Env;
  ctx: ExecutionContext;
};

export const cloudflareContext = createContext<CloudflareContext>();
