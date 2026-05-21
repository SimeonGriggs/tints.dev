import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

const isTest = process.env.VITEST === "true";

export default defineConfig({
  plugins: [
    ...(isTest
      ? []
      : [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()]),
    tailwindcss(),
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
  },
});
