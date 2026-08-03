import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // v8 default is true; keep explicit so route-module splitting stays intentional.
  splitRouteModules: true,
} satisfies Config;
