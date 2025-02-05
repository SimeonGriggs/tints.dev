import babel from "vite-plugin-babel";

import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const ReactCompilerConfig = {
  target: "18", // '17' | '18' | '19'
};

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tsconfigPaths(),
  ],
});
